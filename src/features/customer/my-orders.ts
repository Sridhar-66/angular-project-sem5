import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../core/order.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-customer-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.html',
})
export class CustomerMyOrdersComponent implements OnInit {
  expandedOrderId: string | null = null;

  constructor(
    public orderSvc: OrderService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.auth.user()?.id;
    if (userId) this.orderSvc.loadMyOrders(userId);
  }

  toggleExpand(orderId: string): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  statusLabel(status: Order['order_status']): string {
    const labels: Record<Order['order_status'], string> = {
      placed: '📋 Placed',
      ready_to_deliver: '🎁 Ready to Deliver',
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
}
