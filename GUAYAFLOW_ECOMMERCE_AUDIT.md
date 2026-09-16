# Guayaberas Alum — GuayaFlow E-commerce Standard v1.0

Versión del estándar: `1.0.0`  
Tenant: `alum_gf`  
API desarrollo: `https://dev-api-nacx.guayaflow.com/api`  
API producción: `https://api-multitenant.guayaflow.com/api`

> Estado de certificación: **NO CERTIFICADO — checklist E2E pendiente**.

## Matriz de homologación

| Regla | Estado inicial | Cambio | Validación | Resultado |
|---|---|---|---|---|
| `X-Tenant` configurable | Ya usaba environment | Se conserva `environment.tenant = alum_gf`; sin slugs de otros clientes | Búsqueda estática | Implementado; E2E pendiente |
| API producción | Apuntaba a `localhost` | Se configuró `https://api-multitenant.guayaflow.com/api` | Revisión de environment | Implementado |
| Estado `active/maintenance/inactive` | Inferido consultando catálogo | `GET /ecommerce/status` con contrato real del backend | Revisión estática del servicio/guard | Implementado; E2E pendiente |
| Fail closed | Ante errores abría tienda como activa | Estado local `unavailable` bloquea storefront y deriva a mantenimiento | Revisión de guard | Implementado; E2E pendiente |
| Rutas de pago durante maintenance | Sin garantía de bypass del bloqueo | `payment/success`, `pending`, `failure` y compatibilidad legado quedan sin guard | Revisión de routes/interceptor | Implementado; E2E pendiente |
| Catálogo real | Dataset mock embebido como fallback | Se eliminó fallback de catálogo/inventario/precio | Búsqueda estática | Implementado; E2E pendiente |
| `availableBodega` | Solo `qtyBodega - qty_apartado` en frontend | Prioriza `availableBodega`; compatibilidad calcula `max(0, qtyBodega-qtyApartado)` si falta | Revisión de mapping | Implementado; E2E pendiente |
| `ecommerce_price` | Podía caer a `precio_publico` | Precio web solo de `precio_ecommerce`; se eliminó precio comparativo inventado | Búsqueda estática | Implementado; E2E pendiente |
| Producto sin precio | Parcialmente controlado | Carrito exige precio web > 0 y variante real; UI mantiene WhatsApp | Revisión de ProductCard/Detail/Cart | Implementado; E2E pendiente |
| Sin mocks de pago | Creaba preference/Sale simuladas si backend fallaba | Se eliminaron respuestas y folios simulados | Búsqueda estática | Implementado |
| Revalidación de carrito | No existía antes de checkout | Recarga catálogo real al abrir carrito, actualiza precio, limita cantidad y elimina variantes inválidas; guard obligatorio antes de `/checkout` | Revisión de `refreshAvailability()` + `checkoutStockGuard` | Implementado; E2E pendiente |
| Checkout seguro | Datos presentes, pero incluía autofill de prueba | Se retiró autofill; email obligatorio y con formato para MP; `state` independiente de `city` | Revisión estática | Implementado; E2E pendiente |
| Totales autoritativos | Frontend mostraba/calculaba totales y limpiaba tras preference | Mercado Pago guarda subtotal/envío/total del backend en `CheckoutSession`; WhatsApp usa `subtotal`, `shipping_cost` y `total` devueltos por GuayaFlow para el mensaje y pantalla de éxito | Revisión de response handling | Implementado; E2E pendiente |
| Same-tab redirect | `window.open(..., '_blank')` | `window.location.assign(init_point)` | Búsqueda estática | Implementado |
| No limpiar carrito prematuramente | Se limpiaba al crear preference | MP conserva carrito hasta `approved + paid` | Búsqueda de `clearCart()` | Implementado; E2E pendiente |
| `CheckoutSession` | No existía | `sessionStorage` SSR-safe con sale, preference, signed URL, expiración, totales y snapshot | Revisión del servicio | Implementado; E2E pendiente |
| Success | Solo UX; infería estado de query params | Consulta `order_status_url`; confirma únicamente `approved + paid` | Revisión estática | Implementado; E2E pendiente |
| Pending | No reconciliaba pedido real | Consulta/pollear pedido existente; no crea otra Sale | Revisión estática | Implementado; E2E pendiente |
| Failure | No reconciliaba ni recuperaba | Consulta estado firmado; recuperación solo en terminal `expired/cancelled/failed` | Revisión estática | Implementado; E2E pendiente |
| Webhook fuente de verdad | Frontend no tenía reconciliación autoritativa | Frontend no aprueba por back URL; espera estado backend reconciliado | Revisión de PaymentResult | Implementado lado frontend; backend/E2E pendiente |
| Signed order status | No se consumía | Se conserva y consume exactamente `order_status_url` del backend | Revisión estática | Implementado; E2E pendiente |
| Recuperación de carrito | Ausente | Snapshot -> catálogo real -> revalidación -> ajuste/eliminación | Revisión estática | Implementado; E2E pendiente |
| 409/422/403/503/500/status 0 | Manejo genérico/parcial | `getApiErrorMessage()` + interceptor de estado + Toast; `409 insufficient_stock` y `409 ecommerce_price_unavailable` disparan revalidación inmediata del carrito en Mercado Pago y WhatsApp | Revisión estática | Implementado; E2E pendiente |
| Toast | Ya existía | Se reutiliza para reglas comerciales y errores; no `alert()/confirm()` | Búsqueda estática | Implementado |
| SSR | Rutas dinámicas se prerenderizaban; browser APIs dispersas | Estado/storefront en `RenderMode.Server`; payment result en Client; session usa `isPlatformBrowser` | Revisión de server routes | Implementado; build completo pendiente |
| Standard version | No declarado | `GUAYAFLOW_ECOMMERCE_STANDARD_VERSION = '1.0.0'` | Revisión estática | Implementado |

