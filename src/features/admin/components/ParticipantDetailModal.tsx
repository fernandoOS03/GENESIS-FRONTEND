import { useEffect, useState } from 'react';
import { 
  PiUserLight, 
  PiAirplaneTiltLight, 
  PiCreditCardLight,
  PiXLight,
  PiPencilSimpleLight,
  PiIdentificationCardLight,
  PiBusLight,
  PiCarProfileLight,
  PiCheckCircleFill,
  PiWalletLight
} from 'react-icons/pi';
import type { ParticipanteAdmin } from '../types/admin.types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import PaymentManager from './PaymentManager';

interface ParticipantDetailModalProps {
  participante: ParticipanteAdmin | null;
  onClose: () => void;
  onRefresh?: () => void;
}

function InfoBlock({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {label}
      </span>
      {value ? (
        <span className="text-[12px] font-medium leading-tight text-foreground">
          {value}
        </span>
      ) : (
        <span className="text-[12px] text-muted-foreground/30">—</span>
      )}
    </div>
  );
}

function SectionCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  children,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}
        >
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <h3 className="text-[12px] font-bold text-foreground tracking-wide">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

export default function ParticipantDetailModal({ participante, onClose, onRefresh }: ParticipantDetailModalProps) {
  const [moneda, setMoneda] = useState<'USD' | 'PEN'>('USD');

  useEffect(() => {
    if (participante) {
      if (participante.cuentaMoneda) {
        setMoneda(participante.cuentaMoneda as 'USD' | 'PEN');
      } else {
        setMoneda(participante.pais === 'PE' ? 'PEN' : 'USD');
      }
    }
  }, [participante]);

  if (!participante) return null;

  const fechaRegistro = new Date(participante.fechaRegistro).toLocaleDateString('es-PE', { 
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = participante as any;
  const fecLlegada = p.fechaLlegada 
     ? new Date(p.fechaLlegada).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) 
     : '';
  const fecRetorno = p.fechaIda 
     ? new Date(p.fechaIda).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) 
     : '';

  const TransportIcon = participante.tipoTransporte === 'TERRESTRE' ? PiBusLight 
                      : participante.tipoTransporte === 'INDEPENDIENTE' ? PiCarProfileLight 
                      : PiAirplaneTiltLight;

  const symbol = moneda === 'PEN' ? 'S/' : '$';
  const abono = participante.totalAbonado ?? 0;
  const tarifa = participante.tarifaCongelada ?? 0;
  const porcentajePago = Math.min(100, (abono / (tarifa || 1)) * 100);

  return (
    <Sheet open={!!participante} onOpenChange={(open) => { if (!open) onClose(); }}>
      {/* 90vw width to fit 3 columns without scrolling */}
      <SheetContent side="right" className="w-[95vw] md:max-w-[1200px] p-0 flex flex-col gap-0 bg-background border-l border-border h-screen">
        <SheetHeader className="sr-only">
          <SheetTitle>Detalles de Participante</SheetTitle>
        </SheetHeader>

        {/* HEADER (Fijo) */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 sticky top-0 z-10 bg-card border-b border-border shadow-sm">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold bg-primary/10 text-primary border border-primary/20">
              {participante.nombres.charAt(0)}{participante.apellidos.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[16px] font-bold leading-tight tracking-tight text-foreground truncate">
                {participante.nombres} {participante.apellidos}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[11px] text-muted-foreground font-mono">
                  {participante.codigoReserva || `ID: ${participante.id.substring(0, 8).toUpperCase()}`}
                  {' · '}
                  {participante.rol || 'Participante'}
                </p>
                <div className="w-1 h-1 rounded-full bg-border" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-widest">
                  {participante.estadoRegistro.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-150 border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Editar Participante"
            >
              <PiPencilSimpleLight className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="h-8 px-4 rounded-md flex items-center gap-1.5 text-[12px] font-bold transition-all duration-150 border border-border text-foreground hover:bg-muted"
            >
              <PiXLight className="w-3.5 h-3.5" />
              Cerrar Panel
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL: GRID 3 COLUMNAS - ALTURA FIJA NO SCROLL */}
        <div className="flex-1 min-h-0 p-6 bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            
            {/* COLUMNA 1: PERFIL Y REGISTRO */}
            <div className="flex flex-col gap-4 overflow-y-auto thin-scrollbar pb-6">
              <SectionCard icon={PiUserLight} iconBg="rgba(0,157,225,0.08)" iconColor="var(--primary)" title="Datos Personales">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <InfoBlock label="Correo Electrónico" value={participante.email} />
                  <InfoBlock label="Teléfono" value={participante.telefono} />
                  <InfoBlock label="Sede / País" value={`${participante.sede ? participante.sede + ', ' : ''}${participante.pais}`} />
                  <InfoBlock label="Documento" value={`${participante.tipoDocumento} · ${participante.nroDocumento}`} />
                  <InfoBlock label="Género" value={participante.genero} />
                  <InfoBlock label="Talla Polo" value={participante.tallaPolo} />
                </div>
              </SectionCard>

              <SectionCard icon={PiIdentificationCardLight} iconBg="rgba(139,92,246,0.08)" iconColor="#8B5CF6" title="Registro y Participación">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <InfoBlock label="Condición" value={participante.condParticipacion} />
                  <InfoBlock label="Rol Asignado" value={participante.rol || 'Participante'} />
                  <InfoBlock label="Fecha de Registro" value={fechaRegistro} />
                  <InfoBlock label="Categoría" value="Participante Base" />
                </div>
              </SectionCard>
            </div>

            {/* COLUMNA 2: LOGÍSTICA E ITINERARIO */}
            <div className="flex flex-col gap-4 overflow-y-auto thin-scrollbar pb-6">
              <SectionCard icon={TransportIcon} iconBg="rgba(245,158,11,0.08)" iconColor="#D97706" title="Itinerario y Logística">
                {participante.tipoTransporte && participante.tipoTransporte !== 'Sin transporte' ? (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-md border border-border bg-background p-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Llegada al Evento</span>
                        <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-1.5 rounded">{participante.empresaTransporte || 'Pendiente'} {participante.nroVuelo}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xl font-mono font-bold text-foreground">{participante.pais === 'PE' ? 'LOCAL' : 'EXT'}</p>
                          <p className="text-[10px] text-muted-foreground">{fecLlegada || 'Sin fecha'}</p>
                        </div>
                        <PiAirplaneTiltLight className="w-5 h-5 text-muted-foreground/50 mb-2" />
                        <div className="text-right">
                          <p className="text-xl font-mono font-bold text-foreground">{participante.lugarLlegada ? participante.lugarLlegada.substring(0, 3).toUpperCase() : 'LIM'}</p>
                          <p className="text-[10px] text-muted-foreground opacity-0">.</p>
                        </div>
                      </div>
                    </div>

                    {fecRetorno && (
                      <div className="rounded-md border border-border bg-background p-3 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Retorno</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xl font-mono font-bold text-foreground">{participante.lugarLlegada ? participante.lugarLlegada.substring(0, 3).toUpperCase() : 'LIM'}</p>
                            <p className="text-[10px] text-muted-foreground">{fecRetorno || 'Sin fecha'}</p>
                          </div>
                          <PiAirplaneTiltLight className="w-5 h-5 text-muted-foreground/50 mb-2" style={{ transform: 'scaleX(-1)' }} />
                          <div className="text-right">
                            <p className="text-xl font-mono font-bold text-foreground">{participante.pais === 'PE' ? 'LOCAL' : 'EXT'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-6 border border-dashed border-border rounded-md">
                    <p className="text-[12px] font-medium text-muted-foreground">Sin itinerario de transporte</p>
                  </div>
                )}
              </SectionCard>

              <SectionCard icon={PiCreditCardLight} iconBg="rgba(16,185,129,0.08)" iconColor="#10B981" title="Estado Operativo">
                <div className="flex flex-col gap-2">
                  {participante.estadoRegistro === 'COMPLETADO' ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                      <PiCheckCircleFill className="w-4 h-4 text-emerald-500" />
                      <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400">Participación Completada</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-500/10 border border-amber-500/20">
                      <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                      <span className="text-[12px] font-bold text-amber-700 dark:text-amber-400">{participante.estadoRegistro.replace('_', ' ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center px-1 mt-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Última actualización</span>
                    <span className="text-[11px] font-mono font-medium text-foreground">{fechaRegistro}</span>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* COLUMNA 3: PAGOS Y FINANZAS */}
            <div className="flex flex-col gap-4 overflow-y-auto thin-scrollbar pb-6">
              <SectionCard icon={PiWalletLight} iconBg="rgba(139,92,246,0.08)" iconColor="#8B5CF6" title="Gestión Financiera">
                


                {/* Administrador de Pago */}
                <PaymentManager 
                  cuentaId={participante.cuentaId}
                  totalAbonado={abono}
                  tarifaCongelada={tarifa}
                  cuentaMoneda={moneda}
                  onRefresh={onRefresh}
                  onSuccess={onClose}
                />

                <div className="mt-2 pt-3 border-t border-border">
                   <p className="text-[10px] text-muted-foreground/70 leading-tight">
                     * Historial detallado de transacciones disponible en reportes generales.
                   </p>
                </div>

              </SectionCard>
            </div>

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
