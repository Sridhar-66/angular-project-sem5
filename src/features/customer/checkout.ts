import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { OrderService } from '../../core/order.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-customer-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
})
export class CustomerCheckoutComponent implements OnInit {
  // Form fields (test-mode — no real payment)
  cardName = signal('');
  cardNumber = signal('');
  cardExpiry = signal('');
  cardCvc = signal('');
  deliveryAddress = signal('');

  placing = signal(false);
  error = signal<string | null>(null);

  constructor(
    public cart: CartService,
    private orderSvc: OrderService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.deliveryAddress.set(this.auth.profile()?.address ?? '');
  }

  get isFormValid(): boolean {
    return (
      this.cardName().trim().length > 0 &&
      this.cardNumber().replace(/\s/g, '').length === 16 &&
      this.cardExpiry().trim().length > 0 &&
      this.cardCvc().trim().length >= 3 &&
      this.deliveryAddress().trim().length > 0
    );
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').slice(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    this.cardNumber.set(val);
    input.value = val;
  }

  async placeOrder(): Promise<void> {
    if (this.cart.items().length === 0) {
      this.error.set('Your cart is empty.');
      return;
    }
    const customerId = this.auth.user()?.id;
    if (!customerId) {
      this.error.set('Not authenticated.');
      return;
    }

    this.placing.set(true);
    this.error.set(null);

    try {
      await this.orderSvc.placeOrder(customerId, this.cart.items(), this.deliveryAddress().trim());
      this.cart.clearCart();
      this.router.navigate(['/customer/my-orders']);
    } catch (err: unknown) {
      this.error.set(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      this.placing.set(false);
    }
  }

  backToCart(): void {
    this.router.navigate(['/customer/cart']);
  }
}
