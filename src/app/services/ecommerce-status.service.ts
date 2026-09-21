import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
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

  private inFlight$?: Observable<EcommerceStatusState>;

  /**
   * Obtiene el estado autoritativo del e-commerce.
   *
   * Por defecto reutiliza el ultimo estado conocido para evitar consultar
   * /ecommerce/status en cada navegacion interna. Los cambios de estado que
   * GuayaFlow comunique mediante 403/503 son aplicados por errorInterceptor.
   *
   * Usa force=true solamente para una comprobacion explicita, por ejemplo
   * desde las pantallas de maintenance/inactive.
   */
  load(force = false): Observable<EcommerceStatusState> {
    const cached = this.current();

    if (cached && !force) {
      return of(cached);
    }

    // Evita duplicar una consulta si varios guards/componentes solicitan el
    // estado mientras la misma peticion todavia esta en curso.
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
            };
          }

          return {
            status: data.status,
            message: data.message,
            available: data.available,
            checkoutEnabled: data.checkout_enabled,
            maintenanceMessage: data.maintenance_message,
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
          });
        }),
        tap((state) => {
          this.current.set(state);
        }),
        finalize(() => {
          this.loading.set(false);
          this.inFlight$ = undefined;
        }),
        shareReplay({
          bufferSize: 1,
          refCount: false,
        }),
      );

    this.inFlight$ = request$;
    return request$;
  }

  /** Fuerza una nueva consulta al endpoint de status. */
  refresh(): Observable<EcommerceStatusState> {
    return this.load(true);
  }

  /**
   * Actualiza el cache a partir de una respuesta normal del backend
   * interceptada globalmente, sin disparar una consulta extra de status.
   */
  setFromHttpState(status: EcommerceStatus, message?: string | null): void {
    const active = status === 'active';

    this.current.set({
      status,
      message: message ?? null,
      available: active,
      checkoutEnabled: active,
      maintenanceMessage: status === 'maintenance' ? (message ?? null) : null,
    });
  }
}
