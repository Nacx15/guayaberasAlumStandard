import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Logo } from '../logo/logo';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Logo, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top Announcement Bar -->
    <!-- <div class="bg-[#090D12] text-[#F9F7F2] text-xs py-2 px-4 border-b border-[#AE875B]/30">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-[#00A7D4] animate-pulse"></span>
          <span class="tracking-wide text-stone-200">
            <strong class="text-white">Envío Gratis</strong> a todo México en compras mayores a $1,999 MXN
          </span>
        </div>
        <div class="flex items-center gap-4 text-stone-300 text-[11px] font-medium">
          <span class="flex items-center gap-1">
            <span class="material-icons text-xs text-[#AE875B]">place</span>
            Tekit, Yucatán (Capital de la Guayabera)
          </span>
          <a href="tel:9971149132" class="hover:text-[#00A7D4] transition-colors flex items-center gap-1 text-[#38C7EC]">
            <span class="material-icons text-xs text-[#00A7D4]">phone</span>
            997 114 9132
          </a>
        </div>
      </div>
    </div> -->

    <!-- Main Navigation Header -->
    <header class="sticky top-0 z-40 bg-[#0D131A]/95 backdrop-blur-md border-b border-[#AE875B]/30 transition-all duration-300 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20 sm:h-24">
          
          <!-- Mobile Menu Button -->
          <div class="flex items-center lg:hidden">
            <button (click)="toggleMobileMenu()"
                    class="p-2 text-[#F9F7F2] hover:text-[#00A7D4] focus:outline-none rounded-xl hover:bg-stone-800 transition-colors"
                    aria-label="Abrir menú">
              <span class="material-icons text-2xl">
                {{ mobileMenuOpen() ? 'close' : 'menu' }}
              </span>
            </button>
          </div>

          <!-- Desktop Navigation Left Links -->
          <nav class="hidden lg:flex items-center gap-8">
            <a routerLink="/" 
               routerLinkActive="text-[#00A7D4] font-semibold after:scale-x-100" 
               [routerLinkActiveOptions]="{ exact: true }"
               class="relative py-1 text-sm font-medium tracking-wide text-stone-200 hover:text-[#00A7D4] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00A7D4] after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
              Inicio
            </a>
            
            <a routerLink="/catalogo" 
               routerLinkActive="text-[#00A7D4] font-semibold after:scale-x-100"
               class="relative py-1 text-sm font-medium tracking-wide text-stone-200 hover:text-[#00A7D4] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00A7D4] after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
              Catálogo & Tienda
            </a>

            <a routerLink="/nosotros" 
               routerLinkActive="text-[#00A7D4] font-semibold after:scale-x-100"
               class="relative py-1 text-sm font-medium tracking-wide text-stone-200 hover:text-[#00A7D4] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00A7D4] after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
              Historia y Tradición
            </a>
          </nav>

          <!-- Center Brand Logo -->
          <div class="flex-shrink-0 flex items-center justify-center py-1">
            <app-logo [variant]="'header'" [isDark]="true"></app-logo>
          </div>

          <!-- Desktop Navigation Right Links & Actions -->
          <div class="flex items-center gap-3 sm:gap-6">
            
            <nav class="hidden lg:flex items-center gap-8 mr-2">
              <a routerLink="/servicios" 
                 routerLinkActive="text-[#00A7D4] font-semibold after:scale-x-100"
                 class="relative py-1 text-sm font-medium tracking-wide text-stone-200 hover:text-[#00A7D4] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00A7D4] after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
                Servicios y Mayoristas
              </a>

              <a routerLink="/contacto" 
                 routerLinkActive="text-[#00A7D4] font-semibold after:scale-x-100"
                 class="relative py-1 text-sm font-medium tracking-wide text-stone-200 hover:text-[#00A7D4] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00A7D4] after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
                Contacto & Taller
              </a>
            </nav>

            <!-- Search Button & Live Search Box -->            

            <!-- Wishlist Button with Dynamic Badge -->
            <a routerLink="/wishlist" 
               class="relative p-2 text-stone-200 hover:text-[#00A7D4] rounded-full hover:bg-stone-800 transition-colors"
               title="Lista de Deseos">
              <span class="material-icons text-xl sm:text-2xl">favorite_border</span>
              @if (wishlistService.totalWishlistCount() > 0) {
                <span class="absolute top-0 right-0 w-5 h-5 bg-[#00A7D4] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm transform scale-100 transition-transform">
                  {{ wishlistService.totalWishlistCount() }}
                </span>
              }
            </a>

            <!-- Cart Button with Dynamic Badge -->
            <a routerLink="/carrito" 
               class="relative p-2 text-stone-200 hover:text-[#AE875B] rounded-full hover:bg-stone-800 transition-colors"
               title="Carrito de Compras">
              <span class="material-icons text-xl sm:text-2xl">shopping_bag</span>
              @if (cartService.totalItemsCount() > 0) {
                <span class="absolute top-0 right-0 w-5 h-5 bg-[#AE875B] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm transform scale-100 transition-transform">
                  {{ cartService.totalItemsCount() }}
                </span>
              }
            </a>

          </div>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden bg-[#151F2A] border-b border-[#AE875B]/30 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div class="pt-2 pb-3 space-y-1">
            <a routerLink="/" 
               (click)="closeMobileMenu()"
               routerLinkActive="bg-[#0D131A] text-[#00A7D4] font-bold border-l-2 border-[#00A7D4]"
               [routerLinkActiveOptions]="{ exact: true }"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-stone-200 hover:bg-stone-800">
              <span class="material-icons text-xl text-[#AE875B]">home</span>
              Inicio
            </a>

            <a routerLink="/catalogo" 
               (click)="closeMobileMenu()"
               routerLinkActive="bg-[#0D131A] text-[#00A7D4] font-bold border-l-2 border-[#00A7D4]"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-stone-200 hover:bg-stone-800">
              <span class="material-icons text-xl text-[#AE875B]">storefront</span>
              Catálogo & Tienda
            </a>

            <a routerLink="/nosotros" 
               (click)="closeMobileMenu()"
               routerLinkActive="bg-[#0D131A] text-[#00A7D4] font-bold border-l-2 border-[#00A7D4]"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-stone-200 hover:bg-stone-800">
              <span class="material-icons text-xl text-[#AE875B]">history_edu</span>
              Historia y Tradición
            </a>

            <a routerLink="/servicios" 
               (click)="closeMobileMenu()"
               routerLinkActive="bg-[#0D131A] text-[#00A7D4] font-bold border-l-2 border-[#00A7D4]"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-stone-200 hover:bg-stone-800">
              <span class="material-icons text-xl text-[#AE875B]">design_services</span>
              Servicios y Mayoristas
            </a>

            <a routerLink="/contacto" 
               (click)="closeMobileMenu()"
               routerLinkActive="bg-[#0D131A] text-[#00A7D4] font-bold border-l-2 border-[#00A7D4]"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-stone-200 hover:bg-stone-800">
              <span class="material-icons text-xl text-[#AE875B]">place</span>
              Contacto & Ubicación
            </a>
          </div>

          <div class="pt-4 border-t border-stone-800 flex items-center justify-around text-center">
            <a routerLink="/wishlist" (click)="closeMobileMenu()" class="flex flex-col items-center gap-1 text-xs font-semibold text-stone-300 hover:text-white">
              <span class="material-icons text-[#00A7D4]">favorite</span>
              Favoritos ({{ wishlistService.totalWishlistCount() }})
            </a>
            <a routerLink="/carrito" (click)="closeMobileMenu()" class="flex flex-col items-center gap-1 text-xs font-semibold text-stone-300 hover:text-white">
              <span class="material-icons text-[#AE875B]">shopping_bag</span>
              Carrito ({{ cartService.totalItemsCount() }})
            </a>
            <a href="https://wa.me/529971149132" target="_blank" rel="noopener" class="flex flex-col items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
              <span class="material-icons">chat</span>
              WhatsApp
            </a>
          </div>
        </div>
      }
    </header>
  `
})
export class Header {
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  readonly productService = inject(ProductService);
  private router = inject(Router);

  mobileMenuOpen = signal(false);
  searchOpen = signal(false);
  searchQuery = signal('');
  searchResults = signal<Product[]>([]);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleSearchBox(): void {
    this.searchOpen.update(v => !v);
    if (!this.searchOpen()) {
      this.searchQuery.set('');
      this.searchResults.set([]);
    }
  }

  closeSearch(): void {
    this.searchOpen.set(false);
    this.searchQuery.set('');
    this.searchResults.set([]);
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchQuery.set(query);
    if (query.length < 2) {
      this.searchResults.set([]);
      return;
    }

    const all = this.productService.getProducts();
    const filtered = all.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.fabric.toLowerCase().includes(query) ||
      p.embroideryType.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.shortDescription.toLowerCase().includes(query)
    ).slice(0, 4);

    this.searchResults.set(filtered);
  }

  executeSearch(query: string): void {
    if (!query.trim()) return;
    this.closeSearch();
    this.router.navigate(['/catalogo'], { queryParams: { q: query.trim() } });
  }
}
