import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../core/product.service';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  addedProductId = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private productSvc: ProductService,
    public cart: CartService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Product ID not found.');
      this.loading.set(false);
      return;
    }

    try {
      const p = await this.productSvc.getProduct(id);
      if (!p) {
        this.error.set('Product not found.');
      } else {
        this.product.set(p);
      }
    } catch (err: any) {
      this.error.set(err.message ?? 'Error fetching product.');
    } finally {
      this.loading.set(false);
    }
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

  goBack(): void {
    this.location.back();
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const placeholder = img.nextElementSibling as HTMLElement;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  }
}
