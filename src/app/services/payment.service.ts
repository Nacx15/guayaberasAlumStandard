import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MercadoPagoItem,
  MercadoPagoPreferenceRequest,
  MercadoPagoPreferenceResponse,
  MercadoPagoShippingAddress,
  WhatsAppOrderRequest,
  WhatsAppOrderResponse
} from '../models/payment.model';
import { CartItem } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);

  private formatCartItems(cartItems: CartItem[]): MercadoPagoItem[] {
    return cartItems.map((item) => {
      // selectedSize/selectedColor son la identidad canónica del renglón de carrito.
      // createCheckoutSnapshot() re-resuelve selectedVariant desde el catálogo vivo antes
      // de construir cualquier payload saliente. El backend espera items[].id como ID de
      // VARIANTE, nunca como ID del modelo/producto.
      const canonicalColor = String(item.selectedColor ?? '').trim();
      const canonicalSize = String(item.selectedSize ?? '').trim();
      const variant = item.selectedVariant;
      const variantMatchesSelection = !!variant
        && this.normalizeVariantValue(variant.color) === this.normalizeVariantValue(canonicalColor)
        && this.normalizeVariantValue(variant.talla) === this.normalizeVariantValue(canonicalSize);

      const variantId = Number(variant?.id);
      if (!variantMatchesSelection || !Number.isInteger(variantId) || variantId <= 0) {
        throw new Error(
          `No fue posible validar el ID de variante para ${item.product.name} (${canonicalColor}, talla ${canonicalSize}).`
        );
      }

      const price = Number(variant?.precio_ecommerce ?? 0);
      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(
          `La variante ${item.product.name} (${canonicalColor}, talla ${canonicalSize}) no tiene precio e-commerce válido.`
        );
      }

      return {
        id: variantId,
        modelName: `${item.product.name} color ${canonicalColor} talla ${canonicalSize}`,
        price,
        cartQty: item.quantity,
        color: canonicalColor,
        size: canonicalSize
      };
    });
  }

  private normalizeVariantValue(value: unknown): string {
    return String(value ?? '').trim().toLocaleLowerCase('es-MX');
  }

  private formatShippingAddress(shippingForm: {
    customer_name: string;
    phone: string;
    email?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country?: string;
  }): MercadoPagoShippingAddress {
    return {
      customer_name: (shippingForm.customer_name || '').trim(),
      phone: (shippingForm.phone || '').replace(/[^\d+]/g, '').trim(),
      email: (shippingForm.email || '').trim(),
      address_line_1: (shippingForm.address_line_1 || '').trim(),
      address_line_2: (shippingForm.address_line_2 || '').trim(),
      city: (shippingForm.city || '').trim(),
      state: (shippingForm.state || '').trim(),
      postal_code: (shippingForm.postal_code || '').trim(),
      country: (shippingForm.country || 'MX').trim().toUpperCase()
    };
  }

  buildPreferencePayload(
    cartItems: CartItem[],
    subtotal: number,
    shippingCost: number,
    discount: number,
    total: number,
    shippingForm: {
      customer_name: string;
      phone: string;
      email: string;
      address_line_1: string;
      address_line_2?: string;
      city: string;
      state: string;
      postal_code: string;
      country?: string;
    }
  ): MercadoPagoPreferenceRequest {
    return {
      type: 'Venta Directa',
      total_amount: total,
      subtotal,
      discount,
      shipping_cost: shippingCost,
      tax: 0,
      paymentMethod: 'mercado_pago',
      items: this.formatCartItems(cartItems),
      shipping_address: this.formatShippingAddress(shippingForm)
    };
  }

  buildWhatsAppPayload(
    cartItems: CartItem[],
    subtotal: number,
    shippingCost: number,
    discount: number,
    total: number,
    shippingForm: {
      customer_name: string;
      phone: string;
      email?: string;
      address_line_1: string;
      address_line_2?: string;
      city: string;
      state: string;
      postal_code: string;
      country?: string;
    }
  ): WhatsAppOrderRequest {
    return {
      ...this.buildPreferencePayload(
        cartItems,
        subtotal,
        shippingCost,
        discount,
        total,
        {
          ...shippingForm,
          email: shippingForm.email ?? ''
        }
      ),
      paymentMethod: 'whatsapp'
    };
  }

  createPreference(payload: MercadoPagoPreferenceRequest): Observable<{
    success: true;
    data: MercadoPagoPreferenceResponse;
    requestPayload: MercadoPagoPreferenceRequest;
  }> {
    return this.http.post<MercadoPagoPreferenceResponse>(`${environment.apiUrl}/payment/create-preference`, payload).pipe(
      timeout(15000),
      map((response) => ({
        success: true as const,
        data: response,
        requestPayload: payload
      }))
    );
  }

  createWhatsAppOrder(payload: WhatsAppOrderRequest): Observable<{
    success: true;
    data: WhatsAppOrderResponse;
    requestPayload: WhatsAppOrderRequest;
  }> {
    return this.http.post<WhatsAppOrderResponse>(`${environment.apiUrl}/payment/create-whatsapp-order`, payload).pipe(
      timeout(15000),
      map((response) => ({
        success: true as const,
        data: response,
        requestPayload: payload
      }))
    );
  }
}
