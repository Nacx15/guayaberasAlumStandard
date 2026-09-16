import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import {
  MatIconModule,
} from '@angular/material/icon';
import {
  EcommerceStatusService,
} from '../../services/ecommerce-status.service';

@Component({
  selector: 'app-inactive',
  imports: [
    RouterLink,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-[82vh] bg-[#0D131A] text-[#F9F7F2] px-4 py-12 sm:py-20 flex items-center justify-center relative overflow-hidden">
      <!-- Ambient Glow -->
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-[#AE875B]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="w-full max-w-2xl bg-[#151F2A] border border-[#AE875B]/30 rounded-3xl text-center px-6 py-12 md:px-12 md:py-16 shadow-2xl relative z-10 space-y-6">
        
        <!-- Store Icon -->
        <div class="w-20 h-20 rounded-full bg-[#AE875B]/10 border border-[#AE875B]/35 mx-auto flex items-center justify-center text-[#C9A87C] shadow-inner">
          <mat-icon class="text-4xl w-10 h-10 flex items-center justify-center">storefront</mat-icon>
        </div>

        <!-- Brand Eyebrow -->
        <div class="space-y-2">
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#AE875B]/20 text-[#C9A87C] border border-[#AE875B]/35">
            <mat-icon class="text-xs">verified</mat-icon>
            GUAYABERAS ALUM
          </span>

          <h1 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            La tienda no está disponible.
          </h1>
        </div>

        <p class="text-sm sm:text-base text-stone-300 leading-relaxed max-w-lg mx-auto font-sans">
          {{
            status.current()?.message
              || 'Por el momento no es posible realizar compras desde la tienda en línea. Nuestro taller continúa atendiendo cotizaciones de manera directa.'
          }}
        </p>

        <!-- Actions -->
        <div class="pt-3 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            type="button"
            (click)="retry()"
            [disabled]="status.loading()"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#AE875B] to-[#C9A87C] hover:opacity-95 text-[#0D131A] px-8 py-3.5 text-xs uppercase tracking-widest font-bold rounded-xl transition-all shadow-lg hover:shadow-[#AE875B]/20 disabled:opacity-50 cursor-pointer"
          >
            <mat-icon class="text-sm" [class.animate-spin]="status.loading()">sync</mat-icon>
            <span>{{ status.loading() ? 'Verificando...' : 'Verificar nuevamente' }}</span>
          </button>

          <a
            routerLink="/contacto"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#AE875B]/40 hover:border-[#AE875B] bg-[#0D131A]/70 hover:bg-[#0D131A] text-[#F9F7F2] px-8 py-3.5 text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer"
          >
            <mat-icon class="text-sm">contact_support</mat-icon>
            <span>Contactar a Taller</span>
          </a>
        </div>
      </div>
    </main>
  `,
})
export class InactivePage implements OnInit {
  readonly status = inject(EcommerceStatusService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (!this.status.current()) {
      this.retry();
    }
  }

  retry(): void {
    this.status
      .refresh()
      .subscribe({
        next: (state) => {
          if (state.status === 'active') {
            this.router.navigate(['/']);
          }

          if (state.status === 'maintenance') {
            this.router.navigate(['/maintenance']);
          }
        },
      });
  }
}
