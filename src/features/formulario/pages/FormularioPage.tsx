import { useState } from 'react';
import FormularioConversacional from '../components/FormularioConversacional';
import PantallaBienvenida from '../components/PantallaBienvenida';

export default function FormularioPage() {
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);

  return (
    <div className="formulario-conversacional relative flex min-h-[100dvh] h-[100dvh] overflow-hidden bg-background">
      
      {/* Patrones Andinos Laterales Decorativos (Evitan sensación de vacío en pantallas grandes) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-16 xl:w-24 opacity-[0.035] pointer-events-none hidden lg:block select-none text-[#BE0A2F]">
        <svg viewBox="0 0 100 400" className="w-full" fill="currentColor">
          <path d="M10,0 L90,0 L90,20 L50,20 L50,40 L90,40 L90,60 L10,60 L10,40 L30,40 L30,20 L10,20 Z" />
          <path d="M50,80 L80,110 L50,140 L20,110 Z M50,95 L65,110 L50,125 L35,110 Z" />
          <path d="M10,160 L90,160 L90,180 L70,180 L70,200 L90,200 L90,220 L10,220 Z" />
          <circle cx="50" cy="190" r="10" />
          <path d="M50,240 L70,240 L70,250 L80,250 L80,260 L70,260 L70,270 L50,270 L50,260 L40,260 L40,250 L50,250 Z" />
          <path d="M10,290 L90,290 L90,310 L50,310 L50,330 L90,330 L90,350 L10,350 Z" />
          <circle cx="50" cy="380" r="15" />
        </svg>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-16 xl:w-24 opacity-[0.035] pointer-events-none hidden lg:block select-none text-[#E8A000]">
        <svg viewBox="0 0 100 400" className="w-full" fill="currentColor">
          <circle cx="50" cy="30" r="15" />
          <path d="M10,60 L90,60 L90,80 L50,80 L50,100 L90,100 L90,120 L10,120 Z" />
          <path d="M50,140 L70,140 L70,150 L80,150 L80,160 L70,160 L70,170 L50,170 L50,160 L40,160 L40,150 L50,150 Z" />
          <path d="M10,190 L90,190 L90,210 L70,210 L70,230 L90,230 L90,250 L10,250 Z" />
          <circle cx="50" cy="220" r="10" />
          <path d="M50,270 L80,300 L50,330 L20,300 Z M50,285 L65,300 L50,315 L35,300 Z" />
          <path d="M10,350 L90,350 L90,370 L50,370 L50,390 L90,390 L90,410 L10,410 Z" />
        </svg>
      </div>

      {/* Pantalla de Bienvenida Cinematográfica */}
      {mostrarBienvenida && (
        <PantallaBienvenida onContinuar={() => setMostrarBienvenida(false)} />
      )}

      {/* ── Panel Principal del Formulario ── */}
      <main className="flex-1 flex flex-col bg-background px-4 sm:px-12 md:px-20 lg:px-32 overflow-hidden py-1 sm:py-3">
        
        {/* Header de Marca */}
        <div className="shrink-0 flex items-center justify-between pt-3 pb-1 sm:pt-5 sm:pb-3">
          <div className="select-none">
            <img src="/logo-iyg.png" alt="Logo IYF" className="h-10 sm:h-12 md:h-14 lg:h-16 object-contain" />
          </div>
        </div>

        {/* Formulario Conversacional */}
        <div className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden">
          <FormularioConversacional />
        </div>

        {/* Footer simple */}
        <div className="shrink-0 pb-2 pt-2 sm:pb-3 sm:pt-3 flex items-center justify-between text-xs border-t border-border/40" style={{ color: 'var(--muted-foreground)' }}>
          <span>© {new Date().getFullYear()} IYF Perú · Campamento Mundial</span>
          <div className="flex items-center gap-1 opacity-60">
            <span style={{ background: '#BE0A2F', width: 8, height: 8, borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ background: '#E8A000', width: 8, height: 8, borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ background: '#3A7D0A', width: 8, height: 8, borderRadius: '50%', display: 'inline-block' }} />
          </div>
        </div>

      </main>

    </div>
  );
}
