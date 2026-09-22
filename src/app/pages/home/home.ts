import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
  image: string;
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
    image: environment.images.home.category.caballeros,
    alt: 'Guayaberas Caballero',
    accentClass: 'text-[#00A7D4]',
    hoverClass: 'group-hover:text-[#C9A87C]',
    order: 1
  },
  damas: {
    title: 'DAMA',
    eyebrow: 'Bordados Finos',
    description: 'Prendas pensadas para ella, vestidos elegantes y casuales.',
    image: environment.images.home.category.damas,
    alt: 'Vestidos y Blusas Dama',
    accentClass: 'text-[#C9A87C]',
    hoverClass: 'group-hover:text-[#00A7D4]',
    order: 2
  },
  ninos: {
    title: 'NIÑO',
    eyebrow: 'Tradición Familiar',
    description: 'Prendas pensadas para el más pequeño, manga corta y manga larga.',
    image: environment.images.home.category.ninos,
    alt: 'Línea Infantil Niño',
    accentClass: 'text-[#C9A87C]',
    hoverClass: 'group-hover:text-[#00A7D4]',
    order: 3
  },
  ninas: {
    title: 'NIÑA',
    eyebrow: 'Tradición Familiar',
    description: 'Prendas pensadas para la más pequeña, vestidos y blusas.',
    image: environment.images.home.category.ninas,
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
      
      <!-- HERO BANNER (Fondo primario oscuro #0D131A con contrastes luminosos en #AE875B, #00A7D4 y #F9F7F2) -->
      <section class="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden border-b border-[#AE875B]/25">
        <!-- Background image with blur and dark overlay -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <img [src]="images.home.heroBackground" 
               alt="Fondo taller y artesanía textil" 
               class="w-full h-full object-cover" 
               referrerpolicy="no-referrer" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0D131A] via-[#0D131A]/75 to-[#0D131A]/90"></div>
          <!-- <div class="absolute inset-0 bg-[#0D131A]/40"></div> -->
        </div>
        <div class="absolute top-10 right-10 w-96 h-96 bg-[#AE875B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-10 left-10 w-96 h-96 bg-[#00A7D4]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <!-- Left Hero Text -->
            <div class="lg:col-span-7 text-center lg:text-left space-y-6">
              
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151F2A] border border-[#AE875B]/40 shadow-md text-xs font-semibold text-white">
                <span class="w-2 h-2 rounded-full bg-[#00A7D4] animate-pulse"></span>
                <span class="text-[#C9A87C] uppercase tracking-wider font-bold">Tekit, Yucatán</span>
                <span class="text-stone-600">|</span>
                <span class="text-stone-300">Capital Mundial de la Guayabera</span>
              </div>

              <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight">
                El Arte de la <span class="text-[#C9A87C] italic">Elegancia</span> y la Tradición Yucateca
              </h1>

              <p class="text-base sm:text-lg text-stone-300 max-w-2xl font-sans leading-relaxed">
                Alta costura tradicional por <strong class="text-white">Alan Uicab Medina</strong>. Guayaberas elegantes con bordados en punto de cruz de alta calidad ideales para cualquier ocasión y con el sello de personalidad que caracteriza a Guayaberas ALUM.
              </p>

              <!-- CTA Buttons -->
              <div class="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a routerLink="/inactive" 
                   class="w-full sm:w-auto px-8 py-4 bg-[#00A7D4] hover:bg-[#008AA0] text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <span class="material-icons text-lg">storefront</span>
                  inactive
                </a>

                <a routerLink="/maintenance" 
                   class="w-full sm:w-auto px-8 py-4 bg-[#151F2A] hover:bg-[#1C2938] text-white border border-[#AE875B]/40 hover:border-[#AE875B] font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                  <span class="material-icons text-lg text-[#C9A87C]">design_services</span>
                  maintenance
                </a>
              </div>

              <!-- Key Value Metrics / Guarantees -->
              <div class="pt-6 grid grid-cols-3 gap-4 border-t border-stone-800 max-w-lg mx-auto lg:mx-0">
                <!-- <div class="text-center lg:text-left">
                  <p class="text-xl sm:text-2xl font-serif font-bold text-white">100%</p>
                  <p class="text-[11px] text-stone-400 font-medium uppercase tracking-wider">Lino Fino</p>
                </div>
                <div class="text-center lg:text-left">
                  <p class="text-xl sm:text-2xl font-serif font-bold text-[#38C7EC]">+120</p>
                  <p class="text-[11px] text-stone-400 font-medium uppercase tracking-wider">Alforzas x Pieza</p>
                </div> -->
                <div class="text-center lg:text-left">
                  <p class="text-xl sm:text-2xl font-serif font-bold text-[#C9A87C]">Tekit</p>
                  <p class="text-[11px] text-stone-400 font-medium uppercase tracking-wider">Hecho a Mano</p>
                </div>
              </div>

            </div>

            <!-- Right Hero Visual Showcase -->
            <div class="lg:col-span-5 relative">
              <div class="relative mx-auto max-w-md lg:max-w-none">
                
                <!-- Main Image Card -->
                <div class="relative bg-[#151F2A] p-3 sm:p-4 rounded-3xl border border-[#AE875B]/40 shadow-2xl overflow-hidden">
                  <img [src]="images.home.heroShowcase" 
                       alt="Guayabera de Gala ALUM Tekit" 
                       class="w-full h-[400px] sm:h-[480px] object-cover rounded-2xl" />
                  
                  <!-- Floating Badge overlay -->
                  <div class="absolute bottom-6 left-6 right-6 bg-[#0D131A]/95 backdrop-blur-md p-4 rounded-2xl border border-[#AE875B]/40 shadow-xl">
                    <div class="flex items-center justify-between">
                      <div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-[#00A7D4]">Edición Presidencial</span>
                        <h4 class="font-serif font-bold text-sm text-white">Lino Italiano & Alforzas Finas</h4>
                      </div>
                      <span class="text-sm font-bold text-[#C9A87C]">$2,450 MXN</span>
                    </div>
                  </div>
                </div>

                <!-- Floating Accent Card -->
                <div class="hidden sm:flex absolute -top-4 -left-6 bg-[#151F2A]/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#AE875B]/40 shadow-2xl items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#AE875B]/20 text-[#C9A87C] flex items-center justify-center">
                    <span class="material-icons text-xl">verified</span>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-white">Auténtico Tekit, Yuc.</p>
                    <p class="text-[10px] text-stone-300">Alan Uicab Medina</p>
                  </div>
                </div>

              </div>
            </div>

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
                <img [src]="category.image"
                     [alt]="category.alt"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (product of featuredProducts(); track product.id) {
            <app-product-card [product]="product"></app-product-card>
          }
        </div>
      </section>

      <!-- ALUM TRADITION & TEKIT WORKSHOP PROMISE BANNER -->
      <section class="py-16 bg-[#090D12] border-y border-[#AE875B]/25 relative overflow-hidden">
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
export class Home {
  private productService = inject(ProductService);
  readonly images = environment.images;

  constructor() {
    // Refresco comercial con ventana de frescura. Si GuayaFlow responde 403/503,
    // el errorInterceptor actualiza el status y redirige sin consultar /status.
    this.productService.loadForNavigation().subscribe({
      error: () => {
        // El interceptor/servicio global decide maintenance/inactive/error.
      }
    });
  }

  readonly categoryCards = computed<HomeCategoryCard[]>(() => {
    const categories = new Map<string, { department: string; image?: string }>();

    for (const product of this.productService.products()) {
      const department = String(product.departamento || product.category || '').trim();
      if (!department) continue;

      const key = this.categoryKey(department);
      if (!categories.has(key)) {
        categories.set(key, {
          department,
          image: product.images?.find(Boolean)
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
            ...presentation
          };
        }

        return {
          key,
          department: source.department,
          title: source.department.toLocaleUpperCase('es-MX'),
          eyebrow: 'Colección ALUM',
          description: `Descubre nuestra colección de ${source.department}.`,
          image: source.image || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop',
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
