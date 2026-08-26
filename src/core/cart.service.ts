import { Injectable, signal, computed } from '@angular/core';
import type { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>([]);

  readonly itemCount = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity, 0)
  );

  readonly cartTotal = computed(() =>
    this.items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  addToCart(product: Product, quantity = 1): void {
    this.items.update((list) => {
      const existing = list.find((i) => i.product.id === product.id);
      if (existing) {
        return list.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...list, { product, quantity }];
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.items.update((list) =>
      list.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }

  removeFromCart(productId: string): void {
    this.items.update((list) => list.filter((i) => i.product.id !== productId));
  }

  clearCart(): void {
    this.items.set([]);
  }
}
