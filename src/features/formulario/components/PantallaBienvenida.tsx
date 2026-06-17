import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PropiedadesPantallaBienvenida {
  onContinuar: () => void;
}

export default function PantallaBienvenida({ onContinuar }: PropiedadesPantallaBienvenida) {
  const [videoListo, setVideoListo] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Intentar reproducir el video cuando esté listo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const intentarReproducir = () => {
      video.play().catch(() => {
        // Silencioso — el navegador puede bloquear autoplay con sonido
      });
    };
    video.addEventListener('canplaythrough', intentarReproducir);
    intentarReproducir();
    return () => video.removeEventListener('canplaythrough', intentarReproducir);
  }, []);

  const manejarContinuar = () => {
    setSaliendo(true);
    setTimeout(onContinuar, 650);
  };

  return (
    <AnimatePresence>
      {!saliendo && (
        <motion.div
          key="bienvenida"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="formulario-conversacional"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: '#0A0500',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* ── VIDEO DE FONDO COMPLETO ── */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <video
              ref={videoRef}
              src="/peru.mp4"
              autoPlay
              muted
              loop
              playsInline
              onCanPlay={() => setVideoListo(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: videoListo ? 1 : 0,
                transition: 'opacity 1.2s ease',
              }}
            />

            {/* Overlay gradiente oscuro para legibilidad (Tono Azulado) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `
                  linear-gradient(
                    to bottom,
                    rgba(0, 78, 154, 0.4) 0%,
                    rgba(0, 78, 154, 0.6) 35%,
                    rgba(10, 5, 0, 0.85) 65%,
                    rgba(10, 5, 0, 0.95) 100%
                  )
                `,
              }}
            />

            {/* Textura de grano sobre el video */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.05,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '220px 220px',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* ── LOGO IYF ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              zIndex: 10,
              padding: '1.25rem 1.75rem',
              flexShrink: 0,
            }}
          >
            <img src="/logo-iyg.png" alt="Logo IYF" style={{ height: 38, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </motion.div>

          {/* ── ESPACIO FLEXIBLE PARA EMPUJAR CONTENIDO HACIA ABAJO ── */}
          <div style={{ flex: 1 }} />

          {/* ── BLOQUE CENTRAL DE CONTENIDO ── */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              padding: '0 1.75rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              maxWidth: '700px',
            }}
          >
            {/* Etiqueta de evento */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--primary)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#15A444',
                    display: 'inline-block',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
                Registro Oficial Abierto
              </div>
            </motion.div>

            {/* Título principal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  color: 'white',
                  margin: 0,
                }}
              >
                Campamento Mundial{' '}
                <br />
                <span style={{ color: '#15A444' }}>
                  IYF
                </span>
              </h1>
            </motion.div>

            {/* Subtítulo descriptivo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                maxWidth: '520px',
                margin: 0,
                fontWeight: 400,
              }}
            >
              Plataforma oficial para la gestión y registro de participantes.
              Por favor, inicie su proceso de inscripción para asegurar su lugar.
            </motion.p>

            {/* Separador corporativo */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left' }}
            >
              <div
                style={{ width: '60px', height: '4px', background: 'var(--primary)', borderRadius: '2px' }}
              />
            </motion.div>

            {/* Botón de Continuar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98, y: 1 }}
                onClick={manejarContinuar}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '0.8rem 2rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  fontFamily: 'var(--font-display)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s',
                  border: 'none'
                }}
              >
                Comenzar Inscripción
                <span style={{ fontSize: '1.1rem' }}>→</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Animación de pulso keyframe via style */}
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.5; transform: scale(0.85); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
