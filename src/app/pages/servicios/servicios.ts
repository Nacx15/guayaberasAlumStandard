import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-servicios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-[#0D131A] text-[#F9F7F2]">
      
      <!-- Top Banner -->
      <section class="py-16 sm:py-24 bg-[#151F2A] border-b border-[#AE875B]/30 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#00A7D4]/20 text-[#38C7EC] border border-[#00A7D4]/30 uppercase tracking-wider mb-4">
            <span class="material-icons text-sm">design_services</span>
            SASTRERÍA DE ALTA COSTURA
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            Servicios Especiales & Mayoreo
          </h1>
          <p class="text-base sm:text-lg text-stone-300 mt-4 leading-relaxed font-sans">
            Confección de pedidos especiales para eventos sociales y producción en mayoreo para boutiques.
          </p>
        </div>
      </section>

      <!-- 4 Core Service Cards -->
      <section class="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Servicio 1: Confección a la Medida -->
          <div class="bg-[#151F2A] p-8 sm:p-10 rounded-3xl border border-[#AE875B]/30 shadow-xl hover:border-[#AE875B] transition-all duration-300 flex flex-col justify-between">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-[#AE875B]/20 text-[#C9A87C] flex items-center justify-center border border-[#AE875B]/30">
                <span class="material-icons text-3xl">straighten</span>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-[#C9A87C]">Novios & Eventos Especiales</span>
              <h3 class="font-serif text-2xl font-bold text-white">
                Confección para Eventos Especiales
              </h3>
              <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                Realizamos prendas sobre pedido para cualquier evento en diferentes tallas y tipo de tela que desee.
              </p>
              <ul class="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#38C7EC]">check_circle</span>
                  Elección de lino 
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#38C7EC]">check_circle</span>
                  Elección de tallas
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#38C7EC]">check_circle</span>
                  Elección de bordado 
                </li>
              </ul>
            </div>
            <div class="pt-6 mt-6 border-t border-stone-800">
              <a href="https://wa.me/529971149132?text=Hola,%20me%20gustar%C3%ADa%20cotizar%20una%20guayabera%20a%20la%20medida%20para%20un%20evento." 
                 target="_blank" rel="noopener"
                 class="inline-flex items-center gap-2 text-xs font-bold text-[#38C7EC] hover:text-[#00A7D4]">
                Cotizar por WhatsApp <span class="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
          </div>

          <!-- Servicio 2: Personalización de Bordados -->
          <div class="bg-[#151F2A] p-8 sm:p-10 rounded-3xl border border-[#00A7D4]/30 shadow-xl hover:border-[#00A7D4] transition-all duration-300 flex flex-col justify-between">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-[#00A7D4]/20 text-[#38C7EC] flex items-center justify-center border border-[#00A7D4]/30">
                <span class="material-icons text-3xl">auto_fix_high</span>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-[#38C7EC]">Técnicas de Autor</span>
              <h3 class="font-serif text-2xl font-bold text-white">
                Personalización de Bordados
              </h3>
              <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                Realizamos diferentes diseños de bordado incluyendo logos de empresa con la aplicacion de punto de cruz.
              </p>
              <ul class="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#C9A87C]">check_circle</span>
                  Elección de bordado
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#C9A87C]">check_circle</span>
                  Diferentes tonos de hilos
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#C9A87C]">check_circle</span>
                  Bordados en puños y cuello
                </li>
              </ul>
            </div>
            <div class="pt-6 mt-6 border-t border-stone-800">
              <a href="https://wa.me/529971149132?text=Hola,%20quisiera%20solicitar%20informaci%C3%B3n%20sobre%20bordados%20personalizados." 
                 target="_blank" rel="noopener"
                 class="inline-flex items-center gap-2 text-xs font-bold text-[#C9A87C] hover:text-[#AE875B]">
                Solicitar bordado de autor <span class="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
          </div>

          <!-- Servicio 3: Venta al Mayoreo -->
          <div class="bg-[#151F2A] p-8 sm:p-10 rounded-3xl border border-[#AE875B]/30 shadow-xl hover:border-[#AE875B] transition-all duration-300 flex flex-col justify-between">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-[#AE875B]/20 text-[#C9A87C] flex items-center justify-center border border-[#AE875B]/30">
                <span class="material-icons text-3xl">inventory_2</span>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-[#C9A87C]">Boutiques & Distribuidores</span>
              <h3 class="font-serif text-2xl font-bold text-white">
                Venta al Mayoreo
              </h3>
              <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                Precios preferenciales de fabrica para tiendas de moda, hoteles de lujo y boutiques. garantizamos tiempo de entrega formales y calidad en cada prenda.
              </p>
              <ul class="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#38C7EC]">check_circle</span>
                  Pedidos desde 12 piezas con escala de descuentos
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#38C7EC]">check_circle</span>
                  Disponibilidad de etiqueta propia o marca ALUM
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#38C7EC]">check_circle</span>
                  Muestrario de telas y acabados físicos a domicilio
                </li>
              </ul>
            </div>
            <div class="pt-6 mt-6 border-t border-stone-800">
              <a href="https://wa.me/529971149132?text=Hola,%20quisiera%20solicitar%20cotizaci%C3%B3n%20de%20mayoreo."     
                 target="_blank" rel="noopener"         
                 class="inline-flex items-center gap-2 text-xs font-bold text-[#38C7EC] hover:text-[#00A7D4]">
                Solicitar catálogo de mayoreo <span class="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
          </div>

          <!-- Servicio 4: Envíos Nacionales e Internacionales -->
          <div class="bg-[#151F2A] p-8 sm:p-10 rounded-3xl border border-[#00A7D4]/30 shadow-xl hover:border-[#00A7D4] transition-all duration-300 flex flex-col justify-between">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-[#00A7D4]/20 text-[#38C7EC] flex items-center justify-center border border-[#00A7D4]/30">
                <span class="material-icons text-3xl">flight_takeoff</span>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-[#38C7EC]">Logística Confiable</span>
              <h3 class="font-serif text-2xl font-bold text-white">
                Envíos Nacionales e Internacionales
              </h3>
              <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                Envíos seguros nacionales e internacionales. cada pedido viaja empacado con protección antihumedad.
              </p>
              <ul class="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#C9A87C]">check_circle</span>
                  Envío Gratis en compras a partir de $1,999 MXN
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#C9A87C]">check_circle</span>
                  Número de rastreo en tiempo real enviado por WhatsApp/Email
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-icons text-xs text-[#C9A87C]">check_circle</span>
                  Garantía total contra defectos de confección
                </li>
              </ul>
            </div>
            <div class="pt-6 mt-6 border-t border-stone-800">
              <span class="text-xs font-semibold text-stone-400">
                Tiempos promedio: 2-4 días hábiles nacionales
              </span>
            </div>
          </div>

        </div>
      </section>

      <!-- Quick Quotation Form -->
      <section class="py-16 bg-[#101720] border-t border-stone-800">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-[#151F2A] p-8 sm:p-12 rounded-3xl border border-[#AE875B]/30 shadow-2xl">
            
            <div class="text-center max-w-xl mx-auto mb-8">
              <span class="text-xs font-bold uppercase tracking-widest text-[#C9A87C]">Cotización Inmediata</span>
              <h2 class="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                Solicita una Cotización para tu Proyecto
              </h2>
              <p class="text-xs sm:text-sm text-stone-300 mt-2 font-sans">
                Déjanos los detalles de tu evento, número de piezas y nos comunicaremos en menos de 2 horas.
              </p>
            </div>

            @if (formSent()) {
              <div class="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                <span class="material-icons text-3xl text-emerald-400">check_circle</span>
                <h3 class="font-serif font-bold text-lg text-emerald-200">¡Cotización Enviada Exitosamente!</h3>
                <p class="text-xs text-emerald-300">Nos pondremos en contacto contigo vía WhatsApp / Teléfono a la brevedad.</p>
                <button (click)="formSent.set(false)" class="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors">Enviar otra solicitud</button>
              </div>
            } @else {
              <form (submit)="submitQuotation($event)" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="servicios-name" class="block text-xs font-bold text-[#C9A87C] mb-1">Nombre Completo *</label>
                    <input id="servicios-name" type="text" required placeholder="Ej. Carlos Mendoza" 
                           class="w-full px-4 py-3 bg-[#0D131A] border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4] focus:ring-1 focus:ring-[#00A7D4]" />
                  </div>
                  <div>
                    <label for="servicios-phone" class="block text-xs font-bold text-[#C9A87C] mb-1">Teléfono / WhatsApp *</label>
                    <input id="servicios-phone" type="tel" required placeholder="Ej. 997 123 4567" 
                           class="w-full px-4 py-3 bg-[#0D131A] border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4] focus:ring-1 focus:ring-[#00A7D4]" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="servicios-type" class="block text-xs font-bold text-[#C9A87C] mb-1">Tipo de Servicio *</label>
                    <select id="servicios-type" class="w-full px-4 py-3 bg-[#0D131A] border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#00A7D4] focus:ring-1 focus:ring-[#00A7D4]">
                      <!-- <option class="bg-[#0D131A] text-white">Confección a la Medida para Novio / Padrinos</option> -->
                      <!-- <option class="bg-[#0D131A] text-white">Personalización de Bordados y Monogramas</option> -->
                      <option class="bg-[#0D131A] text-white">Cotización de Mayoreo para Tienda / Boutique</option>
                      <!-- <option class="bg-[#0D131A] text-white">Uniforme Corporativo / Evento de Gala</option> -->
                    </select>
                  </div>
                  <div>
                    <label for="servicios-qty" class="block text-xs font-bold text-[#C9A87C] mb-1">Cantidad Estimada de Piezas</label>
                    <input id="servicios-qty" type="number" min="1" value="1" 
                           class="w-full px-4 py-3 bg-[#0D131A] border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4] focus:ring-1 focus:ring-[#00A7D4]" />
                  </div>
                </div>

                <div>
                  <label for="servicios-details" class="block text-xs font-bold text-[#C9A87C] mb-1">Detalles de la prenda o fecha del evento</label>
                  <textarea id="servicios-details" rows="3" placeholder="Describe color de lino preferido, tipo de alforzas, fecha de boda o medidas especiales..."
                            class="w-full px-4 py-3 bg-[#0D131A] border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00A7D4] focus:ring-1 focus:ring-[#00A7D4]"></textarea>
                </div>

                <div class="text-center pt-2">
                  <button type="submit" 
                          class="w-full sm:w-auto px-10 py-4 bg-[#AE875B] hover:bg-[#8F6A40] text-white font-semibold text-sm rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 mx-auto">
                    <span class="material-icons text-base">send</span>
                    Enviar Solicitud de Cotización
                  </button>
                </div>
              </form>
            }

          </div>
        </div>
      </section>

    </main>
  `
})
export class Servicios {
  private toastService = inject(ToastService);
  formSent = signal(false);

  submitQuotation(event: Event): void {
    event.preventDefault();
    this.formSent.set(true);
    this.toastService.show('¡Solicitud de cotización recibida! Nos comunicaremos contigo.', 'success');
  }
}
