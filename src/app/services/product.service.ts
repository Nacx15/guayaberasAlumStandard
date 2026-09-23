import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, shareReplay, throwError, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiColor,
  ApiDepartamento,
  ApiEcommerceResponse,
  ApiManga,
  ApiProducto,
  ApiTalla,
  Product,
  ProductColor,
  ProductVariant
} from '../models/product.model';

const CURATED_IMAGES_BY_MODEL: Record<string, string[]> = {
  '1': [
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop'
  ],
  '2': [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop'
  ],
  '3': [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620012253295-c15c429fcc71?q=80&w=1000&auto=format&fit=crop'
  ],
  '4': [
    'https://images.unsplash.com/photo-1620012253295-c15c429fcc71?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop'
  ],
  '5': [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop'
  ],
  '6': [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop'
  ],
  '7': [
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620012253295-c15c429fcc71?q=80&w=1000&auto=format&fit=crop'
  ],
  '8': [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop'
  ],
  '9': [
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop'
  ],
  '10': [
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop'
  ],
  '11': [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop'
  ],
  '12': [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop'
  ]
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  readonly products = signal<Product[]>([]);
  readonly departamentos = signal<ApiDepartamento[]>([]);
  readonly tallas = signal<ApiTalla[]>([]);
  readonly colores = signal<ApiColor[]>([]);
  readonly mangas = signal<ApiManga[]>([]);

  readonly isLoading = signal<boolean>(false);
  readonly apiStatus = signal<'idle' | 'connected' | 'error'>('idle');
  readonly lastSync = signal<Date | null>(null);
  readonly errorMessage = signal<string | null>(null);

  /**
   * Ventana corta para navegación comercial. Home/Catálogo/Detalle pueden usar
   * el catálogo recién consultado sin repetir el GET en cada click, pero una
   * navegación posterior vuelve a tocar GuayaFlow y permite que el
   * errorInterceptor detecte maintenance/inactive mediante 503/403.
   *
   * Carrito/checkout NO usan esta ventana: llaman loadFromApi() directamente
   * porque stock/precio deben revalidarse de forma forzada en puntos críticos.
   */
  private readonly navigationCatalogMaxAgeMs = 20_000;
  private catalogRequestInFlight: Observable<Product[]> | null = null;

  constructor() {
    this.fetchFromApi();
  }

  fetchFromApi(): void {
    this.loadFromApi().subscribe({
      error: () => {
        // La UI conserva el catálogo vacío o la última respuesta real; nunca inyecta mocks.
      }
    });
  }

  /**
   * Carga usada por Home/Catálogo/Detalle. Reutiliza únicamente respuestas muy
   * recientes; cuando vencen vuelve a consultar productos. De esta manera las
   * llamadas de negocio funcionan también como heartbeat natural del tenant,
   * sin volver a consultar /ecommerce/status en cada navegación.
   */
  loadForNavigation(maxAgeMs = this.navigationCatalogMaxAgeMs): Observable<Product[]> {
    const lastSync = this.lastSync();
    const ageMs = lastSync ? Date.now() - lastSync.getTime() : Number.POSITIVE_INFINITY;
    const hasFreshCatalog =
      this.apiStatus() === 'connected'
      && lastSync !== null
      && ageMs >= 0
      && ageMs <= Math.max(0, maxAgeMs);

    if (hasFreshCatalog) {
      return of(this.products());
    }

    return this.loadFromApi();
  }

  /**
   * Consulta forzada del catálogo real. Las llamadas concurrentes comparten un
   * único request para evitar duplicados (por ejemplo, primera carga + Home).
   */
  loadFromApi(): Observable<Product[]> {
    if (this.catalogRequestInFlight) {
      return this.catalogRequestInFlight;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const request$ = this.http.get<ApiEcommerceResponse>(`${environment.apiUrl}/productos/ecommerce`).pipe(
      timeout(12000),
      map((res) => {
        if (!res || !Array.isArray(res.productos)) {
          throw new Error('Respuesta de catálogo inválida.');
        }

        this.processApiResponse(res, 'connected');
        return this.products();
      }),
      catchError((error: HttpErrorResponse | Error) => {
        this.apiStatus.set('error');
        this.errorMessage.set('No fue posible cargar el catálogo');
        return throwError(() => error);
      }),
      finalize(() => {
        if (this.catalogRequestInFlight === request$) {
          this.catalogRequestInFlight = null;
        }
        this.isLoading.set(false);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.catalogRequestInFlight = request$;
    return request$;
  }

  private processApiResponse(data: ApiEcommerceResponse, status: 'connected'): void {
    this.departamentos.set(data.departamentos || []);
    this.tallas.set(data.tallas || []);
    this.colores.set(data.colores || []);
    this.mangas.set(data.mangas || []);

    const transformedProducts = (data.productos || []).map((apiProd) => this.mapApiProduct(apiProd, data));
    this.products.set(transformedProducts);
    this.apiStatus.set(status);
    this.lastSync.set(new Date());
  }

  private mapApiProduct(apiProd: ApiProducto, catalogData: ApiEcommerceResponse): Product {
    // GuayaFlow E-commerce Standard: el precio web sale exclusivamente de ecommerce_price.
    const parsedPrice = Number(apiProd.precio_ecommerce ?? 0);
    const precioEcommerce = Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : 0;
    const hasEcommercePrice = precioEcommerce > 0;

    // 1. Process variants and compute stock availability
    const variants: ProductVariant[] = (apiProd.variantes || []).map((v) => {
      const qtyBodega = Number(v.qtyBodega ?? 0) || 0;
      const qtyApartado = Number(v.qtyApartado ?? v.qty_apartado ?? 0) || 0;
      const backendAvailable = Number(v.availableBodega);
      const availableBodega = Number.isFinite(backendAvailable)
        ? Math.max(0, backendAvailable)
        : Math.max(0, qtyBodega - qtyApartado);

      const rawVariantPrice = Number(v.precio_ecommerce ?? precioEcommerce);
      const variantPrecioEcommerce = Number.isFinite(rawVariantPrice) && rawVariantPrice > 0
        ? rawVariantPrice
        : precioEcommerce;

      return {
        ...v,
        qtyBodega,
        qty_apartado: qtyApartado,
        qtyApartado,
        availableBodega,
        precio_ecommerce: variantPrecioEcommerce,
        stockDisponible: availableBodega
      };
    });

    const stockBodega = variants.reduce((sum, v) => sum + (v.qtyBodega || 0), 0);
    const stockApartado = variants.reduce((sum, v) => sum + (v.qty_apartado || 0), 0);
    const stockProduccion = variants.reduce((sum, v) => sum + (v.qtyProduccion || 0), 0);
    const stockPreventa = variants.reduce((sum, v) => sum + (v.qtyPreventa || 0), 0);
    const totalStock = variants.reduce((sum, v) => sum + v.stockDisponible, 0);
    const inStock = totalStock > 0;

    // 2. Derive unique colors with image map
    const colorMap = new Map<string, ProductColor>();
    
    // First from variants
    for (const v of variants) {
      if (!colorMap.has(v.color)) {
        let hex = v.hex || '#FFFFFF';
        if (!hex || hex === '#ffffff') {
          const matchColor = catalogData.colores?.find(c => c.id === v.color_id || c.name.toLowerCase() === v.color.toLowerCase());
          if (matchColor) hex = matchColor.hex_code;
        }

        // Check if there are specific images in color_images
        const colorImgEntry = apiProd.color_images?.find(ci => String(ci.color_id) === String(v.color_id));
        const colorImgs = colorImgEntry?.images_url && colorImgEntry.images_url.length > 0
          ? colorImgEntry.images_url
          : (v.images_url || []);

        colorMap.set(v.color, {
          id: v.color_id,
          name: v.color,
          hex: hex || '#FFFFFF',
          class: `border-stone-600`,
          images: colorImgs
        });
      }
    }

    const colors: ProductColor[] = Array.from(colorMap.values());

    // 3. Derive unique sizes
    const sizeSet = new Set<string>();
    for (const v of variants) {
      if (v.talla) {
        sizeSet.add(v.talla);
      }
    }
    const sizes = Array.from(sizeSet);

    // 4. Resolve Images (with graceful fallback if URLs are empty or local container ports)
    let images: string[] = [];
    if (apiProd.images_url && apiProd.images_url.length > 0 && apiProd.images_url[0]) {
      images = [...apiProd.images_url];
    }
    
    // Append color images if available
    if (apiProd.color_images) {
      for (const ci of apiProd.color_images) {
        if (ci.images_url) {
          for (const imgUrl of ci.images_url) {
            if (imgUrl && !images.includes(imgUrl)) {
              images.push(imgUrl);
            }
          }
        }
      }
    }

    // If still empty or default fallback needed
    const curated = CURATED_IMAGES_BY_MODEL[String(apiProd.id)] || [];
    if (images.length === 0) {
      images = curated.length > 0 ? curated : [
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop'
      ];
    }

    // 5. Department resolution
    // El departamento siempre debe provenir del response real de GuayaFlow.
    // Si el producto solo trae department_id, resolvemos el nombre contra el catálogo
    // incluido en la misma respuesta; nunca inventamos Caballeros/Damas/Niños.
    const deptName = String(
      apiProd.departamento
      || catalogData.departamentos?.find(dept => dept.id === apiProd.department_id)?.name
      || ''
    ).trim();
    const categorySlug = deptName.toLocaleLowerCase('es-MX');

    // 6. Manga resolution
    // Igual que con departamento: únicamente usamos información contenida en el
    // response. Si no existe manga/manga_id configurado, el producto queda sin manga
    // y el filtro no mostrará valores ficticios.
    const mangaName = String(
      apiProd.manga
      || catalogData.mangas?.find(manga => manga.id === apiProd.manga_id)?.name
      || ''
    ).trim() || undefined;

    // 7. Embroidery & Fabric Details
    let embroideryType = 'Alforzado Fino Artesanal';
    if (apiProd.nombre.toLowerCase().includes('deshilado')) embroideryType = 'Deshilado Maya';
    else if (apiProd.nombre.toLowerCase().includes('huipil') || apiProd.nombre.toLowerCase().includes('vestido')) embroideryType = 'Punto de Cruz Yucateco';
    else if (apiProd.nombre.toLowerCase().includes('plateado')) embroideryType = 'Bordado Metálico de Autor';
    else if (apiProd.nombre.toLowerCase().includes('cuadriculado')) embroideryType = 'Bordado Geométrico';
    else if (apiProd.nombre.toLowerCase().includes('calabaza') || apiProd.nombre.toLowerCase().includes('rosas')) embroideryType = 'Bordado Floral Tekiteño';

    return {
      id: String(apiProd.id),
      numericId: apiProd.id,
      ref_code: apiProd.ref_code,
      name: apiProd.nombre,
      department_id: apiProd.department_id,
      departamento: deptName,
      category: categorySlug,
      type: deptName === 'Damas' ? 'vestido' : 'presidencial',
      manga: mangaName,
      manga_id: apiProd.manga_id,
      price: precioEcommerce,
      precio_ecommerce: precioEcommerce,
      precio_publico: apiProd.precio_publico,
      precio_mayoreo: apiProd.precio_mayoreo,
      hasEcommercePrice,
      // No inventar precios de comparación: GuayaFlow solo autoriza ecommerce_price para venta web.
      originalPrice: undefined,
      rating: Number((4.6 + ((apiProd.id % 5) * 0.1)).toFixed(1)),
      reviewsCount: 15 + (apiProd.id * 3),
      isNew: apiProd.id <= 4,
      isFeatured: apiProd.id === 1 || apiProd.id === 2 || apiProd.id === 4 || apiProd.id === 8,
      isBestSeller: apiProd.id === 1 || apiProd.id === 3 || apiProd.id === 7,
      fabric: 'Lino Puro de Tekit',
      shortDescription: `Confección artesanal yucateca con ${variants.length} variantes disponibles. Ref: ${apiProd.ref_code}.`,
      description: `La prenda "${apiProd.nombre}" (Ref: ${apiProd.ref_code}) es confeccionada en nuestro taller en Tekit, Yucatán. Cuenta con finos remates, alta transpirabilidad y acabados de lujo diseñados por Alan Uicab Medina.`,
      features: [
        `Lino fino pre-lavado y transpirable`,
        ...(deptName || mangaName
          ? [`Corte exclusivo ${[deptName, mangaName ? `(${mangaName})` : ''].filter(Boolean).join(' ')}`]
          : []),
        `Disponibilidad en almacén: ${stockBodega} pzas (Apartado: ${stockApartado})`,
        `Variantes en tallas: ${sizes.join(', ')}`,
        `Hecho 100% a mano en Tekit, Yucatán`
      ],
      images,
      color_images: apiProd.color_images,
      colors,
      sizes,
      inStock,
      totalStock,
      stockBodega,
      stockApartado,
      stockProduccion,
      stockPreventa,
      embroideryType,
      variantes: variants,
      rawApi: apiProd
    };
  }

  getProducts(): Product[] {
    return this.products();
  }

  getProductById(id: string): Product | undefined {
    const prods = this.products();
    return prods.find(p => p.id === id || String(p.numericId) === id || p.ref_code === id);
  }

  getFeaturedProducts(): Product[] {
    const prods = this.products();
    return prods.filter(p => p.isFeatured || p.isNew);
  }

  getNewArrivals(): Product[] {
    const prods = this.products();
    return prods.filter(p => p.isNew);
  }

  getRelatedProducts(currentId: string, category: string, limit = 3): Product[] {
    const prods = this.products();
    return prods
      .filter(p => p.id !== currentId && String(p.numericId) !== currentId)
      .slice(0, limit);
  }

  // Stock Validator method for a product & variant
  getVariantStock(productId: string | number, colorName: string, sizeName: string): {
    found: boolean;
    stockDisponible: number;
    qtyBodega: number;
    qtyApartado: number;
    qtyProduccion: number;
    qtyPreventa: number;
    sku?: string;
  } {
    const p = this.getProductById(String(productId));
    if (!p) {
      return { found: false, stockDisponible: 0, qtyBodega: 0, qtyApartado: 0, qtyProduccion: 0, qtyPreventa: 0 };
    }

    const normalizedColor = String(colorName ?? '').trim().toLocaleLowerCase('es-MX');
    const normalizedSize = String(sizeName ?? '').trim().toLocaleLowerCase('es-MX');
    const sameColor = (v: ProductVariant) =>
      String(v.color ?? '').trim().toLocaleLowerCase('es-MX') === normalizedColor;

    // Priorizar siempre la etiqueta real de talla. talla_id solo es fallback para
    // compatibilidad con referencias antiguas; nunca debe ganarle a una talla "40" real.
    const variant = p.variantes.find(v =>
      sameColor(v)
      && String(v.talla ?? '').trim().toLocaleLowerCase('es-MX') === normalizedSize
    ) ?? p.variantes.find(v =>
      sameColor(v)
      && String(v.talla_id) === String(sizeName).trim()
    );

    if (variant) {
      return {
        found: true,
        stockDisponible: variant.stockDisponible,
        qtyBodega: variant.qtyBodega,
        qtyApartado: variant.qtyApartado ?? variant.qty_apartado,
        qtyProduccion: variant.qtyProduccion,
        qtyPreventa: variant.qtyPreventa,
        sku: variant.sku
      };
    }

    return {
      found: false,
      stockDisponible: 0,
      qtyBodega: 0,
      qtyApartado: 0,
      qtyProduccion: 0,
      qtyPreventa: 0
    };
  }
}
