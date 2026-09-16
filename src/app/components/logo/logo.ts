import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/" class="group flex flex-col items-center select-none text-center" [class]="containerClass()">
      @if (variant() === 'header') {
        <!-- Dedicated Header Vertical Lockup (Optimized to fit inside navbar heights) -->
        <span class="font-serif tracking-[0.24em] text-[8px] sm:text-[9px] uppercase font-bold transition-colors duration-200 leading-tight"
              [class]="isDark() ? 'text-[#F9F7F2] group-hover:text-[#00A7D4]' : 'text-[#0D131A] group-hover:text-[#AE875B]'">
          GUAYABERAS
        </span>

        <!-- Mayan Geometric Emblem -->
        <div class="my-0.5 sm:my-1 flex items-center justify-center relative w-7 h-5 sm:w-8 sm:h-6">
          <svg viewBox="0 0 100 80" class="w-full h-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Left Top Spiral Fret (Gold #AE875B) -->
            <path d="M12 12 H42 V38 H22 V22 H34 V30 H28" stroke="#AE875B" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>
            <!-- Right Top Spiral Fret (Gold #AE875B) -->
            <path d="M88 12 H58 V38 H78 V22 H66 V30 H72" stroke="#AE875B" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>
            
            <!-- Left Bottom Spiral Fret (Gold #AE875B) -->
            <path d="M12 68 H42 V42 H22 V58 H34 V50 H28" stroke="#AE875B" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>
            <!-- Right Bottom Spiral Fret (Gold #AE875B) -->
            <path d="M88 68 H58 V42 H78 V58 H66 V50 H72" stroke="#AE875B" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>
            
            <!-- Center Cross-stitch Lattice (Turquoise #00A7D4) -->
            <path d="M46 16 L54 24 M54 16 L46 24" stroke="#00A7D4" stroke-width="3" stroke-linecap="round"/>
            <path d="M43 28 L57 42 M57 28 L43 42" stroke="#00A7D4" stroke-width="3" stroke-linecap="round"/>
            <path d="M46 46 L54 54 M54 46 L46 54" stroke="#00A7D4" stroke-width="3" stroke-linecap="round"/>
            <path d="M48 60 L52 64 M52 60 L48 64" stroke="#00A7D4" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="50" cy="35" r="2.5" fill="#00A7D4" />
          </svg>
        </div>

        <!-- ALUM Main Wordmark -->
        <span class="font-display font-extrabold tracking-[0.22em] text-sm sm:text-base leading-none transition-colors"
              [class]="isDark() ? 'text-white group-hover:text-[#00A7D4]' : 'text-[#0D131A] group-hover:text-[#00A7D4]'">
          ALUM
        </span>

        <!-- Origin Subtitle -->
        <span class="text-[6.5px] sm:text-[7.5px] tracking-[0.16em] uppercase font-bold mt-0.5 leading-none"
              [class]="isDark() ? 'text-[#C9A87C]' : 'text-[#AE875B]'">
          HECHO EN TEKIT, YUC.
        </span>
      } @else if (variant() === 'full') {
        <!-- Full Brand Lockup for Footer and Standalone sections -->
        <span class="font-serif tracking-[0.25em] text-xs sm:text-sm uppercase font-semibold transition-colors duration-200"
              [class]="isDark() ? 'text-[#F9F7F2] group-hover:text-[#00A7D4]' : 'text-[#0D131A] group-hover:text-[#AE875B]'">
          GUAYABERAS
        </span>

        <!-- Mayan / Yucatecan Geometric Embroidery Center Icon -->
        <div class="my-1.5 flex items-center justify-center relative w-10 h-8 sm:w-12 sm:h-10">
          <svg viewBox="0 0 100 80" class="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12 H42 V38 H22 V22 H34 V30 H28" stroke="#AE875B" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter"/>
            <path d="M88 12 H58 V38 H78 V22 H66 V30 H72" stroke="#AE875B" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter"/>
            <path d="M12 68 H42 V42 H22 V58 H34 V50 H28" stroke="#AE875B" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter"/>
            <path d="M88 68 H58 V42 H78 V58 H66 V50 H72" stroke="#AE875B" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter"/>
            <path d="M46 16 L54 24 M54 16 L46 24" stroke="#00A7D4" stroke-width="3" stroke-linecap="round"/>
            <path d="M43 28 L57 42 M57 28 L43 42" stroke="#00A7D4" stroke-width="3" stroke-linecap="round"/>
            <path d="M46 46 L54 54 M54 46 L46 54" stroke="#00A7D4" stroke-width="3" stroke-linecap="round"/>
            <path d="M48 60 L52 64 M52 60 L48 64" stroke="#00A7D4" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="50" cy="35" r="2.5" fill="#00A7D4" />
          </svg>
        </div>

        <!-- ALUM Main Wordmark -->
        <span class="font-display font-extrabold tracking-[0.2em] text-lg sm:text-xl leading-none transition-colors"
              [class]="isDark() ? 'text-white group-hover:text-[#00A7D4]' : 'text-[#0D131A] group-hover:text-[#00A7D4]'">
          ALUM
        </span>

        <!-- Origin Subtitle -->
        <span class="text-[8px] sm:text-[9px] tracking-[0.18em] uppercase font-bold mt-1"
              [class]="isDark() ? 'text-[#C9A87C]' : 'text-[#AE875B]'">
          HECHO EN TEKIT, YUC.
        </span>
      } @else {
        <!-- Compact Horizontal Mode for Mobile/Compact bars -->
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 relative flex-shrink-0">
            <svg viewBox="0 0 100 80" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12 H42 V38 H22 V22 H34 V30 H28" stroke="#AE875B" stroke-width="4.5" stroke-linecap="square"/>
              <path d="M88 12 H58 V38 H78 V22 H66 V30 H72" stroke="#AE875B" stroke-width="4.5" stroke-linecap="square"/>
              <path d="M12 68 H42 V42 H22 V58 H34 V50 H28" stroke="#AE875B" stroke-width="4.5" stroke-linecap="square"/>
              <path d="M88 68 H58 V42 H78 V58 H66 V50 H72" stroke="#AE875B" stroke-width="4.5" stroke-linecap="square"/>
              <path d="M44 20 L56 32 M56 20 L44 32" stroke="#00A7D4" stroke-width="4"/>
              <path d="M44 48 L56 60 M56 48 L44 60" stroke="#00A7D4" stroke-width="4"/>
            </svg>
          </div>
          <div class="flex flex-col text-left">
            <span class="font-display font-bold tracking-wider text-sm leading-none"
                  [class]="isDark() ? 'text-white' : 'text-[#0D131A]'">
              GUAYABERAS <span class="text-[#00A7D4]">ALUM</span>
            </span>
            <span class="text-[7.5px] font-bold tracking-widest uppercase mt-0.5"
              [class]="isDark() ? 'text-[#AE875B]' : 'text-[#AE875B]'">
              TEKIT, YUCATÁN
            </span>
          </div>
        </div>
      }
    </a>
  `
})
export class Logo {
  variant = input<'full' | 'compact' | 'header'>('full');
  isDark = input<boolean>(true);
  containerClass = input<string>('');
}

