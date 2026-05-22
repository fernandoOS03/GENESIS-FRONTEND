import { useState } from 'react';
import { FileSpreadsheet, FileText, Filter } from 'lucide-react';
import { useParticipantes } from '../hooks/useParticipantes';

const PAISES_MOCK = ['Todos', 'PE', 'CO', 'MX', 'AR', 'CL', 'EC', 'BO'];
const ESTADOS_MOCK = ['Todos', 'PRE INSCRITO', 'CONFIRMADO', 'PENDIENTE'];

export default function ReportesPage() {
  const { participantes, loading } = useParticipantes();
  const [filtroPais, setFiltroPais] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  // Calcular count del filtro
  const filtered = participantes.filter(p => {
    const pOk = filtroPais === 'Todos' || p.pais === filtroPais;
    const eOk = filtroEstado === 'Todos' || p.estadoRegistro === filtroEstado;
    return pOk && eOk;
  });

  const exportCSV = () => {
    const headers = ['Nombres', 'Apellidos', 'Email', 'País', 'Teléfono', 'Estado', 'Transporte', 'Fecha Registro'];
    const rows = filtered.map(p => [
      p.nombres,
      p.apellidos,
      p.email,
      p.pais,
      p.telefono ?? '',
      p.estadoRegistro,
      p.tipoTransporte ?? '',
      new Date(p.fechaRegistro).toLocaleDateString('es-PE'),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participantes_genesis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reportes del Sistema</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Filtra y exporta la información de los participantes.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">País</label>
            <select
              value={filtroPais}
              onChange={e => setFiltroPais(e.target.value)}
              className="text-sm px-3 py-2 rounded-xl border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
            >
              {PAISES_MOCK.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Estado de registro</label>
            <select
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
              className="text-sm px-3 py-2 rounded-xl border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
            >
              {ESTADOS_MOCK.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {loading ? 'Cargando…' : `${filtered.length} participante(s) coinciden con los filtros.`}
        </p>
      </div>

      {/* Export cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Excel / CSV */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-soft flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Exportar a Excel (CSV)</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Descarga la lista filtrada en formato CSV compatible con Excel.
            </p>
          </div>
          <button
            onClick={exportCSV}
            disabled={loading || filtered.length === 0}
            className="mt-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Descargar CSV
          </button>
        </div>

        {/* PDF (visual, no implementado) */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-soft flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
            <FileText className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Exportar a PDF</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Genera un reporte PDF con la información filtrada (próximamente).
            </p>
          </div>
          <button
            disabled
            className="mt-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium opacity-50 cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
