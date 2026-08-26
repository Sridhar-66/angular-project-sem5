import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../core/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
})
export class AdminOrdersComponent implements OnInit {
  deliveryBoys = signal<{ id: string; full_name: string; email: string }[]>([]);
  assigningOrderId = signal<string | null>(null);

  constructor(public orderSvc: OrderService) {}

  async ngOnInit(): Promise<void> {
    this.orderSvc.loadAllOrders();
    try {
      const boys = await this.orderSvc.getDeliveryBoys();
      this.deliveryBoys.set(boys || []);
    } catch (err) {
      console.error('Failed to load delivery boys', err);
    }
  }

  statusLabel(status: Order['order_status']): string {
    const labels: Record<Order['order_status'], string> = {
      placed: '📋 Placed',
      ready_to_deliver: '🎁 Ready',
      out_for_delivery: '🚚 On the Way',
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

  async assignOrder(orderId: string, deliveryBoyId: string): Promise<void> {
    if (!deliveryBoyId) return;
    this.assigningOrderId.set(orderId);
    try {
      await this.orderSvc.assignDeliveryBoy(orderId, deliveryBoyId);
    } catch (err: any) {
      alert(err.message);
    } finally {
      this.assigningOrderId.set(null);
    }
  }
}
