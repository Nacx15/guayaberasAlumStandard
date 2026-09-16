import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CartItem, Product, ProductVariant } from '../models/product.model';
import { ProductService } from './product.service';
import { ToastService } from './toast.service';

export interface CartRevalidationResult {
  changed: boolean;
  removed: number;
  adjusted: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly CART_STORAGE_KEY = 'guayaberas_alum_cart';
  private readonly itemsSignal = signal<CartItem[]>(this.loadCartFromStorage());
  private readonly toastService = inject(ToastService);
  private readonly productService = inject(ProductService);
  private revalidationInFlight: Promise<CartRevalidationResult> | null = null;

  readonly items = this.itemsSignal.asReadonly();
  readonly isRevalidating = signal(false);

  readonly totalItemsCount = computed(() =>
    this.itemsSignal().reduce((total, item) => total + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((total, item) => total + this.itemUnitPrice(item) * item.quantity, 0)
  );

  readonly freeShippingThreshold = 1999;

  readonly shippingCost = computed(() => {
    if (this.subtotal() === 0) return 0;
    return this.subtotal() >= this.freeShippingThreshold ? 0 : 250;
  });

  readonly discountAmount = signal<number>(0);
  readonly appliedCoupon = signal<string | null>(null);

  readonly total = computed(() => {
    const sub = this.subtotal();
    if (sub === 0) return 0;
    return Math.max(0, sub + this.shippingCost() - this.discountAmount());
  });

  itemUnitPrice(item: CartItem): number {
    const value = Number(item.selectedVariant?.precio_ecommerce ?? item.product.precio_ecommerce ?? 0);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  addToCart(product: Product, size: string, color: string, quantity = 1): boolean {
    if (!size || !color) {
      this.toastService.show('Por favor selecciona una talla y un color disponibles con existencia.', 'error');
      return false;
    }

    const variant = this.findVariant(product, size, color);
    if (!variant) {
      this.toastService.show('La variante seleccionada ya no está disponible.', 'error');
      return false;
    }

    const unitPrice = this.variantPrice(product, variant);
    if (unitPrice <= 0) {
      this.toastService.show(`"${product.name}" no está disponible para compra directa en línea. Consulta el precio por WhatsApp.`, 'info');
      return false;
    }

    const available = Math.max(0, Number(variant.availableBodega ?? variant.stockDisponible ?? 0));
    if (available <= 0) {
      this.toastService.show(`La combinación "${product.name}" (${size}, ${color}) no cuenta con existencia disponible en bodega.`, 'error');
      return false;
    }

    const cartProduct: Product = { ...product, price: unitPrice, precio_ecommerce: unitPrice };
    const current = this.itemsSignal();
    const canonicalSize = variant.talla;
    const canonicalColor = variant.color;
    const existingIndex = current.findIndex((item) => {
      if (item.product.id !== product.id) return false;

      if (item.selectedVariant?.id && variant.id) {
        return item.selectedVariant.id === variant.id;
      }

      return this.normalizeVariantValue(item.selectedSize) === this.normalizeVariantValue(canonicalSize)
        && this.normalizeVariantValue(item.selectedColor) === this.normalizeVariantValue(canonicalColor);
    });

    let updated: CartItem[];
    if (existingIndex > -1) {
      const existingItem = current[existingIndex];
      const newQty = Math.min(existingItem.quantity + Math.max(1, quantity), available);
      if (newQty < existingItem.quantity + Math.max(1, quantity)) {
        this.toastService.show(`Solo hay ${available} piezas disponibles en bodega para esta talla y color.`, 'info');
      }

      updated = current.map((item, index) => index === existingIndex
        ? {
            ...item,
            product: cartProduct,
            selectedSize: canonicalSize,
            selectedColor: canonicalColor,
            selectedVariant: variant,
            quantity: newQty
          }
        : item
      );
    } else {
      updated = [
        ...current,
        {
          product: cartProduct,
          selectedColor: canonicalColor,
          selectedSize: canonicalSize,
          selectedVariant: variant,
          quantity: Math.min(Math.max(1, quantity), available)
        }
      ];
    }

    this.commit(updated);
    this.toastService.show(`¡"${product.name}" (Talla: ${size}, ${color}) agregado al carrito!`, 'success');
    return true;
  }

  updateQuantity(index: number, newQty: number): void {
    const current = this.itemsSignal();
    const item = current[index];
    if (!item) return;

    if (newQty <= 0) {
      this.removeItem(index);
      return;
    }

    const variant = item.selectedVariant ?? this.findVariant(item.product, item.selectedSize, item.selectedColor);
    const maxStock = Math.max(0, Number(variant?.availableBodega ?? variant?.stockDisponible ?? 0));

    if (maxStock <= 0) {
      this.removeItem(index);
      return;
    }

    if (newQty > maxStock) {
      this.toastService.show(`Solo hay ${maxStock} piezas disponibles en bodega.`, 'info');
      newQty = maxStock;
    }

    this.commit(current.map((it, i) => i === index ? { ...it, quantity: newQty } : it));
  }

  removeItem(index: number): void {
    const current = this.itemsSignal();
    const removedItem = current[index];
    this.commit(current.filter((_, i) => i !== index));
    if (removedItem) {
      this.toastService.show(`"${removedItem.product.name}" se eliminó del carrito.`, 'info');
    }
  }

  /**
   * Vuelve a consultar el catálogo real y reemplaza precio/stock del carrito con
   * la respuesta vigente de GuayaFlow. Si la API falla, lanza el error y el checkout se detiene.
   */
  refreshAvailability(): Promise<CartRevalidationResult> {
    if (this.revalidationInFlight) {
      return this.revalidationInFlight;
    }

    this.isRevalidating.set(true);

    const request = this.performAvailabilityRefresh().finally(() => {
      if (this.revalidationInFlight === request) {
        this.revalidationInFlight = null;
      }
      this.isRevalidating.set(false);
    });

    this.revalidationInFlight = request;
    return request;
  }

  private async performAvailabilityRefresh(): Promise<CartRevalidationResult> {
    if (this.itemsSignal().length === 0) return { changed: false, removed: 0, adjusted: 0 };

    const liveProducts = await firstValueFrom(this.productService.loadFromApi());
    // Tomar el carrito después de recibir la API evita reponer o sobrescribir
    // cambios que el usuario haya hecho mientras la consulta estaba en vuelo.
    const original = this.itemsSignal();
    if (original.length === 0) return { changed: false, removed: 0, adjusted: 0 };

    const updated: CartItem[] = [];
    let removed = 0;
    let adjusted = 0;

    for (const item of original) {
      const liveProduct = liveProducts.find((product) =>
        product.id === item.product.id
        || (!!product.numericId && product.numericId === item.product.numericId)
        || (!!product.ref_code && product.ref_code === item.product.ref_code)
      );

      if (!liveProduct) {
        removed++;
        continue;
      }

      const variant = this.findVariant(liveProduct, item.selectedSize, item.selectedColor);
      const price = variant ? this.variantPrice(liveProduct, variant) : 0;
      const available = Math.max(0, Number(variant?.availableBodega ?? variant?.stockDisponible ?? 0));

      if (!variant || price <= 0 || available <= 0) {
        removed++;
        continue;
      }

      const quantity = Math.min(item.quantity, available);
      const canonicalSize = variant.talla;
      const canonicalColor = variant.color;
      const variantIdentityChanged =
        this.normalizeVariantValue(item.selectedSize) !== this.normalizeVariantValue(canonicalSize)
        || this.normalizeVariantValue(item.selectedColor) !== this.normalizeVariantValue(canonicalColor)
        || (!!item.selectedVariant?.id && item.selectedVariant.id !== variant.id);

      if (quantity !== item.quantity || price !== this.itemUnitPrice(item) || variantIdentityChanged) {
        adjusted++;
      }

      updated.push({
        ...item,
        product: { ...liveProduct, price, precio_ecommerce: price },
        selectedSize: canonicalSize,
        selectedColor: canonicalColor,
        selectedVariant: variant,
        quantity
      });
    }

    const changed = removed > 0 || adjusted > 0 || updated.length !== original.length;
    this.commit(updated);

    if (removed > 0) {
      this.toastService.show(`${removed} variante(s) se retiraron del carrito porque ya no tienen stock o precio web disponible.`, 'warning', 6000);
    }
    if (adjusted > 0) {
      this.toastService.show('Actualizamos cantidades o precios del carrito con la disponibilidad vigente.', 'info', 5500);
    }

    return { changed, removed, adjusted };
  }

  /**
   * Construye el snapshot que puede salir del navegador hacia checkout.
   * Re-resuelve cada variante desde el producto ya sincronizado usando la selección
   * visible del carrito. Esto evita que un selectedVariant persistido de una talla
   * anterior pueda viajar al pago después de cambiar de variante del mismo modelo.
   */
  createCheckoutSnapshot(): CartItem[] {
    return this.itemsSignal().map((item) => {
      const variant = this.findVariant(item.product, item.selectedSize, item.selectedColor);
      if (!variant) {
        throw new Error(`La variante ${item.product.name} (${item.selectedColor}, talla ${item.selectedSize}) ya no pudo validarse.`);
      }

      const available = Math.max(0, Number(variant.availableBodega ?? variant.stockDisponible ?? 0));
      const price = this.variantPrice(item.product, variant);
      if (available <= 0 || price <= 0 || item.quantity > available) {
        throw new Error(`La variante ${item.product.name} (${variant.color}, talla ${variant.talla}) cambió de disponibilidad.`);
      }

      return {
        ...item,
        product: {
          ...item.product,
          price,
          precio_ecommerce: price
        },
        selectedSize: variant.talla,
        selectedColor: variant.color,
        selectedVariant: { ...variant },
        quantity: item.quantity
      };
    });
  }

  restoreSnapshot(snapshot: CartItem[]): void {
    this.commit(Array.isArray(snapshot) ? snapshot : []);
  }

  applyCoupon(code: string): boolean {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'TEKIT10') {
      const discount = Math.round(this.subtotal() * 0.10);
      this.discountAmount.set(discount);
      this.appliedCoupon.set(cleanCode);
      this.toastService.show('¡Cupón TEKIT10 aplicado! 10% de descuento.', 'success');
      return true;
    }
    if (cleanCode === 'ALUMLINO') {
      this.discountAmount.set(300);
      this.appliedCoupon.set(cleanCode);
      this.toastService.show('¡Cupón ALUMLINO aplicado! $300 MXN de descuento.', 'success');
      return true;
    }

    this.toastService.show('El cupón ingresado no es válido.', 'error');
    return false;
  }

  removeCoupon(): void {
    this.discountAmount.set(0);
    this.appliedCoupon.set(null);
    this.toastService.show('Cupón removido.', 'info');
  }

  clearCart(): void {
    this.commit([]);
    this.discountAmount.set(0);
    this.appliedCoupon.set(null);
  }

  private findVariant(product: Product, size: string, color: string): ProductVariant | undefined {
    const normalizedColor = this.normalizeVariantValue(color);
    const normalizedSize = this.normalizeVariantValue(size);
    const sameColor = (variant: ProductVariant) =>
      this.normalizeVariantValue(variant.color) === normalizedColor;

    // La UI guarda la etiqueta de talla (ej. "40"). Debe tener prioridad absoluta
    // sobre talla_id para evitar colisiones numéricas entre etiqueta e ID interno.
    const byLabel = product.variantes?.find((variant) =>
      sameColor(variant)
      && this.normalizeVariantValue(variant.talla) === normalizedSize
    );

    if (byLabel) return byLabel;

    // Compatibilidad con carritos antiguos que pudieran haber persistido talla_id.
    return product.variantes?.find((variant) =>
      sameColor(variant)
      && String(variant.talla_id) === String(size).trim()
    );
  }

  private normalizeVariantValue(value: unknown): string {
    return String(value ?? '').trim().toLocaleLowerCase('es-MX');
  }

  private variantPrice(product: Product, variant: ProductVariant): number {
    const value = Number(variant.precio_ecommerce ?? product.precio_ecommerce ?? 0);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  private loadCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    try {
      const data = localStorage.getItem(this.CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // El carrito sigue disponible en memoria aunque storage no esté disponible.
    }
  }

  private commit(items: CartItem[]): void {
    this.itemsSignal.set(items);
    this.saveCartToStorage(items);
  }
}
