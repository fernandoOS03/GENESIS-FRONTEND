import { useParticipantes } from '../hooks/useParticipantes';
import StatusBadge from '../components/StatusBadge';
import { MapPin, Plane, Bus, Building2 } from 'lucide-react';

const HOTELES_MOCK = [
  { id: 1, nombre: 'Casa Andina Select', ciudad: 'Lima, Perú', capacidad: 40, ocupado: 40 },
  { id: 2, nombre: 'JW Marriott Lima', ciudad: 'Lima, Perú', capacidad: 60, ocupado: 38 },
  { id: 3, nombre: 'Swissôtel Lima', ciudad: 'Lima, Perú', capacidad: 30, ocupado: 67 },
];

function transporteIcon(tipo: string | null) {
  if (tipo === 'AEREO') return <Plane className="w-3.5 h-3.5" />;
  if (tipo === 'TERRESTRE') return <Bus className="w-3.5 h-3.5" />;
  return null;
}

export default function LogisticaPage() {
  const { participantes, loading } = useParticipantes();
  const conTransporte = participantes.filter(p => p.tipoTransporte !== null);

  return (
    <div className="p-7 space-y-7 animate-fade-up">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
          Logística y Hoteles
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Gestiona alojamiento y transporte de los participantes.
        </p>
      </div>

      {/* Hotel cards */}
      <div>
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Alojamientos asignados
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOTELES_MOCK.map(h => {
            const pct = h.ocupado;
            const isHigh = pct > 60;
            return (
              <div
                key={h.id}
                className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200"
              >
                {/* Hotel header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: 'var(--muted)',
                      color: 'var(--muted-foreground)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    Cap. {h.capacidad}
                  </span>
                </div>

                <h3 className="font-semibold text-sm leading-tight mb-1" style={{ color: 'var(--foreground)' }}>
                  {h.nombre}
                </h3>
                <p
                  className="text-xs flex items-center gap-1 mb-5"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <MapPin className="w-3 h-3" /> {h.ciudad}
                </p>

                {/* Occupancy bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Ocupación</span>
                    <span
                      className="text-[11px] font-semibold"
                      style={{
                        color: isHigh ? '#EF4444' : 'var(--primary)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: 'var(--muted)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: isHigh
                          ? 'linear-gradient(90deg, #F97316, #EF4444)'
                          : 'linear-gradient(90deg, #009DE1, #38BDF8)',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transport table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
            Participantes con transporte
          </h2>
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: 'var(--muted)',
              color: 'var(--muted-foreground)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {conTransporte.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
                {['Participante', 'País', 'Tipo', 'Aerolínea', 'Nro. Vuelo', 'Destino', 'Estado'].map(h => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-3.5">
                        <div className="h-3.5 rounded animate-pulse" style={{ background: 'var(--muted)', width: '60%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : conTransporte.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Ningún participante ha registrado transporte aún.
                  </td>
                </tr>
              ) : (
                conTransporte.map(p => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    className="transition-colors duration-100"
                  >
                    <td className="px-5 py-3.5 font-medium text-[13px]" style={{ color: 'var(--foreground)' }}>
                      {p.nombres} {p.apellidos}
                    </td>
                    <td
                      className="px-5 py-3.5 text-[12px]"
                      style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
                    >
                      {p.pais}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-[12px]" style={{ color: 'var(--muted-foreground)' }}>
                        {transporteIcon(p.tipoTransporte)}
                        <span style={{ fontFamily: 'var(--font-mono)' }}>{p.tipoTransporte}</span>
                      </span>
                    </td>
                    <td
                      className="px-5 py-3.5 text-[12px]"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {p.empresaTransporte ?? <span style={{ opacity: 0.35 }}>—</span>}
                    </td>
                    <td
                      className="px-5 py-3.5 text-[12px]"
                      style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
                    >
                      {p.nroVuelo ?? <span style={{ opacity: 0.35 }}>—</span>}
                    </td>
                    <td
                      className="px-5 py-3.5 text-[12px]"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {p.lugarLlegada ?? <span style={{ opacity: 0.35 }}>—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge estado={p.estadoRegistro} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
