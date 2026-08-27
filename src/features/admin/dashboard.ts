import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { ProductService } from '../../core/product.service';
import { OrderService } from '../../core/order.service';
import { NotificationBellComponent } from '../../ui/notification-bell';
import { ToastComponent } from '../../ui/toast';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, NotificationBellComponent, ToastComponent],
  templateUrl: './dashboard.html',
})
export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private mouseMoveListener?: (e: MouseEvent) => void;
  constructor(
    public auth: AuthService,
    public productSvc: ProductService,
    public orderSvc: OrderService
  ) {}

  ngOnInit(): void {
    this.productSvc.loadProducts();
    this.orderSvc.loadAllOrders();
  }

  ngAfterViewInit(): void {
    const glow = document.getElementById('cursor-glow');
    if (glow) {
      this.mouseMoveListener = (e: MouseEvent) => {
        glow.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      };
      window.addEventListener('mousemove', this.mouseMoveListener);
    }
  }

  ngOnDestroy(): void {
    if (this.mouseMoveListener) {
      window.removeEventListener('mousemove', this.mouseMoveListener);
    }
  }

  logout() {
    this.auth.signOut();
  }
}
