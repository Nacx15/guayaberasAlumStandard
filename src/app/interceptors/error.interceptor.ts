import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { EcommerceStatusService } from '../services/ecommerce-status.service';
import { ToastService } from '../services/toast.service';
import { getApiErrorMessage } from '../shared/http/api-error.util';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const statusService = inject(EcommerceStatusService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const code = error.error?.code;
      const message = getApiErrorMessage(error);
      const onPaymentRoute = router.url.startsWith('/payment/') || router.url.startsWith('/pago/');

      if (error.status === 503) {
        const state = code === 'ecommerce_maintenance' ? 'maintenance' : 'unavailable';
        statusService.setFromHttpState(state, message);

        if (isPlatformBrowser(platformId) && !onPaymentRoute) {
          void router.navigate(['/maintenance']);
        }
      } else if (error.status === 403 && code === 'ecommerce_inactive') {
        statusService.setFromHttpState('inactive', message);

        if (isPlatformBrowser(platformId) && !onPaymentRoute) {
          void router.navigate(['/inactive']);
        }
      } else if (error.status === 0 && isPlatformBrowser(platformId)) {
        toast.show(message, 'error', 5200);
      }

      return throwError(() => error);
    })
  );
};
