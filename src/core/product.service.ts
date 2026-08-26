import { Injectable, signal, computed } from '@angular/core';
import { supabase } from './supabase.client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  category: string | null;
  created_by: string | null;
  created_at: string;
}

export type ProductInput = Omit<Product, 'id' | 'created_by' | 'created_at'>;

@Injectable({ providedIn: 'root' })
export class ProductService {
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly productCount = computed(() => this.products().length);

  /** Fetch all products from Supabase */
  async loadProducts(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      this.error.set(error.message);
    } else {
      this.products.set((data as Product[]) ?? []);
    }
    this.loading.set(false);
  }

  /** Fetch a single product by ID */
  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error.message);
      return null;
    }
    return data as Product;
  }

  /** Upload image to Supabase Storage; returns public URL */
  private async uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: false });
    if (error) throw new Error(`Image upload failed: ${error.message}`);

    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  }

  /** Remove an image from Storage by its public URL */
  private async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract path after the bucket name in the URL
      const match = imageUrl.match(/product-images\/(.+)$/);
      if (match) {
        await supabase.storage.from('product-images').remove([match[1]]);
      }
    } catch {
      // Non-fatal — product still gets deleted
    }
  }

  /** Create a new product, optionally uploading an image first */
  async createProduct(input: ProductInput, imageFile?: File): Promise<Product> {
    let image_url = input.image_url;
    if (imageFile) {
      image_url = await this.uploadImage(imageFile);
    }

    const { data, error } = await supabase
      .from('products')
      .insert({ ...input, image_url })
      .select()
      .single();

    if (error) throw new Error(error.message);
    const product = data as Product;
    this.products.update((list) => [product, ...list]);
    return product;
  }

  /** Update an existing product */
  async updateProduct(
    id: string,
    input: Partial<ProductInput>,
    imageFile?: File,
    oldImageUrl?: string | null
  ): Promise<Product> {
    let image_url = input.image_url;

    if (imageFile) {
      // Delete old image if it exists
      if (oldImageUrl) await this.deleteImage(oldImageUrl);
      image_url = await this.uploadImage(imageFile);
    }

    const { data, error } = await supabase
      .from('products')
      .update({ ...input, image_url })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    const updated = data as Product;
    this.products.update((list) =>
      list.map((p) => (p.id === id ? updated : p))
    );
    return updated;
  }

  /** Delete a product and its image */
  async deleteProduct(id: string, imageUrl?: string | null): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    if (imageUrl) await this.deleteImage(imageUrl);
    this.products.update((list) => list.filter((p) => p.id !== id));
  }
}
