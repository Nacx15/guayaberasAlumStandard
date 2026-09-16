import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="group bg-[#151F2A] rounded-2xl border border-[#AE875B]/25 overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#AE875B]/70 transition-all duration-300 flex flex-col h-full">
      <!-- Image & Badges Container -->
      <div class="relative aspect-[4/5] bg-[#0D131A] overflow-hidden">
        <a [routerLink]="['/producto', product().id]" class="block w-full h-full">
          <img [src]="getImageUrl()" 
               [alt]="product().name"
               (error)="onImageError($event)"
               loading="lazy"
               class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />
        </a>

        <!-- Top Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          @if (product().departamento) {
            <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#00A7D4] text-white rounded-full shadow-sm">
              {{ product().departamento }}
            </span>
          }
          @if (product().manga) {
            <span class="px-2 py-0.5 text-[9px] font-semibold bg-[#0D131A]/90 backdrop-blur-sm text-stone-200 rounded-full border border-stone-700">
              {{ product().manga }}
            </span>
          }
          @if (product().ref_code) {
            <span class="px-2 py-0.5 text-[9px] font-mono font-semibold bg-[#AE875B]/90 text-white rounded-full shadow-xs">
              Ref: {{ product().ref_code }}
            </span>
          }
        </div>

        <!-- Wishlist Button -->
        <button (click)="toggleWishlist($event)"
                class="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#0D131A]/85 hover:bg-[#0D131A] text-stone-300 hover:text-rose-500 shadow-md flex items-center justify-center transition-all transform active:scale-90 z-10 border border-stone-700"
                [title]="isFavorite() ? 'Quitar de lista de deseos' : 'Guardar en lista de deseos'">
          <span class="material-icons text-xl" [class.text-rose-500]="isFavorite()">
            {{ isFavorite() ? 'favorite' : 'favorite_border' }}
          </span>
        </button>

        <!-- Stock Indicator Overlay Tag on top image bottom -->
        <div class="absolute left-3 bottom-3 z-10 pointer-events-none">
          @if (product().inStock) {
            <span class="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-600 rounded-full shadow-md backdrop-blur-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              En existencia ({{ product().totalStock }} pzas)
            </span>
          } @else {
            <span class="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-600 rounded-full shadow-md backdrop-blur-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Bajo Pedido
            </span>
          }
        </div>

        <!-- Quick View / Action Overlay on hover -->
        <div class="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 z-20">
          <a [routerLink]="['/producto', product().id]"
             class="flex-1 py-2.5 px-3 bg-[#0D131A]/95 hover:bg-[#090D12] text-white text-xs font-semibold text-center rounded-xl backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 border border-stone-700 shadow-md">
            <span class="material-icons text-sm">visibility</span>
            <span>Ver Detalle y Tallas</span>
          </a>
        </div>
      </div>

      <!-- Content Info -->
      <div class="p-5 flex flex-col flex-1 justify-between bg-[#151F2A]">
        <div>
          <div class="flex items-center justify-between gap-2 text-[11px] text-stone-400 mb-1.5">
            <span class="font-medium text-[#C9A87C] uppercase tracking-wider truncate">{{ product().embroideryType }}</span>
            <div class="flex items-center gap-1 text-amber-400 flex-shrink-0">
              <span class="material-icons text-xs">star</span>
              <span class="font-bold text-white">{{ product().rating }}</span>
              <span class="text-stone-400">({{ product().reviewsCount }})</span>
            </div>
          </div>

          <h3 class="font-serif font-bold text-base text-white group-hover:text-[#38C7EC] transition-colors line-clamp-1 mb-1">
            <a [routerLink]="['/producto', product().id]">
              {{ product().name }}
            </a>
          </h3>

          <!-- Sizes available chips -->
          <div class="flex items-center gap-1.5 flex-wrap my-2">
            <span class="text-[10px] text-stone-400 uppercase font-semibold">Tallas:</span>
            @for (sz of product().sizes.slice(0, 5); track sz) {
              <span class="px-1.5 py-0.5 text-[10px] font-mono bg-[#0D131A] text-stone-300 rounded border border-stone-700">
                {{ sz }}
              </span>
            }
            @if (product().sizes.length > 5) {
              <span class="text-[10px] text-stone-400">+{{ product().sizes.length - 5 }}</span>
            }
          </div>
        </div>

        <!-- Price & Action Section -->
        <div class="pt-3 border-t border-stone-800 space-y-2.5">
          <div class="flex items-center justify-between">
            @if (hasEcommercePrice()) {
              <!-- Available Ecommerce Price -->
              <div class="flex items-baseline gap-2">
                <span class="text-lg font-bold text-white font-sans">
                  \${{ product().price | number:'1.2-2' }} <span class="text-xs text-stone-400 font-normal">MXN</span>
                </span>
                @if (product().originalPrice) {
                  <span class="text-xs text-stone-400 line-through">
                    \${{ product().originalPrice | number:'1.2-2' }}
                  </span>
                }
              </div>
            } @else {
              <!-- Price Not Available (Consult via WhatsApp) -->
              <div class="flex flex-col">
                <span class="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1">
                  <span class="material-icons text-sm">info</span>
                  Precio no disponible
                </span>
                <span class="text-[10px] text-stone-400 font-medium">Consultar precio por WhatsApp</span>
              </div>
            }

            <!-- Color Dots with Hex Codes -->
            <div class="flex items-center -space-x-1.5">
              @for (color of product().colors.slice(0, 4); track color.name) {
                <span class="w-4 h-4 rounded-full border border-stone-600 shadow-sm"
                      [style.background-color]="color.hex"
                      [title]="color.name"></span>
              }
              @if (product().colors.length > 4) {
                <span class="text-[9px] text-stone-400 font-medium pl-2">+{{ product().colors.length - 4 }}</span>
              }
            </div>
          </div>

          <!-- WhatsApp Inquiry Button when price is not available -->
          @if (!hasEcommercePrice()) {
            <a [href]="getWhatsAppPriceUrl()"
               (click)="onWhatsAppClick($event)"
               target="_blank"
               rel="noopener"
               class="w-full py-2 px-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/70 text-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs">
              <span class="material-icons text-sm text-emerald-400">chat</span>
              <span>Preguntar precio por Whats</span>
            </a>
          }
        </div>
      </div>
    </article>
  `
})
export class ProductCard {
  product = input.required<Product>();

  private router = inject(Router);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  readonly isFavorite = computed(() => this.wishlistService.isInWishlist(this.product().id));
  readonly hasEcommercePrice = computed(() => {
    const p = Number(this.product().precio_ecommerce ?? this.product().price ?? 0);
    return !isNaN(p) && p > 0;
  });

  getImageUrl(): string {
    const p = this.product();
    if (p.images && p.images.length > 0 && p.images[0]) {
      return p.images[0];
    }
    return 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop';
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlistService.toggleWishlist(this.product());
  }

  getWhatsAppPriceUrl(): string {
    const p = this.product();
    const message = `Hola Guayaberas ALUM, me interesa saber el precio del modelo "${p.name}" (Ref: ${p.ref_code || p.id}, Depto: ${p.departamento || 'General'}). ¿Cuál es su precio y disponibilidad?`;
    return `https://wa.me/529971149132?text=${encodeURIComponent(message)}`;
  }

  onWhatsAppClick(event: Event): void {
    event.stopPropagation();
  }

  quickAdd(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const p = this.product();
    
    // Prevent adding if no ecommerce price
    if (p.precio_ecommerce <= 0) {
      this.router.navigate(['/producto', p.id]);
      return;
    }

    // Find first variant that has stock disponible > 0
    const inStockVariant = p.variantes?.find(v => v.stockDisponible > 0);
    if (inStockVariant) {
      this.cartService.addToCart(p, inStockVariant.talla, inStockVariant.color, 1);
    } else {
      this.router.navigate(['/producto', p.id]);
    }
  }
}
