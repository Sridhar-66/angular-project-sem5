import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-customer-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
})
export class CustomerCartComponent {
  constructor(
    public cart: CartService,
    private router: Router
  ) {}

  checkout(): void {
    this.router.navigate(['/customer/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/customer/browse']);
  }
}
