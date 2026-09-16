import { HttpErrorResponse } from '@angular/common/http';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'No fue posible completar la operación.'
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const body = error.error || {};

  if (error.status === 422) {
    const validation = body.errores ?? body.errors;
    if (validation && typeof validation === 'object') {
      const messages = Object.values(validation)
        .flat()
        .filter(Boolean)
        .slice(0, 4)
        .map((value) => String(value));

      if (messages.length > 0) {
        return messages.join(' ');
      }
    }
  }

  if (error.status === 409 && body.code === 'ecommerce_price_unavailable') {
    return body.message || 'Uno de los productos ya no tiene precio disponible para venta en línea.';
  }

  if (error.status === 409) {
    return body.message || body.mensajeError || 'El inventario o las condiciones del pedido cambiaron. Revisa tu carrito.';
  }

  if (error.status === 403) {
    return body.message || body.mensajeError || 'La tienda no está disponible para realizar esta operación.';
  }

  if (error.status === 503) {
    return body.message || body.mensajeError || 'La tienda no está disponible temporalmente.';
  }

  if (error.status === 500) {
    return body.message || body.mensajeError || 'Ocurrió un error en el servidor. Intenta nuevamente.';
  }

  if (error.status === 0) {
    return 'No pudimos conectar con GuayaFlow. Verifica tu conexión e intenta nuevamente.';
  }

  return body.mensajeError || body.message || body.error || fallback;
}
