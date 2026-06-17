import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Progress } from '@/components/ui/progress';

interface PropiedadesContenedorPregunta {
  children: ReactNode;
  indice: number;
  total: number;
  titulo: string;
  subtitulo?: string;
  obligatorio?: boolean;
  layout?: 'standard' | 'split';
  sticker?: ReactNode;
}

const variantesMovimiento = {
  inicial: {
    y: 40,
    opacity: 0,
  },
  activo: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1] as any, // easeOutExpo
    },
  },
  salida: {
    y: -40,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
};

export default function ContenedorPregunta({
  children,
  indice,
  total,
  titulo,
  subtitulo,
  obligatorio = false,
  layout = 'standard',
  sticker,
}: PropiedadesContenedorPregunta) {
  
  if (layout === 'split') {
    return (
      <motion.div
        key={indice}
        custom={1}
        variants={variantesMovimiento}
        initial="inicial"
        animate="activo"
        exit="salida"
        className="w-full flex flex-col gap-4"
      >
        {/* Encabezado compacto con Progress */}
        <div className="space-y-3 mb-2">
          <Progress value={(indice / total) * 100} className="h-1.5" />
          <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
            <span>Paso {indice}</span>
            <span>{total} pasos</span>
          </div>
          <h2
            className="font-bold select-none leading-tight"
            style={{
              fontSize: 'clamp(1.1rem, 3.5vw, 1.6rem)',
              color: 'var(--foreground)',
              letterSpacing: '-0.03em',
            }}
          >
            {titulo}
          </h2>
          {subtitulo && (
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.5,
              }}
            >
              {subtitulo}
            </p>
          )}
        </div>

        {/* Contenido directo sin scroll */}
        <div className="w-full">
          {children}
        </div>
      </motion.div>
    );
  }

  // Layout Estándar
  return (
    <motion.div
      key={indice}
      custom={1}
      variants={variantesMovimiento}
      initial="inicial"
      animate="activo"
      exit="salida"
      className="w-full flex flex-col md:grid md:grid-cols-12 md:gap-6 md:items-center"
    >
      {/* Columna de Sticker — compacto en desktop */}
      {sticker && (
        <div className="md:col-span-2 flex justify-center md:justify-start pb-3 md:pb-0">
          {/* Sticker reducido en laptop/desktop para no consumir altura */}
          <div className="scale-75 md:scale-90 origin-center">
            {sticker}
          </div>
        </div>
      )}

      {/* Columna del Contenido y Título de Pregunta */}
      <div className={sticker ? 'md:col-span-10 flex flex-col gap-3' : 'md:col-span-12 flex flex-col gap-3'}>
        <div className="space-y-3 mb-2">
          <Progress value={(indice / total) * 100} className="h-1.5" />
          <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
            <span>
              Paso {indice}
              {obligatorio && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#BE0A2F',
                    marginLeft: 6,
                  }}
                />
              )}
            </span>
            <span>{total} pasos</span>
          </div>

          <h2
            className="font-bold select-none leading-tight"
            style={{
              fontSize: 'clamp(1.15rem, 4vw, 1.9rem)',
              color: 'var(--foreground)',
              letterSpacing: '-0.03em',
            }}
          >
            {titulo}
          </h2>

          {subtitulo && (
            <p
              style={{
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                color: 'var(--muted-foreground)',
                lineHeight: 1.5,
                maxWidth: '480px',
              }}
            >
              {subtitulo}
            </p>
          )}
        </div>

        {/* Contenido del paso */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
