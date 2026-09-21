import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-nosotros',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-[#0D131A] text-[#F9F7F2]">
      
      <!-- Top Hero Header -->
      <section class="relative py-16 sm:py-24 bg-[#151F2A] border-b border-[#AE875B]/30 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#AE875B]/20 text-[#C9A87C] border border-[#AE875B]/30 uppercase tracking-wider mb-4">
            <span class="material-icons text-sm">history_edu</span>
            NUESTRA HISTORIA Y RAÍCES
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            Tradición, Alta Costura y Pasión por la Elegancia
          </h1>
          <p class="text-base sm:text-lg text-stone-300 mt-4 leading-relaxed font-sans">
            Desde Tekit, la capital mundial de la guayabera en Yucatán, <strong>Alan Uicab Medina</strong> lidera una firma comprometida con la autenticidad, la precisión geométrica maya y la elegancia sin tiempo.
          </p>
        </div>
      </section>

      <!-- Founder & Tekit Origin Story -->
      <section class="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Image Collage -->
          <div class="lg:col-span-6 relative">
            <div class="relative bg-[#151F2A] p-3 rounded-3xl border border-[#AE875B]/30 shadow-2xl overflow-hidden">
              <img [src]="images.nosotros.founderWorkshop" 
                   alt="Taller de guayaberas Tekit Alan Uicab" 
                   class="w-full h-[440px] object-cover rounded-2xl" />
              
              <div class="absolute bottom-6 left-6 bg-[#0D131A]/95 text-white p-4 rounded-2xl border border-[#AE875B]/40 max-w-xs backdrop-blur-md shadow-2xl">
                <p class="text-xs font-bold text-[#C9A87C]">Alan Uicab Medina</p>
                <p class="text-[11px] text-stone-300">Fundador & Maestro Sastre de Guayaberas ALUM</p>
              </div>
            </div>
          </div>

          <!-- Story Text -->
          <div class="lg:col-span-6 space-y-6">
            <span class="text-xs font-bold uppercase tracking-widest text-[#38C7EC]">El Origen de GUAYABERAS ALUM</span>
            <h2 class="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Honrando las Manos que Hacen Grande a Yucatán
            </h2>
            
            <p class="text-sm text-stone-300 leading-relaxed font-sans">
              En Tekit, Yucatán, la costura no es simplemente una industria: es una herencia viva que pasa de generación en generación. <strong>GUAYABERAS ALUM</strong> nace de la visión de <strong>Alan Uicab Medina</strong> de elevar la prenda emblemática del sureste mexicano al nivel de la más refinada sastrería internacional.
            </p>

            <p class="text-sm text-stone-300 leading-relaxed font-sans">
              Cada una de nuestras guayaberas y vestidos incorpora elementos simbólicos de nuestra cultura: las espirales en greca que representan el movimiento cósmico maya, el alforzado milimétrico que brinda una estructura distinguida y el deshilado artesanal que permite que la brisa fluya libremente a través del lino.
            </p>

            <div class="pt-4 border-t border-stone-800 grid grid-cols-2 gap-6">
              <div>
                <h4 class="font-serif font-bold text-lg text-[#C9A87C]">Tekit, Yucatán</h4>
                <p class="text-xs text-stone-400 mt-1">Ubicación de nuestro taller matriz y sala de exhibición.</p>
              </div>
              <!-- <div>
                <h4 class="font-serif font-bold text-lg text-[#38C7EC]">100% Lino Fino</h4>
                <p class="text-xs text-stone-400 mt-1">Fibras naturales seleccionadas de la más alta pureza.</p>
              </div> -->
            </div>
          </div>

        </div>
      </section>

      <!-- Craftsmanship & Production Process Gallery -->
      <section class="py-16 bg-[#151F2A] border-y border-stone-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="text-xs font-bold uppercase tracking-widest text-[#C9A87C]">Paso a Paso</span>
            <h2 class="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
              El Proceso Artesanal de Confección
            </h2>
            <p class="text-sm text-stone-300 mt-2">
              Detrás de cada prenda ALUM hay horas de dedicación, corte manual y bordado minucioso.
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <!-- Step 1 -->
            <div class="bg-[#0D131A] p-6 rounded-3xl border border-[#AE875B]/30 flex flex-col justify-between space-y-4 shadow-xl">
              <div>
                <span class="text-3xl font-serif font-bold text-[#C9A87C]">01</span>
                <h3 class="font-serif font-bold text-lg text-white mt-2">Selección de Lino</h3>
                <p class="text-xs text-stone-300 mt-2 leading-relaxed font-sans">
                  Telas frescas cómodas y duraderas que garantizan calidad y elegancia para todo momento especial.
                </p>
              </div>
              <div class="h-36 rounded-2xl overflow-hidden border border-stone-800">
                <img [src]="images.nosotros.processLinen" class="w-full h-full object-cover" alt="Lino puro" />
              </div>
            </div>

            <!-- Step 2 -->
            <div class="bg-[#0D131A] p-6 rounded-3xl border border-[#00A7D4]/30 flex flex-col justify-between space-y-4 shadow-xl">
              <div>
                <span class="text-3xl font-serif font-bold text-[#38C7EC]">02</span>
                <h3 class="font-serif font-bold text-lg text-white mt-2">Alforzado</h3>
                <p class="text-xs text-stone-300 mt-2 leading-relaxed font-sans">
                  Pliegue por pliegue se alinean las alforzas en los delanteros y traseros con precisión milimétrica.
                </p>
              </div>
              <div class="h-36 rounded-2xl overflow-hidden border border-stone-800">
                <img [src]="images.nosotros.processPleating" class="w-full h-full object-cover" alt="Alforzado fino" />
              </div>
            </div>

            <!-- Step 3 -->
            <div class="bg-[#0D131A] p-6 rounded-3xl border border-[#AE875B]/30 flex flex-col justify-between space-y-4 shadow-xl">
              <div>
                <span class="text-3xl font-serif font-bold text-[#C9A87C]">03</span>
                <h3 class="font-serif font-bold text-lg text-white mt-2">Bordado</h3>
                <p class="text-xs text-stone-300 mt-2 leading-relaxed font-sans">
                  Bordados elegantes con la aplicación del punto de cruz tradicional dejando un acabado lindo y elegante.
                </p>
              </div>
              <div class="h-36 rounded-2xl overflow-hidden border border-stone-800">
                <img [src]="images.nosotros.processEmbroidery" class="w-full h-full object-cover" alt="Bordado tradicional" />
              </div>
            </div>

            <!-- Step 4 -->
            <div class="bg-[#0D131A] p-6 rounded-3xl border border-[#00A7D4]/30 flex flex-col justify-between space-y-4 shadow-xl">
              <div>
                <span class="text-3xl font-serif font-bold text-[#38C7EC]">04</span>
                <h3 class="font-serif font-bold text-lg text-white mt-2">Acabado</h3>
                <p class="text-xs text-stone-300 mt-2 leading-relaxed font-sans">
                  Pegado de botones, realización del ojal, planchado a vapor y control de calidad de la prenda ya finalizada.
                </p>
              </div>
              <div class="h-36 rounded-2xl overflow-hidden border border-stone-800">
                <img [src]="images.nosotros.processFinishing" class="w-full h-full object-cover" alt="Acabados finales" />
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Mission, Vision & Values Cards -->
      <section class="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
          
          <!-- Misión -->
          <div class="bg-[#151F2A] p-8 rounded-3xl border border-[#AE875B]/30 shadow-xl space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-[#AE875B]/20 text-[#C9A87C] flex items-center justify-center border border-[#AE875B]/30">
              <span class="material-icons text-2xl">flag</span>
            </div>
            <h3 class="font-serif font-bold text-xl text-white">Nuestra Misión</h3>
            <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              Preservar y engrandecer la tradición textil de Tekit confeccionando guayaberas y prendas de lino de la más alta costura, llevando la elegancia yucateca a los escenarios más distinguidos de México y el mundo.
            </p>
          </div>

          <!-- Visión -->
          <div class="bg-[#151F2A] p-8 rounded-3xl border border-[#00A7D4]/30 shadow-xl space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-[#00A7D4]/20 text-[#38C7EC] flex items-center justify-center border border-[#00A7D4]/30">
              <span class="material-icons text-2xl">visibility</span>
            </div>
            <h3 class="font-serif font-bold text-xl text-white">Nuestra Visión</h3>
            <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              Consolidar a <strong>GUAYABERAS ALUM</strong> como el referente de excelencia artesanal y moda contemporánea de lino, dignificando el trabajo de los artesanos tekiteños y promoviendo el comercio justo.
            </p>
          </div>

          <!-- Valores -->
          <div class="bg-[#151F2A] p-8 rounded-3xl border border-[#AE875B]/30 shadow-xl space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-[#AE875B]/20 text-[#C9A87C] flex items-center justify-center border border-[#AE875B]/30">
              <span class="material-icons text-2xl">favorite</span>
            </div>
            <h3 class="font-serif font-bold text-xl text-white">Nuestros Valores</h3>
            <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              Honestidad artesanal, calidad en cada puntada y compromiso con la satisfacción de cada cliente.
            </p>
          </div>

        </div>

        <div class="mt-14 text-center">
          <a routerLink="/catalogo" 
             class="inline-flex items-center gap-2 px-8 py-4 bg-[#00A7D4] hover:bg-[#008AA0] text-white text-sm font-semibold rounded-xl shadow-xl transition-all">
            Descubre Nuestras Creaciones <span class="material-icons text-base">arrow_forward</span>
          </a>
        </div>
      </section>

    </main>
  `
})
export class Nosotros {
  readonly images = environment.images;
}
