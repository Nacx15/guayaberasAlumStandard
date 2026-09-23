import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-contacto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-[#0D131A] text-[#F9F7F2] py-8 sm:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#AE875B]/20 text-[#C9A87C] border border-[#AE875B]/30 uppercase tracking-wider mb-4">
            <span class="material-icons text-sm">place</span>
            TALLER MATRIZ EN TEKIT, YUCATÁN
          </span>
          <h1 class="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
            Visítanos o Contáctanos
          </h1>
          <p class="text-base sm:text-lg text-stone-300 mt-3 font-sans leading-relaxed">
            Estamos a tus órdenes para visitas en sala de exhibición en Tekit, cotizaciones de mayoreo o envíos a todo México.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          <!-- LEFT: Contact Cards & Info of Alan Uicab Medina -->
          <div class="lg:col-span-5 space-y-6">
            
            <!-- Brand & Director Card -->
            <div class="bg-[#151F2A] p-6 sm:p-8 rounded-3xl border border-[#AE875B]/30 shadow-xl space-y-4">
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#38C7EC]">Dirección General</span>
              <h3 class="font-serif font-bold text-2xl text-white">Alan Uicab Medina</h3>
              <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                Fundador de <strong>GUAYABERAS ALUM</strong>. Comprometido con la preservación de la alta costura tekiteña y la atención personalizada con los clientes.
              </p>
              <div class="pt-2 border-t border-stone-800 flex items-center gap-2 text-xs text-[#C9A87C] font-bold">
                <span class="material-icons text-base">verified</span>
                Hecho en Tekit, Yucatán, México
              </div>
            </div>

            <!-- Wholesale / Mayoreo Dedicated Card -->
            <div id="contacto-mayoreo" class="bg-gradient-to-br from-[#151F2A] to-[#1A2634] p-6 sm:p-8 rounded-3xl border-2 border-[#AE875B]/60 shadow-2xl space-y-4 relative overflow-hidden">
              <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-[#AE875B]/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#AE875B]/25 text-[#C9A87C] border border-[#AE875B]/40 uppercase tracking-widest">
                  <span class="material-icons text-xs">storefront</span>
                  Ventas al Mayoreo
                </span>
                <span class="text-[11px] font-bold text-stone-400">Desde 12 piezas</span>
              </div>

              <h3 class="font-serif font-bold text-xl sm:text-2xl text-white">
                Pedidos de Mayoreo y Distribuidores
              </h3>

              <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                ¿Tienes una boutique, tienda de ropa o requieres prendas para eventos corporativos y bodas masivas? Ofrecemos precios directos de taller tekiteño con catálogo de mayoreo exclusivo.
              </p>

              <ul class="space-y-2 text-xs text-stone-300 font-sans">
                <li class="flex items-center gap-2">
                  <span class="material-icons text-sm text-[#38C7EC]">check_circle</span>
                  <span>Precios preferenciales de fabricante directo en Tekit</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-icons text-sm text-[#38C7EC]">check_circle</span>
                  <span>Lino, algodón y mezclas finas</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-icons text-sm text-[#38C7EC]">check_circle</span>
                  <span>Envíos rápidos y asegurados a todo México y EE.UU.</span>
                </li>
              </ul>

              <div class="pt-3 border-t border-stone-800 flex flex-col sm:flex-row gap-3">
                <a href="https://wa.me/529971149132?text=Hola%20Alan%20Uicab%20%2F%20Guayaberas%20ALUM,%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n%20y%20cotizaci%C3%B3n%20para%20un%20pedido%20al%20MAYOREO%20de%20guayaberas%20de%20lino%20para%20mi%20negocio%2Fevento."
                   target="_blank"
                   rel="noopener noreferrer"
                   id="btn-whatsapp-mayoreo"
                   class="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.175.2-.351.226-.652.075s-1.272-.469-2.423-1.496c-.896-.799-1.5-1.788-1.676-2.089-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.101-.2.05-.376-.025-.527-.075-.15-.678-1.633-.929-2.235-.245-.587-.494-.507-.678-.517-.175-.01-.376-.01-.577-.01s-.527.075-.803.376c-.276.301-1.054 1.029-1.054 2.511s1.079 2.913 1.23 3.114c.15.201 2.123 3.242 5.143 4.547.719.311 1.281.497 1.719.636.722.23 1.378.197 1.898.12.579-.086 1.78-.727 2.031-1.429.251-.702.251-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.05 21.785h-.007a9.736 9.736 0 0 1-4.962-1.354l-.356-.211-3.691.968.985-3.598-.232-.369a9.742 9.742 0 0 1-1.497-5.187c0-5.385 4.382-9.768 9.771-9.768 2.607 0 5.059 1.016 6.903 2.86 1.844 1.845 2.859 4.298 2.859 6.907 0 5.387-4.382 9.77-9.77 9.77zm0-17.785c-4.418 0-8.012 3.594-8.012 8.012 0 1.547.442 3.037 1.28 4.328l-.837 3.058 3.14-.824a7.989 7.989 0 0 0 4.429 1.45h.005c4.417 0 8.01-3.594 8.01-8.012 0-2.14-.834-4.152-2.348-5.666a7.962 7.962 0 0 0-5.667-2.346z"/>
                  </svg>
                  WhatsApp Mayoreo
                </a>

                <a href="tel:9971149132"
                   id="btn-tel-mayoreo"
                   class="py-3 px-4 bg-[#0D131A] hover:bg-stone-800 text-stone-200 hover:text-white text-xs font-semibold rounded-xl transition-colors border border-stone-700 flex items-center justify-center gap-1.5">
                  <span class="material-icons text-sm text-[#C9A87C]">call</span>
                  997 114 9132
                </a>
              </div>
            </div>

            <!-- Workshop Contact Details -->
            <div class="bg-[#151F2A] p-6 sm:p-8 rounded-3xl border border-[#AE875B]/25 shadow-xl space-y-5">
              
              <!-- Address -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-2xl bg-[#AE875B]/20 text-[#C9A87C] flex items-center justify-center flex-shrink-0 mt-1 border border-[#AE875B]/30">
                  <span class="material-icons text-xl">location_on</span>
                </div>
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-white">Ubicación del Taller</h4>
                  <p class="text-xs sm:text-sm text-stone-300 mt-0.5">
                    Calle 21 x 32 y 32, Tekit, Yucatán, C.P. 97680
                  </p>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-2xl bg-[#00A7D4]/20 text-[#38C7EC] flex items-center justify-center flex-shrink-0 mt-1 border border-[#00A7D4]/30">
                  <span class="material-icons text-xl">phone</span>
                </div>
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-white">Teléfono & WhatsApp</h4>
                  <a href="tel:9971149132" class="text-xs sm:text-sm font-semibold text-[#38C7EC] hover:underline block mt-0.5">
                    997 114 9132
                  </a>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-2xl bg-[#AE875B]/20 text-[#C9A87C] flex items-center justify-center flex-shrink-0 mt-1 border border-[#AE875B]/30">
                  <span class="material-icons text-xl">email</span>
                </div>
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-white">Correo Electrónico</h4>
                  <a href="mailto:guayaberasalum@gmail.com" class="text-xs sm:text-sm font-semibold text-stone-200 hover:text-[#38C7EC] hover:underline block mt-0.5 break-all">
                    guayaberasalum&#64;gmail.com
                  </a>
                </div>
              </div>

              <!-- Hours -->
              <div class="flex items-start gap-4 pt-2 border-t border-stone-800">
                <div class="w-10 h-10 rounded-2xl bg-[#0D131A] text-[#C9A87C] flex items-center justify-center flex-shrink-0 mt-1 border border-stone-800">
                  <span class="material-icons text-xl">schedule</span>
                </div>
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-white">Horarios de Atención</h4>
                  <p class="text-xs text-stone-300 mt-0.5"><strong>Lunes a Viernes:</strong> 10:00 am a 6:00 pm</p>
                  <p class="text-xs text-stone-300"><strong>Sábados y Domingos:</strong> 10:00 am a 3:00 pm</p>
                </div>
              </div>

            </div>

          </div>

          <!-- RIGHT: Direct Contact Form on Dark Card Container -->
          <div class="lg:col-span-7 bg-[#151F2A] p-6 sm:p-10 rounded-3xl border border-[#AE875B]/30 shadow-xl">
            <span class="text-xs font-bold uppercase tracking-widest text-[#38C7EC]">Mensaje Directo</span>
            <h3 class="font-serif font-bold text-2xl text-white mt-1 mb-2">Envíanos un Mensaje</h3>
            <p class="text-xs sm:text-sm text-stone-300 mb-6">
              Completa el formulario y Alan Uicab o nuestro equipo de atención se pondrá en contacto contigo de forma personalizada.
            </p>

            @if (messageSent()) {
              <div class="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                <span class="material-icons text-3xl text-emerald-400">check_circle</span>
                <h4 class="font-serif font-bold text-lg text-emerald-200">¡Mensaje Enviado Correctamente!</h4>
                <p class="text-xs text-emerald-300">Agradecemos tu interés en Guayaberas ALUM. Te responderemos hoy mismo.</p>
                <button (click)="messageSent.set(false)" class="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors">Enviar otro mensaje</button>
              </div>
            } @else {
              <form (submit)="sendMessage($event)" class="space-y-4">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="contact-name" class="block text-xs font-bold text-stone-200 mb-1">Tu Nombre Completo *</label>
                    <input id="contact-name" type="text" required placeholder="Ej. Roberto Sánchez"
                           class="w-full px-4 py-3 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none focus:border-[#00A7D4]" />
                  </div>

                  <div>
                    <label for="contact-email" class="block text-xs font-bold text-stone-200 mb-1">Correo Electrónico *</label>
                    <input id="contact-email" type="email" required placeholder="tu@correo.com"
                           class="w-full px-4 py-3 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none focus:border-[#00A7D4]" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="contact-phone" class="block text-xs font-bold text-stone-200 mb-1">Teléfono / WhatsApp *</label>
                    <input id="contact-phone" type="tel" required placeholder="Ej. 997 114 9132"
                           class="w-full px-4 py-3 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none focus:border-[#00A7D4]" />
                  </div>

                  <div>
                    <label for="contact-reason" class="block text-xs font-bold text-stone-200 mb-1">Motivo de Contacto</label>
                    <select id="contact-reason" class="w-full px-4 py-3 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A7D4]">
                      <option class="bg-[#151F2A] text-white">Consulta general sobre prendas de lino</option>
                      <!-- <option class="bg-[#151F2A] text-white">Cita para confección a la medida (Novio/Padrinos)</option> -->
                      <option class="bg-[#151F2A] text-white">Cotización al Mayoreo para Boutique</option>
                      <option class="bg-[#151F2A] text-white">Seguimiento de Envío</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label for="contact-message" class="block text-xs font-bold text-stone-200 mb-1">Mensaje *</label>
                  <textarea id="contact-message" rows="4" required placeholder="Escribe aquí tu mensaje, duda sobre tallas, fecha de evento o piezas solicitadas..."
                            class="w-full px-4 py-3 bg-[#0D131A] border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none focus:border-[#00A7D4]"></textarea>
                </div>

                <div class="pt-2">
                  <button type="submit" 
                          class="w-full sm:w-auto px-10 py-4 bg-[#00A7D4] hover:bg-[#008AA0] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center gap-2">
                    <span class="material-icons text-base">send</span>
                    Enviar Mensaje Directo
                  </button>
                </div>

              </form>
            }

          </div>

        </div>

        <!-- Interactive Google Map of Tekit, Yucatán -->
        <section class="bg-[#151F2A] p-6 sm:p-8 rounded-3xl border border-[#AE875B]/30 shadow-xl space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span class="text-xs font-bold uppercase tracking-widest text-[#C9A87C]">Mapa Interactivo</span>
              <h3 class="font-serif font-bold text-2xl text-white">Ubicación de la Boutique en Tekit, Yucatán</h3>
              <p class="text-xs text-stone-300">Calle 21 x 32 y 32, Tekit, Yucatán, C.P. 97680</p>
            </div>
            <a href="https://maps.google.com/?q=Tekit,+Yucat%C3%A1n" target="_blank" rel="noopener"
               class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#AE875B] hover:bg-[#8F6A40] text-white text-xs font-bold rounded-xl transition-colors self-start sm:self-auto shadow-md">
              <span class="material-icons text-sm">directions</span>
              Cómo Llegar con Google Maps
            </a>
          </div>

          <!-- Embed iframe of Tekit, Yucatan -->
          <div class="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-stone-800">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14948.868019318858!2d-89.33924765!3d20.536762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5619caefbce8c3%3A0x6b6c0bfb2d416b25!2sTekit%2C%20Yuc.!5e0!3m2!1ses!2smx!4v1700000000000!5m2!1ses!2smx" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
              title="Mapa de Tekit Yucatan - Guayaberas ALUM">
            </iframe>
          </div>
        </section>

      </div>
    </main>
  `
})
export class Contacto {
  private toastService = inject(ToastService);
  messageSent = signal(false);

  sendMessage(event: Event): void {
    event.preventDefault();
    this.messageSent.set(true);
    this.toastService.show('¡Mensaje enviado con éxito! En breve te contactaremos.', 'success');
  }
}
