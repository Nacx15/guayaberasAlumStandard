import { Injectable, computed, inject, signal } from '@angular/core';
import { Product, WishlistItem } from '../models/product.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly WISHLIST_STORAGE_KEY = 'guayaberas_alum_wishlist';
  private readonly itemsSignal = signal<WishlistItem[]>(this.loadWishlistFromStorage());
  private readonly toastService = inject(ToastService);

  readonly items = this.itemsSignal.asReadonly();

  readonly totalWishlistCount = computed(() => this.itemsSignal().length);

  private loadWishlistFromStorage(): WishlistItem[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    try {
      const data = localStorage.getItem(this.WISHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveWishlistToStorage(items: WishlistItem[]): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(this.WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  isInWishlist(productId: string): boolean {
    return this.itemsSignal().some(item => item.product.id === productId);
  }

  toggleWishlist(product: Product): void {
    const exists = this.isInWishlist(product.id);
    let updated: WishlistItem[];
    if (exists) {
      updated = this.itemsSignal().filter(item => item.product.id !== product.id);
      this.toastService.show(`"${product.name}" se removió de favoritos.`, 'info');
    } else {
      updated = [...this.itemsSignal(), { product, addedAt: new Date().toISOString() }];
      this.toastService.show(`"${product.name}" se guardó en tu lista de deseos.`, 'success');
    }
    this.itemsSignal.set(updated);
    this.saveWishlistToStorage(updated);
  }

  removeFromWishlist(productId: string): void {
    const current = this.itemsSignal();
    const product = current.find(i => i.product.id === productId)?.product;
    const updated = current.filter(item => item.product.id !== productId);
    this.itemsSignal.set(updated);
    this.saveWishlistToStorage(updated);
    if (product) {
      this.toastService.show(`"${product.name}" eliminado de favoritos.`, 'info');
    }
  }

  clearWishlist(): void {
    this.itemsSignal.set([]);
    this.saveWishlistToStorage([]);
  }
}
