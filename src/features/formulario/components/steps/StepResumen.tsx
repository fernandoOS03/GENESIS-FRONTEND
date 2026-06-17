import React from 'react';
import type { StepProps } from '../../types/participante.types';
import { CondParticipacion, TipoTransporte } from '../../types/participante.types';
import { findCountry } from '@/lib/countryOptions';

interface StepResumenProps extends StepProps {
  transportSkipped: boolean;
  showTransport: boolean;
}

interface FilaProps {
  label: string;
  value: string | null | undefined;
  highlight?: boolean;
}

function Fila({ label, value, highlight }: FilaProps) {
  if (!value) return null;
  return (
    <tr className="border-b border-border/40 last:border-0">
      <td
        className="py-1.5 pr-4 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap align-top"
        style={{ color: 'var(--muted-foreground)', width: '40%' }}
      >
        {label}
      </td>
      <td
        className="py-1.5 text-xs font-medium align-top break-words"
        style={{
          color: highlight ? '#BE0A2F' : 'var(--foreground)',
          maxWidth: 0,
          width: '60%',
        }}
      >
        {value}
      </td>
    </tr>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="text-[9px] font-black uppercase tracking-widest mb-1 pb-1 border-b border-border"
        style={{ color: 'var(--muted-foreground)', letterSpacing: '0.12em' }}
      >
        {titulo}
      </p>
      <table className="w-full border-collapse">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default function StepResumen({
  formData,
  transportSkipped,
  showTransport,
}: StepResumenProps) {
  const mostrarCargo = formData.condParticipacion === CondParticipacion.MIEMBRO;
  const tipo = formData.tipoTransporte;

  const labelTransporte =
    tipo === 'AEREO'
      ? 'Vuelo Aéreo ✈'
      : tipo === 'TERRESTRE'
        ? 'Ruta Terrestre 🚌'
        : tipo === 'INDEPENDIENTE'
          ? 'Viaje Independiente 🚗'
          : '';

  return (
    <div className="w-full">
      {/* Layout dos columnas en pantallas medianas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        {/* Columna 1: Identidad + Contacto */}
        <div className="space-y-4">
          <Seccion titulo="Identidad">
            <Fila label="Tipo Doc." value={formData.tipoDocumento.replace(/_/g, ' ')} />
            <Fila label="Nro. Documento" value={formData.nroDocumento} />
            <Fila label="Nombres" value={formData.nombres} />
            <Fila label="Apellidos" value={formData.apellidos} />
            <Fila label="Fecha Nac." value={formData.fechaNacimiento} />
            <Fila label="Género" value={formData.genero} />
          </Seccion>

          <Seccion titulo="Contacto">
            <Fila label="País" value={findCountry(formData.pais)?.label ?? formData.pais} />
            {formData.sede && <Fila label="Sede" value={formData.sede} />}
            <Fila label="Teléfono" value={formData.telefono} />
            <Fila label="Correo" value={formData.email} />
          </Seccion>
        </div>

        {/* Columna 2: Participación + Transporte */}
        <div className="space-y-4">
          <Seccion titulo="Participación">
            <Fila label="Talla Polo" value={formData.tallaPolo} />
            <Fila label="Condición" value={formData.condParticipacion} />
            {mostrarCargo && <Fila label="Cargo / Rol" value={formData.rol} />}
          </Seccion>

          {showTransport && (
            <Seccion titulo="Logística y Transporte">
              {transportSkipped ? (
                <tr>
                  <td colSpan={2} className="py-2 text-xs italic" style={{ color: 'var(--muted-foreground)' }}>
                    Transporte no registrado aún.
                  </td>
                </tr>
              ) : (
                <>
                  <Fila label="Medio" value={labelTransporte} />
                  {(tipo === TipoTransporte.AEREO || tipo === TipoTransporte.TERRESTRE) && (
                    <Fila label="Empresa" value={formData.empresaTransporte} />
                  )}
                  {tipo === TipoTransporte.AEREO && (
                    <Fila label="Nro. Vuelo" value={formData.nroVuelo} />
                  )}
                  <Fila label="Llegada" value={formData.fechaLlegada} />
                  <Fila label="Retorno" value={formData.fechaIda} />
                  {tipo === TipoTransporte.TERRESTRE && (
                    <Fila label="Lugar Llegada" value={formData.lugarLlegada} />
                  )}
                  {(formData.boletoUrl || formData.boletoNombre) && (
                    <Fila label="Comprobante" value={formData.boletoNombre || 'Adjunto'} />
                  )}
                </>
              )}
            </Seccion>
          )}

          {/* Mensaje de confirmación — solo texto */}
          <p className="text-sm pt-1" style={{ color: 'var(--muted-foreground)' }}>
            ¿Todo correcto?{' '}
            <span className="font-bold" style={{ color: '#BE0A2F' }}>
              Presiona Enviar Registro para confirmar tu inscripción.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
