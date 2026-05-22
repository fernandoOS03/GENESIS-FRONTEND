import { useEffect } from 'react';
import { 
  PiUserLight, 
  PiAirplaneTiltLight, 
  PiCreditCardLight,
  PiXLight,
  PiDotsThreeLight,
  PiPencilSimpleLight,
  PiIdentificationCardLight,
  PiBusLight,
  PiCarProfileLight,
  PiCheckCircleFill
} from 'react-icons/pi';
import type { ParticipanteAdmin } from '../types/admin.types';

interface ParticipantDetailModalProps {
  participante: ParticipanteAdmin | null;
  onClose: () => void;
}

// Subcomponente de texto (label + valor)
function InfoBlock({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{label}</span>
      <span className="text-sm font-semibold text-muted-foreground/30">-</span>
    </div>
  );
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{label}</span>
      <span className="text-sm font-semibold text-foreground truncate">{value}</span>
    </div>
  );
}

// Subcomponente de tarjeta de iteración (Vuelos)
function ItineraryCard({ 
  label, 
  airline, 
  flightNumber, 
  origin, 
  destination, 
  dateStr 
}: { 
  label: string; 
  airline: string; 
  flightNumber: string; 
  origin: string; 
  destination: string; 
  dateStr?: string; 
}) {
  return (
    <div className="flex-1 bg-background border border-border/40 rounded-2xl p-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-4">
        {label} &bull; {airline} {flightNumber}
      </p>
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <h4 className="text-2xl font-bold tracking-tighter text-foreground">{origin}</h4>
          {dateStr && <p className="text-[11px] font-medium text-muted-foreground mt-1">{dateStr}</p>}
        </div>
        
        <div className="flex-1 flex items-center justify-center px-4 relative">
          <div className="w-full h-px bg-border absolute top-1/2 left-0 -translate-y-1/2 border-dashed border-t-2 bg-transparent" />
          <div className="bg-background px-2 relative z-10 text-muted-foreground">
            <PiAirplaneTiltLight className="w-5 h-5" />
          </div>
        </div>

        <div className="text-center">
          <h4 className="text-2xl font-bold tracking-tighter text-foreground">{destination}</h4>
          {dateStr && <p className="text-[11px] font-medium text-transparent mt-1 select-none">.</p>}
        </div>
      </div>
    </div>
  );
}

