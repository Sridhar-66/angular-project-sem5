import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { OrderService } from '../../core/order.service';
import { NotificationBellComponent } from '../../ui/notification-bell';
import { ToastComponent } from '../../ui/toast';

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, NotificationBellComponent, ToastComponent],
  templateUrl: './dashboard.html',
})
export class DeliveryDashboardComponent implements OnInit {
  constructor(
    public auth: AuthService,
    public orderSvc: OrderService
  ) {}

  ngOnInit(): void {
    const userId = this.auth.user()?.id;
    if (userId) {
      this.orderSvc.loadDeliveryOrders(userId);
    }
  }

  logout(): void {
    this.auth.signOut();
  }
}
