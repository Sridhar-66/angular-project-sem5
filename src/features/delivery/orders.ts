import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { OrderService, Order } from '../../core/order.service';

@Component({
  selector: 'app-delivery-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
})
export class DeliveryOrdersComponent {
  advancingOrderId = signal<string | null>(null);

  constructor(
    public auth: AuthService,
    public orderSvc: OrderService
  ) {}

  getNextStatus(current: Order['order_status']): Order['order_status'] | null {
    if (current === 'placed') return 'ready_to_deliver';
    if (current === 'ready_to_deliver') return 'out_for_delivery';
    if (current === 'out_for_delivery') return 'delivered';
    return null;
  }

  statusLabel(status: Order['order_status'] | null): string {
    if (!status) return '';
    const labels: Record<Order['order_status'], string> = {
      placed: '📋 Placed',
      ready_to_deliver: '🎁 Ready',
      out_for_delivery: '🚚 Out for Delivery',
      delivered: '✅ Delivered',
    };
    return labels[status];
  }

  statusClass(status: Order['order_status']): string {
    const map: Record<Order['order_status'], string> = {
      placed: 'status-placed',
      ready_to_deliver: 'status-ready',
      out_for_delivery: 'status-out',
      delivered: 'status-delivered',
    };
    return map[status];
  }

  async advance(order: Order): Promise<void> {
    const nextStatus = this.getNextStatus(order.order_status);
    if (!nextStatus) return;

    this.advancingOrderId.set(order.id);
    try {
      await this.orderSvc.advanceOrderStatus(order.id, nextStatus, order.customer_id);
    } catch (err: any) {
      alert(err.message);
    } finally {
      this.advancingOrderId.set(null);
    }
  }
}