## Contradicciones comerciales preservadas para validación

1. **Envío frontend:** Alum muestra actualmente envío estimado de `$250` y gratis desde `$1,999`, mientras el ejemplo real de `create-preference` proporcionado devolvió `$300` para subtotal `$450`. No se alteró esta regla comercial sin autorización. El backend sigue siendo autoridad y el `CheckoutSession` guarda el envío/total real devuelto por GuayaFlow.
2. **Cupones frontend:** `TEKIT10` y `ALUMLINO` continúan en la experiencia actual, pero no se proporcionó un contrato backend de cupones. Debe comprobarse en E2E que el backend valida/ignora cualquier descuento enviado y que el monto cobrado es autoritativo.
3. **URL firmada:** el frontend consume `order_status_url` exactamente como la entrega Laravel. En producción debe ser HTTPS y no `localhost`; el frontend no puede reescribirla porque rompería/alteraría el recurso firmado.

## Validaciones realizadas en este entorno

- Parseo sintáctico de **41 archivos TypeScript**: `0` errores sintácticos.
- Búsqueda estática: sin dataset `FALLBACK_ECOMMERCE_DATA`, sin simulaciones de Preference/Sale, sin `alert()`/`confirm()`, sin popup de Mercado Pago y sin slug de La Rosa.
- `npm run build` no pudo ejecutarse porque el ZIP no incluye `node_modules`.
- Se intentó `npm ci`, pero este entorno no pudo resolver `registry.npmjs.org` (`EAI_AGAIN`). Por ello **no se declara build Angular aprobado** aquí.

## Checklist E2E pendiente

Ejecutar desde ERP/entorno real antes de certificar:

- Tenant `alum_gf`, active, maintenance, inactive y fallo de status.
- Catálogo real, `availableBodega`, `ecommerce_price`, producto sin precio y bypass backend 409.
- Revalidación visual al abrir carrito y bloqueo de `/checkout` ante stock/precio cambiado o fallo de verificación.
- Email/dirección/estado reales y recálculo backend de totales.
- Preference, reserva, redirect same-tab y retorno success/pending/failure.
- Webhook firmado, idempotencia, `sale_payment`, Payment ID y actualización ERP.
- Signed status durante tienda activa y durante maintenance.
- Expiración/liberación de reservas, recuperación de carrito y ausencia de stock negativo.
- Manipulación de precio/descuento/frontend sin alterar el cobro autoritativo.

Solo después de completar todo lo anterior puede marcarse:

`GuayaFlow E-commerce Standard v1.0 — CERTIFICADO`

## Ajuste posterior — sincronización anticipada de stock del carrito

Se agregó una segunda capa de sincronización visual y una barrera de navegación para cubrir cambios de inventario realizados desde ERP después de haber agregado productos al carrito:

