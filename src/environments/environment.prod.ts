export const environment = {
  production: true,
  tenant: 'alum_gf',
  apiUrl: 'https://api-multitenant.guayaflow.com/api',
  ecommerceStandardVersion: '1.0.0',
  useMock: false,
  endpoints: {
    ecommerceStatus: 'https://api-multitenant.guayaflow.com/api/ecommerce/status',
    products: 'https://api-multitenant.guayaflow.com/api/productos/ecommerce',
    createPreference: 'https://api-multitenant.guayaflow.com/api/payment/create-preference',
    createWhatsAppOrder: 'https://api-multitenant.guayaflow.com/api/payment/create-whatsapp-order',
  }
};
