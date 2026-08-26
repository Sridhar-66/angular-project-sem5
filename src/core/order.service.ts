import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase.client';
import type { CartItem } from './cart.service';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product?: { name: string; image_url: string | null };
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
  order_status: 'placed' | 'ready_to_deliver' | 'out_for_delivery' | 'delivered';
  delivery_boy_id: string | null;
  delivery_address: string | null;
  created_at: string;
  order_items?: OrderItem[];
  profiles?: { full_name: string; email: string; address?: string };
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  readonly myOrders = signal<Order[]>([]);
  readonly allOrders = signal<Order[]>([]);
  readonly loading = signal(false);

  private ordersChannel: any = null;

  /** Customer: place an order from cart items */
  async placeOrder(customerId: string, cartItems: CartItem[], deliveryAddress: string): Promise<Order> {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // 1. Insert the order record
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        total_amount: totalAmount,
        payment_status: 'paid', // test-mode: always paid
        order_status: 'placed',
        delivery_address: deliveryAddress,
      })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);
    const order = orderData as Order;

    // 2. Insert order_items in batch
    const itemRows = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemRows);

    if (itemsError) throw new Error(itemsError.message);

    // 3. Decrement stock for each product
    for (const item of cartItems) {
      await supabase.rpc('decrement_stock', {
        product_id: item.product.id,
        qty: item.quantity,
      });
    }

    // 4. Insert notification for admin (new order placed)
    // Get all admin user IDs
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (admins && admins.length > 0) {
      const notifs = admins.map((a: { id: string }) => ({
        user_id: a.id,
        message: `New order #${order.id.slice(0, 8)} placed — ₹${totalAmount.toFixed(2)}`,
        type: 'order_placed',
      }));
      await supabase.from('notifications').insert(notifs);
    }

    return order;
  }

  /** Customer: fetch their own orders with items + product names */
  async loadMyOrders(customerId: string): Promise<void> {
    this.loading.set(true);
    const { data, error } = await supabase
      .from('orders')
      .select(
        `*, order_items(*, product:products(name, image_url))`
      )
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading my orders:', error);
    }
    if (!error && data) {
      this.myOrders.set(data as Order[]);
    }
    this.loading.set(false);

    // Setup realtime subscription for the customer's orders
    if (this.ordersChannel) {
      supabase.removeChannel(this.ordersChannel);
    }
    this.ordersChannel = supabase
      .channel('public:orders:customer')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${customerId}`,
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          this.myOrders.update((orders) =>
            orders.map((o) =>
              o.id === updatedOrder.id
                ? { ...o, order_status: updatedOrder.order_status, payment_status: updatedOrder.payment_status }
                : o
            )
          );
        }
      )
      .subscribe();
  }

  /** Admin: fetch all orders with customer profiles */
  async loadAllOrders(): Promise<void> {
    this.loading.set(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`*, profiles!orders_customer_id_fkey(full_name, email), order_items(*, product:products(name))`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading all orders:', error);
    }
    if (!error && data) {
      this.allOrders.set(data as Order[]);
    }
    this.loading.set(false);
  }

  /** Admin: get all delivery boys */
  async getDeliveryBoys() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'delivery');
    if (error) throw new Error(error.message);
    return data;
  }

  /** Admin: assign an order to a delivery boy */
  async assignDeliveryBoy(orderId: string, deliveryBoyId: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ delivery_boy_id: deliveryBoyId })
      .eq('id', orderId);

    if (error) throw new Error(error.message);
    // Reload admin orders
    await this.loadAllOrders();
  }

  /** Delivery: load assigned orders */
  async loadDeliveryOrders(deliveryBoyId: string): Promise<void> {
    this.loading.set(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`*, profiles!orders_customer_id_fkey(full_name, email), order_items(*, product:products(name, image_url))`)
      .eq('delivery_boy_id', deliveryBoyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading delivery orders:', error);
    }
    if (!error && data) {
      this.myOrders.set(data as Order[]); // Reusing myOrders for delivery boy
    }
    this.loading.set(false);
  }

  /** Delivery: advance order status */
  async advanceOrderStatus(orderId: string, nextStatus: Order['order_status'], customerId: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: nextStatus })
      .eq('id', orderId);
    
    if (error) throw new Error(error.message);

    const statusLabels: Record<Order['order_status'], string> = {
      placed: 'Placed',
      ready_to_deliver: 'Ready for Delivery',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
    };

    // Notify customer
    await supabase.from('notifications').insert({
      user_id: customerId,
      message: `Your order #${orderId.slice(0,8)} is now ${statusLabels[nextStatus]}.`,
      type: 'status_update',
    });

    // Update local state
    this.myOrders.update((orders) => 
      orders.map((o) => (o.id === orderId ? { ...o, order_status: nextStatus } : o))
    );
  }
}
