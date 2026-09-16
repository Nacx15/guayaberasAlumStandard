export const environment = {
  production: false,
  tenant: 'alum_gf',
  apiUrl: 'https://dev-api-nacx.guayaflow.com/api',
  ecommerceStandardVersion: '1.0.0',
  useMock: false,
  endpoints: {
    ecommerceStatus: 'https://dev-api-nacx.guayaflow.com/api/ecommerce/status',
    products: 'https://dev-api-nacx.guayaflow.com/api/productos/ecommerce',
    createPreference: 'https://dev-api-nacx.guayaflow.com/api/payment/create-preference',
    createWhatsAppOrder: 'https://dev-api-nacx.guayaflow.com/api/payment/create-whatsapp-order',
  }
};
