import { Component, OnInit, computed, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../core/order.service';
import { ProductService } from '../../core/product.service';

interface ProductSale {
  name: string;
  totalSold: number;
  revenue: number;
}

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
})
export class AdminAnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = signal(true);
  private observer?: IntersectionObserver;

  constructor(
    public orderSvc: OrderService,
    public productSvc: ProductService
  ) {}

  ngOnInit(): void {
    // Orders are already loaded by parent dashboard; just mark ready
    this.loading.set(false);
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    // Timeout to ensure elements are rendered
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => this.observer?.observe(el));
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }

  get orders(): Order[] {
    return this.orderSvc.allOrders();
  }

  get totalRevenue(): number {
    return this.orders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + o.total_amount, 0);
  }

  get totalOrders(): number {
    return this.orders.length;
  }

  get deliveredOrders(): number {
    return this.orders.filter(o => o.order_status === 'delivered').length;
  }

  get pendingOrders(): number {
    return this.orders.filter(o => o.order_status === 'placed').length;
  }

  get inTransitOrders(): number {
    return this.orders.filter(o =>
      o.order_status === 'out_for_delivery' || o.order_status === 'ready_to_deliver'
    ).length;
  }

  get statusBreakdown(): { label: string; count: number; pct: number; cls: string }[] {
    const total = this.orders.length || 1;
    return [
      { label: 'Placed',           count: this.pendingOrders,   pct: (this.pendingOrders / total) * 100,   cls: 'status-placed'    },
      { label: 'Ready / In Transit', count: this.inTransitOrders, pct: (this.inTransitOrders / total) * 100, cls: 'status-out'        },
      { label: 'Delivered',         count: this.deliveredOrders, pct: (this.deliveredOrders / total) * 100, cls: 'status-delivered'  },
    ];
  }

  get topProducts(): ProductSale[] {
    const map = new Map<string, ProductSale>();
    for (const order of this.orders) {
      for (const item of order.order_items ?? []) {
        const name = item.product?.name ?? 'Unknown';
        const existing = map.get(name) ?? { name, totalSold: 0, revenue: 0 };
        map.set(name, {
          name,
          totalSold: existing.totalSold + item.quantity,
          revenue: existing.revenue + item.price_at_purchase * item.quantity,
        });
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  get avgOrderValue(): number {
    if (this.orders.length === 0) return 0;
    return this.totalRevenue / this.orders.length;
  }

  get recentOrders(): Order[] {
    return [...this.orders].slice(0, 5);
  }
}
