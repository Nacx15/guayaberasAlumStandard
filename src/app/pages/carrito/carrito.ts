import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { getApiErrorMessage } from '../../shared/http/api-error.util';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-[#0D131A] text-[#F9F7F2] py-8 sm:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Breadcrumb & Title -->
        <nav class="flex items-center gap-2 text-xs text-stone-400 mb-4 font-medium">
          <a routerLink="/" class="hover:text-[#00A7D4]">Inicio</a>
          <span>/</span>
          <span class="text-[#C9A87C] font-bold">Carrito de Compras</span>
        </nav>

        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-white mb-8">
          Tu Carrito de Alta Costura
        </h1>

        @if (cartService.totalItemsCount() > 0) {
          
          <!-- Free Shipping Progress Indicator -->
          <div class="bg-[#151F2A] p-4.5 rounded-2xl border border-[#AE875B]/30 shadow-md mb-8">
            <div class="flex items-center justify-between text-xs font-semibold text-white mb-2">
              <span class="flex items-center gap-1.5">
                <span class="material-icons text-sm text-[#00A7D4]">local_shipping</span>
                @if (cartService.subtotal() >= cartService.freeShippingThreshold) {
                  <span class="text-emerald-400 font-bold">¡Felicidades! Tienes Envío Gratis a todo México.</span>
                } @else {
                  <span>
                    Te faltan <strong class="text-[#C9A87C]">\${{ cartService.freeShippingThreshold - cartService.subtotal() | number:'1.2-2' }} MXN</strong> para obtener <strong>Envío Gratis</strong>
                  </span>
                }
              </span>
              <span class="text-[11px] text-stone-400">Monto Mínimo: $1,999 MXN</span>
            </div>
            <div class="w-full bg-[#0D131A] rounded-full h-2 overflow-hidden border border-stone-800">
              <div class="bg-[#00A7D4] h-2 rounded-full transition-all duration-500"
                   [style.width.%]="getProgressPercent()"></div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT: Cart Items List -->
            <div class="lg:col-span-8 space-y-4">
              @for (item of cartService.items(); track $index) {
                <div class="bg-[#151F2A] p-4 sm:p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col sm:flex-row items-center gap-5">
                  
                  <!-- Product Image -->
                  <a [routerLink]="['/producto', item.product.id]" class="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-[#0D131A] flex-shrink-0 border border-stone-800">
                    <img [src]="item.product.images[0]" [alt]="item.product.name" class="w-full h-full object-cover" />
                  </a>

                  <!-- Info Details -->
                  <div class="flex-1 min-w-0 text-center sm:text-left space-y-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-[#C9A87C]">
                      {{ item.product.embroideryType }}
                    </span>
                    <h3 class="font-serif font-bold text-base text-white truncate">
                      <a [routerLink]="['/producto', item.product.id]" class="hover:text-[#00A7D4] transition-colors">
                        {{ item.product.name }}
                      </a>
                    </h3>
                    
                    <!-- Size & Color Badges -->
                    <div class="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-stone-300">
                      <span class="px-2.5 py-0.5 bg-[#0D131A] border border-stone-700 rounded-md font-semibold text-stone-200">
                        Talla: {{ item.selectedSize }}
                      </span>
                      <span class="px-2.5 py-0.5 bg-[#0D131A] border border-stone-700 rounded-md font-semibold text-stone-200">
                        Color: {{ item.selectedColor }}
                      </span>
                    </div>

                    <p class="text-xs text-stone-400 pt-1 font-sans">
                      100% Lino • Confeccionado en Tekit, Yuc.
                    </p>
                  </div>

                  <!-- Controls & Price -->
                  <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <div class="text-right">
                      <p class="text-base font-bold text-white font-sans">
                        \${{ item.product.price * item.quantity | number:'1.2-2' }} MXN
                      </p>
                      @if (item.quantity > 1) {
                        <p class="text-[10px] text-stone-400">(\${{ item.product.price | number }} c/u)</p>
                      }
                    </div>

                    <!-- Quantity Controls -->
                    <div class="flex items-center border border-stone-700 rounded-xl bg-[#0D131A] p-1">
                      <button (click)="cartService.updateQuantity($index, item.quantity - 1)" 
                              class="w-7 h-7 flex items-center justify-center text-stone-300 hover:bg-stone-800 rounded-lg"
                              aria-label="Disminuir cantidad">
                        <span class="material-icons text-xs">remove</span>
                      </button>
                      <span class="w-8 text-center text-xs font-bold text-white">{{ item.quantity }}</span>
                      <button (click)="cartService.updateQuantity($index, item.quantity + 1)" 
                              class="w-7 h-7 flex items-center justify-center text-stone-300 hover:bg-stone-800 rounded-lg"
                              aria-label="Aumentar cantidad">
                        <span class="material-icons text-xs">add</span>
                      </button>
                    </div>

                    <!-- Remove Item Button -->
                    <button (click)="cartService.removeItem($index)" 
                            class="text-xs text-rose-400 hover:text-rose-300 p-1 flex items-center gap-1"
                            title="Eliminar del carrito">
                      <span class="material-icons text-base">delete_outline</span>
                      <span class="hidden sm:inline text-[11px]">Quitar</span>
                    </button>
                  </div>

                </div>
              }
            </div>

            <!-- RIGHT: Order Summary in Dark Box with Golden Borders -->
            <div class="lg:col-span-4">
              <div class="bg-[#151F2A] p-6 sm:p-8 rounded-3xl border-2 border-[#AE875B]/40 shadow-xl space-y-6">
                
                <h3 class="font-serif font-bold text-xl text-white pb-3 border-b border-stone-800">
                  Resumen de Compra
                </h3>

                <!-- Coupon Input Form -->
                <div class="space-y-2">
                  <label for="coupon-code" class="block text-xs font-bold text-stone-200 uppercase tracking-wider">Cupón de Descuento</label>
                  
                  @if (cartService.appliedCoupon(); as c) {
                    <div class="flex items-center justify-between p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-xs">
                      <span class="font-bold text-emerald-300">Cupón activo: {{ c }}</span>
                      <button (click)="cartService.removeCoupon()" class="text-rose-400 hover:underline font-bold text-[11px]">
                        Remover
                      </button>
                    </div>
                  } @else {
                    <div class="flex gap-2">
                      <input id="coupon-code"
                             type="text"
                             [value]="couponCode()"
                             (input)="couponCode.set($any($event.target).value)"
                             placeholder="Ej. TEKIT10 o ALUMLINO"
                             class="flex-1 px-3 py-2 bg-[#0D131A] border border-stone-700 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#00A7D4]" />
                      <button (click)="applyCoupon()"
                              class="px-4 py-2 bg-[#AE875B] hover:bg-[#8F6A40] text-white text-xs font-bold rounded-xl transition-colors shadow-md">
                        Aplicar
                      </button>
                    </div>
                    <p class="text-[10px] text-stone-400">Prueba con: <strong>TEKIT10</strong> (10% desc.)</p>
                  }
                </div>

                <!-- Price Breakdown -->
                <div class="space-y-3 pt-4 border-t border-stone-800 text-xs">
                  <div class="flex items-center justify-between text-stone-300">
                    <span>Subtotal:</span>
                    <span class="font-bold text-white font-sans">\${{ cartService.subtotal() | number:'1.2-2' }} MXN</span>
                  </div>

                  <div class="flex items-center justify-between text-stone-300">
                    <span>Envío Estimado (Estafeta / DHL):</span>
                    @if (cartService.shippingCost() === 0) {
                      <span class="font-bold text-emerald-400 uppercase">Gratis</span>
                    } @else {
                      <span class="font-bold text-white font-sans">\${{ cartService.shippingCost() | number:'1.2-2' }} MXN</span>
                    }
                  </div>

                  @if (cartService.discountAmount() > 0) {
                    <div class="flex items-center justify-between text-emerald-400 font-semibold">
                      <span>Descuento aplicado:</span>
                      <span>-\${{ cartService.discountAmount() | number:'1.2-2' }} MXN</span>
                    </div>
                  }

                  <!-- Total -->
                  <div class="pt-4 border-t border-stone-800 flex items-baseline justify-between">
                    <span class="text-base font-serif font-bold text-white">Total a Pagar:</span>
                    <div class="text-right">
                      <span class="text-2xl font-extrabold text-[#C9A87C] font-sans">
                        \${{ cartService.total() | number:'1.2-2' }}
                      </span>
                      <span class="text-xs text-stone-400 block">MXN (IVA Incluido)</span>
                    </div>
                  </div>
                </div>

                <!-- Checkout Button -->
                <div class="space-y-3 pt-2">
                  <a routerLink="/checkout"
                     [attr.aria-disabled]="cartService.isRevalidating()"
                     [class.pointer-events-none]="cartService.isRevalidating()"
                     [class.opacity-60]="cartService.isRevalidating()"
                     class="w-full py-4 px-6 bg-[#00A7D4] hover:bg-[#008AA0] text-white font-bold text-sm text-center rounded-xl shadow-xl transition-all flex items-center justify-center gap-2">
                    @if (cartService.isRevalidating()) {
                      <span class="material-icons text-lg animate-spin">sync</span>
                      Validando existencias...
                    } @else {
                      <span class="material-icons text-lg">lock</span>
                      Proceder al Pago Seguro
                    }
                  </a>

                  <a routerLink="/catalogo" 
                     class="block w-full py-2.5 text-center text-xs text-stone-400 hover:text-[#00A7D4] font-medium">
                    ← Continuar Comprando
                  </a>
                </div>

                <!-- Security Guarantees -->
                <div class="pt-4 border-t border-stone-800 flex items-center justify-around text-[11px] text-stone-400">
                  <span class="flex items-center gap-1">
                    <span class="material-icons text-xs text-[#00A7D4]">shield</span>
                    Pago Protegido
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1">
                    <span class="material-icons text-xs text-[#C9A87C]">local_shipping</span>
                    Envío Asegurado
                  </span>
                </div>

              </div>
            </div>

          </div>

        } @else {
          <!-- Empty Cart State -->
          <div class="bg-[#151F2A] rounded-3xl p-12 sm:p-16 text-center border border-stone-800 shadow-xl max-w-lg mx-auto space-y-4">
            <div class="w-16 h-16 rounded-full bg-[#AE875B]/20 text-[#C9A87C] flex items-center justify-center mx-auto border border-[#AE875B]/30">
              <span class="material-icons text-3xl">shopping_bag</span>
            </div>
            <h2 class="font-serif font-bold text-2xl text-white">Tu carrito está vacío</h2>
            <p class="text-xs sm:text-sm text-stone-400 max-w-xs mx-auto">
              Aún no has agregado prendas de lino. Descubre nuestra colección presidencial y modelos artesanales de Tekit.
            </p>
            <div class="pt-2">
              <a routerLink="/catalogo" 
                 class="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00A7D4] hover:bg-[#008AA0] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all">
                <span class="material-icons text-base">storefront</span>
                Ir al Catálogo de Lino
              </a>
            </div>
          </div>
        }

      </div>
    </main>
  `
})
export class Carrito implements OnInit {
  readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);
  couponCode = signal('');

  ngOnInit(): void {
    void this.refreshCartOnEntry();
  }

  private async refreshCartOnEntry(): Promise<void> {
    if (this.cartService.items().length === 0) return;

    try {
      await this.cartService.refreshAvailability();
    } catch (error) {
      this.toastService.show(
        getApiErrorMessage(error, 'No fue posible actualizar las existencias del carrito. Se volverán a validar antes del checkout.'),
        'error',
        6500
      );
    }
  }

  getProgressPercent(): number {
    const sub = this.cartService.subtotal();
    const target = this.cartService.freeShippingThreshold;
    return Math.min(100, Math.round((sub / target) * 100));
  }

  applyCoupon(): void {
    if (!this.couponCode().trim()) return;
    this.cartService.applyCoupon(this.couponCode());
  }
}
