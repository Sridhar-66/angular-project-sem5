import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { OrderService, Order } from '../../core/order.service';

const DELIVERY_FEE_PER_ORDER = 50; // ₹50 per successfully delivered order

@Component({
  selector: 'app-delivery-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
})
export class DeliveryAnalyticsComponent implements OnInit {
  allAssigned = signal<Order[]>([]);
  loading = signal(true);

  readonly deliveryFee = DELIVERY_FEE_PER_ORDER;

  constructor(
    public auth: AuthService,
    private orderSvc: OrderService
  ) {}

  ngOnInit(): void {
    // myOrders signal is already loaded by the parent dashboard
    this.loading.set(false);
  }

  get orders(): Order[] {
    return this.orderSvc.myOrders();
  }

  get deliveredOrders(): Order[] {
    return this.orders.filter(o => o.order_status === 'delivered');
  }

  get pendingOrders(): Order[] {
    return this.orders.filter(o => o.order_status !== 'delivered');
  }

  get totalEarnings(): number {
    return this.deliveredOrders.length * DELIVERY_FEE_PER_ORDER;
  }

  get totalOrdersHandled(): number {
    return this.orders.length;
  }

  get deliveryRate(): number {
    if (this.totalOrdersHandled === 0) return 0;
    return (this.deliveredOrders.length / this.totalOrdersHandled) * 100;
  }

  get totalValueDelivered(): number {
    return this.deliveredOrders.reduce((sum, o) => sum + o.total_amount, 0);
  }
}
