import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // El resultado depende de sessionStorage + URL firmada guardada en el navegador.
  { path: 'payment/success', renderMode: RenderMode.Client },
  { path: 'payment/pending', renderMode: RenderMode.Client },
  { path: 'payment/failure', renderMode: RenderMode.Client },
  { path: 'payment/result', renderMode: RenderMode.Client },
  { path: 'pago/exito', renderMode: RenderMode.Client },
  { path: 'pago/pendiente', renderMode: RenderMode.Client },
  { path: 'pago/fallo', renderMode: RenderMode.Client },
  { path: 'producto/:id', renderMode: RenderMode.Client },

  // Estado, catálogo y disponibilidad son dinámicos: no deben quedar congelados en prerender.
  { path: '**', renderMode: RenderMode.Server },
];
