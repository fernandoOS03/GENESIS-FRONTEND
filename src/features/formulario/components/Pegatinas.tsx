// Estilo base para los stickers con un borde blanco gordo y sombra para que parezca un sticker de vinilo real
const claseSticker = "drop-shadow-[0_6px_8px_rgba(0,0,0,0.18)] filter select-none pointer-events-none transition-all duration-300 hover:scale-110";

// 1. Sticker de Llamita Peruana (Anfitriona del World Camp)
export function StickerLlamita({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={`${claseSticker} ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Contorno / Borde Blanco de Sticker */}
      <path d="M50 8C35 8 32 15 32 25C32 28 34 32 30 36C25 40 20 45 20 54C20 62 25 70 30 75C34 79 38 92 50 92C62 92 66 79 70 75C75 70 80 62 80 54C80 45 75 40 70 36C66 32 68 28 68 25C68 15 65 8 50 8Z" fill="white" stroke="#E2E8F0" strokeWidth="4"/>
      
      {/* Cuerpo y Cabeza (Lana blanca/crema) */}
      <path d="M50 12C38 12 35 18 35 27V38C35 41 33 43 31 45C27 48 24 52 24 58C24 64 28 70 33 73C36 75 39 82 50 82C61 82 64 75 67 73C72 70 76 64 76 58C76 52 73 48 69 45C67 43 65 41 65 38V27C65 18 62 12 50 12Z" fill="#FBFBF8"/>
      
      {/* Orejas de Llama */}
      <path d="M36 14C33 14 32 6 35 6C38 6 39 12 38 14Z" fill="#FBFBF8" stroke="#EAE3D2" strokeWidth="2"/>
      <path d="M35 12C33 12 33 8 35 8C37 8 37 11 36 12Z" fill="#F87171"/> {/* Interior oreja rosa */}
      
      <path d="M64 14C67 14 68 6 65 6C62 6 61 12 62 14Z" fill="#FBFBF8" stroke="#EAE3D2" strokeWidth="2"/>
      <path d="M65 12C67 12 67 8 65 8C63 8 63 11 64 12Z" fill="#F87171"/>
      
      {/* Ojos tiernos grandes de Caricatura */}
      <circle cx="43" cy="24" r="3.5" fill="#1A1A1A"/>
      <circle cx="42" cy="23" r="1.2" fill="white"/>
      
      <circle cx="57" cy="24" r="3.5" fill="#1A1A1A"/>
      <circle cx="56" cy="23" r="1.2" fill="white"/>
      
      {/* Mejillas Rosadas */}
      <circle cx="39" cy="28" r="3.5" fill="#F472B6" opacity="0.6"/>
      <circle cx="61" cy="28" r="3.5" fill="#F472B6" opacity="0.6"/>
      
      {/* Hocico de Llama */}
      <ellipse cx="50" cy="29" rx="6" ry="4" fill="#F3E8FF"/>
      <path d="M48 29.5C49 31 51 31 52 29.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round"/>
      
      {/* Bufanda Andina de Colores (Chullo/Manta peruana en el cuello) */}
      <path d="M34 40C34 38 66 38 66 40C66 43 62 48 50 48C38 48 34 43 34 40Z" fill="#C8102E"/>
      {/* Líneas de colores de la bufanda */}
      <path d="M38 43H62" stroke="#F59E0B" strokeWidth="2.5"/>
      <path d="M42 45H58" stroke="#10B981" strokeWidth="2.5"/>
      {/* Flecos de la bufanda */}
      <path d="M46 48V52M50 48V53M54 48V52" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Pequeños brillos de fondo */}
      <circle cx="20" cy="25" r="2" fill="#F59E0B"/>
      <circle cx="82" cy="35" r="2.5" fill="#C8102E"/>
    </svg>
  );
}

// 2. Sticker de Email Volador (Festival Vibe)
export function StickerEmail({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg className={`${claseSticker} ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Borde Blanco del Sticker */}
      <path d="M14 46C14 42 20 40 28 40H72C80 40 86 42 86 46V74C86 78 80 82 72 82H28C20 82 14 78 14 74V46Z" fill="white" stroke="#E2E8F0" strokeWidth="4"/>
      {/* Alitas de Caricatura */}
      <path d="M16 45C5 38 2 24 10 20C18 16 26 26 22 36" fill="white" stroke="#E2E8F0" strokeWidth="3"/>
      <path d="M12 36C4 32 3 24 8 22C14 20 18 26 15 32" fill="#F9A8D4" opacity="0.6"/> {/* Ala rosa */}
      
      <path d="M84 45C95 38 98 24 90 20C82 16 74 26 78 36" fill="white" stroke="#E2E8F0" strokeWidth="3"/>
      <path d="M88 36C96 32 97 24 92 22C86 20 82 26 85 32" fill="#F9A8D4" opacity="0.6"/>
      
      {/* Cuerpo del Sobre de Carta */}
      <rect x="20" y="46" width="60" height="30" rx="6" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2"/>
      <path d="M20 47L50 64L80 47" stroke="#4B5563" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 75L42 60" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M80 75L58 60" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"/>
      
      {/* Corazón Rojo central de sello */}
      <path d="M50 64C50 64 45 60.5 45 57C45 54.6 47 52.6 49.4 52.6C50.6 52.6 51 53.4 50 53.4C49.6 53.4 50 52.6 51.2 52.6C53.6 52.6 55.6 54.6 55.6 57C55.6 60.5 50 64 50 64Z" fill="#EF4444"/>
      
      {/* Estrellas y sparkles */}
      <path d="M28 20L31 23M31 20L28 23" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
      <path d="M72 20L69 23M69 20L72 23" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// 3. Sticker de Teléfono/WhatsApp (Con orejitas de llama o andino)
export function StickerTelefono({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg className={`${claseSticker} ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="26" y="10" width="48" height="80" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="4"/>
      <rect x="30" y="14" width="40" height="72" rx="8" fill="#10B981"/> {/* Verde WhatsApp */}
      
      {/* Pantalla del Teléfono */}
      <rect x="34" y="20" width="32" height="52" rx="4" fill="#E6F4EA"/>
      
      {/* Burbuja de chat con corazón */}
      <path d="M40 46C40 40 60 40 60 46C60 50 54 53 50 53L48 57V53C43 53 40 50 40 46Z" fill="white" stroke="#059669" strokeWidth="1.5"/>
      <circle cx="50" cy="46" r="2.5" fill="#EF4444"/>
      
      {/* Altavoz y botón home */}
      <line x1="45" y1="17" x2="55" y2="17" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="50" cy="80" r="3.5" fill="#D1D5DB"/>
      
      {/* Chullo peruano decorativo encima del teléfono */}
      <path d="M35 15L50 5L65 15H35Z" fill="#C8102E" stroke="white" strokeWidth="2"/>
      <path d="M43 10L50 5L57 10H43Z" fill="#F59E0B"/>
    </svg>
  );
}

// 4. Sticker de Carnet de Identidad
export function StickerCarnet({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg className={`${claseSticker} ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="20" width="70" height="60" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="4"/>
      <rect x="20" y="25" width="60" height="50" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2"/>
      
      {/* Foto de perfil del carnet (Silueta de persona) */}
      <rect x="26" y="34" width="16" height="20" rx="2" fill="#DBEAFE"/>
      <circle cx="34" cy="40" r="4" fill="#3B82F6"/>
      <path d="M28 52C28 48 40 48 40 52V54H28V52Z" fill="#3B82F6"/>
      
      {/* Líneas simulando texto del carnet */}
      <line x1="48" y1="38" x2="70" y2="38" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round"/>
      <line x1="48" y1="45" x2="65" y2="45" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round"/>
      <line x1="48" y1="52" x2="60" y2="52" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round"/>
      
      {/* Sello de aprobación dorado tipo estrella */}
      <path d="M68 62L70 58L74 60L73 56L77 55L73 54L74 50L70 52L68 48L67 52L63 50L64 54L60 55L64 56L63 60L67 58L68 62Z" fill="#F59E0B"/>
    </svg>
  );
}

// 5. Sticker de Sol de IYF / Sol de los Andes (Festival Inti Raymi vibe)
export function StickerSolPeru({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg className={`${claseSticker} ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
      <circle cx="50" cy="50" r="38" fill="#FFFBEB"/>
      
      {/* Sol radiante andino */}
      <circle cx="50" cy="50" r="20" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
      
      {/* Rayos de Sol */}
      <path d="M50 14V24M50 76V86M14 50H24M76 50H86M24 24L32 32M68 68L76 76M76 24L68 32M32 68L24 76" stroke="#D97706" strokeWidth="4.5" strokeLinecap="round"/>
      
      {/* Carita feliz en el sol para naturalidad y agrado */}
      <circle cx="44" cy="46" r="2" fill="#1A1A1A"/>
      <circle cx="56" cy="46" r="2" fill="#1A1A1A"/>
      <path d="M45 54C47 56.5 53 56.5 55 54" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// 6. Sticker de Camiseta / Polo (para talla de polo)
export function StickerCamiseta({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg className={`${claseSticker} ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Contorno blanco sticker */}
      <path d="M20 28L8 46L24 52V88H76V52L92 46L80 28C76 34 67 38 50 38C33 38 24 34 20 28Z" fill="white" stroke="#E2E8F0" strokeWidth="4"/>
      {/* Cuerpo camiseta */}
      <path d="M20 28L8 46L24 52V88H76V52L92 46L80 28C76 34 67 38 50 38C33 38 24 34 20 28Z" fill="#C8102E"/>
      {/* Cuello */}
      <path d="M38 28C38 22 62 22 62 28C62 34 56 38 50 38C44 38 38 34 38 28Z" fill="#A50000"/>
      {/* Franjas andinas decorativas */}
      <line x1="24" y1="60" x2="76" y2="60" stroke="#F59E0B" strokeWidth="3"/>
      <line x1="24" y1="66" x2="76" y2="66" stroke="white" strokeWidth="2"/>
      <line x1="24" y1="71" x2="76" y2="71" stroke="#10B981" strokeWidth="2.5"/>
      {/* Texto "IYF" pequeño en el pecho */}
      <text x="50" y="48" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" opacity="0.9">IYF</text>
      {/* Sparkle decorativo */}
      <path d="M14 22L16 18M16 22L14 18" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M86 22L88 18M88 22L86 18" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

// 7. Sticker de Bus / Transporte (para pasos de logística)
export function StickerBus({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg className={`${claseSticker} ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Contorno blanco sticker */}
      <rect x="8" y="24" width="84" height="52" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="4"/>
      {/* Cuerpo del bus */}
      <rect x="12" y="28" width="76" height="44" rx="8" fill="#009DE1"/>
      {/* Franja lateral andina */}
      <rect x="12" y="54" width="76" height="6" fill="#C8102E"/>
      <rect x="12" y="60" width="76" height="4" fill="#F59E0B"/>
      {/* Ventanas */}
      <rect x="20" y="34" width="14" height="12" rx="3" fill="white" opacity="0.9"/>
      <rect x="40" y="34" width="14" height="12" rx="3" fill="white" opacity="0.9"/>
      <rect x="60" y="34" width="14" height="12" rx="3" fill="white" opacity="0.9"/>
      {/* Parabrisas frontal (derecha) */}
      <rect x="76" y="32" width="8" height="10" rx="2" fill="#BAE6FD" opacity="0.8"/>
      {/* Puerta */}
      <rect x="20" y="48" width="10" height="8" rx="2" fill="white" opacity="0.6"/>
      {/* Ruedas */}
      <circle cx="26" cy="76" r="8" fill="#1F2937" stroke="white" strokeWidth="2"/>
      <circle cx="26" cy="76" r="4" fill="#6B7280"/>
      <circle cx="74" cy="76" r="8" fill="#1F2937" stroke="white" strokeWidth="2"/>
      <circle cx="74" cy="76" r="4" fill="#6B7280"/>
      {/* Líneas carretera decorativas */}
      <line x1="20" y1="92" x2="80" y2="92" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round"/>
      {/* Nubes de movimiento */}
      <path d="M4 50C4 48 7 47 8 49C9 47 12 46 13 48" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// 8. Grupo de pegatinas decorativo (ideal para cabeceras y resumen)
export function GrupoPegatinas({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center gap-2 ${className}`}>
      <StickerLlamita className="w-16 h-16 -rotate-12 translate-y-1" />
      <StickerSolPeru className="w-14 h-14 rotate-6 -translate-y-2" />
      <StickerEmail className="w-14 h-14 -rotate-6" />
      <StickerTelefono className="w-15 h-15 rotate-12 translate-y-2" />
    </div>
  );
}
