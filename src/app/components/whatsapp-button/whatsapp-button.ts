import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside aria-label="Atención por WhatsApp" class="fixed bottom-6 right-6 z-40 flex items-center group">
      <!-- Tooltip text on hover -->
      <span class="hidden sm:inline-block mr-3 px-3 py-1.5 bg-[#0D131A] text-white text-xs font-semibold rounded-xl shadow-lg border border-[#AE875B]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        ¿Tienes alguna duda? ¡Escríbenos!
      </span>

      <!-- Floating WhatsApp Button -->
      <a href="https://wa.me/529971149132?text=Hola%20Guayaberas%20ALUM,%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n%20sobre%20sus%20guayaberas%20de%20lino."
         target="_blank"
         rel="noopener noreferrer"
         class="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/70"
         aria-label="Contactar por WhatsApp a Guayaberas ALUM">
        
        <!-- Pulse effect -->
        <span class="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10"></span>
        
        <!-- WhatsApp Vector Icon -->
        <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.175.2-.351.226-.652.075s-1.272-.469-2.423-1.496c-.896-.799-1.5-1.788-1.676-2.089-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.101-.2.05-.376-.025-.527-.075-.15-.678-1.633-.929-2.235-.245-.587-.494-.507-.678-.517-.175-.01-.376-.01-.577-.01s-.527.075-.803.376c-.276.301-1.054 1.029-1.054 2.511s1.079 2.913 1.23 3.114c.15.201 2.123 3.242 5.143 4.547.719.311 1.281.497 1.719.636.722.23 1.378.197 1.898.12.579-.086 1.78-.727 2.031-1.429.251-.702.251-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.05 21.785h-.007a9.736 9.736 0 0 1-4.962-1.354l-.356-.211-3.691.968.985-3.598-.232-.369a9.742 9.742 0 0 1-1.497-5.187c0-5.385 4.382-9.768 9.771-9.768 2.607 0 5.059 1.016 6.903 2.86 1.844 1.845 2.859 4.298 2.859 6.907 0 5.387-4.382 9.77-9.77 9.77zm0-17.785c-4.418 0-8.012 3.594-8.012 8.012 0 1.547.442 3.037 1.28 4.328l-.837 3.058 3.14-.824a7.989 7.989 0 0 0 4.429 1.45h.005c4.417 0 8.01-3.594 8.01-8.012 0-2.14-.834-4.152-2.348-5.666a7.962 7.962 0 0 0-5.667-2.346z"/>
        </svg>
      </a>
    </aside>
  `
})
export class WhatsappButton {}
