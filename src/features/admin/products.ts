import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, ProductInput } from '../../core/product.service';
import { AuthService } from '../../core/auth.service';

interface ProductForm {
  name: string;
  description: string;
  price: number | null;
  stock_quantity: number | null;
  category: string;
  image_url: string;
}

const emptyForm = (): ProductForm => ({
  name: '',
  description: '',
  price: null,
  stock_quantity: null,
  category: '',
  image_url: '',
});

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
})
export class AdminProductsComponent implements OnInit {
  // Modal state
  showModal = signal(false);
  editingProduct = signal<Product | null>(null);
  form = signal<ProductForm>(emptyForm());
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  saving = signal(false);
  saveError = signal<string | null>(null);
  deletingId = signal<string | null>(null);

  // Search
  search = signal('');

  filteredProducts = computed(() => {
    const q = this.search().toLowerCase();
    if (!q) return this.productSvc.products();
    return this.productSvc.products().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
    );
  });

  constructor(
    public productSvc: ProductService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.productSvc.loadProducts();
  }

  openCreate(): void {
    this.editingProduct.set(null);
    this.form.set(emptyForm());
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.saveError.set(null);
    this.showModal.set(true);
  }

  openEdit(product: Product): void {
    this.editingProduct.set(product);
    this.form.set({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      stock_quantity: product.stock_quantity,
      category: product.category ?? '',
      image_url: product.image_url ?? '',
    });
    this.selectedFile.set(null);
    this.previewUrl.set(product.image_url ?? null);
    this.saveError.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile.set(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  async save(): Promise<void> {
    const f = this.form();
    if (!f.name || f.price == null || f.stock_quantity == null) {
      this.saveError.set('Name, price, and stock are required.');
      return;
    }
    this.saving.set(true);
    this.saveError.set(null);
    try {
      const input: ProductInput = {
        name: f.name.trim(),
        description: f.description.trim() || null,
        price: Number(f.price),
        stock_quantity: Number(f.stock_quantity),
        category: f.category.trim() || null,
        image_url: f.image_url.trim() || null,
      };
      const editing = this.editingProduct();
      if (editing) {
        await this.productSvc.updateProduct(
          editing.id,
          input,
          this.selectedFile() ?? undefined,
          editing.image_url
        );
      } else {
        await this.productSvc.createProduct(input, this.selectedFile() ?? undefined);
      }
      this.closeModal();
    } catch (err: unknown) {
      this.saveError.set(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteProduct(product: Product): Promise<void> {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    this.deletingId.set(product.id);
    try {
      await this.productSvc.deleteProduct(product.id, product.image_url);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      this.deletingId.set(null);
    }
  }
}
