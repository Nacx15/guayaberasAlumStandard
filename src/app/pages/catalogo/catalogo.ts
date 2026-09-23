import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCard } from '../../components/product-card/product-card';
import { ApiColor, ApiDepartamento, ApiManga, Product, ProductVariant } from '../../models/product.model';
import { ShippingPromo } from '../../components/shipping-promo/shipping-promo';

@Component({
  selector: 'app-catalogo',
  imports: [RouterLink, ProductCard, DecimalPipe, ShippingPromo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-[#0D131A] text-[#F9F7F2] py-6 sm:py-10">
      <app-shipping-promo></app-shipping-promo>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Breadcrumbs & Heading -->
        <div class="mb-6 sm:mb-8">
          <nav class="flex items-center gap-2 text-xs text-stone-400 mb-2 font-medium">
            <a routerLink="/" class="hover:text-[#00A7D4] transition-colors">Inicio</a>
            <span>/</span>
            <span class="text-[#C9A87C] font-bold">Catálogo & Tienda Oficial</span>
          </nav>
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div class="flex items-center gap-3">
                <h1 class="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Catálogo y Tienda
                </h1>
                
                <!-- Live API Connection Pill -->
                <!-- <button (click)="syncApi()" 
                        [title]="'Endpoint: ' + productService.ENDPOINT_URL + ' - Clic para sincronizar'"
                        class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all border shadow-xs"
                        [class]="productService.apiStatus() === 'connected' 
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900' 
                          : 'bg-[#151F2A] text-stone-300 border-stone-700 hover:border-[#AE875B]'">
                  <span class="w-2 h-2 rounded-full"
                        [class]="productService.apiStatus() === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'"></span>
                  <span>{{ productService.apiStatus() === 'connected' ? 'API Conectada' : 'Datos Sincronizados' }}</span>
                  <span class="material-icons text-xs" [class.animate-spin]="productService.isLoading()">sync</span>
                </button> -->
              </div>

              <p class="text-xs sm:text-sm text-stone-400 mt-1 font-sans">
                Confección artesanal en Tekit, Yucatán • Existencias validadas en tiempo real.
              </p>
            </div>

            <!-- Desktop Sorting Dropdown & Sync Button -->
            <div class="flex items-center gap-3">
              <!-- <button (click)="syncApi()"
                      class="sm:hidden px-3 py-2 bg-[#151F2A] border border-[#AE875B]/40 rounded-xl text-xs font-semibold text-stone-300 flex items-center gap-1">
                <span class="material-icons text-sm" [class.animate-spin]="productService.isLoading()">sync</span>
                <span>API</span>
              </button> -->

              <label for="catalog-sort" class="text-xs font-semibold text-stone-300 whitespace-nowrap hidden sm:block">Ordenar por:</label>
              <select id="catalog-sort"
                      (change)="onSortChange($event)"
                      [value]="sortBy()"
                      class="px-3 py-2 bg-[#151F2A] border border-[#AE875B]/40 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#00A7D4] shadow-md">
                <option value="featured" class="bg-[#151F2A] text-white">Destacados ALUM</option>
                <option value="stock-desc" class="bg-[#151F2A] text-white">Mayor Existencia en Bodega</option>
                <option value="price-asc" class="bg-[#151F2A] text-white">Precio: Menor a Mayor</option>
                <option value="price-desc" class="bg-[#151F2A] text-white">Precio: Mayor a Menor</option>
                <option value="name-asc" class="bg-[#151F2A] text-white">Nombre (A - Z)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- TABLET & MOBILE FILTER TOGGLE BAR -->
        <div class="lg:hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <button (click)="openMobileFilters()"
                  class="flex items-center justify-center gap-2 px-4 py-3 bg-[#151F2A] border border-[#AE875B]/40 rounded-2xl text-xs font-bold text-white shadow-md hover:border-[#00A7D4] active:scale-[0.99] transition-all">
            <span class="material-icons text-base text-[#C9A87C]">tune</span>
            <span>Filtros (Depto, Talla, Color, Manga, Stock)</span>
            @if (activeFiltersCount() > 0) {
              <span class="px-2 py-0.5 rounded-full bg-[#00A7D4] text-white text-[10px] font-bold">
                {{ activeFiltersCount() }}
              </span>
            }
          </button>

          <div class="flex items-center justify-between sm:justify-end gap-3 text-xs text-stone-400">
            <span>{{ filteredProducts().length }} {{ filteredProducts().length === 1 ? 'modelo' : 'modelos' }}</span>
            <button (click)="toggleOnlyInStock()"
                    class="px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors"
                    [class]="onlyInStock() ? 'bg-emerald-950 border-emerald-600 text-emerald-300' : 'bg-[#151F2A] border-stone-700 text-stone-300'">
              {{ onlyInStock() ? '✓ Con Existencia' : 'Todas' }}
            </button>
          </div>
        </div>

        <!-- ACTIVE FILTER PILLS (Removable) -->
        @if (hasActiveFilters()) {
          <div class="flex flex-wrap items-center gap-2 mb-6 p-3 bg-[#151F2A] rounded-2xl border border-stone-800 text-xs shadow-md">
            <span class="font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1 mr-1">
              <span class="material-icons text-xs text-[#C9A87C]">filter_alt</span>
              Filtros activos:
            </span>

            @if (selectedDepartment() !== 'all') {
              <button (click)="selectedDepartment.set('all')"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00A7D4]/20 text-[#38C7EC] font-semibold text-[11px] hover:bg-[#00A7D4]/30 transition-colors border border-[#00A7D4]/30">
                <span>Depto: {{ getDepartmentName(selectedDepartment()) }}</span>
                <span class="material-icons text-xs">close</span>
              </button>
            }

            @if (selectedManga() !== 'all') {
              <button (click)="selectedManga.set('all')"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#AE875B]/20 text-[#C9A87C] font-semibold text-[11px] hover:bg-[#AE875B]/30 transition-colors border border-[#AE875B]/30">
                <span>Manga: {{ selectedManga() }}</span>
                <span class="material-icons text-xs">close</span>
              </button>
            }

            @if (selectedColor() !== 'all') {
              <button (click)="selectedColor.set('all')"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 text-stone-200 font-semibold text-[11px] hover:bg-stone-700 transition-colors border border-stone-700">
                <span>Color: {{ selectedColor() }}</span>
                <span class="material-icons text-xs">close</span>
              </button>
            }

            @if (selectedSize() !== 'all') {
              <button (click)="selectedSize.set('all')"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 text-stone-200 font-semibold text-[11px] hover:bg-stone-700 transition-colors border border-stone-700">
                <span>Talla: {{ selectedSize() }}</span>
                <span class="material-icons text-xs">close</span>
              </button>
            }

            @if (onlyInStock()) {
              <button (click)="onlyInStock.set(false)"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700 font-semibold text-[11px] hover:bg-emerald-900 transition-colors">
                <span>Solo con Existencia</span>
                <span class="material-icons text-xs">close</span>
              </button>
            }

            @if (isPriceFilterActive()) {
              <button (click)="maxPriceFilter.set(null)"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 text-stone-200 font-semibold text-[11px] border border-stone-700">
                <span>Máx: \${{ effectiveMaxPrice() | number:'1.0-0' }} MXN</span>
                <span class="material-icons text-xs">close</span>
              </button>
            }

            @if (searchFilter().trim().length > 0) {
              <button (click)="searchFilter.set('')"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 text-stone-200 font-semibold text-[11px] hover:bg-stone-700 transition-colors border border-stone-700">
                <span>"{{ searchFilter() }}"</span>
                <span class="material-icons text-xs">close</span>
              </button>
            }

            <button (click)="resetFilters()"
                    class="text-[11px] font-bold text-[#00A7D4] hover:underline ml-auto">
              Limpiar todos
            </button>
          </div>
        }

        <!-- MAIN LAYOUT: Sidebar Filters & Products Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          <!-- DESKTOP FILTERS SIDEBAR -->
          <aside class="hidden lg:block lg:col-span-1">
            <div class="sticky top-28 bg-[#151F2A] p-5 rounded-3xl border border-[#AE875B]/30 shadow-xl space-y-5">
              
              <!-- Header -->
              <div class="flex items-center justify-between pb-3 border-b border-stone-800">
                <h2 class="font-serif font-bold text-base text-white flex items-center gap-2">
                  <span class="material-icons text-sm text-[#C9A87C]">tune</span>
                  Filtros Dinámicos
                  @if (activeFiltersCount() > 0) {
                    <span class="px-2 py-0.5 rounded-full bg-[#00A7D4] text-white text-[10px] font-bold">
                      {{ activeFiltersCount() }}
                    </span>
                  }
                </h2>
                @if (hasActiveFilters()) {
                  <button (click)="resetFilters()" class="text-[11px] font-bold text-[#00A7D4] hover:underline">
                    Limpiar
                  </button>
                }
              </div>

              <!-- Search -->
              <div>
                <label for="catalog-search" class="block text-xs font-bold text-stone-200 mb-1.5 uppercase tracking-wider">Buscar Prenda</label>
                <div class="relative">
                  <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
                  <input id="catalog-search"
                         type="text"
                         [value]="searchFilter()"
                         (input)="updateSearch($event)"
                         placeholder="Nombre, ref, SKU..."
                         class="w-full pl-9 pr-3 py-2 bg-[#0D131A] border border-stone-700 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#00A7D4]" />
                </div>
              </div>

              <!-- 1. Stock / Existencias Filter Switch -->
              <div class="p-3 bg-[#0D131A] rounded-2xl border border-stone-800">
                <label class="flex items-center justify-between cursor-pointer">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="text-xs font-bold text-stone-200">Solo con Existencia</span>
                  </div>
                  <input type="checkbox"
                         [checked]="onlyInStock()"
                         (change)="toggleOnlyInStock()"
                         class="w-4 h-4 accent-[#00A7D4] rounded cursor-pointer" />
                </label>
                <p class="text-[10px] text-stone-400 mt-1">Filtra prendas con piezas disponibles en bodega.</p>
              </div>

              <!-- 2. Departamentos Filter -->
              <div class="space-y-1.5">
                <span class="block text-xs font-bold text-stone-200 uppercase tracking-wider">Departamento</span>
                <div class="space-y-1">
                  <button (click)="selectedDepartment.set('all')"
                          class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left"
                          [class]="selectedDepartment() === 'all' ? 'bg-[#00A7D4]/20 text-[#38C7EC] font-bold border border-[#00A7D4]/40' : 'text-stone-300 hover:bg-[#0D131A]'">
                    <span>Todos los Departamentos</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-[#0D131A] text-stone-400">
                      {{ allProducts().length }}
                    </span>
                  </button>

                  @for (dept of availableDepartments(); track dept.name) {
                    <button (click)="selectedDepartment.set(dept.name)"
                            class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left"
                            [class]="selectedDepartment() === dept.name ? 'bg-[#00A7D4]/20 text-[#38C7EC] font-bold border border-[#00A7D4]/40' : 'text-stone-300 hover:bg-[#0D131A]'">
                      <span>{{ dept.name }}</span>
                      <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-[#0D131A] text-stone-400">
                        {{ getDepartmentCount(dept.name) }}
                      </span>
                    </button>
                  }
                </div>
              </div>

              <!-- 3. Tipos de Manga Filter -->
              @if (availableMangas().length > 0) {
                <div class="space-y-1.5 pt-2 border-t border-stone-800">
                  <span class="block text-xs font-bold text-stone-200 uppercase tracking-wider">Tipo de Manga</span>
                  <div class="grid grid-cols-2 gap-1.5">
                    <button (click)="selectedManga.set('all')"
                            class="py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center transition-colors"
                            [class]="selectedManga() === 'all' ? 'bg-[#AE875B] text-white' : 'bg-[#0D131A] text-stone-300 hover:bg-stone-800 border border-stone-700'">
                      Todas
                    </button>
                    @for (manga of availableMangas(); track manga.name) {
                      <button (click)="toggleManga(manga.name)"
                              class="py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center transition-colors truncate"
                              [class]="selectedManga() === manga.name ? 'bg-[#AE875B] text-white' : 'bg-[#0D131A] text-stone-300 hover:bg-stone-800 border border-stone-700'">
                        {{ manga.name }}
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- 4. Colores Filter (Visual Swatches) -->
              <div class="space-y-1.5 pt-2 border-t border-stone-800">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-stone-200 uppercase tracking-wider">Color</span>
                  @if (selectedColor() !== 'all') {
                    <button (click)="selectedColor.set('all')" class="text-[10px] text-[#00A7D4] hover:underline">Todos</button>
                  }
                </div>
                <div class="flex flex-wrap gap-2 pt-1">
                  @for (col of availableColors(); track col.name) {
                    <button (click)="toggleColor(col.name)"
                            class="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border"
                            [class]="selectedColor() === col.name 
                              ? 'bg-[#00A7D4]/20 border-[#00A7D4] text-[#38C7EC] ring-1 ring-[#00A7D4]' 
                              : 'bg-[#0D131A] border-stone-700 text-stone-300 hover:border-stone-500'">
                      <span class="w-3 h-3 rounded-full border border-stone-600 shadow-2xs"
                            [style.background-color]="col.hex_code"></span>
                      <span>{{ col.name }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- 5. Tallas Filter -->
              <div class="space-y-1.5 pt-2 border-t border-stone-800">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-stone-200 uppercase tracking-wider">Talla</span>
                  @if (selectedSize() !== 'all') {
                    <button (click)="selectedSize.set('all')" class="text-[10px] text-[#00A7D4] hover:underline">Todas</button>
                  }
                </div>
                <div class="grid grid-cols-4 gap-1.5 pt-1">
                  @for (sz of availableSizeNames(); track sz) {
                    <button (click)="toggleSize(sz)"
                            class="py-1.5 text-xs font-mono font-bold rounded-lg border transition-all"
                            [class]="selectedSize() === sz 
                              ? 'bg-[#00A7D4] text-white border-[#00A7D4] shadow-md' 
                              : 'bg-[#0D131A] text-stone-300 border-stone-700 hover:border-[#AE875B]'">
                      {{ sz }}
                    </button>
                  }
                </div>
              </div>

              <!-- 6. Price Range Filter -->
              @if (priceBounds().max > 0) {
                <div class="space-y-1.5 pt-2 border-t border-stone-800">
                  <div class="flex items-center justify-between text-xs font-bold text-stone-200 uppercase tracking-wider">
                    <label for="price-range">Precio Máximo</label>
                    <span class="text-[#C9A87C] font-bold">\${{ effectiveMaxPrice() | number:'1.0-0' }} MXN</span>
                  </div>
                  <input id="price-range"
                         type="range"
                         [min]="priceBounds().min"
                         [max]="priceBounds().max"
                         [step]="priceStep()"
                         [value]="effectiveMaxPrice()"
                         [disabled]="priceBounds().min === priceBounds().max"
                         (input)="updateMaxPrice($event)"
                         class="w-full accent-[#00A7D4] cursor-pointer disabled:opacity-50 disabled:cursor-default" />
                  <div class="flex justify-between text-[10px] text-stone-400">
                    <span>\${{ priceBounds().min | number:'1.0-0' }} MXN</span>
                    <span>\${{ priceBounds().max | number:'1.0-0' }} MXN</span>
                  </div>
                </div>
              }

            </div>
          </aside>

          <!-- PRODUCTS GRID -->
          <div class="lg:col-span-3 space-y-6">
            
            <!-- Result Summary Bar -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#151F2A] px-4 py-3 rounded-2xl border border-stone-800 text-xs text-stone-400 shadow-md gap-2">
              <p>
                Mostrando <strong class="text-white">{{ filteredProducts().length }}</strong> prendas en catálogo
                @if (onlyInStock()) {
                  <span class="text-emerald-400 font-semibold ml-1">• (Solo con existencia)</span>
                }
              </p>

              <div class="flex items-center gap-2">
                @if (selectedDepartment() !== 'all') {
                  <span class="px-2 py-0.5 rounded-md bg-[#00A7D4]/20 text-[#38C7EC] font-semibold uppercase text-[10px] border border-[#00A7D4]/30">
                    {{ selectedDepartment() }}
                  </span>
                }
                @if (selectedManga() !== 'all') {
                  <span class="px-2 py-0.5 rounded-md bg-[#AE875B]/20 text-[#C9A87C] font-semibold text-[10px] border border-[#AE875B]/30">
                    {{ selectedManga() }}
                  </span>
                }
              </div>
            </div>

            <!-- Loading Spinner State -->
            @if (productService.isLoading()) {
              <div class="bg-[#151F2A] rounded-3xl p-12 text-center border border-stone-800 space-y-3">
                <span class="material-icons text-3xl text-[#00A7D4] animate-spin">sync</span>
                <!-- <p class="text-xs text-stone-300">Consultando {{ productService.ENDPOINT_URL }}...</p> -->
                <p class="text-xs text-stone-300">Consultando</p>

              </div>
            } @else if (filteredProducts().length > 0) {
              <!-- Active Products Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                @for (product of filteredProducts(); track product.id) {
                  <app-product-card [product]="product"></app-product-card>
                }
              </div>
            } @else {
              <!-- Empty state -->
              <div class="bg-[#151F2A] rounded-3xl p-12 text-center border border-stone-800 space-y-4 shadow-xl">
                <div class="w-16 h-16 rounded-full bg-[#0D131A] text-stone-400 flex items-center justify-center mx-auto border border-stone-700">
                  <span class="material-icons text-3xl">search_off</span>
                </div>
                <h3 class="font-serif font-bold text-xl text-white">No se encontraron productos con estos filtros</h3>
                <p class="text-xs sm:text-sm text-stone-400 max-w-sm mx-auto font-sans">
                  Intenta cambiar el departamento, talla, color o desactiva el filtro de existencias para ver todo el catálogo.
                </p>
                <button (click)="resetFilters()" 
                        class="px-6 py-2.5 bg-[#00A7D4] text-white text-xs font-bold rounded-xl hover:bg-[#008AA0] transition-colors shadow-md">
                  Ver Todos los Productos
                </button>
              </div>
            }

          </div>

        </div>

      </div>
    </main>

    <!-- MOBILE OFF-CANVAS SIDEBAR DRAWER -->
    @if (mobileFiltersOpen()) {
      <div class="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros del catálogo">
        <!-- Dark Blur Backdrop -->
        <button type="button" 
                aria-label="Cerrar filtros"
                class="fixed inset-0 bg-[#0D131A]/80 backdrop-blur-sm transition-opacity w-full h-full border-none cursor-default"
                (click)="closeMobileFilters()"></button>

        <!-- Sidebar Drawer Container -->
        <div class="fixed inset-y-0 left-0 max-w-sm w-[88vw] bg-[#151F2A] text-white border-r border-[#AE875B]/30 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out">
          
          <!-- Drawer Header -->
          <div class="p-5 border-b border-stone-800 flex items-center justify-between bg-[#0D131A]">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-[#AE875B]/20 text-[#C9A87C] flex items-center justify-center border border-[#AE875B]/30">
                <span class="material-icons text-base">tune</span>
              </span>
              <div>
                <h3 class="font-serif font-bold text-base text-white">Filtros del Catálogo</h3>
                <p class="text-[11px] text-stone-400">Departamentos, tallas, colores y existencias</p>
              </div>
            </div>
            
            <button (click)="closeMobileFilters()"
                    class="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                    aria-label="Cerrar filtros">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <!-- Drawer Body (Scrollable) -->
          <div class="flex-1 overflow-y-auto p-5 space-y-6 overscroll-contain">
            
            <!-- Live Search -->
            <div>
              <label for="mobile-drawer-search" class="block text-xs font-bold text-stone-200 mb-2 uppercase tracking-wider">Buscar Prenda</label>
              <div class="relative">
                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
                <input id="mobile-drawer-search"
                       type="text"
                       [value]="searchFilter()"
                       (input)="updateSearch($event)"
                       placeholder="Nombre, ref, SKU..."
                       class="w-full pl-9 pr-3 py-2.5 bg-[#0D131A] border border-stone-700 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#00A7D4]" />
              </div>
            </div>

            <!-- Only in stock switch -->
            <div class="p-3 bg-[#0D131A] rounded-2xl border border-stone-800">
              <label class="flex items-center justify-between cursor-pointer">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="text-xs font-bold text-stone-200">Solo con Existencia</span>
                </div>
                <input type="checkbox"
                       [checked]="onlyInStock()"
                       (change)="toggleOnlyInStock()"
                       class="w-4 h-4 accent-[#00A7D4] rounded cursor-pointer" />
              </label>
            </div>

            <!-- Departamentos -->
            <div class="space-y-2">
              <span class="block text-xs font-bold text-stone-200 uppercase tracking-wider">Departamento</span>
              <div class="space-y-1">
                <button (click)="selectedDepartment.set('all')"
                        class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left"
                        [class]="selectedDepartment() === 'all' ? 'bg-[#00A7D4]/20 text-[#38C7EC] font-bold border border-[#00A7D4]/40' : 'text-stone-300 hover:bg-[#0D131A]'">
                  <span>Todos</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#0D131A] text-stone-400 font-semibold">
                    {{ allProducts().length }}
                  </span>
                </button>

                @for (dept of availableDepartments(); track dept.name) {
                  <button (click)="selectedDepartment.set(dept.name)"
                          class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left"
                          [class]="selectedDepartment() === dept.name ? 'bg-[#00A7D4]/20 text-[#38C7EC] font-bold border border-[#00A7D4]/40' : 'text-stone-300 hover:bg-[#0D131A]'">
                    <span>{{ dept.name }}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#0D131A] text-stone-400 font-semibold">
                      {{ getDepartmentCount(dept.name) }}
                    </span>
                  </button>
                }
              </div>
            </div>

            <!-- Tipos de Manga -->
            @if (availableMangas().length > 0) {
              <div class="space-y-2 pt-3 border-t border-stone-800">
                <span class="block text-xs font-bold text-stone-200 uppercase tracking-wider">Tipo de Manga</span>
                <div class="grid grid-cols-2 gap-2">
                  <button (click)="selectedManga.set('all')"
                          class="py-2 px-2 text-xs font-semibold text-center rounded-xl transition-colors"
                          [class]="selectedManga() === 'all' ? 'bg-[#AE875B] text-white' : 'bg-[#0D131A] text-stone-300 border border-stone-700'">
                    Todas
                  </button>
                  @for (manga of availableMangas(); track manga.name) {
                    <button (click)="toggleManga(manga.name)"
                            class="py-2 px-2 text-xs font-semibold text-center rounded-xl transition-colors truncate"
                            [class]="selectedManga() === manga.name ? 'bg-[#AE875B] text-white' : 'bg-[#0D131A] text-stone-300 border border-stone-700'">
                      {{ manga.name }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Colores -->
            <div class="space-y-2 pt-3 border-t border-stone-800">
              <span class="block text-xs font-bold text-stone-200 uppercase tracking-wider">Color</span>
              <div class="flex flex-wrap gap-2">
                @for (col of availableColors(); track col.name) {
                  <button (click)="toggleColor(col.name)"
                          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
                          [class]="selectedColor() === col.name 
                            ? 'bg-[#00A7D4]/20 border-[#00A7D4] text-[#38C7EC]' 
                            : 'bg-[#0D131A] border-stone-700 text-stone-300'">
                    <span class="w-3.5 h-3.5 rounded-full border border-stone-600"
                          [style.background-color]="col.hex_code"></span>
                    <span>{{ col.name }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- Tallas -->
            <div class="space-y-2 pt-3 border-t border-stone-800">
              <span class="block text-xs font-bold text-stone-200 uppercase tracking-wider">Talla</span>
              <div class="grid grid-cols-4 gap-2">
                @for (sz of availableSizeNames(); track sz) {
                  <button (click)="toggleSize(sz)"
                          class="py-2 text-xs font-mono font-bold rounded-xl border transition-all"
                          [class]="selectedSize() === sz ? 'bg-[#00A7D4] text-white border-[#00A7D4]' : 'bg-[#0D131A] text-stone-300 border-stone-700'">
                    {{ sz }}
                  </button>
                }
              </div>
            </div>

            <!-- Price Range -->
            @if (priceBounds().max > 0) {
              <div class="space-y-2 pt-3 border-t border-stone-800">
                <div class="flex items-center justify-between text-xs font-bold text-stone-200 uppercase tracking-wider">
                  <label for="mobile-drawer-price">Precio Máximo</label>
                  <span class="text-[#C9A87C] font-bold">\${{ effectiveMaxPrice() | number:'1.0-0' }} MXN</span>
                </div>
                <input id="mobile-drawer-price"
                       type="range"
                       [min]="priceBounds().min"
                       [max]="priceBounds().max"
                       [step]="priceStep()"
                       [value]="effectiveMaxPrice()"
                       [disabled]="priceBounds().min === priceBounds().max"
                       (input)="updateMaxPrice($event)"
                       class="w-full accent-[#00A7D4] cursor-pointer disabled:opacity-50 disabled:cursor-default" />
                <div class="flex justify-between text-[10px] text-stone-400">
                  <span>\${{ priceBounds().min | number:'1.0-0' }} MXN</span>
                  <span>\${{ priceBounds().max | number:'1.0-0' }} MXN</span>
                </div>
              </div>
            }

          </div>

          <!-- Drawer Sticky Footer -->
          <div class="p-4 border-t border-stone-800 bg-[#0D131A] flex items-center gap-3">
            @if (hasActiveFilters()) {
              <button (click)="resetFilters()"
                      class="px-4 py-3 bg-[#151F2A] border border-stone-700 text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors">
                Limpiar
              </button>
            }
            <button (click)="closeMobileFilters()"
                    class="flex-1 py-3 bg-[#00A7D4] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#008AA0] transition-colors flex items-center justify-center gap-2">
              <span>Ver {{ filteredProducts().length }} {{ filteredProducts().length === 1 ? 'Modelo' : 'Modelos' }}</span>
              <span class="material-icons text-sm">arrow_forward</span>
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class Catalogo {
  productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  selectedDepartment = signal<string>('all');
  selectedManga = signal<string>('all');
  selectedColor = signal<string>('all');
  selectedSize = signal<string>('all');
  onlyInStock = signal<boolean>(false);
  // null = sin límite manual: usa siempre el máximo real del response actual.
  maxPriceFilter = signal<number | null>(null);
  searchFilter = signal<string>('');
  sortBy = signal<string>('featured');
  mobileFiltersOpen = signal<boolean>(false);

  readonly allProducts = computed(() => this.productService.getProducts());

  /**
   * Rango real de precios ecommerce presentes en los productos actuales.
   * Productos sin ecommerce_price siguen visibles para su flujo de WhatsApp,
   * pero no se usan para inventar límites de precio.
   */
  readonly priceBounds = computed(() => {
    const prices = this.allProducts()
      .map(product => Number(product.precio_ecommerce ?? product.price ?? 0))
      .filter(price => Number.isFinite(price) && price > 0);

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  });

  readonly effectiveMaxPrice = computed(() => this.maxPriceFilter() ?? this.priceBounds().max);

  readonly priceStep = computed(() => {
    const { min, max } = this.priceBounds();
    const range = Math.max(0, max - min);
    if (range <= 200) return 10;
    if (range <= 1000) return 25;
    if (range <= 3000) return 50;
    return 100;
  });

  readonly isPriceFilterActive = computed(() => {
    const selected = this.maxPriceFilter();
    return selected !== null && this.priceBounds().max > 0 && selected < this.priceBounds().max;
  });

  /**
   * Departamentos presentes realmente en productos. También son contextuales:
   * respetan los demás filtros activos, pero nunca dependen del catálogo general
   * de departamentos si no hay productos asociados.
   */
  readonly availableDepartments = computed<ApiDepartamento[]>(() => {
    const byName = new Map<string, ApiDepartamento>();

    for (const product of this.allProducts()) {
      if (!this.productMatchesContext(product, 'department')) continue;

      const name = String(product.departamento ?? '').trim();
      if (!name) continue;
      const key = this.normalize(name);
      if (byName.has(key)) continue;

      byName.set(key, {
        id: Number(product.department_id ?? 0),
        name,
        description: null
      });
    }

    return Array.from(byName.values());
  });

  /** Manga únicamente si existe en los productos del response actual. */
  readonly availableMangas = computed<ApiManga[]>(() => {
    const byName = new Map<string, ApiManga>();

    for (const product of this.allProducts()) {
      if (!this.productMatchesContext(product, 'manga')) continue;

      const name = String(product.manga ?? '').trim();
      if (!name) continue;
      const key = this.normalize(name);
      if (byName.has(key)) continue;

      byName.set(key, {
        id: Number(product.manga_id ?? 0),
        name
      });
    }

    return Array.from(byName.values());
  });

  /**
   * Colores derivados de variantes reales. Si hay talla seleccionada, solo se
   * muestran colores que tengan esa talla en la misma variante/combinación.
   */
  readonly availableColors = computed<ApiColor[]>(() => {
    const byName = new Map<string, ApiColor>();
    const selectedSize = this.selectedSize();

    for (const product of this.allProducts()) {
      if (!this.productMatchesContext(product, 'color')) continue;

      for (const variant of product.variantes) {
        if (selectedSize !== 'all' && !this.sameValue(variant.talla, selectedSize)) continue;
        if (this.onlyInStock() && Number(variant.stockDisponible ?? 0) <= 0) continue;

        const name = String(variant.color ?? '').trim();
        if (!name) continue;
        const key = this.normalize(name);
        if (byName.has(key)) continue;

        const productColor = product.colors.find(color => this.sameValue(color.name, name));
        byName.set(key, {
          id: Number(variant.color_id ?? productColor?.id ?? 0),
          name,
          hex_code: String(variant.hex || productColor?.hex || '#FFFFFF')
        });
      }
    }

    return Array.from(byName.values());
  });

  /**
   * Tallas derivadas de variantes reales. Si hay color seleccionado, solo se
   * muestran tallas existentes para ese color en la misma variante.
   */
  readonly availableSizeNames = computed<string[]>(() => {
    const sizes = new Map<string, string>();
    const selectedColor = this.selectedColor();

    for (const product of this.allProducts()) {
      if (!this.productMatchesContext(product, 'size')) continue;

      for (const variant of product.variantes) {
        if (selectedColor !== 'all' && !this.sameValue(variant.color, selectedColor)) continue;
        if (this.onlyInStock() && Number(variant.stockDisponible ?? 0) <= 0) continue;

        const size = String(variant.talla ?? '').trim();
        if (!size) continue;
        const key = this.normalize(size);
        if (!sizes.has(key)) sizes.set(key, size);
      }
    }

    return Array.from(sizes.values()).sort((a, b) =>
      a.localeCompare(b, 'es-MX', { numeric: true, sensitivity: 'base' })
    );
  });

  constructor() {
    // Catálogo participa como heartbeat natural del storefront: solo vuelve a
    // consultar productos cuando venció la ventana corta de frescura.
    this.productService.loadForNavigation().subscribe({
      error: () => {
        // 403/503 son gestionados globalmente por errorInterceptor.
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['cat']) {
        const rawCategory = String(params['cat']).trim();
        const cat = this.normalize(rawCategory);

        if (cat === 'caballeros') this.selectedDepartment.set('Caballeros');
        else if (cat === 'damas') this.selectedDepartment.set('Damas');
        else if (cat === 'ninos') this.selectedDepartment.set('Niños');
        else this.selectedDepartment.set(rawCategory);
      }
      if (params['q']) {
        this.searchFilter.set(params['q']);
      }
      if (params['manga']) {
        this.selectedManga.set(params['manga']);
      }
    });

    // Si cambia el response o un filtro padre deja inválido otro filtro,
    // limpiamos únicamente la selección que ya no existe. Durante la carga
    // inicial no tocamos query params para evitar descartarlos antes del API.
    effect(() => {
      if (this.productService.apiStatus() !== 'connected') return;

      const department = this.selectedDepartment();
      if (department !== 'all' && !this.availableDepartments().some(item => this.sameValue(item.name, department))) {
        this.selectedDepartment.set('all');
      }

      const manga = this.selectedManga();
      if (manga !== 'all' && !this.availableMangas().some(item => this.sameValue(item.name, manga))) {
        this.selectedManga.set('all');
      }

      const color = this.selectedColor();
      if (color !== 'all' && !this.availableColors().some(item => this.sameValue(item.name, color))) {
        this.selectedColor.set('all');
      }

      const size = this.selectedSize();
      if (size !== 'all' && !this.availableSizeNames().some(item => this.sameValue(item, size))) {
        this.selectedSize.set('all');
      }

      const max = this.maxPriceFilter();
      const bounds = this.priceBounds();
      if (max !== null && (bounds.max <= 0 || max >= bounds.max)) {
        this.maxPriceFilter.set(null);
      }
    });
  }

  syncApi(): void {
    this.productService.fetchFromApi();
  }

  getDepartmentName(deptName: string): string {
    return deptName;
  }

  getDepartmentCount(deptName: string): number {
    return this.allProducts().filter(product =>
      this.sameValue(product.departamento, deptName)
      && this.productMatchesContext(product, 'department')
    ).length;
  }

  readonly activeFiltersCount = computed(() => {
    let count = 0;
    if (this.selectedDepartment() !== 'all') count++;
    if (this.selectedManga() !== 'all') count++;
    if (this.selectedColor() !== 'all') count++;
    if (this.selectedSize() !== 'all') count++;
    if (this.onlyInStock()) count++;
    if (this.isPriceFilterActive()) count++;
    if (this.searchFilter().trim().length > 0) count++;
    return count;
  });

  hasActiveFilters(): boolean {
    return this.activeFiltersCount() > 0;
  }

  openMobileFilters(): void {
    this.mobileFiltersOpen.set(true);
  }

  closeMobileFilters(): void {
    this.mobileFiltersOpen.set(false);
  }

  resetFilters(): void {
    this.selectedDepartment.set('all');
    this.selectedManga.set('all');
    this.selectedColor.set('all');
    this.selectedSize.set('all');
    this.onlyInStock.set(false);
    this.maxPriceFilter.set(null);
    this.searchFilter.set('');
  }

  toggleOnlyInStock(): void {
    this.onlyInStock.update(value => !value);
  }

  toggleManga(mangaName: string): void {
    this.selectedManga.set(this.sameValue(this.selectedManga(), mangaName) ? 'all' : mangaName);
  }

  toggleColor(colorName: string): void {
    this.selectedColor.set(this.sameValue(this.selectedColor(), colorName) ? 'all' : colorName);
  }

  toggleSize(sizeName: string): void {
    this.selectedSize.set(this.sameValue(this.selectedSize(), sizeName) ? 'all' : sizeName);
  }

  updateSearch(event: Event): void {
    this.searchFilter.set((event.target as HTMLInputElement).value);
  }

  updateMaxPrice(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    const max = this.priceBounds().max;
    this.maxPriceFilter.set(Number.isFinite(value) && value < max ? value : null);
  }

  onSortChange(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value);
  }

  readonly filteredProducts = computed(() => {
    let list = this.allProducts().filter(product => this.productMatchesContext(product, null));

    const sort = this.sortBy();
    if (sort === 'price-asc') {
      list = [...list].sort((a, b) => {
        const aPrice = Number(a.precio_ecommerce ?? a.price ?? 0);
        const bPrice = Number(b.precio_ecommerce ?? b.price ?? 0);
        const aHas = aPrice > 0;
        const bHas = bPrice > 0;
        if (!aHas && bHas) return 1;
        if (!bHas && aHas) return -1;
        return aPrice - bPrice;
      });
    } else if (sort === 'price-desc') {
      list = [...list].sort((a, b) => {
        const aPrice = Number(a.precio_ecommerce ?? a.price ?? 0);
        const bPrice = Number(b.precio_ecommerce ?? b.price ?? 0);
        const aHas = aPrice > 0;
        const bHas = bPrice > 0;
        if (!aHas && bHas) return 1;
        if (!bHas && aHas) return -1;
        return bPrice - aPrice;
      });
    } else if (sort === 'stock-desc') {
      list = [...list].sort((a, b) => b.totalStock - a.totalStock);
    } else if (sort === 'name-asc') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'es-MX'));
    }

    return list;
  });

  private productMatchesContext(
    product: Product,
    ignore: 'department' | 'manga' | 'color' | 'size' | 'price' | 'search' | null
  ): boolean {
    if (
      ignore !== 'department'
      && this.selectedDepartment() !== 'all'
      && !this.sameValue(product.departamento, this.selectedDepartment())
    ) {
      return false;
    }

    if (
      ignore !== 'manga'
      && this.selectedManga() !== 'all'
      && !this.sameValue(product.manga, this.selectedManga())
    ) {
      return false;
    }

    const selectedColor = ignore === 'color' ? 'all' : this.selectedColor();
    const selectedSize = ignore === 'size' ? 'all' : this.selectedSize();
    const requiresVariantMatch = selectedColor !== 'all' || selectedSize !== 'all' || this.onlyInStock();

    if (requiresVariantMatch) {
      const hasMatchingVariant = product.variantes.some(variant =>
        this.variantMatches(variant, selectedColor, selectedSize, this.onlyInStock())
      );
      if (!hasMatchingVariant) return false;
    }

    if (ignore !== 'price' && this.isPriceFilterActive()) {
      const productPrice = Number(product.precio_ecommerce ?? product.price ?? 0);
      if (!(productPrice > 0 && productPrice <= this.effectiveMaxPrice())) {
        return false;
      }
    }

    if (ignore !== 'search') {
      const query = this.normalize(this.searchFilter());
      if (query) {
        const searchable = [
          product.name,
          product.ref_code,
          product.departamento,
          product.manga,
          product.embroideryType
        ].map(value => this.normalize(value));

        const matchesProduct = searchable.some(value => value.includes(query));
        const matchesVariant = product.variantes.some(variant =>
          this.normalize(variant.sku).includes(query)
          || this.normalize(variant.descripcion).includes(query)
          || this.normalize(variant.color).includes(query)
          || this.normalize(variant.talla).includes(query)
        );

        if (!matchesProduct && !matchesVariant) return false;
      }
    }

    return true;
  }

  private variantMatches(
    variant: ProductVariant,
    color: string,
    size: string,
    requireStock: boolean
  ): boolean {
    const matchesColor = color === 'all' || this.sameValue(variant.color, color);
    const matchesSize = size === 'all' || this.sameValue(variant.talla, size);
    const matchesStock = !requireStock || Number(variant.stockDisponible ?? 0) > 0;
    return matchesColor && matchesSize && matchesStock;
  }

  private sameValue(left: unknown, right: unknown): boolean {
    return this.normalize(left) === this.normalize(right);
  }

  private normalize(value: unknown): string {
    return String(value ?? '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es-MX');
  }
}
