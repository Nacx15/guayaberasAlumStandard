import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCard } from '../../components/product-card/product-card';
import { environment } from '../../../environments/environment';
import { ShippingPromo } from '../../components/shipping-promo/shipping-promo';


interface HomeCategoryCard {
  key: string;
  department: string;
  title: string;
  eyebrow: string;
  description: string;
  image?: string;
  alt: string;
  accentClass: string;
  hoverClass: string;
  order: number;
}

const HOME_CATEGORY_PRESENTATION: Record<string, Omit<HomeCategoryCard, 'key' | 'department'>> = {
  caballeros: {
    title: 'CABALLERO',
    eyebrow: 'Clásico & Moderno',
    description: 'Prendas pensadas para él, manga corta y manga larga.',
    alt: 'Guayaberas Caballero',
    accentClass: 'text-[#00A7D4]',
    hoverClass: 'group-hover:text-[#C9A87C]',
    order: 1
  },
  damas: {
    title: 'DAMA',
    eyebrow: 'Bordados Finos',
    description: 'Prendas pensadas para ella, vestidos elegantes y casuales.',
    alt: 'Vestidos y Blusas Dama',
    accentClass: 'text-[#C9A87C]',
    hoverClass: 'group-hover:text-[#00A7D4]',
    order: 2
  },
  ninos: {
    title: 'NIÑO',
    eyebrow: 'Tradición Familiar',
    description: 'Prendas pensadas para el más pequeño, manga corta y manga larga.',
    alt: 'Línea Infantil Niño',
    accentClass: 'text-[#C9A87C]',
    hoverClass: 'group-hover:text-[#00A7D4]',
    order: 3
  },
  ninas: {
    title: 'NIÑA',
    eyebrow: 'Tradición Familiar',
    description: 'Prendas pensadas para la más pequeña, vestidos y blusas.',
    alt: 'Línea Infantil Niña',
    accentClass: 'text-[#C9A87C]',
    hoverClass: 'group-hover:text-[#00A7D4]',
    order: 4
  }
};

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard, ShippingPromo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-[#0D131A] text-[#F9F7F2]">
      <app-shipping-promo></app-shipping-promo>
      
      <!-- HERO CAROUSEL -->
      <section class="relative overflow-hidden border-b border-[#AE875B]/25">
        <div class="relative min-h-[620px] sm:min-h-[680px] lg:min-h-[720px]">
          @for (slide of heroSlides; track $index) {
            <div class="absolute inset-0 transition-opacity duration-700"
                 [class.opacity-100]="activeHeroSlide() === $index"
                 [class.opacity-0]="activeHeroSlide() !== $index"
                 [class.pointer-events-none]="activeHeroSlide() !== $index">
              <img [src]="slide.image" [alt]="slide.alt" class="absolute inset-0 w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-r from-[#0D131A]/95 via-[#0D131A]/55 to-[#0D131A]/20"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-[#0D131A]/80 via-transparent to-[#0D131A]/35"></div>

              <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[620px] sm:min-h-[680px] lg:min-h-[720px] flex items-center">
                <div class="max-w-3xl py-20 text-center lg:text-left">
                  <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151F2A]/90 border border-[#AE875B]/40 shadow-md text-xs font-semibold text-white backdrop-blur-md">
                    <span class="w-2 h-2 rounded-full bg-[#00A7D4]"></span>
                    <span class="text-[#C9A87C] uppercase tracking-wider font-bold">{{ slide.eyebrow }}</span>
                  </div>

                  <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mt-6">
                    {{ slide.title }} <span class="text-[#C9A87C] italic">{{ slide.highlight }}</span>
                  </h1>
                  <p class="text-base sm:text-lg text-stone-200 max-w-2xl font-sans leading-relaxed mt-6 mx-auto lg:mx-0">{{ slide.description }}</p>

                  <div class="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <a routerLink="/catalogo"
                       class="w-full sm:w-auto px-8 py-4 bg-[#00A7D4] hover:bg-[#008AA0] text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                      <span class="material-icons text-lg">storefront</span>
                      Explorar Catálogo
                    </a>
                  </div>

                  <div class="mt-8 pt-6 border-t border-white/15 max-w-lg mx-auto lg:mx-0">
                    <p class="text-xl sm:text-2xl font-serif font-bold text-[#C9A87C]">Tekit</p>
                    <p class="text-[11px] text-stone-300 font-medium uppercase tracking-wider">Hecho a Mano</p>
                  </div>
                </div>
              </div>
            </div>
          }

          <button type="button" (click)="previousHeroSlide()" aria-label="Slide anterior"
                  class="absolute z-20 left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0D131A]/70 hover:bg-[#0D131A] border border-white/20 text-white backdrop-blur-md transition-colors flex items-center justify-center">
            <span class="material-icons">chevron_left</span>
          </button>
          <button type="button" (click)="nextHeroSlide()" aria-label="Siguiente slide"
                  class="absolute z-20 right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0D131A]/70 hover:bg-[#0D131A] border border-white/20 text-white backdrop-blur-md transition-colors flex items-center justify-center">
            <span class="material-icons">chevron_right</span>
          </button>

          <div class="absolute z-20 bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2">
            @for (slide of heroSlides; track $index) {
              <button type="button" (click)="goToHeroSlide($index)" [attr.aria-label]="'Ir al slide ' + ($index + 1)"
                      class="h-2.5 rounded-full transition-all duration-300"
                      [class.w-8]="activeHeroSlide() === $index"
                      [class.w-2.5]="activeHeroSlide() !== $index"
                      [class.bg-[#00A7D4]]="activeHeroSlide() === $index"
                      [class.bg-white/50]="activeHeroSlide() !== $index"></button>
            }
          </div>
        </div>
      </section>

      <!-- FEATURED CATEGORIES (dinámicas desde el catálogo real) -->
      <section class="py-16 sm:py-24 bg-[#0D131A] border-b border-stone-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-2xl mx-auto mb-12">
            <span class="text-xs font-bold uppercase tracking-widest text-[#00A7D4]">SELECCIONES EXCLUSIVAS</span>
            <h2 class="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
              Colecciones por Categoría
            </h2>
            <p class="text-sm text-stone-400 mt-2 font-sans">
              Prendas confeccionadas para cada momento especial con la frescura y elegancia que te garantiza Guayaberas ALUM.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            @for (category of categoryCards(); track category.key) {
              <a routerLink="/catalogo" [queryParams]="{cat: category.department}"
                 class="group relative h-96 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-stone-800 hover:border-[#AE875B]/60 transition-all duration-300">
                @if (category.image) {
                  <img [src]="category.image"
                       [alt]="category.alt"
                       class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                } @else {
                  <div class="w-full h-full bg-[#151F2A] flex items-center justify-center" role="img" [attr.aria-label]="category.alt">
                    <span class="material-icons text-7xl text-[#C9A87C]/55 group-hover:text-[#C9A87C]/80 group-hover:scale-105 transition-all duration-300">shopping_bag</span>
                  </div>
                }
                <div class="absolute inset-0 bg-gradient-to-t from-[#0D131A] via-[#0D131A]/40 to-transparent"></div>

                <div class="absolute inset-x-5 bottom-5 text-white">
                  <span class="text-[10px] uppercase font-bold tracking-widest {{ category.accentClass }}">{{ category.eyebrow }}</span>
                  <h3 class="font-serif text-2xl font-bold mt-0.5 {{ category.hoverClass }} transition-colors">{{ category.title }}</h3>
                  <p class="text-xs text-stone-300 mt-1 line-clamp-2">{{ category.description }}</p>
                  <span class="inline-flex items-center gap-1 text-xs font-bold {{ category.accentClass }} mt-3 group-hover:translate-x-1 transition-transform">
                    Ver Colección <span class="material-icons text-xs">arrow_forward</span>
                  </span>
                </div>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- NOVEDADES & DESTACADOS (4 prendas destacadas de alta confección) -->
      <section class="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-[#C9A87C]">Alta Sastrería Tekiteña</span>
            <h2 class="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
              Novedades y Piezas de Autor
            </h2>
          </div>
          <a routerLink="/catalogo" 
             class="inline-flex items-center gap-2 text-sm font-bold text-[#00A7D4] hover:text-[#38C7EC] transition-colors">
            Ver todas las prendas <span class="material-icons text-base">arrow_forward</span>
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6">
          @for (product of featuredProducts(); track product.id) {
            <app-product-card [product]="product"></app-product-card>
          }
        </div>
      </section>

      <!-- ALUM TRADITION & TEKIT WORKSHOP PROMISE BANNER -->
      <section class="py-16 bg-[#090D12] border-y border-[#AE875B]/25 relative overflow-hidden" hidden>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-[#151F2A] rounded-3xl p-8 sm:p-12 border border-[#AE875B]/30 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div class="space-y-5">
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#AE875B]/20 text-[#C9A87C] border border-[#AE875B]/30">
                <span class="material-icons text-sm">handyman</span>
                MAESTROS GUAYABEREROS DE TEKIT
              </span>
              
              <h2 class="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                El Legado de Guayaberas ALUM
              </h2>

              <p class="text-sm text-stone-300 leading-relaxed font-sans">
                Tekit es conocido como la capital mundial de la Guayabera. En<strong class="text-white"> Guayaberas ALUM</strong> combinamos la tradición con la elegancia en el corte, alforzado, bordado y armado fino de nuestras prendas con telas frescas ideales para toda ocasión.
              </p>

              <div class="space-y-3 pt-2">
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-[#00A7D4]/20 text-[#38C7EC] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-icons text-sm">check</span>
                  </div>
                  <p class="text-xs sm:text-sm text-stone-200"><strong class="text-white">Alforzado Milimétrico:</strong> Alforzas alineadas con precisión.</p>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-[#AE875B]/20 text-[#C9A87C] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-icons text-sm">check</span>
                  </div>
                  <p class="text-xs sm:text-sm text-stone-200"><strong class="text-white">Linos de Calidad:</strong> Telas frescas, cómodas y duraderas que no encogen.</p>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-[#00A7D4]/20 text-[#38C7EC] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-icons text-sm">check</span>
                  </div>
                  <p class="text-xs sm:text-sm text-stone-200"><strong class="text-white">Personalización Total:</strong> Confeccionamos prendas al gusto con mínimo de prendas.</p>
                </div>
              </div>

              <div class="pt-4">
                <a routerLink="/nosotros" 
                   class="inline-flex items-center gap-2 px-6 py-3 bg-[#AE875B] hover:bg-[#8F6A40] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg">
                  Conoce Nuestra Historia <span class="material-icons text-sm">arrow_forward</span>
                </a>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <img [src]="images.home.craftsmanshipDetail" 
                   alt="Detalle de alforzas y botones de concha" 
                   class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-[#AE875B]/30 shadow-lg" />
              <img [src]="images.home.craftsmanshipWorkshop" 
                   alt="Taller de confección en Tekit" 
                   class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-[#AE875B]/30 shadow-lg translate-y-6" />
            </div>

          </div>
        </div>
      </section>

      <!-- TESTIMONIALS & REVIEWS -->
      <section class="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-bold uppercase tracking-widest text-[#00A7D4]">Experiencias de Clientes</span>
          <h2 class="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
            Lo que Dicen Quienes Visten ALUM
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div class="bg-[#151F2A] p-8 rounded-3xl border border-stone-800 shadow-xl flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-1 text-amber-400 mb-4">
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
              </div>
              <p class="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
                "Mandé a hacer 8 guayaberas presidenciales para los padrinos de mi boda en la Riviera Maya. La calidad del lino y la precisión de las alforzas superó por mucho lo que encuentras en tiendas departamentales."
              </p>
            </div>
            <div class="pt-6 border-t border-stone-800 mt-6 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#00A7D4]/20 text-[#38C7EC] font-bold flex items-center justify-center text-sm">
                RG
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">Lic. Rodrigo Garza</h4>
                <p class="text-[10px] text-stone-400">Monterrey, N.L. • Boda en Playa</p>
              </div>
            </div>
          </div>

          <div class="bg-[#151F2A] p-8 rounded-3xl border border-[#AE875B]/40 shadow-xl flex flex-col justify-between relative">
            <span class="absolute -top-3 right-6 px-3 py-1 bg-[#AE875B] text-white text-[10px] font-bold rounded-full uppercase shadow-md">Verificado</span>
            <div>
              <div class="flex items-center gap-1 text-amber-400 mb-4">
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
              </div>
              <p class="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
                "El modelo Deshilado Maya es una joya. Se nota que es hecho por manos maestras en Tekit. El envío a Ciudad de México llegó en 2 días con un empaque impecable."
              </p>
            </div>
            <div class="pt-6 border-t border-stone-800 mt-6 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#AE875B]/20 text-[#C9A87C] font-bold flex items-center justify-center text-sm">
                ME
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">Mauricio Espinosa</h4>
                <p class="text-[10px] text-stone-400">CDMX • Coleccionista de Guayaberas</p>
              </div>
            </div>
          </div>

          <div class="bg-[#151F2A] p-8 rounded-3xl border border-stone-800 shadow-xl flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-1 text-amber-400 mb-4">
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
                <span class="material-icons text-lg">star</span>
              </div>
              <p class="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
                "El vestido de lino con bordado en punto de cruz fue el centro de atención en nuestro evento en Mérida. Es comodísimo, fresco y con una caída maravillosa."
              </p>
            </div>
            <div class="pt-6 border-t border-stone-800 mt-6 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#00A7D4]/20 text-[#38C7EC] font-bold flex items-center justify-center text-sm">
                VP
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">Valeria Ponce</h4>
                <p class="text-[10px] text-stone-400">Mérida, Yucatán</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  `
})
export class Home implements OnDestroy {
  private productService = inject(ProductService);
  readonly images = environment.images;
  readonly activeHeroSlide = signal(0);
  readonly heroSlides = [
    {
      eyebrow: 'Tekit, Yucatán · Capital Mundial de la Guayabera',
      title: 'El Arte de la Elegancia y la',
      highlight: 'Tradición Yucateca',
      description: 'Alta costura tradicional por Alan Uicab Medina. Guayaberas elegantes con el sello de personalidad que caracteriza a Guayaberas ALUM.',
      image: this.images.home.heroSlides.slide1 || this.images.home.heroBackground || this.images.home.heroShowcase,
      alt: 'Tradición yucateca de Guayaberas ALUM'
    },
    {
      eyebrow: 'Confección artesanal',
      title: 'Detalles que distinguen cada',
      highlight: 'Guayabera ALUM',
      description: 'Prendas elaboradas con atención al detalle, acabados elegantes y la experiencia artesanal de Tekit, Yucatán.',
      image: this.images.home.heroSlides.slide2,
      alt: 'Detalle artesanal de una prenda ALUM'
    },
    {
      eyebrow: 'Hecho en Tekit, Yucatán',
      title: 'Tradición que se transforma en',
      highlight: 'Elegancia',
      description: 'Descubre piezas para ocasiones especiales y para vestir con frescura, identidad y estilo todos los días.',
      image: this.images.home.heroSlides.slide3,
      alt: 'Proceso artesanal de Guayaberas ALUM'
    }
  ];
  private heroTimer = setInterval(() => this.nextHeroSlide(), 6500);

  constructor() {
    // Refresco comercial con ventana de frescura. Si GuayaFlow responde 403/503,
    // el errorInterceptor actualiza el status y redirige sin consultar /status.
    this.productService.loadForNavigation().subscribe({
      error: () => {
        // El interceptor/servicio global decide maintenance/inactive/error.
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.heroTimer);
  }

  previousHeroSlide(): void {
    this.activeHeroSlide.update(index => (index - 1 + this.heroSlides.length) % this.heroSlides.length);
  }

  nextHeroSlide(): void {
    this.activeHeroSlide.update(index => (index + 1) % this.heroSlides.length);
  }

  goToHeroSlide(index: number): void {
    this.activeHeroSlide.set(index);
  }

  readonly categoryCards = computed<HomeCategoryCard[]>(() => {
    const categories = new Map<string, { department: string; image?: string }>();

    for (const product of this.productService.products()) {
      const department = String(product.departamento || product.category || '').trim();
      if (!department) continue;

      const key = this.categoryKey(department);
      if (!categories.has(key)) {
        // La tarjeta representa el primer producto recibido por la API para el
        // departamento. Se usa únicamente una imagen real de GuayaFlow; no el
        // fallback visual que ProductService aplica a las fichas de producto.
        const apiImages = product.rawApi?.images_url || [];
        const firstProductImage = apiImages.find(Boolean)
          || product.rawApi?.color_images?.flatMap(color => color.images_url || []).find(Boolean);

        categories.set(key, {
          department,
          image: firstProductImage || undefined
        });
      }
    }

    return Array.from(categories.entries())
      .map(([key, source]) => {
        const presentation = HOME_CATEGORY_PRESENTATION[key];

        if (presentation) {
          return {
            key,
            department: source.department,
            ...presentation,
            image: source.image
          };
        }

        return {
          key,
          department: source.department,
          title: source.department.toLocaleUpperCase('es-MX'),
          eyebrow: 'Colección ALUM',
          description: `Descubre nuestra colección de ${source.department}.`,
          image: source.image,
          alt: `Colección ${source.department}`,
          accentClass: 'text-[#C9A87C]',
          hoverClass: 'group-hover:text-[#00A7D4]',
          order: 99
        };
      })
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'es'));
  });

  readonly featuredProducts = computed(() => this.productService.getFeaturedProducts().slice(0, 4));

  private categoryKey(value: string): string {
    const normalized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLocaleLowerCase('es-MX');

    if (normalized.includes('caballer')) return 'caballeros';
    if (normalized.includes('dama')) return 'damas';
    if (normalized.includes('nina')) return 'ninas';
    if (normalized.includes('nino')) return 'ninos';

    return normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}
