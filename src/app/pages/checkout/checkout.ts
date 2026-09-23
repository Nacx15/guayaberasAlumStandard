import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DecimalPipe, JsonPipe, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { PaymentService } from '../../services/payment.service';
import {
  MercadoPagoPreferenceRequest,
  MercadoPagoPreferenceResponse,
  WhatsAppOrderRequest,
  WhatsAppOrderResponse
} from '../../models/payment.model';
import { CartItem } from '../../models/product.model';
import { CheckoutSessionService } from '../../services/checkout-session.service';
import { getApiErrorMessage } from '../../shared/http/api-error.util';
import { ShippingPromo } from '../../components/shipping-promo/shipping-promo';
import { EcommerceStatusService } from '../../services/ecommerce-status.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, DecimalPipe, JsonPipe, ShippingPromo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-[#0D131A] text-[#F9F7F2] py-8 sm:py-12">
      <app-shipping-promo></app-shipping-promo>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Breadcrumb & Header -->
        <nav class="flex items-center gap-2 text-xs text-stone-400 mb-4 font-medium">
          <a routerLink="/" class="hover:text-[#00A7D4]">Inicio</a>
          <span>/</span>
          <a routerLink="/carrito" class="hover:text-[#00A7D4]">Carrito</a>
          <span>/</span>
          <span class="text-[#C9A87C] font-bold">Pasarela y Datos de Envío</span>
        </nav>

        @if (orderCompleted()) {
          @if (completedPaymentMethod() === 'whatsapp') {
            <!-- ORDER / WHATSAPP SUCCESS SCREEN -->
            <div class="max-w-3xl mx-auto bg-[#151F2A] rounded-3xl p-6 sm:p-10 border-2 border-[#25D366]/50 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
              
              <div class="w-20 h-20 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto shadow-inner border border-[#25D366]/40">
                <span class="material-icons text-4xl">chat</span>
              </div>

              <div class="text-center space-y-2">
                <span class="text-xs font-bold uppercase tracking-widest text-[#25D366] bg-[#25D366]/10 px-3 py-1 rounded-full border border-[#25D366]/30">
                  ¡Pedido Registrado con Éxito en el ERP!
                </span>
                <h1 class="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
                  Finalizar Venta por WhatsApp
                </h1>
                <p class="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-sans leading-relaxed">
                  {{ whatsAppResponse()?.message || 'Tu pedido ha sido guardado exitosamente en el ERP.' }}
                  Folio de Venta ERP: <strong class="text-[#25D366] font-mono text-base font-bold">#{{ whatsAppSaleId() || orderNumber() }}</strong>.
                </p>
              </div>

              <!-- PRIMARY WHATSAPP REDIRECTION CALLOUT CARD -->
              <div class="bg-gradient-to-r from-[#0D131A] via-[#151F2A] to-[#0D131A] p-5 sm:p-6 rounded-2xl border border-[#25D366]/50 shadow-lg text-center space-y-4">
                
                <div class="space-y-1">
                  <p class="text-xs text-stone-300">
                    Si WhatsApp no se abrió automáticamente en una nueva pestaña:
                  </p>
                  <p class="text-sm font-semibold text-white">
                    Haz clic en el siguiente botón para enviar los detalles de tu pedido directamente:
                  </p>
                </div>

                <!-- Main Action Button to Open WhatsApp -->
                <a [href]="whatsAppOrderUrl()" 
                   class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-sm sm:text-base uppercase tracking-wider rounded-2xl transition-all shadow-xl hover:shadow-[#25D366]/30 hover:scale-[1.02] active:scale-[0.98]">
                  <span class="material-icons text-2xl">chat</span>
                  <span>Abrir WhatsApp y Enviar Pedido</span>
                  <span class="material-icons text-xl">arrow_forward</span>
                </a>

                <!-- Copy Text & Reopen Actions -->
                <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button (click)="copyWhatsAppMessage()" type="button"
                          class="px-4 py-2 bg-[#0D131A] hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                    <span class="material-icons text-sm text-[#25D366]">content_copy</span>
                    <span>{{ isMessageCopied() ? '¡Mensaje copiado!' : 'Copiar mensaje de pedido' }}</span>
                  </button>

                  <button (click)="openWhatsAppTab()" type="button"
                          class="px-4 py-2 bg-[#0D131A] hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                    <span class="material-icons text-sm text-[#25D366]">launch</span>
                    <span>Reintentar abrir WhatsApp</span>
                  </button>
                </div>

              </div>

              <!-- Order Details Ticket -->
              <div class="bg-[#0D131A] p-6 rounded-2xl border border-stone-800 space-y-3.5 text-xs">
                
                <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-800 gap-2">
                  <span class="text-stone-400">ID de Venta ERP (sale_id):</span>
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-sm font-bold text-[#25D366] bg-[#151F2A] px-3 py-1 rounded-lg border border-stone-700 break-all select-all">
                      #{{ whatsAppSaleId() || orderNumber() }}
                    </span>
                    <button (click)="copyOrderId()" type="button" title="Copiar Folio"
                            class="text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 cursor-pointer">
                      <span class="material-icons text-xs">content_copy</span>
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-stone-800">
                  <div>
                    <span class="text-stone-400 block text-[11px]">Cliente:</span>
                    <strong class="text-white text-xs">{{ customerName() }}</strong>
                  </div>
                  <div>
                    <span class="text-stone-400 block text-[11px]">Teléfono / WhatsApp:</span>
                    <span class="text-stone-200 text-xs">{{ customerPhone() }}</span>
                  </div>
                  @if (customerEmail()) {
                    <div>
                      <span class="text-stone-400 block text-[11px]">Correo Electrónico:</span>
                      <span class="text-stone-200 text-xs">{{ customerEmail() }}</span>
                    </div>
                  }
                  <div>
                    <span class="text-stone-400 block text-[11px]">Método Seleccionado:</span>
                    <span class="text-[#25D366] font-bold uppercase tracking-wider text-xs flex items-center gap-1">
                      <span class="material-icons text-xs">chat</span>
                      Venta por WhatsApp (ERP Directo)
                    </span>
                  </div>
                </div>

                <!-- Products Summary in Ticket -->
                @if (orderedItemsSnapshot().length > 0) {
                  <div class="pb-3 border-b border-stone-800 space-y-2">
                    <span class="text-stone-400 block text-[11px]">Prendas del Pedido:</span>
                    <div class="space-y-1.5">
                      @for (item of orderedItemsSnapshot(); track $index) {
                        <div class="flex justify-between items-center bg-[#151F2A] px-3 py-2 rounded-xl text-stone-300">
                          <div>
                            <p class="font-semibold text-white">{{ item.quantity }}x {{ item.product.name }}</p>
                            <p class="text-[10px] text-stone-400">Talla: {{ item.selectedSize }} • Color: {{ item.selectedColor }}</p>
                          </div>
                          <span class="font-bold text-[#C9A87C] font-mono">\${{ item.product.price * item.quantity | number:'1.2-2' }}</span>
                        </div>
                      }
                    </div>
                  </div>
                }

                <div class="flex flex-col sm:flex-row justify-between pb-3 border-b border-stone-800 gap-1">
                  <span class="text-stone-400">Dirección de Entrega:</span>
                  <div class="text-left sm:text-right text-stone-200">
                    <p class="font-medium text-white">{{ addressLine1() }}</p>
                    @if (addressLine2()) {
                      <p class="text-stone-400 text-[11px]">Referencia: {{ addressLine2() }}</p>
                    }
                    <p class="text-stone-400 text-[11px]">{{ city() }}, {{ state() }}, C.P. {{ postalCode() }}, {{ country() }}</p>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-1">
                  <span class="text-stone-300 font-semibold text-sm">Total del Pedido:</span>
                  <strong class="text-lg font-bold text-[#C9A87C] font-sans">\${{ totalPaid() | number:'1.2-2' }} MXN</strong>
                </div>

              </div>

              <!-- Secondary Actions & Response JSON -->
              <div class="space-y-3 pt-2">
                <!-- <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button (click)="toggleWhatsAppMessagePreview()" type="button"
                          class="text-xs text-stone-400 hover:text-[#25D366] underline flex items-center gap-1 cursor-pointer">
                    <span class="material-icons text-sm">visibility</span>
                    {{ showMessagePreview() ? 'Ocultar Texto del Mensaje' : 'Ver Texto del Mensaje Formateado' }}
                  </button>

                  <button (click)="toggleResponseJson()" type="button"
                          class="text-xs text-stone-400 hover:text-[#25D366] underline flex items-center gap-1 cursor-pointer">
                    <span class="material-icons text-sm">code</span>
                    {{ showResponseJson() ? 'Ocultar JSON de Respuesta ERP' : 'Ver JSON de Respuesta del ERP' }}
                  </button>

                  <a routerLink="/catalogo" 
                     class="text-xs text-[#C9A87C] hover:underline font-semibold flex items-center gap-1">
                    <span class="material-icons text-sm">storefront</span>
                    Volver al Catálogo
                  </a>
                </div> -->

                @if (showMessagePreview()) {
                  <div class="mt-4 p-4 bg-[#090D12] rounded-2xl border border-stone-800 text-left font-mono text-[11px] text-stone-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                    <div class="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 font-sans text-xs">
                      <span class="text-stone-400 font-bold">Mensaje enviado a WhatsApp (+52 997 114 9132):</span>
                    </div>
                    {{ generatedWhatsAppText() }}
                  </div>
                }

                @if (showResponseJson()) {
                  <div class="mt-4 p-4 bg-[#090D12] rounded-2xl border border-stone-800 text-left font-mono text-[11px] overflow-x-auto text-emerald-400 max-h-64">
                    <div class="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 font-sans text-xs">
                      <!-- <span class="text-stone-400 font-bold">Respuesta del Endpoint ERP:</span> -->
                      <!-- <code class="text-stone-300">{{ paymentService.WHATSAPP_ENDPOINT }}</code> -->
                    </div>
                    <pre>{{ whatsAppResponse() | json }}</pre>
                  </div>
                }
              </div>

            </div>

          } @else {
            <!-- ORDER / MERCADO PAGO SUCCESS SCREEN -->
            <div class="max-w-3xl mx-auto bg-[#151F2A] rounded-3xl p-6 sm:p-10 border-2 border-[#00A7D4]/50 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
              
              <div class="w-20 h-20 rounded-full bg-[#00A7D4]/20 text-[#38C7EC] flex items-center justify-center mx-auto shadow-inner border border-[#00A7D4]/40">
                <span class="material-icons text-4xl">check_circle</span>
              </div>

              <div class="text-center space-y-2">
                <span class="text-xs font-bold uppercase tracking-widest text-[#38C7EC] bg-[#00A7D4]/10 px-3 py-1 rounded-full border border-[#00A7D4]/30">
                  ¡Preferencia Generada con Éxito!
                </span>
                <h1 class="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
                  Redirección a Mercado Pago
                </h1>
                <p class="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-sans leading-relaxed">
                  Tu solicitud de compra ha sido procesada en el servidor. Procede a la pasarela segura de Mercado Pago para elegir tu método de pago preferido.
                </p>
              </div>

              <!-- PRIMARY REDIRECTION CALLOUT CARD -->
              <div class="bg-gradient-to-r from-[#0D131A] via-[#151F2A] to-[#0D131A] p-5 sm:p-6 rounded-2xl border border-[#00A7D4]/50 shadow-lg text-center space-y-4">
                
                <div class="space-y-1">
                  <p class="text-xs text-stone-300">
                    Si tu navegador no continuó automáticamente a la pasarela:
                  </p>
                  <p class="text-sm font-semibold text-white">
                    Haz clic en el siguiente botón para completar tu pago de forma segura:
                  </p>
                </div>

                <!-- Main Redirection Button to Mercado Pago Init Point -->
                <a [href]="preferenceResponse()?.init_point" 
                   class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#00A7D4] hover:bg-[#0092BA] text-white font-bold text-sm sm:text-base uppercase tracking-wider rounded-2xl transition-all shadow-xl hover:shadow-[#00A7D4]/30 hover:scale-[1.02] active:scale-[0.98]">
                  <span class="material-icons text-2xl">payment</span>
                  <span>Pagar en Mercado Pago (\${{ totalPaid() | number:'1.2-2' }} MXN)</span>
                  <span class="material-icons text-xl">arrow_forward</span>
                </a>

                <!-- Copy Link & Preference ID Actions -->
                <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button (click)="copyPaymentLink()" type="button"
                          class="px-4 py-2 bg-[#0D131A] hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                    <span class="material-icons text-sm text-[#38C7EC]">content_copy</span>
                    <span>{{ isLinkCopied() ? '¡Enlace copiado!' : 'Copiar enlace de pago' }}</span>
                  </button>

                  <button (click)="openMercadoPagoTab()" type="button"
                          class="px-4 py-2 bg-[#0D131A] hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                    <span class="material-icons text-sm text-[#00A7D4]">launch</span>
                    <span>Continuar a Mercado Pago</span>
                  </button>
                </div>

              </div>

              <!-- Preference Details & Order Summary Card -->
              <div class="bg-[#0D131A] p-6 rounded-2xl border border-stone-800 space-y-3.5 text-xs">
                
                <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-800 gap-2">
                  <span class="text-stone-400">ID de Preferencia (preference_id):</span>
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-xs font-bold text-[#38C7EC] bg-[#151F2A] px-2.5 py-1 rounded-lg border border-stone-700 break-all select-all">
                      {{ preferenceResponse()?.preference_id || orderNumber() }}
                    </span>
                    <button (click)="copyPreferenceId()" type="button" title="Copiar ID"
                            class="text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 cursor-pointer">
                      <span class="material-icons text-xs">content_copy</span>
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-stone-800">
                  <div>
                    <span class="text-stone-400 block text-[11px]">Cliente:</span>
                    <strong class="text-white text-xs">{{ customerName() }}</strong>
                  </div>
                  <div>
                    <span class="text-stone-400 block text-[11px]">Teléfono / WhatsApp:</span>
                    <span class="text-stone-200 text-xs">{{ customerPhone() }}</span>
                  </div>
                  <div>
                    <span class="text-stone-400 block text-[11px]">Correo Electrónico:</span>
                    <span class="text-stone-200 text-xs">{{ customerEmail() }}</span>
                  </div>
                  <div>
                    <span class="text-stone-400 block text-[11px]">Método Seleccionado:</span>
                    <span class="text-[#00A7D4] font-bold uppercase tracking-wider text-xs">Mercado Pago</span>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row justify-between pb-3 border-b border-stone-800 gap-1">
                  <span class="text-stone-400">Dirección de Entrega:</span>
                  <div class="text-left sm:text-right text-stone-200">
                    <p class="font-medium text-white">{{ addressLine1() }}</p>
                    @if (addressLine2()) {
                      <p class="text-stone-400 text-[11px]">Referencia: {{ addressLine2() }}</p>
                    }
                    <p class="text-stone-400 text-[11px]">{{ city() }}, {{ state() }}, C.P. {{ postalCode() }}, {{ country() }}</p>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-1">
                  <span class="text-stone-300 font-semibold text-sm">Total Registrado en Preferencia:</span>
                  <strong class="text-lg font-bold text-[#C9A87C] font-sans">\${{ totalPaid() | number:'1.2-2' }} MXN</strong>
                </div>

              </div>

              <!-- Secondary Actions: WhatsApp Confirmation & JSON Inspection -->
              <div class="space-y-3 pt-2">
                
                <a [href]="getWhatsAppConfirmationUrl()" target="_blank" rel="noopener"
                   class="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                  <span class="material-icons text-base">chat</span>
                  Confirmar y Dar Seguimiento por WhatsApp
                </a>

                <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button (click)="toggleResponseJson()" type="button"
                          class="text-xs text-stone-400 hover:text-[#00A7D4] underline flex items-center gap-1 cursor-pointer">
                    <span class="material-icons text-sm">code</span>
                    {{ showResponseJson() ? 'Ocultar JSON de Respuesta' : 'Ver JSON de Respuesta del Endpoint' }}
                  </button>

                  <a routerLink="/catalogo" 
                     class="text-xs text-[#C9A87C] hover:underline font-semibold flex items-center gap-1">
                    <span class="material-icons text-sm">storefront</span>
                    Volver al Catálogo
                  </a>
                </div>

                <!-- Collapsible Response JSON viewer -->
                @if (showResponseJson()) {
                  <div class="mt-4 p-4 bg-[#090D12] rounded-2xl border border-stone-800 text-left font-mono text-[11px] overflow-x-auto text-emerald-400 max-h-64">
                    <div class="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 font-sans text-xs">
                      <!-- <span class="text-stone-400 font-bold">Respuesta del Endpoint:</span>
                      <code class="text-stone-300">{{ paymentService.API_ENDPOINT }}</code> -->
                    </div>
                    <pre>{{ preferenceResponse() | json }}</pre>
                  </div>
                }
              </div>

            </div>
          }

        } @else if (cartService.totalItemsCount() === 0) {
          <!-- Empty Cart redirect prompt -->
          <div class="bg-[#151F2A] rounded-3xl p-12 text-center border border-stone-800 shadow-xl max-w-md mx-auto space-y-4">
            <span class="material-icons text-4xl text-stone-500">shopping_bag</span>
            <h2 class="font-serif font-bold text-xl text-white">No tienes productos en el carrito</h2>
            <p class="text-xs text-stone-400">Agrega productos al carrito antes de proceder a la pasarela de pago.</p>
            <a routerLink="/catalogo" class="inline-block px-6 py-2.5 bg-[#00A7D4] text-white text-xs font-bold rounded-xl shadow-md">
              Ver Catálogo
            </a>
          </div>

        } @else {
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 class="font-serif text-3xl sm:text-4xl font-bold text-white">
                Finalizar Compra y Datos de Envío
              </h1>
              <p class="text-xs sm:text-sm text-stone-400 mt-1">
                Confección de taller y envío seguro desde Tekit, Yucatán.
              </p>
            </div>
          </div>

          <form (submit)="processOrder($event)" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT: Shipping & Payment Form -->
            <div class="lg:col-span-8 space-y-6">
              
              <!-- 1. Contact Info -->
              <div class="bg-[#151F2A] p-6 sm:p-8 rounded-3xl border border-[#AE875B]/30 shadow-xl space-y-4">
                <div class="flex items-center gap-2 pb-3 border-b border-stone-800">
                  <span class="w-7 h-7 rounded-full bg-[#00A7D4] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h3 class="font-serif font-bold text-lg text-white">Información de Contacto</h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label for="checkout-name" class="block text-xs font-bold text-stone-200">Nombre Completo *</label>
                      <span class="text-[10px] text-stone-400 font-medium">Obligatorio</span>
                    </div>
                    <input id="checkout-name"
                           type="text" 
                           [value]="customerName()"
                           (input)="customerName.set($any($event.target).value)"
                           required                           
                           class="w-full px-4 py-2.5 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4]" />
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label for="checkout-email" class="block text-xs font-bold text-stone-200">
                        Correo Electrónico {{ paymentMethod() === 'mercado_pago' ? '*' : '' }}
                      </label>
                      @if (paymentMethod() === 'mercado_pago') {
                        <span class="text-[10px] text-[#00A7D4] font-semibold uppercase tracking-wider">Requerido en Mercado Pago</span>
                      } @else {
                        <span class="text-[10px] text-emerald-400 font-medium">Opcional en WhatsApp</span>
                      }
                    </div>
                    <input id="checkout-email"
                           type="email" 
                           [value]="customerEmail()"
                           (input)="customerEmail.set($any($event.target).value)"
                           [required]="paymentMethod() === 'mercado_pago'"                           
                           class="w-full px-4 py-2.5 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4]" />
                    @if (paymentMethod() === 'mercado_pago') {
                      <p class="text-[10px] text-stone-400 mt-1">
                        Obligatorio para enviarte el comprobante oficial de pago de Mercado Pago.
                      </p>
                    } @else {
                      <p class="text-[10px] text-stone-400 mt-1">
                        Opcional. Para venta por WhatsApp solo se requiere tu número de teléfono.
                      </p>
                    }
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label for="checkout-phone" class="block text-xs font-bold text-stone-200">Teléfono / WhatsApp (10 dígitos) *</label>
                    <span class="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Obligatorio</span>
                  </div>
                  <input id="checkout-phone"
                         type="tel" 
                         [value]="customerPhone()"
                         (input)="customerPhone.set($any($event.target).value)"
                         required                         
                         class="w-full px-4 py-2.5 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4]" />
                  <p class="text-[10px] text-stone-400 mt-1">
                    {{ paymentMethod() === 'whatsapp' ? 'Obligatorio para enlazar la venta y enviarte el seguimiento por WhatsApp.' : 'Obligatorio para notificaciones de paquetería y entrega.' }}
                  </p>
                </div>
              </div>

              <!-- 2. Shipping Address -->
              <div class="bg-[#151F2A] p-6 sm:p-8 rounded-3xl border border-[#AE875B]/30 shadow-xl space-y-4">
                <div class="flex items-center gap-2 pb-3 border-b border-stone-800">
                  <span class="w-7 h-7 rounded-full bg-[#00A7D4] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <h3 class="font-serif font-bold text-lg text-white">Dirección de Envío</h3>
                </div>

                <!-- address_line_1 -->
                <div>
                  <label for="checkout-address1" class="block text-xs font-bold text-stone-200 mb-1">
                    Dirección Principal (Calle, Cruzamientos y Número) *
                  </label>
                  <input id="checkout-address1"
                         type="text" 
                         [value]="addressLine1()"
                         (input)="addressLine1.set($any($event.target).value)"
                         required                         
                         class="w-full px-4 py-2.5 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4]" />
                </div>

                <!-- address_line_2 (Referencia o color de la casa - Opcional) -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label for="checkout-address2" class="block text-xs font-bold text-stone-200">
                      Referencias de la Casa / Color de la Fachada (address_line_2)
                    </label>
                    <span class="text-[10px] text-[#C9A87C] font-semibold uppercase tracking-wider">Campo Opcional</span>
                  </div>
                  <input id="checkout-address2"
                         type="text" 
                         [value]="addressLine2()"
                         (input)="addressLine2.set($any($event.target).value)"                         
                         class="w-full px-4 py-2.5 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4]" />
                  <p class="text-[10px] text-stone-400 mt-1">
                    Ayuda al repartidor a ubicar tu domicilio más rápido (color de la casa, entre qué calles o detalles clave).
                  </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- city -->
                  <div>
                    <label for="checkout-city" class="block text-xs font-bold text-stone-200 mb-1">Ciudad / Municipio *</label>
                    <input id="checkout-city"
                           type="text" 
                           [value]="city()"
                           (input)="city.set($any($event.target).value)"
                           required                           
                           class="w-full px-4 py-2.5 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4]" />
                  </div>

                  <!-- state -->
                  <div>
                    <label for="checkout-state" class="block text-xs font-bold text-stone-200 mb-1">Estado *</label>
                    <input id="checkout-state"
                           type="text" 
                           [value]="state()"
                           (input)="state.set($any($event.target).value)"
                           required                           
                           class="w-full px-4 py-2.5 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4]" />
                  </div>

                  <!-- postal_code -->
                  <div>
                    <label for="checkout-zip" class="block text-xs font-bold text-stone-200 mb-1">Código Postal (C.P.) *</label>
                    <input id="checkout-zip"
                           type="text" 
                           [value]="postalCode()"
                           (input)="postalCode.set($any($event.target).value)"
                           required                           
                           class="w-full px-4 py-2.5 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4]" />
                  </div>
                </div>

                <!-- country -->
                <div>
                  <label for="checkout-country" class="block text-xs font-bold text-stone-200 mb-1">País *</label>
                  <div class="flex items-center gap-2">
                    <input id="checkout-country"
                           type="text" 
                           [value]="country()"
                           (input)="country.set($any($event.target).value)"
                           required                            
                           class="w-28 px-4 py-2.5 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4] uppercase font-bold" />
                    <span class="text-xs text-stone-400">México (MX)</span>
                  </div>
                </div>
              </div>

              <!-- 3. Payment Method Selection -->
              <div class="bg-[#151F2A] p-6 sm:p-8 rounded-3xl border border-[#AE875B]/30 shadow-xl space-y-4">
                <div class="flex items-center gap-2 pb-3 border-b border-stone-800">
                  <span class="w-7 h-7 rounded-full bg-[#00A7D4] text-white text-xs font-bold flex items-center justify-center">3</span>
                  <h3 class="font-serif font-bold text-lg text-white">Método de Pago</h3>
                </div>

                <!-- Payment Options Radio Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Option 1: Mercado Pago -->
                  <button type="button" 
                          (click)="paymentMethod.set('mercado_pago')"
                          class="p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer relative"
                          [class]="paymentMethod() === 'mercado_pago' ? 'border-[#00A7D4] bg-[#00A7D4]/15 ring-2 ring-[#00A7D4]/50' : 'border-stone-700 bg-[#0D131A] hover:border-stone-500'">
                    <div class="w-10 h-10 rounded-xl bg-[#00A7D4]/30 text-[#38C7EC] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="material-icons text-2xl">account_balance_wallet</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-white">Mercado Pago</span>
                        <span class="text-[10px] bg-[#00A7D4] text-white px-2 py-0.5 rounded-full font-bold">Oficial</span>
                      </div>
                      <p class="text-[11px] text-stone-300 mt-1">Tarjetas de crédito/débito, saldo Mercado Pago, OXXO y meses.</p>
                    </div>
                  </button>

                  <!-- Option 2: Finalizar Venta por WhatsApp -->
                  <button type="button" 
                          (click)="paymentMethod.set('whatsapp')"
                          class="p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer relative"
                          [class]="paymentMethod() === 'whatsapp' ? 'border-[#25D366] bg-[#25D366]/15 ring-2 ring-[#25D366]/50' : 'border-stone-700 bg-[#0D131A] hover:border-stone-500'">
                    <div class="w-10 h-10 rounded-xl bg-[#25D366]/30 text-[#25D366] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="material-icons text-2xl">chat</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-white">Venta por WhatsApp</span>
                        <span class="text-[10px] bg-[#25D366] text-black px-2 py-0.5 rounded-full font-bold">Trato Directo</span>
                      </div>
                      <p class="text-[11px] text-stone-300 mt-1">Atención directa con taller, registro en ERP y pago guiado.</p>
                    </div>
                  </button>
                </div>

                <!-- Info description based on selected payment method -->
                @if (paymentMethod() === 'mercado_pago') {
                  <div class="p-4 bg-[#0D131A] rounded-2xl border border-[#00A7D4]/30 text-xs space-y-2">
                    <div class="flex items-center gap-2 text-[#38C7EC] font-semibold">
                      <span class="material-icons text-base">verified_user</span>
                      <span>Pasarela Segura con Mercado Pago (Endpoint Oficial)</span>
                    </div>
                    <p class="text-stone-300 text-[11px]">
                      Al hacer clic en pagar, generaremos la preferencia con el Endpoint oficial y te redirigiremos a la pasarela segura para completar tu pago con tarjeta, transferencia SPEI o efectivo.
                    </p>
                  </div>
                } @else if (paymentMethod() === 'whatsapp') {
                  <div class="p-4 bg-[#0D131A] rounded-2xl border border-[#25D366]/30 text-xs space-y-2">
                    <div class="flex items-center gap-2 text-[#25D366] font-semibold">
                      <span class="material-icons text-base">support_agent</span>
                      <span>Registro de Pedido & Atención por WhatsApp (+52 997 114 9132)</span>
                    </div>
                    <p class="text-stone-300 text-[11px] leading-relaxed">
                      El pedido se registrará automáticamente, se generará tu folio de venta y abrirá WhatsApp con el mensaje estructurado para confirmar detalles con Alan Uicab.
                    </p>
                  </div>
                }
              </div>

            </div>

            <!-- RIGHT: Order Summary & Place Order Button -->
            <div class="lg:col-span-4 space-y-6">
              
              <div class="bg-[#151F2A] p-6 sm:p-8 rounded-3xl border-2 border-[#AE875B]/40 shadow-xl space-y-6 sticky top-24">
                
                <h3 class="font-serif font-bold text-xl text-white pb-3 border-b border-stone-800">
                  Resumen de Orden
                </h3>

                <!-- Mini item list with color and size -->
                <div class="max-h-64 overflow-y-auto space-y-3 divide-y divide-stone-800 pr-1">
                  @for (item of cartService.items(); track $index) {
                    <div class="flex items-center gap-3 pt-2">
                      <img [src]="item.product.images[0]" [alt]="item.product.name" class="w-12 h-14 rounded-lg object-cover border border-stone-800 bg-[#0D131A]" />
                      <div class="flex-1 min-w-0 text-xs">
                        <p class="font-semibold text-white truncate">{{ item.product.name }}</p>
                        <p class="text-stone-400 text-[11px] truncate">
                          Color: <strong class="text-stone-200">{{ item.selectedColor }}</strong> • Talla: <strong class="text-stone-200">{{ item.selectedSize }}</strong>
                        </p>
                        <p class="text-stone-400 text-[10px]">Cant: {{ item.quantity }} x \${{ item.product.price | number:'1.2-2' }}</p>
                        <p class="font-bold text-[#C9A87C] mt-0.5">\${{ item.product.price * item.quantity | number:'1.2-2' }} MXN</p>
                      </div>
                    </div>
                  }
                </div>

                <!-- Price summary -->
                <div class="pt-4 border-t border-stone-800 space-y-2 text-xs">
                  <div class="flex justify-between text-stone-300">
                    <span>Subtotal:</span>
                    <span class="font-semibold text-white">\${{ cartService.subtotal() | number:'1.2-2' }} MXN</span>
                  </div>

                  <div class="flex justify-between text-stone-300">
                    <span>Envío:</span>
                    @if (cartService.shippingCost() === null) {
                      <span class="font-semibold text-stone-400">Por calcular</span>
                    } @else if (cartService.shippingCost() === 0) {
                      <span class="font-bold text-emerald-400 uppercase">Gratis</span>
                    } @else {
                      <span class="font-semibold text-white">\${{ cartService.shippingCost() | number:'1.2-2' }} MXN</span>
                    }
                  </div>

                  @if (cartService.discountAmount() > 0) {
                    <div class="flex justify-between text-emerald-400 font-semibold">
                      <span>Descuento:</span>
                      <span>-\${{ cartService.discountAmount() | number:'1.2-2' }} MXN</span>
                    </div>
                  }

                  <div class="pt-3 border-t border-stone-800 flex items-baseline justify-between">
                    <span class="text-base font-serif font-bold text-white">Total estimado:</span>
                    <span class="text-2xl font-extrabold text-[#C9A87C] font-sans">
                      @if (cartService.total() === null) { Por calcular } @else { \${{ cartService.total() | number:'1.2-2' }} MXN }
                    </span>
                  </div>
                </div>

                <!-- Submit Button Dynamic per Payment Method -->
                @if (paymentMethod() === 'mercado_pago') {
                  <button type="submit" 
                          [disabled]="isProcessing() || cartService.shippingCost() === null"
                          class="w-full py-4 px-6 bg-[#00A7D4] hover:bg-[#0092BA] disabled:bg-stone-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
                    @if (isProcessing()) {
                      <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Procesando Preferencia...</span>
                    } @else {
                      <span class="material-icons text-base">payment</span>
                      <span>Pagar con Mercado Pago @if (cartService.total() !== null) { (\${{ cartService.total() | number:'1.2-2' }}) }</span>
                    }
                  </button>
                } @else {
                  <button type="submit" 
                          [disabled]="isProcessing() || cartService.shippingCost() === null"
                          class="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba5a] disabled:bg-stone-700 text-black font-bold text-sm uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
                    @if (isProcessing()) {
                      <span class="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Guardando en ERP y Abriendo WhatsApp...</span>
                    } @else {
                      <span class="material-icons text-base">chat</span>
                      <span>Finalizar por WhatsApp @if (cartService.total() !== null) { (\${{ cartService.total() | number:'1.2-2' }}) }</span>
                    }
                  </button>
                }

                <p class="text-[10px] text-center text-stone-400 leading-relaxed">
                  Al completar tu pedido aceptas los términos de confección artesanal y envío seguro de Guayaberas ALUM.
                </p>

              </div>

            </div>

          </form>

        }

      </div>
    </main>
  `
})
export class Checkout {
  readonly cartService = inject(CartService);
  readonly paymentService = inject(PaymentService);
  private toastService = inject(ToastService);
  private readonly checkoutSession = inject(CheckoutSessionService);
  private readonly ecommerceStatus = inject(EcommerceStatusService);
  private readonly platformId = inject(PLATFORM_ID);

  // Form Signals
  customerName = signal('');
  customerEmail = signal('');
  customerPhone = signal('');
  addressLine1 = signal('');
  addressLine2 = signal(''); // Referencia de la casa o color (opcional)
  city = signal('');
  state = signal('');
  postalCode = signal('');
  country = signal('');

  // Payment Method Selection: 'mercado_pago' | 'whatsapp'
  paymentMethod = signal<string>('mercado_pago');
  completedPaymentMethod = signal<string>('mercado_pago');
  
  // UI & Flow Signals
  isProcessing = signal(false);
  orderCompleted = signal(false);
  orderNumber = signal('');
  totalPaid = signal(0);
  orderedItemsSnapshot = signal<CartItem[]>([]);

  showRequestJson = signal(false);
  showResponseJson = signal(false);
  showMessagePreview = signal(false);
  isLinkCopied = signal(false);
  isMessageCopied = signal(false);
  preferenceResponse = signal<MercadoPagoPreferenceResponse | null>(null);
  whatsAppResponse = signal<WhatsAppOrderResponse | null>(null);
  whatsAppSaleId = signal<number | string | null>(null);

  /**
   * Genera el payload reactivo en tiempo real para Mercado Pago
   */
  readonly currentRequestPayload = computed<MercadoPagoPreferenceRequest | null>(() => {
    const shipping = this.cartService.shippingCost();
    const total = this.cartService.total();
    if (shipping === null || total === null) return null;
    return this.paymentService.buildPreferencePayload(
      this.cartService.items(),
      this.cartService.subtotal(),
      shipping,
      this.cartService.discountAmount(),
      total,
      {
        customer_name: this.customerName(),
        phone: this.customerPhone(),
        email: this.customerEmail(),
        address_line_1: this.addressLine1(),
        address_line_2: this.addressLine2(),
        city: this.city(),
        state: this.state(),
        postal_code: this.postalCode(),
        country: this.country()
      }
    );
  });

  /**
   * Genera el payload reactivo en tiempo real para WhatsApp
   */
  readonly currentWhatsAppRequestPayload = computed<WhatsAppOrderRequest | null>(() => {
    const shipping = this.cartService.shippingCost();
    const total = this.cartService.total();
    if (shipping === null || total === null) return null;
    return this.paymentService.buildWhatsAppPayload(
      this.cartService.items(),
      this.cartService.subtotal(),
      shipping,
      this.cartService.discountAmount(),
      total,
      {
        customer_name: this.customerName(),
        phone: this.customerPhone(),
        email: this.customerEmail(),
        address_line_1: this.addressLine1(),
        address_line_2: this.addressLine2(),
        city: this.city(),
        state: this.state(),
        postal_code: this.postalCode(),
        country: this.country()
      }
    );
  });

  /**
   * Genera el mensaje formateado y estructurado para WhatsApp
   */
  readonly generatedWhatsAppText = computed<string>(() => {
    const saleId = this.whatsAppSaleId();
    const folio = saleId ? `#${saleId}` : (this.orderNumber() || `ALUM-WA-${Date.now().toString().slice(-6)}`);
    const items = this.orderedItemsSnapshot().length > 0 
      ? this.orderedItemsSnapshot() 
      : this.cartService.items();
    
    let itemsText = '';
    items.forEach((item, index) => {
      const priceTotal = item.product.price * item.quantity;
      itemsText += `${index + 1}. *${item.product.name}*\n   - Cantidad: ${item.quantity}\n   - Color: ${item.selectedColor}\n   - Talla: ${item.selectedSize}\n   - Importe: $${priceTotal.toFixed(2)} MXN\n`;
    });

    const ref = this.addressLine2() ? `\n• *Referencia:* ${this.addressLine2()}` : '';
    const emailText = this.customerEmail() ? `\n✉️ *CORREO:* ${this.customerEmail()}` : '';
    const response = this.whatsAppResponse();
    const authoritativeSubtotal = Number(response?.subtotal ?? 0);
    const authoritativeShipping = Number(response?.shipping_cost ?? 0);
    const authoritativeTotal = Number(response?.total ?? 0);

    return `*¡HOLA GUAYABERAS ALUM!* 🌿\n\n` +
      `Deseo confirmar el siguiente pedido registrado en la tienda en línea y ERP:\n\n` +
      `📋 *FOLIO DE VENTA ERP:* ${folio}\n` +
      `👤 *CLIENTE:* ${this.customerName()}\n` +
      `📱 *TELÉFONO:* ${this.customerPhone()}${emailText}\n\n` +
      `📦 *DIRECCIÓN DE ENVÍO:*\n` +
      `• *Calle y Número:* ${this.addressLine1()}${ref}\n` +
      `• *Ciudad y Estado:* ${this.city()}, ${this.state()}\n` +
      `• *C.P. y País:* ${this.postalCode()}, ${this.country() || 'MX'}\n\n` +
      `👕 *PRENDAS SOLICITADAS:*\n${itemsText}\n` +
      `💰 *RESUMEN DE PAGO:*\n` +
      `• *Subtotal:* $${authoritativeSubtotal.toFixed(2)} MXN\n` +
      `• *Envío:* ${authoritativeShipping === 0 ? 'Gratis' : `$${authoritativeShipping.toFixed(2)} MXN`}\n` +
      `• *Total a Pagar:* $${authoritativeTotal.toFixed(2)} MXN\n\n` +
      `Quedo en espera de su confirmación para concretar el método de pago y el envío. ¡Muchas gracias!`;
  });

  /**
   * URL de WhatsApp para enviar el pedido completo
   */
  readonly whatsAppOrderUrl = computed<string>(() => {
    const text = this.generatedWhatsAppText();
    return `https://wa.me/529971149132?text=${encodeURIComponent(text)}`;
  });

  toggleRequestJson(): void {
    this.showRequestJson.update(v => !v);
  }

  toggleResponseJson(): void {
    this.showResponseJson.update(v => !v);
  }

  toggleWhatsAppMessagePreview(): void {
    this.showMessagePreview.update(v => !v);
  }

  copyPaymentLink(): void {
    const link = this.preferenceResponse()?.init_point;
    if (!link) return;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        this.isLinkCopied.set(true);
        this.toastService.show('Enlace de pago copiado al portapapeles.', 'success');
        setTimeout(() => this.isLinkCopied.set(false), 3000);
      }).catch(() => {
        this.toastService.show('No se pudo copiar automáticamente.', 'info');
      });
    }
  }

  copyPreferenceId(): void {
    const id = this.preferenceResponse()?.preference_id || this.orderNumber();
    if (!id) return;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(id).then(() => {
        this.toastService.show('ID de preferencia copiado.', 'success');
      });
    }
  }

  copyOrderId(): void {
    const id = this.whatsAppSaleId() ? `#${this.whatsAppSaleId()}` : this.orderNumber();
    if (!id) return;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(id.toString()).then(() => {
        this.toastService.show('Folio de venta copiado.', 'success');
      });
    }
  }

  copyWhatsAppMessage(): void {
    const msg = this.generatedWhatsAppText();
    if (!msg) return;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(msg).then(() => {
        this.isMessageCopied.set(true);
        this.toastService.show('¡Mensaje de pedido copiado al portapapeles!', 'success');
        setTimeout(() => this.isMessageCopied.set(false), 3000);
      }).catch(() => {
        this.toastService.show('No se pudo copiar el texto automáticamente.', 'info');
      });
    }
  }

  openWhatsAppTab(): void {
    const url = this.whatsAppOrderUrl();
    if (url && typeof window !== 'undefined') {
      try {
        const newWin = window.open(url, '_blank', 'noopener,noreferrer');
        if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
          this.toastService.show('Ventana emergente bloqueada por el navegador. Haz clic en el botón principal para abrir WhatsApp.', 'info', 6000);
        } else {
          this.toastService.show('Abriendo WhatsApp...', 'info');
        }
      } catch (e) {
        console.warn('Error al abrir ventana de WhatsApp:', e);
        this.toastService.show('Haz clic en el botón para abrir WhatsApp.', 'info');
      }
    }
  }

  openMercadoPagoTab(): void {
    const link = this.preferenceResponse()?.init_point;
    if (link && isPlatformBrowser(this.platformId)) {
      window.location.assign(link);
    }
  }

  getWhatsAppConfirmationUrl(): string {
    const prefId = this.preferenceResponse()?.preference_id || this.orderNumber();
    const msg = encodeURIComponent(
      `Hola Alan Uicab (Guayaberas ALUM), acabo de generar mi orden de compra con Mercado Pago (Folio/Preferencia: ${prefId}) a nombre de ${this.customerName()} por un total de $${this.totalPaid().toFixed(2)} MXN. Me gustaría confirmar el seguimiento.`
    );
    return `https://wa.me/529971149132?text=${msg}`;
  }

  async processOrder(event: Event): Promise<void> {
    event.preventDefault();

    if (this.cartService.items().length === 0) {
      this.toastService.show('El carrito está vacío.', 'error');
      return;
    }

    const isMp = this.paymentMethod() === 'mercado_pago';
    const email = this.customerEmail().trim();

    if (!this.customerName().trim()) {
      this.toastService.show('Por favor ingresa tu nombre completo.', 'error');
      return;
    }

    if (!this.customerPhone().trim()) {
      this.toastService.show('Por favor ingresa tu número de teléfono / WhatsApp.', 'error');
      return;
    }

    if (isMp && !email) {
      this.toastService.show('Para pagar con Mercado Pago, el correo electrónico real es obligatorio.', 'error');
      return;
    }

    if (isMp && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.toastService.show('Ingresa un correo electrónico válido para Mercado Pago.', 'error');
      return;
    }

    if (
      !this.addressLine1().trim()
      || !this.city().trim()
      || !this.state().trim()
      || !this.postalCode().trim()
    ) {
      this.toastService.show('Por favor completa calle, ciudad/municipio, estado y código postal.', 'error');
      return;
    }

    this.isProcessing.set(true);

    try {
      await firstValueFrom(this.ecommerceStatus.refresh());
      const shippingEstimate = this.cartService.shippingCost();
      const totalEstimate = this.cartService.total();
      if (shippingEstimate === null || totalEstimate === null) {
        this.isProcessing.set(false);
        this.toastService.show('No fue posible obtener la configuración de envío. Intenta nuevamente.', 'error', 6500);
        return;
      }

      const revalidation = await this.cartService.refreshAvailability();

      if (this.cartService.items().length === 0) {
        this.isProcessing.set(false);
        this.toastService.show('Ya no hay variantes comprables en el carrito. Revisa el catálogo.', 'warning', 6000);
        return;
      }

      if (revalidation.changed) {
        this.isProcessing.set(false);
        this.toastService.show('El carrito cambió con la disponibilidad actual. Revísalo antes de continuar.', 'warning', 6500);
        return;
      }

      const selectedMethod = this.paymentMethod();
      // Congelar exactamente el carrito que acaba de ser revalidado. La variante se
      // vuelve a resolver desde selectedSize/selectedColor para impedir que una referencia
      // persistida de otra talla del mismo modelo llegue al payload de pago.
      const validatedCartSnapshot = this.cartService.createCheckoutSnapshot();
      this.orderedItemsSnapshot.set(validatedCartSnapshot);

      if (selectedMethod === 'whatsapp') {
        this.completedPaymentMethod.set('whatsapp');
        const payload = this.paymentService.buildWhatsAppPayload(
          validatedCartSnapshot,
          this.cartService.subtotal(),
          shippingEstimate,
          this.cartService.discountAmount(),
          totalEstimate,
          {
            customer_name: this.customerName(),
            phone: this.customerPhone(),
            email: this.customerEmail(),
            address_line_1: this.addressLine1(),
            address_line_2: this.addressLine2(),
            city: this.city(),
            state: this.state(),
            postal_code: this.postalCode(),
            country: this.country()
          }
        );

        this.paymentService.createWhatsAppOrder(payload).subscribe({
          next: (result) => {
            const response = result.data;
            const subtotal = Number(response?.subtotal);
            const shippingCost = Number(response?.shipping_cost);
            const total = Number(response?.total);

            if (
              !response?.success
              || !response.sale_id
              || !Number.isFinite(subtotal)
              || subtotal < 0
              || !Number.isFinite(shippingCost)
              || shippingCost < 0
              || !Number.isFinite(total)
              || total < 0
            ) {
              this.isProcessing.set(false);
              this.toastService.show(
                'Se registró una respuesta incompleta para el pedido por WhatsApp. No se abrirá WhatsApp con totales no verificados.',
                'error',
                7000
              );
              return;
            }

            this.isProcessing.set(false);
            // Los totales mostrados y enviados a WhatsApp salen exclusivamente de la
            // respuesta autoritativa del ERP, no de los cálculos del navegador.
            this.totalPaid.set(total);
            this.whatsAppResponse.set(response);
            this.whatsAppSaleId.set(response.sale_id);
            this.orderNumber.set(`VENTA-${response.sale_id}`);
            this.toastService.show('¡Pedido guardado con éxito en el ERP! Abriendo WhatsApp...', 'success');
            this.orderCompleted.set(true);
            this.cartService.clearCart();
            setTimeout(() => this.openWhatsAppTab(), 350);
          },
          error: async (error) => {
            await this.handleOrderRequestError(error, 'Ocurrió un error al registrar el pedido.');
          }
        });
        return;
      }

      this.completedPaymentMethod.set('mercado_pago');
      const payload = this.paymentService.buildPreferencePayload(
        validatedCartSnapshot,
        this.cartService.subtotal(),
        shippingEstimate,
        this.cartService.discountAmount(),
        totalEstimate,
        {
          customer_name: this.customerName(),
          phone: this.customerPhone(),
          email: this.customerEmail(),
          address_line_1: this.addressLine1(),
          address_line_2: this.addressLine2(),
          city: this.city(),
          state: this.state(),
          postal_code: this.postalCode(),
          country: this.country()
        }
      );
      const cartSnapshot = validatedCartSnapshot;

      this.paymentService.createPreference(payload).subscribe({
        next: (result) => {
          const response = result.data;

          if (
            !response?.success
            || !response.sale_id
            || !response.preference_id
            || !response.init_point
            || !response.order_status_url
          ) {
            this.isProcessing.set(false);
            this.toastService.show('Se devolvió una preferencia incompleta. No se realizó el redirect.', 'error', 6500);
            return;
          }

          this.preferenceResponse.set(response);
          this.orderNumber.set(String(response.sale_id));
          this.totalPaid.set(Number(response.total));

          this.checkoutSession.save({
            saleId: Number(response.sale_id),
            preferenceId: response.preference_id,
            initPoint: response.init_point,
            orderStatusUrl: response.order_status_url,
            reservationExpiresAt: response.reservation_expires_at ?? null,
            subtotal: Number(response.subtotal),
            shippingCost: Number(response.shipping_cost),
            total: Number(response.total),
            addressLabel: `${this.addressLine1().trim()}, ${this.city().trim()}, ${this.state().trim()}, C.P. ${this.postalCode().trim()}`,
            cartItems: cartSnapshot,
            createdAt: new Date().toISOString()
          });

          // El backend ya creó la Sale/reserva. No limpiar el carrito todavía.
          if (isPlatformBrowser(this.platformId)) {
            window.location.assign(response.init_point);
          } else {
            this.isProcessing.set(false);
          }
        },
        error: async (error) => {
          await this.handleOrderRequestError(error, 'No fue posible crear la preferencia de Mercado Pago.');
        }
      });
    } catch (error) {
      this.isProcessing.set(false);
      this.toastService.show(getApiErrorMessage(error, 'No fue posible revalidar el carrito.'), 'error', 6500);
    }
  }

  /**
   * Si GuayaFlow rechaza el checkout por una carrera de inventario/precio (409),
   * sincroniza inmediatamente el carrito con el catálogo vigente. El backend sigue
   * siendo la autoridad y no se reintenta automáticamente la creación de la venta.
   */
  private async handleOrderRequestError(error: unknown, fallback: string): Promise<void> {
    this.isProcessing.set(false);

    if (error instanceof HttpErrorResponse && error.status === 409) {
      const code = String(error.error?.code ?? '').trim();

      if (code === 'insufficient_stock' || code === 'ecommerce_price_unavailable') {
        try {
          await this.cartService.refreshAvailability();
        } catch {
          this.toastService.show(
            'Se rechazó el pedido y no fue posible sincronizar el carrito en este momento. No se realizó el pago.',
            'error',
            7000
          );
          return;
        }

        if (code === 'insufficient_stock') {
          const available = Number(error.error?.available);
          const message = Number.isFinite(available)
            ? (available > 0
                ? `La existencia cambió durante el checkout. Solo quedan ${available} unidad(es) disponibles; actualizamos tu carrito.`
                : 'Una de las variantes se agotó durante el checkout y fue retirada del carrito.')
            : (error.error?.message || 'La existencia cambió durante el checkout. Actualizamos tu carrito.');

          this.toastService.show(message, 'warning', 7000);
          return;
        }

        const productName = String(error.error?.product_name ?? '').trim();
        this.toastService.show(
          productName
            ? `${productName} ya no tiene precio disponible para venta en línea. Actualizamos tu carrito; puedes consultarlo por WhatsApp.`
            : (error.error?.message || 'Uno de los productos ya no tiene precio web. Actualizamos tu carrito.'),
          'info',
          7000
        );
        return;
      }
    }

    this.toastService.show(getApiErrorMessage(error, fallback), 'error', 6500);
  }

}
