import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-size-guide-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-[#151F2A] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#AE875B]/40 shadow-2xl relative max-h-[90vh] overflow-y-auto text-white">
        
        <!-- Close Button -->
        <button (click)="closeModal.emit()" 
                class="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                aria-label="Cerrar modal">
          <span class="material-icons text-xl">close</span>
        </button>

        <!-- Header -->
        <div class="text-center sm:text-left mb-6">
          <span class="text-xs font-bold uppercase tracking-widest text-[#C9A87C]">GUAYABERAS ALUM</span>
          <h2 class="text-2xl font-serif font-bold text-white mt-1">Guía Oficial de Tallas y Medidas</h2>
          <p class="text-xs sm:text-sm text-stone-300 mt-1">
            Nuestras guayaberas y prendas de lino están confeccionadas siguiendo el corte tradicional yucateco (holgado y cómodo).
          </p>
        </div>

        <!-- Unit Toggle -->
        <div class="flex items-center justify-center sm:justify-start gap-2 mb-6">
          <button (click)="unit.set('cm')" 
                  class="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                  [class]="unit() === 'cm' ? 'bg-[#00A7D4] text-white shadow-md' : 'bg-[#0D131A] text-stone-300 hover:bg-stone-800 border border-stone-700'">
            Centímetros (cm)
          </button>
          <button (click)="unit.set('in')" 
                  class="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                  [class]="unit() === 'in' ? 'bg-[#00A7D4] text-white shadow-md' : 'bg-[#0D131A] text-stone-300 hover:bg-stone-800 border border-stone-700'">
            Pulgadas (in)
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded-2xl border border-stone-800 mb-6 bg-[#0D131A]">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead class="bg-[#101720] text-[#C9A87C] font-serif border-b border-stone-800">
              <tr>
                <th class="p-3 font-bold">Talla</th>
                <th class="p-3 font-semibold">Pecho</th>
                <th class="p-3 font-semibold">Espalda</th>
                <th class="p-3 font-semibold">Largo</th>
                <th class="p-3 font-semibold">Cuello</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-800 font-sans text-stone-300">
              @if (unit() === 'cm') {
                <tr class="hover:bg-stone-900/50">
                  <td class="p-3 font-bold text-[#38C7EC]">S (36)</td>
                  <td class="p-3">104 - 108 cm</td>
                  <td class="p-3">44 cm</td>
                  <td class="p-3">72 cm</td>
                  <td class="p-3">38 - 39 cm</td>
                </tr>
                <tr class="hover:bg-stone-900/50">
                  <td class="p-3 font-bold text-[#38C7EC]">M (38)</td>
                  <td class="p-3">110 - 114 cm</td>
                  <td class="p-3">46 cm</td>
                  <td class="p-3">74 cm</td>
                  <td class="p-3">40 - 41 cm</td>
                </tr>
                <tr class="hover:bg-stone-900/50">
                  <td class="p-3 font-bold text-[#38C7EC]">L (40)</td>
                  <td class="p-3">116 - 120 cm</td>
                  <td class="p-3">48 cm</td>
                  <td class="p-3">76 cm</td>
                  <td class="p-3">42 - 43 cm</td>
                </tr>
                <tr class="hover:bg-stone-900/50">
                  <td class="p-3 font-bold text-[#38C7EC]">XL (42)</td>
                  <td class="p-3">122 - 126 cm</td>
                  <td class="p-3">50 cm</td>
                  <td class="p-3">78 cm</td>
                  <td class="p-3">44 - 45 cm</td>
                </tr>
                <tr class="hover:bg-stone-900/50">
                  <td class="p-3 font-bold text-[#38C7EC]">XXL (44)</td>
                  <td class="p-3">128 - 134 cm</td>
                  <td class="p-3">52 cm</td>
                  <td class="p-3">80 cm</td>
                  <td class="p-3">46 - 47 cm</td>
                </tr>
                <tr class="hover:bg-stone-900/50">
                  <td class="p-3 font-bold text-[#38C7EC]">3XL (46)</td>
                  <td class="p-3">136 - 142 cm</td>
                  <td class="p-3">54 cm</td>
                  <td class="p-3">82 cm</td>
                  <td class="p-3">48 - 49 cm</td>
                </tr>
              } @else {
                <tr class="hover:bg-stone-900/50">
                  <td class="p-3 font-bold text-[#38C7EC]">S (36)</td>
                  <td class="p-3">41 - 42.5 in</td>
                  <td class="p-3">17.3 in</td>
                  <td class="p-3">28.3 in</td>
                  <td class="p-3">15 in</td>
                </tr>
                <tr class="hover:bg-stone-900/50">
                  <td class="p-3 font-bold text-[#38C7EC]">M (38)</td>
                  <td class="p-3">43.3 - 44.8 in</td>
                  <td class="p-3">18.1 in</td>
                  <td class="p-3">29.1 in</td>
                  <td class="p-3">16 in</td>
                </tr>
                <tr class="hover:bg-stone-900/50">
                  <td class="p-3 font-bold text-[#38C7EC]">L (40)</td>
                  <td class="p-3">45.6 - 47.2 in</td>
                  <td class="p-3">18.9 in</td>
                  <td class="p-3">29.9 in</td>
                  <td class="p-3">16.5 in</td>
                </tr>
                <tr class="hover:bg-stone-900/50">
                  <td class="p-3 font-bold text-[#38C7EC]">XL (42)</td>
                  <td class="p-3">48.0 - 49.6 in</td>
                  <td class="p-3">19.7 in</td>
                  <td class="p-3">30.7 in</td>
                  <td class="p-3">17.5 in</td>
                </tr>
                <tr class="hover:bg-stone-900/50">
                  <td class="p-3 font-bold text-[#38C7EC]">XXL (44)</td>
                  <td class="p-3">50.3 - 52.7 in</td>
                  <td class="p-3">20.5 in</td>
                  <td class="p-3">31.5 in</td>
                  <td class="p-3">18.2 in</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Sizing Advice Tip -->
        <div class="bg-[#0D131A] p-4 rounded-2xl border border-[#AE875B]/30 flex items-start gap-3">
          <span class="material-icons text-[#C9A87C] text-xl flex-shrink-0">lightbulb</span>
          <div class="text-xs text-stone-300 space-y-1">
            <p><strong>¿Cómo medirte correctamente?</strong> Mide la circunferencia de tu pecho pasando la cinta métrica por debajo de las axilas y mantén 1 o 2 dedos de holgura para el confort del lino.</p>
            <!-- <p>Para pedidos especiales a la medida o novios, contáctanos directamente a nuestro taller en Tekit.</p> -->
          </div>
        </div>

        <div class="mt-6 text-center">
          <button (click)="closeModal.emit()" 
                  class="w-full sm:w-auto px-8 py-3 bg-[#AE875B] hover:bg-[#8F6A40] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md">
            Entendido
          </button>
        </div>

      </div>
    </div>
  `
})
export class SizeGuideModal {
  closeModal = output<void>();
  unit = signal<'cm' | 'in'>('cm');
}
