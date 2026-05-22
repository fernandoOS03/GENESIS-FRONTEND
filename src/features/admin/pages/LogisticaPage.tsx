import { useParticipantes } from '../hooks/useParticipantes';
import StatusBadge from '../components/StatusBadge';
import { MapPin, Plane, Bus } from 'lucide-react';

// Hard-coded hotel data (as per Banani design)
const HOTELES_MOCK = [
  {
    id: 1,
    nombre: 'Hotel Casa Andina Select',
    ciudad: 'Lima, Perú',
    emoji: '🏨',
    capacidad: 40,
  },
  {
    id: 2,
    nombre: 'Hotel JW Marriott',
    ciudad: 'Lima, Perú',
    emoji: '🏨',
    capacidad: 60,
  },
  {
    id: 3,
    nombre: 'Swiss Hotel Lima',
    ciudad: 'Lima, Perú',
    emoji: '🏨',
    capacidad: 30,
  },
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Logística y Hoteles</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gestiona alojamiento y transporte de los participantes.
        </p>
      </div>

      {/* Hotel cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {HOTELES_MOCK.map(h => (
          <div key={h.id} className="bg-white rounded-2xl border border-border p-5 shadow-soft">
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{h.emoji}</div>
              <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                Cap. {h.capacidad}
              </span>
            </div>
            <h3 className="font-bold text-foreground text-sm">{h.nombre}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> {h.ciudad}
            </p>
            <div className="mt-4 h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '40%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">40% ocupado (mock)</p>
          </div>
        ))}
      </div>

      {/* Participants with transport */}
      <div className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground text-sm">
            Participantes con transporte registrado
          </h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {conTransporte.length} participantes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Participante', 'País', 'Tipo', 'Aerolínea', 'Nro. Vuelo', 'Destino', 'Estado'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded-lg" /></td>
                    ))}
                  </tr>
                ))
              ) : conTransporte.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground text-sm">
                    Ningún participante ha registrado transporte aún.
                  </td>
                </tr>
              ) : (
                conTransporte.map(p => (
                  <tr key={p.id} className="border-b border-border hover:bg-accent/40 transition">
                    <td className="px-4 py-3 font-medium text-foreground">{p.nombres} {p.apellidos}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.pais}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs">
                        {transporteIcon(p.tipoTransporte)}
                        {p.tipoTransporte}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.empresaTransporte ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.nroVuelo ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.lugarLlegada ?? '—'}</td>
                    <td className="px-4 py-3"><StatusBadge estado={p.estadoRegistro} /></td>
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
