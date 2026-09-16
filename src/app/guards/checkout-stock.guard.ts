import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ToastService } from '../services/toast.service';
import { getApiErrorMessage } from '../shared/http/api-error.util';

/**
 * Impide abrir checkout con un carrito basado en stock/precios obsoletos.
 * Siempre consulta el catálogo real antes de activar la ruta.
 */
export const checkoutStockGuard: CanActivateFn = async () => {
  const cartService = inject(CartService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  if (cartService.items().length === 0) {
    toastService.show('Tu carrito está vacío. Agrega productos antes de continuar al checkout.', 'warning', 5500);
    return router.createUrlTree(['/carrito']);
  }

  try {
    const result = await cartService.refreshAvailability();

    if (cartService.items().length === 0) {
      toastService.show('Las prendas del carrito ya no cuentan con existencia disponible. Revisa el catálogo.', 'warning', 6500);
      return router.createUrlTree(['/carrito']);
    }

    if (result.changed) {
      toastService.show('Actualizamos tu carrito con las existencias vigentes. Revísalo antes de continuar al pago.', 'warning', 6500);
      return router.createUrlTree(['/carrito']);
    }

    return true;
  } catch (error) {
    toastService.show(
      getApiErrorMessage(error, 'No fue posible verificar las existencias actuales. Por seguridad, no puedes entrar al checkout todavía.'),
      'error',
      6500
    );
    return router.createUrlTree(['/carrito']);
  }
};
