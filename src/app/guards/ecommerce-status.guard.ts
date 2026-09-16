import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { EcommerceStatusService } from '../services/ecommerce-status.service';

export const ecommerceStatusGuard: CanActivateFn = () => {
  const statusService = inject(EcommerceStatusService);
  const router = inject(Router);

  return statusService.refresh().pipe(
    map((state) => {
      if (state.status === 'active') return true;
      if (state.status === 'inactive') return router.createUrlTree(['/inactive']);
      return router.createUrlTree(['/maintenance']);
    })
  );
};
