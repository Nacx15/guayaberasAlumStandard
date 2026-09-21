export const environment = {
  production: false,
  tenant: 'alum',
  apiUrl: 'https://dev-api-nacx.guayaflow.com/api',
  ecommerceStandardVersion: '1.0.0',
  useMock: false,
  endpoints: {
    ecommerceStatus: 'https://dev-api-nacx.guayaflow.com/api/ecommerce/status',
    products: 'https://dev-api-nacx.guayaflow.com/api/productos/ecommerce',
    createPreference: 'https://dev-api-nacx.guayaflow.com/api/payment/create-preference',
    createWhatsAppOrder: 'https://dev-api-nacx.guayaflow.com/api/payment/create-whatsapp-order',
  },
  images: {
    home: {
      heroBackground: 'https://assets.sm-panel.site/gallery/creacionesgolondrina/tienda_frente.jpeg',
      heroShowcase: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop',
      craftsmanshipDetail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
      craftsmanshipWorkshop: 'https://images.unsplash.com/photo-1620012253295-c15c429fcc71?q=80&w=600&auto=format&fit=crop',
    },
    nosotros: {
      founderWorkshop: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
      processLinen: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop',
      processPleating: 'https://images.unsplash.com/photo-1620012253295-c15c429fcc71?q=80&w=600&auto=format&fit=crop',
      processEmbroidery: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop',
      processFinishing: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    },
  },
};
