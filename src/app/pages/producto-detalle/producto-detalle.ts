import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { SizeGuideModal } from '../../components/size-guide-modal/size-guide-modal';
import { ProductCard } from '../../components/product-card/product-card';
import { Product } from '../../models/product.model';
import { ShippingPromo } from '../../components/shipping-promo/shipping-promo';

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink, DecimalPipe, SizeGuideModal, ProductCard, ShippingPromo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-[#0D131A] text-[#F9F7F2] py-8 sm:py-12">
      <app-shipping-promo></app-shipping-promo>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        @if (product(); as prod) {
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-xs text-stone-400 mb-8 font-medium">
            <a routerLink="/" class="hover:text-[#00A7D4]">Inicio</a>
            <span>/</span>
            <a routerLink="/catalogo" class="hover:text-[#00A7D4]">Catálogo</a>
            <span>/</span>
            <span class="capitalize">{{ prod.departamento || prod.category }}</span>
            <span>/</span>
            <span class="text-[#C9A87C] font-bold truncate">{{ prod.name }}</span>
          </nav>

          <!-- Main Product Layout (Canvas #0D131A with container #151F2A & golden accents) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-[#151F2A] p-6 sm:p-10 rounded-3xl border border-[#AE875B]/30 shadow-2xl">
            
            <!-- LEFT: Image Gallery with Color Adaptation -->
            <div class="lg:col-span-7 space-y-4">
              <!-- Main Selected Image -->
              <div class="relative aspect-[4/5] bg-[#0D131A] rounded-3xl overflow-hidden border border-stone-800 shadow-lg">
                <img [src]="displayImage()" 
                     [alt]="prod.name"
                     (error)="onImageError($event)"
                     class="w-full h-full object-cover object-center transition-all duration-300" />
                
                <!-- Department & Manga badge -->
                <div class="absolute bottom-4 left-4 bg-[#0D131A]/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-stone-200 flex items-center gap-1.5 shadow-md border border-stone-700">
                  <span class="material-icons text-xs text-[#00A7D4]">verified</span>
                  <span>{{ prod.departamento || 'Caballeros' }} • {{ prod.manga || 'Manga Larga' }}</span>
                </div>

                <!-- Wishlist heart button -->
                <button (click)="toggleWishlist(prod)"
                        class="absolute top-4 right-4 w-11 h-11 rounded-full bg-[#0D131A]/90 hover:bg-[#0D131A] shadow-lg flex items-center justify-center transition-all active:scale-90 text-stone-300 hover:text-rose-500 border border-stone-700"
                        [title]="isFavorite() ? 'Quitar de favoritos' : 'Guardar en favoritos'">
                  <span class="material-icons text-2xl" [class.text-rose-500]="isFavorite()">
                    {{ isFavorite() ? 'favorite' : 'favorite_border' }}
                  </span>
                </button>
              </div>

              <!-- Thumbnails -->
              <div class="flex items-center gap-3 overflow-x-auto pb-2">
                @for (img of currentGalleryImages(); track img) {
                  <button (click)="selectedImage.set(img)"
                          class="relative w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all bg-[#0D131A]"
                          [class]="displayImage() === img ? 'border-[#00A7D4] ring-2 ring-[#00A7D4]/40' : 'border-stone-800 opacity-60 hover:opacity-100'">
                    <img [src]="img" [alt]="prod.name" (error)="onImageError($event)" class="w-full h-full object-cover" />
                  </button>
                }
              </div>
            </div>

            <!-- RIGHT: Product Specifications, Stock Validation & Purchase Options -->
            <div class="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                
                <!-- Origin, Ref & Rating -->
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C9A87C]">
                    <span class="w-2 h-2 rounded-full bg-[#00A7D4]"></span>
                    Tekit, Yucatán • Alan Uicab
                  </span>
                  @if (prod.ref_code) {
                    <span class="px-2.5 py-0.5 text-[11px] font-mono font-bold bg-[#0D131A] text-amber-300 border border-stone-700 rounded-md">
                      Ref: {{ prod.ref_code }}
                    </span>
                  }
                </div>

                <h1 class="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {{ prod.name }}
                </h1>

                <!-- Price Block -->
                @if (hasEcommercePrice(prod)) {
                  <div class="mt-3 flex items-baseline gap-3">
                    <span class="text-3xl font-bold text-white font-sans">
                      \${{ prod.price | number:'1.2-2' }} <span class="text-xs text-stone-400 font-normal">MXN</span>
                    </span>
                    @if (prod.originalPrice) {
                      <span class="text-sm text-stone-500 line-through">
                        \${{ prod.originalPrice | number:'1.2-2' }}
                      </span>
                      <span class="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700">
                        Ahorras \${{ prod.originalPrice - prod.price | number:'1.2-2' }}
                      </span>
                    }
                  </div>
                } @else {
                  <div class="mt-3 p-4 bg-amber-950/30 border border-amber-700/60 rounded-2xl space-y-1.5 shadow-md">
                    <div class="flex items-center gap-2 text-amber-400 font-bold text-base">
                      <span class="material-icons text-lg">info</span>
                      <span>Precio no disponible</span>
                    </div>
                    <p class="text-xs text-stone-300 font-sans leading-relaxed">
                      El precio de este modelo no está publicado en la tienda en línea. Puedes consultar el precio, disponibilidad directamente por WhatsApp.
                    </p>
                  </div>
                }

                <!-- 1. Color Selector -->
                <div class="mt-6 space-y-2">
                  <div class="flex items-center justify-between text-xs font-bold">
                    <span class="text-stone-200 uppercase tracking-wider">
                      1. Selecciona Color: <strong class="text-[#38C7EC]">{{ selectedColor() }}</strong>
                    </span>
                    <span class="text-[11px] text-stone-400 font-normal">
                      {{ availableSizesInStockCount() }} {{ availableSizesInStockCount() === 1 ? 'talla con existencia' : 'tallas con existencia' }}
                    </span>
                  </div>
                  
                  <div class="flex items-center gap-2.5 flex-wrap">
                    @for (c of prod.colors; track c.name) {
                      <button (click)="selectColor(c.name)"
                              class="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all"
                              [class]="selectedColor() === c.name 
                                ? 'border-[#00A7D4] bg-[#00A7D4]/20 text-[#38C7EC] ring-2 ring-[#00A7D4]/50 shadow-md scale-[1.02]' 
                                : 'border-stone-700 bg-[#0D131A] text-stone-300 hover:border-stone-500 hover:bg-[#1A2634]'">
                        <span class="w-4 h-4 rounded-full border border-stone-600 shadow-2xs" [style.background-color]="c.hex"></span>
                        <!-- <span>{{ c.name }}</span> -->
                      </button>
                    }
                  </div>
                </div>

                <!-- 2. Size Selector with Stock Highlight & Disabled Opaque State -->
                <div class="mt-6 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-stone-200 uppercase tracking-wider">
                      2. Selecciona Talla: 
                      @if (selectedSize()) {
                        <strong class="text-white ml-1 font-mono">{{ selectedSize() }}</strong>
                      } @else {
                        <span class="text-amber-400 ml-1 font-normal">(Elige una talla disponible)</span>
                      }
                    </span>
                    <button (click)="showSizeGuide.set(true)" 
                            class="text-[#00A7D4] font-bold hover:underline flex items-center gap-1">
                      <span class="material-icons text-sm">straighten</span>
                      Guía de Tallas
                    </button>
                  </div>

                  <!-- Tallas Grid -->
                  <div class="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    @for (size of prod.sizes; track size) {
                      @let isAvailable = isSizeAvailableForColor(size);
                      @let stockCount = getSizeStock(size);
                      @let isSizeSelected = selectedSize() === size;

                      @if (isAvailable) {
                        <!-- TALLA DISPONIBLE (EN EXISTENCIA) - RESALTA Y SE PUEDE SELECCIONAR -->
                        <button type="button"
                                (click)="selectSize(size)"
                                class="py-3 px-2 text-xs font-bold rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 relative cursor-pointer group shadow-sm"
                                [class]="isSizeSelected 
                                  ? 'bg-[#00A7D4] text-white border-[#00A7D4] shadow-lg ring-2 ring-[#00A7D4]/40 scale-[1.03]' 
                                  : 'bg-[#0D131A] text-stone-100 border-[#AE875B]/60 hover:border-[#00A7D4] hover:bg-[#1A2634]'">
                          <span class="font-mono text-sm tracking-wider">{{ size }}</span>
                          <span class="text-[10px] font-semibold flex items-center gap-0.5"
                                [class]="isSizeSelected ? 'text-white font-bold' : 'text-emerald-400'">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" [class.bg-white]="isSizeSelected"></span>
                            {{ stockCount }} disp.
                          </span>
                        </button>
                      } @else {
                        <!-- TALLA SIN EXISTENCIA CON ESTE COLOR - OPACA Y BLOQUEADA (NO SE PUEDE SELECCIONAR) -->
                        <button type="button"
                                [disabled]="true"
                                class="py-3 px-2 text-xs rounded-xl border border-stone-800/60 bg-[#0D131A]/30 text-stone-600 opacity-40 cursor-not-allowed select-none flex flex-col items-center justify-center gap-1 relative"
                                title="Esta talla no tiene existencias disponibles para el color {{ selectedColor() }}">
                          <span class="font-mono text-sm line-through text-stone-500">{{ size }}</span>
                          <span class="text-[9px] text-stone-600 font-medium">Sin stock</span>
                        </button>
                      }
                    }
                  </div>

                  @if (availableSizesInStockCount() === 0) {
                    <div class="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                      <span class="material-icons text-sm">info</span>
                      <span>No hay piezas en bodega para el color <strong>{{ selectedColor() }}</strong>. Por favor selecciona otro color.</span>
                    </div>
                  }
                </div>

                <!-- REAL-TIME STOCK INVENTORY VALIDATION BOX -->                

                <!-- Quantity & Actions -->
                <div class="mt-6 space-y-3">
                  @if (hasEcommercePrice(prod)) {
                    <!-- Ecommerce Purchase Flow (Add to Cart) -->
                    <div class="flex items-center gap-3">
                      
                      <!-- Quantity Control (Capped by available stock) -->
                      <div class="flex items-center border border-stone-700 rounded-xl bg-[#0D131A] p-1"
                           [class.opacity-40]="selectedVariantStock().stockDisponible <= 0">
                        <button (click)="decrementQty()" 
                                [disabled]="selectedVariantStock().stockDisponible <= 0 || quantity() <= 1"
                                class="w-8 h-8 flex items-center justify-center text-stone-300 hover:bg-stone-800 rounded-lg disabled:cursor-not-allowed"
                                aria-label="Menos cantidad">
                          <span class="material-icons text-sm">remove</span>
                        </button>
                        <span class="w-10 text-center text-xs font-bold text-white">{{ quantity() }}</span>
                        <button (click)="incrementQty()" 
                                [disabled]="selectedVariantStock().stockDisponible <= 0 || quantity() >= selectedVariantStock().stockDisponible"
                                class="w-8 h-8 flex items-center justify-center text-stone-300 hover:bg-stone-800 rounded-lg disabled:cursor-not-allowed"
                                aria-label="Más cantidad">
                          <span class="material-icons text-sm">add</span>
                        </button>
                      </div>

                      <!-- Add to Cart Primary Button (Enabled only if stock > 0 and size selected) -->
                      @if (selectedVariantStock().stockDisponible > 0 && selectedSize()) {
                        <button (click)="addToCart(prod)"
                                class="flex-1 py-3.5 px-6 bg-[#AE875B] hover:bg-[#8F6A40] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer">
                          <span class="material-icons text-lg">shopping_bag</span>
                          <span>Agregar al Carrito ({{ quantity() }})</span>
                        </button>
                      } @else {
                        <button [disabled]="true"
                                class="flex-1 py-3.5 px-6 bg-stone-800 text-stone-500 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-stone-700 transition-all flex items-center justify-center gap-2 cursor-not-allowed opacity-60">
                          <span class="material-icons text-lg">block</span>
                          <span>
                            @if (!selectedSize()) {
                              Elige una talla disponible
                            } @else {
                              Sin existencia disponible
                            }
                          </span>
                        </button>
                      }
                    </div>

                    <!-- Direct WhatsApp Contact Button -->
                    <a [href]="getWhatsAppUrl(prod)" target="_blank" rel="noopener"
                       class="w-full py-3 px-4 bg-[#0D131A] hover:bg-stone-900 border border-[#00A7D4] text-[#38C7EC] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                      <span class="material-icons text-base">chat</span>
                      <span>Consultar mayoreo por WhatsApp</span>
                    </a>
                  } @else {
                    <!-- WhatsApp Inquire Price Primary Flow (precio_ecommerce === 0) -->
                    <div class="space-y-3">
                      <a [href]="getWhatsAppPriceInquiryUrl(prod)" target="_blank" rel="noopener"
                         class="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer">
                        <span class="material-icons text-xl">chat</span>
                        <span>Preguntar Precio por WhatsApp</span>
                      </a>

                      <div class="p-3 bg-[#0D131A] rounded-xl border border-stone-800 text-center text-xs text-stone-400 flex items-center justify-center gap-2">
                        <span class="material-icons text-sm text-amber-400">lock</span>
                        <span>Prenda no disponible para compra directa en la tienda online. Atención personalizada vía WhatsApp.</span>
                      </div>
                    </div>
                  }
                </div>

                <!-- Shipping Perks -->
                <div class="mt-6 pt-6 border-t border-stone-800 space-y-2 text-xs text-stone-400 font-sans">
                  <div class="flex items-center gap-2">
                    <span class="material-icons text-sm text-[#00A7D4]">local_shipping</span>
                    <span>Envío Gratis a todo México en compras a partir de $1,999 MXN.</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="material-icons text-sm text-[#C9A87C]">workspace_premium</span>
                    <span>Garantía de confección 100% artesanal en Tekit, Yucatán.</span>
                  </div>
                </div>

              </div>

              <!-- Product Technical Description -->
              <div class="pt-6 border-t border-stone-800 space-y-4">
                <h3 class="font-serif font-bold text-base text-white">Detalles del Modelo</h3>
                <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                  {{ prod.description }}
                </p>
                <div class="space-y-1.5 pt-2">
                  <p class="text-xs font-bold text-white">Especificaciones:</p>
                  @for (feat of prod.features; track feat) {
                    <p class="text-xs text-stone-300 flex items-start gap-2">
                      <span class="material-icons text-xs text-[#C9A87C] mt-0.5">check</span>
                      <span>{{ feat }}</span>
                    </p>
                  }
                </div>
              </div>

            </div>

          </div>

          <!-- Related Products Section -->
          <div class="mt-16">
            <div class="flex items-center justify-between mb-8">
              <div>
                <span class="text-xs font-bold uppercase tracking-widest text-[#C9A87C]">Colección Relacionada</span>
                <h2 class="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                  Otras Piezas de {{ prod.departamento || 'la Colección' }}
                </h2>
              </div>
              <a routerLink="/catalogo" class="text-xs font-bold text-[#00A7D4] hover:underline flex items-center gap-1">
                Ver Catálogo Completo <span class="material-icons text-xs">arrow_forward</span>
              </a>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              @for (rel of relatedProducts(); track rel.id) {
                <app-product-card [product]="rel"></app-product-card>
              }
            </div>
          </div>

        } @else {
          <!-- Product Not Found -->
          <div class="bg-[#151F2A] p-12 rounded-3xl text-center border border-stone-800 max-w-md mx-auto space-y-4 shadow-xl">
            <span class="material-icons text-4xl text-stone-500">error_outline</span>
            <h2 class="font-serif font-bold text-xl text-white">Producto no encontrado</h2>
            <p class="text-xs text-stone-400">La prenda que estás buscando no existe en el catálogo.</p>
            <a routerLink="/catalogo" class="inline-block px-6 py-2.5 bg-[#00A7D4] text-white text-xs font-bold rounded-xl shadow-md">
              Regresar a la Tienda
            </a>
          </div>
        }

      </div>

      <!-- Size Guide Modal Component -->
      @if (showSizeGuide()) {
        <app-size-guide-modal (closeModal)="showSizeGuide.set(false)"></app-size-guide-modal>
      }
    </main>
  `
})
export class ProductoDetalle {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  productId = signal<string>('');
  selectedImage = signal<string>('');
  selectedColor = signal<string>('');
  selectedSize = signal<string>('');
  quantity = signal<number>(1);
  showSizeGuide = signal<boolean>(false);

  readonly product = computed<Product | undefined>(() => {
    return this.productService.getProductById(this.productId());
  });

  readonly currentGalleryImages = computed<string[]>(() => {
    const p = this.product();
    if (!p) return [];

    const colorObj = p.colors.find(c => c.name.toLowerCase() === this.selectedColor().toLowerCase());
    if (colorObj && colorObj.images && colorObj.images.length > 0) {
      return colorObj.images;
    }

    return p.images;
  });

  readonly displayImage = computed<string>(() => {
    const sel = this.selectedImage();
    if (sel) return sel;
    const gallery = this.currentGalleryImages();
    return gallery[0] || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop';
  });

  readonly selectedVariantStock = computed(() => {
    const p = this.product();
    if (!p || !this.selectedColor() || !this.selectedSize()) {
      return { found: false, stockDisponible: 0, qtyBodega: 0, qtyApartado: 0, qtyProduccion: 0, qtyPreventa: 0, sku: '' };
    }
    return this.productService.getVariantStock(p.id, this.selectedColor(), this.selectedSize());
  });

  readonly availableSizesInStockCount = computed<number>(() => {
    const p = this.product();
    if (!p || !this.selectedColor()) return 0;
    return p.sizes.filter(s => this.isSizeAvailableForColor(s)).length;
  });

  readonly relatedProducts = computed<Product[]>(() => {
    const p = this.product();
    if (!p) return [];
    return this.productService.getRelatedProducts(p.id, p.category, 4);
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '1';
      this.productId.set(id);
      this.initializeProductSelection(id);

      // Cada navegación a un detalle usa la misma política de frescura que Home
      // y Catálogo. Si la respuesta detecta maintenance/inactive, el interceptor
      // global se encarga de cambiar el estado y redirigir.
      this.productService.loadForNavigation().subscribe({
        error: () => {
          // Conservamos el último producto real mientras el manejo global actúa.
        }
      });

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    });

    // Reactively ensure selection is synced when the product data is loaded or changes
    effect(() => {
      const p = this.product();
      if (p) {
        const currentColor = this.selectedColor();
        const hasColor = currentColor && p.colors.some(c => c.name.toLowerCase() === currentColor.toLowerCase());
        if (!hasColor) {
          const defaultColor = p.colors[0]?.name || 'Blanco';
          this.selectedColor.set(defaultColor);
          this.selectedImage.set(p.images[0] || '');
          this.autoSelectAvailableSize(p, defaultColor);
          this.quantity.set(1);
        }
      }
    });
  }

  private initializeProductSelection(id: string): void {
    const p = this.productService.getProductById(id);
    if (!p) return;

    // Pick first color
    const defaultColor = p.colors[0]?.name || 'Blanco';
    this.selectedColor.set(defaultColor);
    this.selectedImage.set(p.images[0] || '');

    // Auto-select first size with actual available stock for default color
    this.autoSelectAvailableSize(p, defaultColor);
    this.quantity.set(1);
  }

  isSizeAvailableForColor(sizeName: string): boolean {
    const p = this.product();
    if (!p || !this.selectedColor()) return false;
    const res = this.productService.getVariantStock(p.id, this.selectedColor(), sizeName);
    return res.stockDisponible > 0;
  }

  getSizeStock(sizeName: string): number {
    const p = this.product();
    if (!p || !this.selectedColor()) return 0;
    const res = this.productService.getVariantStock(p.id, this.selectedColor(), sizeName);
    return res.stockDisponible;
  }

  selectColor(colorName: string): void {
    this.selectedColor.set(colorName);
    const p = this.product();
    if (!p) return;

    // Update gallery image for selected color
    const colorObj = p.colors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
    if (colorObj && colorObj.images && colorObj.images.length > 0) {
      this.selectedImage.set(colorObj.images[0]);
    }

    // Check if the current size is available with the new color
    const currentSize = this.selectedSize();
    if (!currentSize || !this.isSizeAvailableForColor(currentSize)) {
      this.autoSelectAvailableSize(p, colorName);
    }

    // Clamp quantity
    this.clampQuantity();
  }

  selectSize(sizeName: string): void {
    if (!this.isSizeAvailableForColor(sizeName)) return;
    this.selectedSize.set(sizeName);
    this.clampQuantity();
  }

  private autoSelectAvailableSize(p: Product, colorName: string): void {
    const availableSize = p.sizes.find(s => {
      const stock = this.productService.getVariantStock(p.id, colorName, s);
      return stock.stockDisponible > 0;
    });

    if (availableSize) {
      this.selectedSize.set(availableSize);
    } else {
      // No size available for this color
      this.selectedSize.set('');
    }
  }

  private clampQuantity(): void {
    const maxStock = this.selectedVariantStock().stockDisponible;
    if (maxStock <= 0) {
      this.quantity.set(1);
    } else if (this.quantity() > maxStock) {
      this.quantity.set(maxStock);
    }
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop';
  }

  isFavorite(): boolean {
    const p = this.product();
    return p ? this.wishlistService.isInWishlist(p.id) : false;
  }

  toggleWishlist(prod: Product): void {
    this.wishlistService.toggleWishlist(prod);
  }

  incrementQty(): void {
    const maxStock = this.selectedVariantStock().stockDisponible;
    if (this.quantity() < maxStock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQty(): void {
    this.quantity.update(q => (q > 1 ? q - 1 : 1));
  }

  hasEcommercePrice(prod?: Product | null): boolean {
    if (!prod) return false;
    const p = Number(prod.precio_ecommerce ?? prod.price ?? 0);
    return !isNaN(p) && p > 0;
  }

  addToCart(prod: Product): void {
    if (!this.hasEcommercePrice(prod)) return;
    const size = this.selectedSize();
    const color = this.selectedColor();
    if (!size || !color) return;

    this.cartService.addToCart(prod, size, color, this.quantity());
  }

  getWhatsAppUrl(prod: Product): string {
    const size = this.selectedSize() || 'A consultar';
    const color = this.selectedColor() || 'A consultar';
    const msg = encodeURIComponent(
      `Hola Guayaberas ALUM, me interesa la prenda "${prod.name}" (Ref: ${prod.ref_code || prod.id}) en talla ${size} y color ${color}. ¿Tienen disponibilidad o confección personalizada?`
    );
    return `https://wa.me/529971149132?text=${msg}`;
  }

  getWhatsAppPriceInquiryUrl(prod: Product): string {
    const size = this.selectedSize() ? ` en talla ${this.selectedSize()}` : '';
    const color = this.selectedColor() ? ` y color ${this.selectedColor()}` : '';
    const msg = encodeURIComponent(
      `Hola Guayaberas ALUM, deseo consultar el precio del modelo "${prod.name}" (Ref: ${prod.ref_code || prod.id}, Depto: ${prod.departamento || 'General'})${size}${color}. ¿Me podrían dar informes y opciones de compra?`
    );
    return `https://wa.me/529971149132?text=${msg}`;
  }
}
