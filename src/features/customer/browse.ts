import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../core/product.service';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-customer-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './browse.html',
})
export class CustomerBrowseComponent implements OnInit {
  search = signal('');
  selectedCategory = signal('');
  addedProductId = signal<string | null>(null);

  readonly categories = computed(() => {
    const cats = this.productSvc
      .products()
      .map((p) => p.category)
      .filter((c): c is string => !!c);
    return ['', ...new Set(cats)];
  });

  readonly filteredProducts = computed(() => {
    const q = this.search().toLowerCase();
    const cat = this.selectedCategory();
    return this.productSvc.products().filter((p) => {
      const matchName = !q || p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q);
      const matchCat = !cat || p.category === cat;
      return matchName && matchCat;
    });
  });

  constructor(
    public productSvc: ProductService,
    public cart: CartService
  ) {}

  ngOnInit(): void {
    this.productSvc.loadProducts();
  }

  addToCart(product: Product): void {
    if (product.stock_quantity === 0) return;
    this.cart.addToCart(product, 1);
    this.addedProductId.set(product.id);
    setTimeout(() => this.addedProductId.set(null), 1500);
  }

  isInCart(productId: string): boolean {
    return this.cart.items().some((i) => i.product.id === productId);
  }

  cartQty(productId: string): number {
    return this.cart.items().find((i) => i.product.id === productId)?.quantity ?? 0;
  }
}
