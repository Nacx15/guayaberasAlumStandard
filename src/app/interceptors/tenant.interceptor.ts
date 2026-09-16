import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenant = environment.tenant;
  const cloned = req.clone({
    setHeaders: {
      'X-Tenant': tenant,
    },
  });
  return next(cloned);
};
