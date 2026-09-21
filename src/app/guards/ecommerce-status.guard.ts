import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { EcommerceStatusService } from '../services/ecommerce-status.service';

export const ecommerceStatusGuard: CanActivateFn = () => {
  const statusService = inject(EcommerceStatusService);
  const router = inject(Router);

  return statusService.load().pipe(
    map((state) => {
      if (state.status === 'active') return true;
      if (state.status === 'inactive') return router.createUrlTree(['/inactive']);

      // maintenance y unavailable se manejan en fail closed.
      return router.createUrlTree(['/maintenance']);
    }),
    catchError(() => of(router.createUrlTree(['/maintenance']))),
  );
};
