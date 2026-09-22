import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { EcommerceStatusService } from '../../services/ecommerce-status.service';

@Component({
  selector: 'app-shipping-promo',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (shipping(); as config) {
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-5" aria-live="polite">
        <div class="rounded-2xl border border-[#AE875B]/35 bg-[#151F2A] px-4 py-4 sm:px-5 shadow-lg">
          <div class="flex gap-3 items-start">
            <span class="material-icons text-[#00A7D4] mt-0.5">local_shipping</span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold text-white">{{ title() }}</p>
              <p class="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">{{ description() }}</p>
              @if (config.freeShipping.enabled) {
                <div class="mt-3 h-1.5 rounded-full bg-[#0D131A] overflow-hidden" role="progressbar" [attr.aria-valuenow]="progressPercent()" aria-valuemin="0" aria-valuemax="100">
                  <div class="h-full bg-[#00A7D4] transition-all duration-300" [style.width.%]="progressPercent()"></div>
                </div>
              }
              <p class="text-[11px] text-stone-500 mt-2">Costo estimado. GuayaFlow confirma el envío y total final al crear el pedido.</p>
            </div>
          </div>
        </div>
      </section>
    }
  `,
})
export class ShippingPromo {
  private readonly status = inject(EcommerceStatusService);
  private readonly cart = inject(CartService);

  readonly shipping = this.status.shipping;
  readonly estimate = computed(() => this.status.estimateShipping(this.cart.totalItemsCount(), this.cart.subtotal()));
  readonly progressPercent = computed(() => Math.round((this.estimate()?.progress ?? 0) * 100));

  readonly title = computed(() => {
    const config = this.shipping();
    const estimate = this.estimate();
    if (!config || !estimate) return '';
    if (!config.freeShipping.enabled) return 'Envío disponible';
    if (estimate.qualifiesForFreeShipping) return '¡Ya tienes envío gratis!';

    const free = config.freeShipping;
    switch (free.condition) {
      case 'items': return `Envío gratis desde ${free.minItems} ${free.minItems === 1 ? 'prenda' : 'prendas'}`;
      case 'amount': return `Envío gratis desde $${this.money(free.minAmount)}`;
      case 'items_or_amount': return 'Dos formas de obtener envío gratis';
      case 'items_and_amount': return 'Completa ambos requisitos para envío gratis';
    }
  });

  readonly description = computed(() => {
    const config = this.shipping();
    const estimate = this.estimate();
    if (!config || !estimate) return '';

    if (!config.freeShipping.enabled) {
      return `La tarifa estándar estimada es de $${this.money(config.flatRate)} MXN.`;
    }
    if (estimate.qualifiesForFreeShipping) {
      return 'Tu carrito cumple la promoción configurada.';
    }

    const free = config.freeShipping;
    const itemsText = estimate.missingItems === 1 ? '1 prenda' : `${estimate.missingItems} prendas`;
    const amountText = `$${this.money(estimate.missingAmount)} MXN`;

    switch (free.condition) {
      case 'items': return `Agrega ${itemsText} más para obtener envío gratis.`;
      case 'amount': return `Agrega ${amountText} más a tu carrito para obtener envío gratis.`;
      case 'items_or_amount': return `Obtén envío gratis agregando ${itemsText} o ${amountText} más.`;
      case 'items_and_amount': {
        if (estimate.itemsMet) return `Ya cumples la cantidad de prendas; agrega ${amountText} más.`;
        if (estimate.amountMet) return `Ya cumples el monto; agrega ${itemsText} más.`;
        return `Agrega ${itemsText} y ${amountText} más para cumplir ambos requisitos.`;
      }
    }
  });

  constructor() {
    this.status.load().subscribe();
  }

  private money(value: number): string {
    return new Intl.NumberFormat('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
  }
}
