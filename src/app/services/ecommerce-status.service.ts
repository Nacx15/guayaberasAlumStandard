import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  map,
  of,
  shareReplay,
  tap,
} from 'rxjs';
import { environment } from '../../environments/environment';

export type EcommerceStatus = 'active' | 'maintenance' | 'inactive' | 'unavailable';
export type FreeShippingCondition = 'items' | 'amount' | 'items_or_amount' | 'items_and_amount';

export interface EcommerceFreeShippingConfiguration {
  enabled: boolean;
  condition: FreeShippingCondition;
  minItems: number;
  minAmount: number;
}

export interface EcommerceShippingConfiguration {
  flatRate: number;
  freeShipping: EcommerceFreeShippingConfiguration;
}

export interface ShippingEstimate {
  shippingCost: number;
  qualifiesForFreeShipping: boolean;
  itemsMet: boolean;
  amountMet: boolean;
  missingItems: number;
  missingAmount: number;
  progress: number;
}

interface EcommerceStatusApiResponse {
  success: boolean;
  data: {
    tenant: string;
    tenant_name: string;
    status: 'active' | 'maintenance' | 'inactive';
    available: boolean;
    checkout_enabled: boolean;
    maintenance_message: string | null;
    message: string | null;
    shipping?: {
      flat_rate: number | string;
      free_shipping: {
        enabled: boolean;
        condition: string;
        min_items: number | string;
        min_amount: number | string;
      };
    } | null;
    updated_at: string | null;
  };
}

export interface EcommerceStatusState {
  status: EcommerceStatus;
  message?: string | null;
  available?: boolean;
  checkoutEnabled?: boolean;
  maintenanceMessage?: string | null;
  shipping?: EcommerceShippingConfiguration | null;
  updatedAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class EcommerceStatusService {
  private readonly http = inject(HttpClient);
  private readonly cacheTtlMs = 3000;
  private lastLoadedAt = 0;

  readonly current = signal<EcommerceStatusState | null>(null);
  readonly loading = signal(false);
  readonly shipping = computed(() => this.current()?.shipping ?? null);

  private inFlight$?: Observable<EcommerceStatusState>;

  load(force = false): Observable<EcommerceStatusState> {
    const cached = this.current();
    const cacheIsFresh = cached && (Date.now() - this.lastLoadedAt) < this.cacheTtlMs;

    if (cacheIsFresh && !force) {
      return of(cached);
    }

    if (this.inFlight$) {
      return this.inFlight$;
    }

    this.loading.set(true);

    const request$ = this.http
      .get<EcommerceStatusApiResponse>(environment.endpoints.ecommerceStatus)
      .pipe(
        map((response) => {
          const data = response?.data;
          const valid = data && ['active', 'maintenance', 'inactive'].includes(data.status);

          if (!response?.success || !valid) {
            return {
              status: 'unavailable' as const,
              message: 'No fue posible validar la disponibilidad de la tienda.',
              shipping: null,
            };
          }

          return {
            status: data.status,
            message: data.message,
            available: data.available,
            checkoutEnabled: data.checkout_enabled,
            maintenanceMessage: data.maintenance_message,
            shipping: this.parseShipping(data.shipping),
            updatedAt: data.updated_at,
          } satisfies EcommerceStatusState;
        }),
        catchError((error: HttpErrorResponse) => {
          const message = error?.error?.message
            || error?.error?.mensajeError
            || 'No fue posible validar la disponibilidad de la tienda. Intenta nuevamente.';

          return of<EcommerceStatusState>({
            status: 'unavailable',
            message,
            shipping: null,
          });
        }),
        tap((state) => {
          this.current.set(state);
          this.lastLoadedAt = Date.now();
        }),
        finalize(() => {
          this.loading.set(false);
          this.inFlight$ = undefined;
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this.inFlight$ = request$;
    return request$;
  }

  refresh(): Observable<EcommerceStatusState> {
    return this.load(true);
  }

  estimateShipping(itemCount: number, subtotal: number): ShippingEstimate | null {
    const config = this.shipping();
    if (!config) return null;

    const safeItems = Math.max(0, Number(itemCount) || 0);
    const safeSubtotal = Math.max(0, Number(subtotal) || 0);
    const free = config.freeShipping;
    const itemsMet = safeItems >= free.minItems;
    const amountMet = safeSubtotal >= free.minAmount;

    let qualifies = false;
    if (free.enabled) {
      switch (free.condition) {
        case 'items': qualifies = itemsMet; break;
        case 'amount': qualifies = amountMet; break;
        case 'items_or_amount': qualifies = itemsMet || amountMet; break;
        case 'items_and_amount': qualifies = itemsMet && amountMet; break;
      }
    }

    const itemsProgress = free.minItems > 0 ? Math.min(1, safeItems / free.minItems) : 1;
    const amountProgress = free.minAmount > 0 ? Math.min(1, safeSubtotal / free.minAmount) : 1;
    let progress = 0;

    switch (free.condition) {
      case 'items': progress = itemsProgress; break;
      case 'amount': progress = amountProgress; break;
      case 'items_or_amount': progress = Math.max(itemsProgress, amountProgress); break;
      case 'items_and_amount': progress = Math.min(itemsProgress, amountProgress); break;
    }

    return {
      shippingCost: qualifies ? 0 : config.flatRate,
      qualifiesForFreeShipping: qualifies,
      itemsMet,
      amountMet,
      missingItems: Math.max(0, free.minItems - safeItems),
      missingAmount: Math.max(0, free.minAmount - safeSubtotal),
      progress: free.enabled ? progress : 0,
    };
  }

  setFromHttpState(status: EcommerceStatus, message?: string | null): void {
    const active = status === 'active';
    const previousShipping = this.current()?.shipping ?? null;

    this.current.set({
      status,
      message: message ?? null,
      available: active,
      checkoutEnabled: active,
      maintenanceMessage: status === 'maintenance' ? (message ?? null) : null,
      shipping: active ? previousShipping : null,
    });
  }

  private parseShipping(raw: EcommerceStatusApiResponse['data']['shipping']): EcommerceShippingConfiguration | null {
    if (!raw || !raw.free_shipping) return null;

    const condition = raw.free_shipping.condition as FreeShippingCondition;
    const validConditions: FreeShippingCondition[] = ['items', 'amount', 'items_or_amount', 'items_and_amount'];
    const flatRate = Number(raw.flat_rate);
    const minItems = Number(raw.free_shipping.min_items);
    const minAmount = Number(raw.free_shipping.min_amount);

    if (
      !validConditions.includes(condition)
      || !Number.isFinite(flatRate) || flatRate < 0
      || !Number.isFinite(minItems) || minItems < 0
      || !Number.isFinite(minAmount) || minAmount < 0
    ) {
      return null;
    }

    return {
      flatRate,
      freeShipping: {
        enabled: raw.free_shipping.enabled === true,
        condition,
        minItems,
        minAmount,
      },
    };
  }
}
