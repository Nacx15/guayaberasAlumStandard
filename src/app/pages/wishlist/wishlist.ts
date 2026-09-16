import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-[#0D131A] text-[#F9F7F2] py-8 sm:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Breadcrumb & Header -->
        <nav class="flex items-center gap-2 text-xs text-stone-400 mb-4 font-medium">
          <a routerLink="/" class="hover:text-[#38C7EC]">Inicio</a>
          <span>/</span>
          <span class="text-[#C9A87C] font-bold">Mi Lista de Deseos</span>
        </nav>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="font-serif text-3xl sm:text-4xl font-bold text-white">
              Prendas Guardadas
            </h1>
            <p class="text-xs sm:text-sm text-stone-300 mt-1 font-sans">
              Tienes <strong class="text-[#38C7EC]">{{ wishlistService.totalWishlistCount() }}</strong> prendas artesanales en tu lista de deseos.
            </p>
          </div>

          @if (wishlistService.totalWishlistCount() > 0) {
            <button (click)="wishlistService.clearWishlist()" 
                    class="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors">
              <span class="material-icons text-sm">delete_outline</span>
              Vaciar lista de deseos
            </button>
          }
        </div>

        @if (wishlistService.totalWishlistCount() > 0) {
          <!-- Grid of Saved Items -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (item of wishlistService.items(); track item.product.id) {
              <div class="bg-[#151F2A] rounded-3xl border border-[#AE875B]/30 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                
                <div class="relative aspect-[4/5] bg-stone-900 overflow-hidden">
                  <a [routerLink]="['/producto', item.product.id]">
                    <img [src]="item.product.images[0]" [alt]="item.product.name" class="w-full h-full object-cover" />
                  </a>

                  <button (click)="wishlistService.removeFromWishlist(item.product.id)"
                          class="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0D131A]/90 hover:bg-[#0D131A] text-rose-400 border border-stone-700 shadow-md flex items-center justify-center transition-colors"
                          title="Eliminar de favoritos">
                    <span class="material-icons text-base">close</span>
                  </button>
                </div>

                <div class="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-[#C9A87C]">
                      {{ item.product.embroideryType }}
                    </span>
                    <h3 class="font-serif font-bold text-base text-white mt-1 line-clamp-1">
                      <a [routerLink]="['/producto', item.product.id]" class="hover:text-[#38C7EC]">
                        {{ item.product.name }}
                      </a>
                    </h3>
                    <p class="text-xs text-stone-300 mt-1 line-clamp-2 font-sans">
                      {{ item.product.shortDescription }}
                    </p>
                    @if (hasEcommercePrice(item.product)) {
                      <p class="text-base font-bold text-white mt-3 font-sans">
                        \${{ item.product.price | number:'1.2-2' }} MXN
                      </p>
                    } @else {
                      <p class="text-xs font-bold text-amber-400 mt-3 font-sans flex items-center gap-1">
                        <span class="material-icons text-sm">info</span>
                        Precio no disponible (WhatsApp)
                      </p>
                    }
                  </div>

                  <div class="mt-4 pt-3 border-t border-stone-800 flex items-center gap-2">
                    <!-- <button (click)="moveToCart(item.product)"
                            class="flex-1 py-2.5 px-3 bg-[#00A7D4] hover:bg-[#008AA0] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md">
                      <span class="material-icons text-sm">shopping_bag</span>
                      Mover al Carrito
                    </button> -->                    
                    <!-- <a [routerLink]="['/producto', item.product.id]"
                       class="p-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl transition-colors border border-stone-700"
                       title="Ver Detalle">
                      <span class="material-icons text-sm">visibility</span>                      
                    </a> -->
                    <a [routerLink]="['/producto', item.product.id]"
                      class="flex-1 py-2.5 px-3 bg-[#0D131A]/95 hover:bg-[#090D12] text-white text-xs font-semibold text-center rounded-xl backdrop-blur-md transition-colors flex items-center justify-center gap-1 border border-stone-700">
                      <span class="material-icons text-sm">visibility</span>
                      Ver Tallas & Colores
                    </a>
                  </div>
                </div>

              </div>
            }
          </div>
        } @else {
          <!-- Empty State -->
          <div class="bg-[#151F2A] rounded-3xl p-12 sm:p-16 text-center border border-[#AE875B]/30 shadow-2xl max-w-lg mx-auto space-y-4">
            <div class="w-16 h-16 rounded-full bg-[#00A7D4]/20 text-[#38C7EC] flex items-center justify-center mx-auto border border-[#00A7D4]/30">
              <span class="material-icons text-3xl">favorite_border</span>
            </div>
            <h2 class="font-serif font-bold text-2xl text-white">Tu lista de deseos está vacía</h2>
            <p class="text-xs sm:text-sm text-stone-300 max-w-xs mx-auto font-sans">
              Explora nuestro catálogo de lino yucateco y guarda tus modelos favoritos para revisarlos después.
            </p>
            <div class="pt-2">
              <a routerLink="/catalogo" 
                 class="inline-flex items-center gap-2 px-8 py-3.5 bg-[#AE875B] hover:bg-[#8F6A40] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xl transition-all">
                <span class="material-icons text-base">storefront</span>
                Explorar Catálogo
              </a>
            </div>
          </div>
        }

      </div>
    </main>
  `
})
export class Wishlist {
  readonly wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  hasEcommercePrice(prod: Product): boolean {
    const p = Number(prod.precio_ecommerce ?? prod.price ?? 0);
    return !isNaN(p) && p > 0;
  }

  moveToCart(product: Product): void {
    if (!this.hasEcommercePrice(product)) return;
    const size = product.sizes[1] || product.sizes[0] || 'M';
    const color = product.colors[0]?.name || 'Lino Blanco';
    this.cartService.addToCart(product, size, color, 1);
    this.wishlistService.removeFromWishlist(product.id);
  }
}
