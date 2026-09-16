import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Nosotros } from './pages/nosotros/nosotros';
import { Servicios } from './pages/servicios/servicios';
import { Catalogo } from './pages/catalogo/catalogo';
import { ProductoDetalle } from './pages/producto-detalle/producto-detalle';
import { Wishlist } from './pages/wishlist/wishlist';
import { Carrito } from './pages/carrito/carrito';
import { Checkout } from './pages/checkout/checkout';
import { Contacto } from './pages/contacto/contacto';
import { PaymentResultPage } from './pages/payment-result/payment-result';
import { InactivePage } from './pages/inactive/inactive';
import { MaintenancePage } from './pages/maintenance/maintenance';
import { ecommerceStatusGuard } from './guards/ecommerce-status.guard';
import { checkoutStockGuard } from './guards/checkout-stock.guard';

export const routes: Routes = [
  // Retornos de Mercado Pago: siempre accesibles, incluso con tienda bloqueada.
  { path: 'payment/success', component: PaymentResultPage, data: { paymentState: 'success' }, title: 'Pago Exitoso | GUAYABERAS ALUM' },
  { path: 'payment/pending', component: PaymentResultPage, data: { paymentState: 'pending' }, title: 'Pago Pendiente | GUAYABERAS ALUM' },
  { path: 'payment/failure', component: PaymentResultPage, data: { paymentState: 'failure' }, title: 'Pago No Completado | GUAYABERAS ALUM' },
  { path: 'payment/result', component: PaymentResultPage, data: { paymentState: 'pending' }, title: 'Resultado del Pago | GUAYABERAS ALUM' },
  { path: 'pago/exito', component: PaymentResultPage, data: { paymentState: 'success' }, title: 'Pago Exitoso | GUAYABERAS ALUM' },
  { path: 'pago/pendiente', component: PaymentResultPage, data: { paymentState: 'pending' }, title: 'Pago Pendiente | GUAYABERAS ALUM' },
  { path: 'pago/fallo', component: PaymentResultPage, data: { paymentState: 'failure' }, title: 'Pago No Completado | GUAYABERAS ALUM' },

  // Estado de tienda: no se protegen para evitar loops de navegación.
  { path: 'inactive', component: InactivePage, title: 'Tienda No Disponible | GUAYABERAS ALUM' },
  { path: 'maintenance', component: MaintenancePage, title: 'Mantenimiento | GUAYABERAS ALUM' },

  // Storefront protegido por estado autoritativo de GuayaFlow.
  { path: '', component: Home, canActivate: [ecommerceStatusGuard], title: 'GUAYABERAS ALUM | Alta Costura Yucateca - Tekit' },
  { path: 'inicio', component: Home, canActivate: [ecommerceStatusGuard], title: 'GUAYABERAS ALUM | Inicio' },
  { path: 'nosotros', component: Nosotros, canActivate: [ecommerceStatusGuard], title: 'Historia & Tradición | GUAYABERAS ALUM' },
  { path: 'servicios', component: Servicios, canActivate: [ecommerceStatusGuard], title: 'Servicios de Sastrería & Mayoreo | GUAYABERAS ALUM' },
  { path: 'catalogo', component: Catalogo, canActivate: [ecommerceStatusGuard], title: 'Catálogo de Lino & Tienda | GUAYABERAS ALUM' },
  { path: 'producto/:id', component: ProductoDetalle, canActivate: [ecommerceStatusGuard], title: 'Detalle de Prenda | GUAYABERAS ALUM' },
  { path: 'producto-detalle', component: ProductoDetalle, canActivate: [ecommerceStatusGuard], title: 'Detalle de Prenda | GUAYABERAS ALUM' },
  { path: 'wishlist', component: Wishlist, canActivate: [ecommerceStatusGuard], title: 'Mi Lista de Deseos | GUAYABERAS ALUM' },
  { path: 'carrito', component: Carrito, canActivate: [ecommerceStatusGuard], title: 'Carrito de Compras | GUAYABERAS ALUM' },
  { path: 'checkout', component: Checkout, canActivate: [ecommerceStatusGuard, checkoutStockGuard], title: 'Pasarela de Pago Seguro | GUAYABERAS ALUM' },
  { path: 'contacto', component: Contacto, canActivate: [ecommerceStatusGuard], title: 'Contacto & Taller en Tekit | GUAYABERAS ALUM' },
  { path: '**', redirectTo: '' }
];
