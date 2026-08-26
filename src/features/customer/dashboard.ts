import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { ProductService } from '../../core/product.service';
import { NotificationBellComponent } from '../../ui/notification-bell';
import { ToastComponent } from '../../ui/toast';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, NotificationBellComponent, ToastComponent],
  templateUrl: './dashboard.html',
})
export class CustomerDashboardComponent implements OnInit {
  constructor(
    public auth: AuthService,
    public cart: CartService,
    public productSvc: ProductService
  ) {}

  ngOnInit(): void {
    this.productSvc.loadProducts();
  }

  logout() {
    this.auth.signOut();
  }
}
