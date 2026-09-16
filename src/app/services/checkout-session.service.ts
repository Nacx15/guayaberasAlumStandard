import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { CartItem } from '../models/product.model';

export interface CheckoutSession {
  saleId: number;
  preferenceId: string;
  initPoint: string;
  orderStatusUrl: string;
  reservationExpiresAt: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  addressLabel: string;
  cartItems: CartItem[];
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutSessionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly key = 'guayaberas_alum_checkout_session_v1';

  save(session: CheckoutSession): void {
    if (!isPlatformBrowser(this.platformId)) return;
    sessionStorage.setItem(this.key, JSON.stringify(session));
  }

  get(): CheckoutSession | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const raw = sessionStorage.getItem(this.key);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as CheckoutSession;
    } catch {
      this.clear();
      return null;
    }
  }

  getForSale(saleId: number | null): CheckoutSession | null {
    const session = this.get();
    if (!session) return null;
    if (saleId && session.saleId !== saleId) return null;
    return session;
  }

  clear(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    sessionStorage.removeItem(this.key);
  }
}
