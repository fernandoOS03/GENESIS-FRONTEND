import type { StepProps } from '../../types/participante.types';
import { CondParticipacion, TipoTransporte } from '../../types/participante.types';
import { findCountry } from '@/lib/countryOptions';
import { PiUserLight, PiTargetLight, PiBusLight } from 'react-icons/pi';
import React from 'react';

interface StepResumenProps extends StepProps {
  transportSkipped: boolean;
  showTransport: boolean;
}

interface SummaryRowProps {
  label: string;
  value: string | null | undefined;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-3 px-4 sm:px-5 border-b border-border/40 last:border-0 bg-background hover:bg-secondary/20 transition-colors">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="text-[14px] font-medium text-foreground text-right max-w-[60%] truncate" title={value}>
        {value}
      </span>
    </div>
  );
}

function SummarySection({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2 px-2">
        <Icon className="text-primary/70 shrink-0" size={18} />
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-background shadow-sm ring-1 ring-border/30">
        <div className="flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function StepResumen({
  formData,
  transportSkipped,
  showTransport,
}: StepResumenProps) {
  const showCargo = formData.condParticipacion === CondParticipacion.MIEMBRO;
  const tipo = formData.tipoTransporte;

  return (
    <div className="space-y-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Confirmación de Datos
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa tu información detenidamente antes de enviar. Puedes regresar si necesitas corregir algo.
        </p>
      </div>

      {/* Datos Personales y Contacto */}
      <SummarySection title="Datos Personales y Contacto" icon={PiUserLight}>
        <SummaryRow
          label="Tipo de Documento"
          value={formData.tipoDocumento.replace(/_/g, ' ')}
        />
        <SummaryRow label="Nro. Documento" value={formData.nroDocumento} />
        <SummaryRow label="Nombres" value={formData.nombres} />
        <SummaryRow label="Apellidos" value={formData.apellidos} />
        <SummaryRow label="Correo Electrónico" value={formData.email} />
        <SummaryRow label="País" value={findCountry(formData.pais)?.label ?? formData.pais} />
        <SummaryRow label="Sede" value={formData.sede} />
        <SummaryRow label="Teléfono" value={formData.telefono} />
        <SummaryRow label="Género" value={formData.genero} />
        <SummaryRow
          label="Fecha de Nacimiento"
          value={formData.fechaNacimiento}
        />
        <SummaryRow label="Talla de Polo" value={formData.tallaPolo} />
      </SummarySection>

      {/* Participación */}
      <SummarySection title="Participación" icon={PiTargetLight}>
        <SummaryRow label="Condición" value={formData.condParticipacion} />
        {showCargo && <SummaryRow label="Cargo/Rol" value={formData.rol} />}
      </SummarySection>

      {/* Transporte */}
      {showTransport && (
        <SummarySection title="Logística y Transporte" icon={PiBusLight}>
          {transportSkipped ? (
            <div className="py-4 px-5 bg-background">
              <p className="text-sm italic text-muted-foreground text-center">
                Has omitido el registro de transporte.
              </p>
            </div>
          ) : (
            <>
              <SummaryRow
                label="Medio de Transporte"
                value={
                  tipo === 'AEREO'
                    ? 'Vuelo Aéreo'
                    : tipo === 'TERRESTRE'
                      ? 'Ruta Terrestre'
                      : tipo === 'INDEPENDIENTE'
                        ? 'Viaje Independiente'
                        : ''
                }
              />
              {(tipo === TipoTransporte.AEREO ||
                tipo === TipoTransporte.TERRESTRE) && (
                <SummaryRow
                  label="Empresa"
                  value={formData.empresaTransporte}
                />
              )}
              {tipo === TipoTransporte.AEREO && (
                <SummaryRow label="Nro. de Vuelo" value={formData.nroVuelo} />
              )}
              <SummaryRow
                label="Fecha de Llegada"
                value={formData.fechaLlegada}
              />
              <SummaryRow label="Fecha de Salida" value={formData.fechaIda} />
              {tipo === TipoTransporte.TERRESTRE && (
                <SummaryRow
                  label="Lugar de Llegada"
                  value={formData.lugarLlegada}
                />
              )}
              {(formData.boletoUrl || formData.boletoNombre) && (
                <SummaryRow
                  label="Boleto"
                  value={formData.boletoNombre || 'Documento adjunto'}
                />
              )}
            </>
          )}
        </SummarySection>
      )}
    </div>
  );
}
