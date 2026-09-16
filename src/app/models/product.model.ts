export interface ApiVariante {
  id: number;
  sku: string;
  descripcion: string;
  precio_publico: number;
  precio_ecommerce?: number;
  precio_mayoreo?: number;
  hex: string;
  color: string;
  color_id: number;
  talla: string;
  talla_id: number;
  qtyBodega: number;
  qty_apartado?: number;
  qtyApartado?: number;
  availableBodega?: number;
  qtyProduccion: number;
  qtyPreventa: number;
  images_url: string[];
}

export interface ApiColorImage {
  color_id: string | number;
  images_url: string[];
}

export interface ApiProducto {
  id: number;
  nombre: string;
  ref_code: string;
  precio_publico: number;
  precio_ecommerce?: number;
  precio_mayoreo?: number;
  department_id: number;
  departamento: string;
  images_url: string[];
  color_images: ApiColorImage[];
  variantes: ApiVariante[];
  manga_id?: number;
  manga?: string;
}

export interface ApiDepartamento {
  id: number;
  name: string;
  description: string | null;
}

export interface ApiTalla {
  id: number;
  department_id: number;
  name: string;
  code: string;
}

export interface ApiColor {
  id: number;
  name: string;
  hex_code: string;
}

export interface ApiManga {
  id: number;
  name: string;
}

export interface ApiEcommerceResponse {
  productos: ApiProducto[];
  departamentos: ApiDepartamento[];
  tallas: ApiTalla[];
  colores: ApiColor[];
  mangas: ApiManga[];
}

export interface ProductVariant extends ApiVariante {
  qty_apartado: number;
  qtyApartado: number;
  availableBodega: number;
  stockDisponible: number;
}

export interface ProductColor {
  id?: number;
  name: string;
  hex: string;
  class: string;
  images?: string[];
}

export interface Product {
  id: string;
  numericId?: number;
  ref_code?: string;
  name: string;
  department_id?: number;
  departamento?: string;
  category: string;
  type: string;
  manga?: string;
  manga_id?: number;
  price: number;
  precio_ecommerce: number;
  precio_publico?: number;
  precio_mayoreo?: number;
  hasEcommercePrice: boolean;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  fabric: string;
  shortDescription: string;
  description: string;
  features: string[];
  images: string[];
  color_images?: ApiColorImage[];
  colors: ProductColor[];
  sizes: string[];
  inStock: boolean;
  totalStock: number;
  stockBodega: number;
  stockApartado: number;
  stockProduccion: number;
  stockPreventa: number;
  embroideryType: string;
  variantes: ProductVariant[];
  rawApi?: ApiProducto;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface FilterOptions {
  department: string;
  category: string;
  type: string;
  color: string;
  size: string;
  manga: string;
  onlyInStock: boolean;
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'stock' | 'name';
  searchQuery: string;
}

