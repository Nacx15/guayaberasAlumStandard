export interface MercadoPagoItem {
  /** ID autoritativo de la variante de inventario (ApiVariante.id), no del modelo/producto. */
  id: number;
  modelName: string;
  price: number;
  cartQty: number;
  color: string;
  size: string;
}

export interface MercadoPagoShippingAddress {
  customer_name: string;
  phone: string;
  email: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface MercadoPagoPreferenceRequest {
  type: string;
  total_amount: number;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  paymentMethod: string;
  items: MercadoPagoItem[];
  shipping_address: MercadoPagoShippingAddress;
}

export interface WhatsAppOrderRequest extends MercadoPagoPreferenceRequest {}

export interface MercadoPagoPreferenceResponse {
  success: boolean;
  sale_id: number;
  init_point: string;
  preference_id: string;
  reservation_expires_at: string | null;
  order_status_url: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
}

export interface WhatsAppOrderResponse {
  success: boolean;
  message: string;
  sale_id: number | string;
  /** Totales autoritativos recalculados por GuayaFlow al registrar la venta. */
  subtotal: number;
  shipping_cost: number;
  total: number;
}

export interface OrderStatusResponse {
  success: boolean;
  data: {
    sale_id: number;
    sale_status: string;
    payment_status: string;
    amount_paid: number;
    balance_due: number;
    total: number;
    payment_provider?: string | null;
    provider_payment_id?: string | null;
    reservation: {
      state: string;
      expires_at?: string | null;
      released_at?: string | null;
      release_reason?: string | null;
    };
    updated_at?: string | null;
  };
}
