import { Component, OnInit } from '@angular/core';
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
export class AdminDashboardComponent implements OnInit {
  constructor(
    public auth: AuthService,
    public productSvc: ProductService,
    public orderSvc: OrderService
  ) {}

  ngOnInit(): void {
    this.productSvc.loadProducts();
    this.orderSvc.loadAllOrders();
  }

  logout() {
    this.auth.signOut();
  }
}