export default function ParticipantDetailModal({ participante, onClose }: ParticipantDetailModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!participante) return null;

  // Lógica de fechas y códigos
  const fechaRegistro = new Date(participante.fechaRegistro).toLocaleDateString('es-PE', { 
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
  
  const fecLlegada = participante.fechaLlegada 
     ? new Date(participante.fechaLlegada).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) 
     : '';
  const fecRetorno = participante.fechaIda 
     ? new Date(participante.fechaIda).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) 
     : '';

  // Determinar ícono de transporte
  const TransportIcon = participante.tipoTransporte === 'TERRESTRE' ? PiBusLight 
                      : participante.tipoTransporte === 'INDEPENDIENTE' ? PiCarProfileLight 
                      : PiAirplaneTiltLight;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-md animate-in fade-in transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[850px] bg-[#fdfdfd] dark:bg-card border border-border/50 shadow-2xl rounded-[32px] flex flex-col animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300 overflow-hidden my-auto h-auto max-h-[96vh]">
        
        {/* Soft Violet Gradient top-left */}
        <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-primary/5 dark:bg-primary/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Scrollable Content Wrapper */}
        <div className="overflow-y-auto p-8 sm:p-10 hide-scrollbar flex flex-col gap-6 relative z-10 w-full h-full">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-2">
            <div className="flex items-center gap-5">
              <div className="w-[88px] h-[88px] rounded-full bg-muted border-4 border-background shadow-sm flex items-center justify-center text-muted-foreground text-3xl font-bold uppercase shrink-0">
                {participante.nombres.charAt(0)}{participante.apellidos.charAt(0)}
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground leadiing-none">
                  {participante.nombres} {participante.apellidos}
                </h2>
                <div className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-2">
                  <span>ID: {participante.codigoReserva || participante.id.substring(0,8).toUpperCase()}</span>
                  &bull;
                  <span>{participante.rol || 'Participante'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button className="w-10 h-10 rounded-full border border-border/50 bg-background flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all shadow-sm shrink-0">
                <PiDotsThreeLight className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="h-10 px-5 rounded-full border border-border/50 bg-background flex items-center justify-center text-sm font-semibold text-foreground hover:bg-muted transition-all shadow-sm shrink-0 gap-2"
              >
                <PiXLight className="w-4 h-4" />
                Cerrar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* Card 1: Datos Personales */}
            <div className="bg-card dark:bg-muted/10 border border-border/60 rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <PiUserLight className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Datos Personales</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-7">
                <InfoBlock label="Correo Electrónico" value={participante.email} />
                <InfoBlock label="Teléfono" value={participante.telefono} />
                <InfoBlock label="Sede / País" value={`${participante.sede ? participante.sede + ', ' : ''}${participante.pais}`} />
                <InfoBlock label="Documento" value={`${participante.tipoDocumento} (${participante.nroDocumento})`} />
                <InfoBlock label="Género" value={participante.genero} />
                <InfoBlock label="Talla Polo" value={participante.tallaPolo} />
              </div>
            </div>

            {/* Card 2: Registro y Participación */}
            <div className="bg-card dark:bg-muted/10 border border-border/60 rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <PiIdentificationCardLight className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Registro y Participación</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-7">
                <InfoBlock label="Condición" value={participante.condParticipacion} />
                <InfoBlock label="Rol Asignado" value={participante.rol || 'N/A'} />
                <InfoBlock label="Fecha de Registro" value={fechaRegistro} />
                <InfoBlock label="Categoría" value="Público General" />
                <InfoBlock label="Código Reserva" value={participante.codigoReserva} />
                <InfoBlock label="Documentos Adjr." value={participante.boletoUrl ? '1 Archivo' : 'Ninguno'} />
              </div>
            </div>
          </div>

          {/* Card 3: Itinerario de Vuelos (solo si tiene transporte) */}
          {participante.tipoTransporte && participante.tipoTransporte !== 'Sin transporte' && (
            <div className="bg-card dark:bg-muted/10 border border-border/60 rounded-[24px] p-6 shadow-sm flex flex-col relative z-10 w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <TransportIcon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Itinerario de {participante.tipoTransporte === 'TERRESTRE' ? 'Viaje' : 'Vuelos'}</h3>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <ItineraryCard 
                  label="Llegada al Evento"
                  airline={participante.empresaTransporte || 'Pendiente'}
                  flightNumber={participante.nroVuelo || '-'}
                  origin={participante.pais === 'PE' ? 'LOCAL' : 'EXT'}
                  destination={participante.lugarLlegada ? participante.lugarLlegada.substring(0,3).toUpperCase() : 'LIMA'}
                  dateStr={fecLlegada}
                />
                
                {fecRetorno && (
                  <ItineraryCard 
                    label="Retorno"
                    airline={participante.empresaTransporte || 'Pendiente'}
                    flightNumber={participante.nroVuelo || '-'}
                    origin={participante.lugarLlegada ? participante.lugarLlegada.substring(0,3).toUpperCase() : 'LIMA'}
                    destination={participante.pais === 'PE' ? 'LOCAL' : 'EXT'}
                    dateStr={fecRetorno}
                  />
                )}
              </div>
            </div>
          )}

          {/* Card 4: Estado de Registro */}
          <div className="bg-card dark:bg-muted/10 border border-border/60 rounded-[24px] p-6 shadow-sm flex flex-col relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <PiCreditCardLight className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Estado General</h3>
            </div>
            
            <div className="flex items-center justify-between">
              
              {participante.estadoRegistro === 'CONFIRMADO' ? (
                 <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 px-5 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                   <PiCheckCircleFill className="w-5 h-5 text-emerald-500" />
                   <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Participación Confirmada</span>
                 </div>
              ) : participante.estadoRegistro === 'PRE INSCRITO' ? (
                 <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-500/10 px-5 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                   <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                   <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">Pre Insctito</span>
                 </div>
              ) : (
                <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-500/10 px-5 py-3 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                  <div className="w-2 h-2 rounded-full bg-amber-500 ml-1.5" />
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Pendiente de Aprobación</span>
                </div>
              )}

              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-0.5">Última actualización</span>
                <span className="text-xs font-semibold text-muted-foreground">{fechaRegistro}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
