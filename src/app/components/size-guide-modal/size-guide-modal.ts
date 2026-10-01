import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-size-guide-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-[#151F2A] rounded-3xl max-w-5xl w-full p-5 sm:p-8 border border-[#AE875B]/40 shadow-2xl relative max-h-[92vh] overflow-y-auto text-white">
        <button (click)="closeModal.emit()"
                class="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                aria-label="Cerrar modal">
          <span class="material-icons text-xl">close</span>
        </button>

        <div class="text-center sm:text-left mb-6 pr-10">
          <span class="text-xs font-bold uppercase tracking-widest text-[#C9A87C]">GUAYABERAS ALUM</span>
          <h2 class="text-2xl font-serif font-bold text-white mt-1">Tabla de Medidas</h2>
          <p class="text-xs sm:text-sm text-stone-300 mt-1">Consulta las medidas de la prenda y compáralas antes de seleccionar tu talla.</p>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-[#AE875B]/30 mb-6 bg-[#0D131A]">
          <table class="w-full min-w-[820px] text-center text-xs sm:text-sm">
            <thead>
              <tr class="bg-[#C9A87C] text-[#0D131A] uppercase">
                <th class="p-3 text-left">Medida</th>
                <th class="p-3">Talla 36</th>
                <th class="p-3">Talla 38</th>
                <th class="p-3">Talla 40</th>
                <th class="p-3">Talla 42</th>
                <th class="p-3">Talla 44</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-800 text-stone-200">
              @for (row of measurements; track row.label) {
                <tr class="hover:bg-white/[0.03] transition-colors">
                  <th class="p-3 text-left font-bold uppercase text-[#C9A87C] bg-[#101720]">{{ row.label }}</th>
                  @for (value of row.values; track $index) {
                    <td class="p-3">{{ value }}</td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="bg-[#0D131A] p-4 rounded-2xl border border-[#AE875B]/30 flex items-start gap-3">
          <span class="material-icons text-[#C9A87C] text-xl flex-shrink-0">straighten</span>
          <p class="text-xs text-stone-300"><strong class="text-white">Recomendación:</strong> compara estas medidas con una prenda que te quede cómoda. Las medidas corresponden a la prenda terminada.</p>
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

  readonly measurements = [
    { label: 'Largo de la prenda en centro trasero', values: ['69', '70', '71 1/2', '74', '77'] },
    { label: 'Ancho de pecho', values: ['111', '116', '121', '127', '134'] },
    { label: 'Ancho de cintura', values: ['107', '112', '117', '123', '129'] },
    { label: 'Ancho de cadera', values: ['111', '116', '121', '127', '134'] },
    { label: 'Largo manga corta', values: ['23 1/2', '24', '24 1/2', '25 3/4', '26 3/4'] },
    { label: 'Largo manga larga', values: ['61 1/4', '62 1/4', '63 1/4', '64 3/4', '64 3/4'] },
    { label: 'Largo de hombro a hombro', values: ['44 1/2', '46', '48 1/2', '51', '53'] },
    { label: 'Boca de manga corta', values: ['18 1/2', '19 1/4', '20', '21', '21 3/4'] }
  ];
}