- Al abrir `/carrito`, se consulta nuevamente el catálogo real y se reconcilia cada variante con `availableBodega`.
- Si la existencia vigente es menor que la cantidad del carrito, la cantidad se reduce visualmente y se persiste en `localStorage`.
- Si `availableBodega <= 0`, la variante se elimina del carrito y se informa mediante Toast.
- Antes de activar `/checkout`, `checkoutStockGuard` ejecuta una nueva revalidación obligatoria.
- Si esa revalidación modifica precio/cantidad, elimina productos o deja vacío el carrito, se cancela el acceso a checkout y el usuario permanece/regresa en `/carrito` para revisar los cambios.
- Si la API no permite verificar existencias, el acceso a checkout falla de forma cerrada (`fail closed`).
- La revalidación final ya existente en `Checkout.processOrder()` se conserva como última barrera antes de crear la venta/preferencia.
- Las revalidaciones simultáneas se consolidan en una sola petición en vuelo para evitar carreras y consultas duplicadas innecesarias.

Validación E2E pendiente desde ERP.

## Corrección v1.0.2 — identidad canónica de variante

Se corrigió un riesgo de colisión entre la etiqueta de talla (por ejemplo `40`) y `talla_id`. La resolución de variantes ahora prioriza la etiqueta real `variant.talla` y solo usa `talla_id` como compatibilidad secundaria. Después de cada revalidación, `selectedSize`, `selectedColor` y `selectedVariant` se canonizan desde la variante viva recibida por GuayaFlow. Los requests de Mercado Pago/WhatsApp se construyen desde un snapshot inmutable recién revalidado y `size`/`color` se derivan de `selectedVariant`, evitando que un valor persistido obsoleto viaje al backend.

## v1.0.3 — Identidad de variante al crear preferencia

Se corrigió una inconsistencia posible entre la talla mostrada por el carrito (`selectedSize`) y una referencia `selectedVariant` persistida de una selección anterior del mismo modelo.

- El payload de pago usa `selectedSize` / `selectedColor` ya canonizados por la revalidación como identidad de la variante.
- `selectedVariant` no puede sobrescribir talla/color del request si no coincide con la selección visible.
- Antes de crear la preferencia, `CartService.createCheckoutSnapshot()` vuelve a resolver la variante desde producto + talla + color y bloquea el POST si ya no existe, no tiene precio, no tiene stock o la cantidad supera `availableBodega`.
- El snapshot guardado en CheckoutSession queda asociado a esa misma variante re-resuelta.

Caso de regresión a validar E2E: talla 38 agotada y retirada del carrito → agregar mismo modelo talla 40 con stock → el request de `create-preference` debe contener exclusivamente `size: "40"` para ese renglón.

## v1.0.4 — ID autoritativo de variante en payloads

- `PaymentService.formatCartItems()` ya no usa `product.numericId` / `product.id` para `items[].id`.
- `items[].id` se obtiene exclusivamente de `selectedVariant.id`, re-resuelto por `createCheckoutSnapshot()` después de la revalidación del catálogo.
- Mercado Pago y WhatsApp comparten el mismo mapper, por lo que ambos envían el ID de variante.
- Si `selectedVariant` no coincide con `selectedSize + selectedColor`, o su `id` no es entero positivo, el request se bloquea antes del POST.
- El precio del item también se toma de la variante validada para evitar mezclar modelo/variante.


## Ajuste v1.0.5 — paridad funcional ERP con La Rosa

- Los rechazos `409 insufficient_stock` y `409 ecommerce_price_unavailable` que ocurran después de la revalidación previa al checkout ahora fuerzan una nueva llamada al catálogo real mediante `CartService.refreshAvailability()`. Esto cubre la carrera entre la última lectura de stock/precio y el `lockForUpdate()` del backend. El frontend no reintenta automáticamente la creación de la venta.
- La respuesta de `/payment/create-whatsapp-order` se modela con `subtotal`, `shipping_cost` y `total`. La pantalla de confirmación y el texto que se abre/copia hacia WhatsApp usan esos valores autoritativos devueltos por GuayaFlow, no los totales calculados previamente por el navegador.
- El mensaje de WhatsApp ahora separa correctamente Subtotal, Envío y Total; ya no reutiliza el total como subtotal.
