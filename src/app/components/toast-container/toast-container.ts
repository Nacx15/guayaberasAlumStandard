import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="pointer-events-auto flex items-center justify-between p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0"
             [class]="getToastClasses(toast.type)">
          <div class="flex items-center gap-3">
            @if (toast.type === 'success') {
              <span class="material-icons text-[#38C7EC] text-xl">check_circle</span>
            } @else if (toast.type === 'error') {
              <span class="material-icons text-rose-400 text-xl">error</span>
            } @else if (toast.type === 'warning') {
              <span class="material-icons text-amber-400 text-xl">warning</span>
            } @else {
              <span class="material-icons text-[#C9A87C] text-xl">info</span>
            }
            <p class="text-xs sm:text-sm font-medium text-white">{{ toast.text }}</p>
          </div>
          <button (click)="toastService.remove(toast.id)" 
                  class="text-stone-400 hover:text-white ml-2 p-1 focus:outline-none transition-colors"
                  aria-label="Cerrar">
            <span class="material-icons text-base">close</span>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainer {
  readonly toastService = inject(ToastService);

  getToastClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-[#151F2A] border-[#00A7D4]/40 text-white shadow-black/50';
      case 'error':
        return 'bg-[#151F2A] border-rose-500/40 text-white shadow-black/50';
      case 'warning':
        return 'bg-[#151F2A] border-amber-500/40 text-white shadow-black/50';
      default:
        return 'bg-[#151F2A] border-[#AE875B]/40 text-white shadow-black/50';
    }
  }
}
