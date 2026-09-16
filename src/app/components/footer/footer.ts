import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../logo/logo';
import { ToastService } from '../../services/toast.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Logo, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-[#0D131A] text-[#F9F7F2] pt-16 pb-12 border-t-2 border-[#AE875B] relative overflow-hidden">
      <!-- Background subtle ornament -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-[#AE875B]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-[#00A7D4]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Top Newsletter & Brand Promise Section -->
        <!-- <div class="bg-[#151F2A] rounded-2xl p-8 mb-16 border border-[#AE875B]/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="max-w-xl text-center lg:text-left">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#AE875B]/20 text-[#C9A87C] border border-[#AE875B]/30 mb-3">
              <span class="material-icons text-sm text-[#00A7D4]">verified</span>
              ALTA COSTURA YUCATECA
            </span>
            <h3 class="text-2xl font-serif font-bold text-white tracking-wide">
              Únete al Club de Amantes del Lino y Tradición
            </h3>
            <p class="text-sm text-stone-300 mt-2 font-sans">
              Recibe lanzamientos de nuevas colecciones ceremoniales y 10% de descuento en tu primera compra con el cupón <strong class="text-[#00A7D4]">TEKIT10</strong>.
            </p>
          </div>

          <form (submit)="subscribeNewsletter($event)" class="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1 sm:w-80">
              <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">email</span>
              <input type="email" 
                     [value]="newsletterEmail()"
                     (input)="newsletterEmail.set($any($event.target).value)"
                     placeholder="Tu correo electrónico..."
                     required
                     class="w-full pl-10 pr-4 py-3 bg-[#0D131A] border border-stone-600 rounded-xl text-sm text-white placeholder-stone-400 focus:outline-none focus:border-[#00A7D4] focus:ring-1 focus:ring-[#00A7D4]" />
            </div>
            <button type="submit" 
                    class="px-6 py-3 bg-[#00A7D4] hover:bg-[#008AA0] text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <span>Suscribirme</span>
              <span class="material-icons text-sm">arrow_forward</span>
            </button>
          </form>
        </div> -->

        <!-- Main Footer Links Columns -->
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          <!-- Column 1: Brand & Craft Identity -->
          <div class="lg:col-span-2 space-y-4">
            <div class="inline-block">
              <app-logo [variant]="'full'" [isDark]="true"></app-logo>
            </div>
            <p class="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm pt-2">
              Taller artesanal de guayaberas de alta gama y ropa típica fundado por <strong>Alan Uicab Medina</strong>. Preservamos las alforzas milimétricas, el bordado de punto de cruz en telas de alta calidad y frescura desde el corazón de Tekit, Yucatán.
            </p>
            <div class="flex items-center gap-3 pt-2">
              <a href="https://wa.me/529971149132" target="_blank" rel="noopener" class="w-9 h-9 rounded-lg bg-stone-800 hover:bg-[#00A7D4] text-white flex items-center justify-center transition-colors" title="WhatsApp">
                <span class="material-icons text-sm">chat</span>
              </a>
              <a href="mailto:guayaberasalum@gmail.com" class="w-9 h-9 rounded-lg bg-stone-800 hover:bg-[#AE875B] text-white flex items-center justify-center transition-colors" title="Correo">
                <span class="material-icons text-sm">mail</span>
              </a>
              <a href="tel:9971149132" class="w-9 h-9 rounded-lg bg-stone-800 hover:bg-[#00A7D4] text-white flex items-center justify-center transition-colors" title="Llamar">
                <span class="material-icons text-sm">call</span>
              </a>
            </div>
          </div>

          <!-- Column 2: Navigation & Collections -->
          <div class="space-y-3">
            <h4 class="text-sm font-bold uppercase tracking-wider text-[#AE875B]">Colecciones</h4>
            <ul class="space-y-2 text-xs sm:text-sm text-stone-300">
              <li>
                <a routerLink="/catalogo" [queryParams]="{cat: 'caballeros'}" class="hover:text-[#00A7D4] transition-colors">Guayaberas Caballero</a>
              </li>
              <li>
                <a routerLink="/catalogo" [queryParams]="{cat: 'damas'}" class="hover:text-[#00A7D4] transition-colors">Vestidos y Blusas Dama</a>
              </li>
              <li>
                <a routerLink="/catalogo" [queryParams]="{cat: 'ninos'}" class="hover:text-[#00A7D4] transition-colors">Línea Infantil Ceremonial</a>
              </li>
              <li>
                <a routerLink="/catalogo" [queryParams]="{cat: 'bodas'}" class="hover:text-[#00A7D4] transition-colors">Colección Bodas de Playa</a>
              </li>
              <li>
                <a routerLink="/catalogo" class="hover:text-[#00A7D4] transition-colors">Catálogo Completo</a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Brand & Services -->
          <div class="space-y-3">
            <h4 class="text-sm font-bold uppercase tracking-wider text-[#AE875B]">Empresa y Servicios</h4>
            <ul class="space-y-2 text-xs sm:text-sm text-stone-300">
              <li>
                <a routerLink="/nosotros" class="hover:text-[#00A7D4] transition-colors">Historia & Alan Uicab</a>
              </li>
              <!-- <li>
                <a routerLink="/servicios" class="hover:text-[#00A7D4] transition-colors">Confección a la Medida</a>
              </li> -->
              <li>
                <a routerLink="/servicios" class="hover:text-[#00A7D4] transition-colors">Venta al Mayoreo</a>
              </li>
              <li>
                <a routerLink="/wishlist" class="hover:text-[#00A7D4] transition-colors">Lista de Deseos</a>
              </li>
              <li>
                <a routerLink="/contacto" class="hover:text-[#00A7D4] transition-colors">Ubicación del Taller</a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Contact & Workshop Hours -->
          <div class="space-y-3">
            <h4 class="text-sm font-bold uppercase tracking-wider text-[#AE875B]">Ubicación & Atención</h4>
            <div class="space-y-2 text-xs text-stone-300">
              <p class="flex items-start gap-2">
                <span class="material-icons text-sm text-[#AE875B] flex-shrink-0 mt-0.5">place</span>
                <span>Calle 21 x 32 y 34, Tekit, Yucatán, C.P. 97680</span>
              </p>
              <p class="flex items-center gap-2">
                <span class="material-icons text-sm text-[#00A7D4] flex-shrink-0">phone</span>
                <a href="https://wa.me/529971149132?" target="_blank" rel="noopener noreferrer" class="hover:underline">997 114 9132</a>
              </p>
              <p class="flex items-center gap-2">
                <span class="material-icons text-sm text-[#AE875B] flex-shrink-0">email</span>
                <a href="mailto:guayaberasalum@gmail.com" class="hover:underline break-all">guayaberasalum&#64;gmail.com</a>
              </p>
              <div class="pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                <p class="font-semibold text-stone-300">Horarios de Atención:</p>
                <p>Lun a Vie: 10:00 am - 6:00 pm</p>
                <p>Sáb y Dom: 10:00 am - 3:00 pm</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom Copyright & Badges -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 GUAYABERAS ALUM. Propietario: Alan Uicab Medina. Todos los derechos reservados.</p>
          <div class="flex items-center gap-4 text-stone-400">
            <span class="flex items-center gap-1">
              <span class="material-icons text-xs text-[#00A7D4]">shield</span>
              Compra 100% Segura
            </span>
            <span>•</span>
            <span class="flex items-center gap-1">
              <span class="material-icons text-xs text-[#AE875B]">workspace_premium</span>
              Hecho a Mano en Yucatán
            </span>
          </div>
        </div>

        <div class="flex justify-center items-center">
          <a href="https://smnsolutions.sm-panel.site/" target="_blank" 
              rel="noopener noreferrer"  style="font-size: smaller;">Desarrollado por SMN SOLUTIONS</a><mat-icon class="ml-2">language</mat-icon>
        </div>
      </div>
    </footer>
  `
})
export class Footer {
  private toastService = inject(ToastService);
  newsletterEmail = signal('');

  subscribeNewsletter(event: Event): void {
    event.preventDefault();
    if (!this.newsletterEmail()) return;
    this.toastService.show('¡Gracias por suscribirte! Usa el cupón TEKIT10 en tu compra.', 'success');
    this.newsletterEmail.set('');
  }
}
