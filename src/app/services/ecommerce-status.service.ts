import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type EcommerceStatus = 'active' | 'maintenance' | 'inactive' | 'unavailable';

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
    updated_at: string | null;
  };
}

export interface EcommerceStatusState {
  status: EcommerceStatus;
  message?: string | null;
  available?: boolean;
  checkoutEnabled?: boolean;
  maintenanceMessage?: string | null;
  updatedAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class EcommerceStatusService {
  private readonly http = inject(HttpClient);

  readonly current = signal<EcommerceStatusState | null>(null);
  readonly loading = signal(false);

  refresh(): Observable<EcommerceStatusState> {
    this.loading.set(true);

    return this.http.get<EcommerceStatusApiResponse>(environment.endpoints.ecommerceStatus).pipe(
      map((response) => {
        const data = response?.data;
        const valid = data && ['active', 'maintenance', 'inactive'].includes(data.status);

        if (!response?.success || !valid) {
          return {
            status: 'unavailable' as const,
            message: 'No fue posible validar la disponibilidad de la tienda.'
          };
        }

        return {
          status: data.status,
          message: data.message,
          available: data.available,
          checkoutEnabled: data.checkout_enabled,
          maintenanceMessage: data.maintenance_message,
          updatedAt: data.updated_at
        } satisfies EcommerceStatusState;
      }),
      catchError((error: HttpErrorResponse) => {
        const message = error?.error?.message
          || error?.error?.mensajeError
          || 'No fue posible validar la disponibilidad de la tienda. Intenta nuevamente.';

        return of<EcommerceStatusState>({
          status: 'unavailable',
          message
        });
      }),
      tap((state) => {
        this.current.set(state);
        this.loading.set(false);
      })
    );
  }

  setFromHttpState(status: EcommerceStatus, message?: string | null): void {
    this.current.set({ status, message });
  }
}
