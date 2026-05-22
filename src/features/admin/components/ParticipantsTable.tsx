import { useState } from 'react';
import { Search, Plus, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import type { ParticipanteAdmin } from '../types/admin.types';
import StatusBadge from './StatusBadge';
import ParticipantActionMenu from './ParticipantActionMenu';

interface ParticipantsTableProps {
  participantes: ParticipanteAdmin[];
  loading: boolean;
  onAddNew: () => void;
  onViewDetail: (p: ParticipanteAdmin) => void;
  onRefresh: () => void;
}

type SortKey = 'nombres' | 'pais' | 'estadoRegistro' | 'fechaRegistro';

// Map ISO → flag emoji
function flagEmoji(iso: string) {
  if (!iso || iso.length !== 2) return '🌎';
  return iso
    .toUpperCase()
    .split('')
    .map(c => String.fromCodePoint(0x1f1e6 - 0x41 + c.charCodeAt(0)))
    .join('');
}

export default function ParticipantsTable({
  participantes,
  loading,
  onAddNew,
  onViewDetail,
  onRefresh,
}: ParticipantsTableProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({
    key: 'fechaRegistro',
    dir: 'desc',
  });
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = participantes
    .filter(p => {
      const q = search.toLowerCase();
      return (
        p.nombres.toLowerCase().includes(q) ||
        p.apellidos.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.pais.toLowerCase().includes(q) ||
        (p.telefono ?? '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const av = a[sort.key] ?? '';
      const bv = b[sort.key] ?? '';
      return sort.dir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const emptyRows = Math.max(0, PER_PAGE - paged.length);

  const toggleSort = (key: SortKey) => {
    setSort(prev =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sort.key === k ? (
      sort.dir === 'asc' ? (
        <ChevronUp className="w-3 h-3" />
      ) : (
        <ChevronDown className="w-3 h-3" />
      )
    ) : (
      <ChevronDown className="w-3 h-3 opacity-30" />
    );

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, país…"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-border/80 transition-all shadow-sm"
          />
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition"
          title="Actualizar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {[
                { label: 'Participante', key: 'nombres' as SortKey },
                { label: 'País', key: 'pais' as SortKey },
                { label: 'Teléfono', key: null },
                { label: 'Transporte', key: null },
                { label: 'Estado', key: 'estadoRegistro' as SortKey },
                { label: 'Registro', key: 'fechaRegistro' as SortKey },
                { label: '', key: null },
              ].map(col => (
                <th
                  key={col.label}
                  className={`text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${
                    col.key ? 'cursor-pointer hover:text-foreground select-none' : ''
                  }`}
                  onClick={() => col.key && toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.key && <SortIcon k={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-muted rounded-lg" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">
                  {search ? 'Sin resultados para la búsqueda.' : 'No hay participantes registrados aún.'}
                </td>
              </tr>
            ) : (
              paged.map(p => (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-accent/40 transition-colors cursor-pointer group"
                  onClick={() => onViewDetail(p)}
                >
                  {/* Participante */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-xs">
                          {p.nombres.charAt(0).toUpperCase()}
                          {p.apellidos.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground leading-tight">
                          {p.nombres} {p.apellidos}
                        </p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* País */}
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base leading-none">{flagEmoji(p.pais)}</span>
                      <span className="text-foreground">{p.pais}</span>
                    </span>
                  </td>
                  {/* Teléfono */}
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.telefono ?? <span className="text-muted-foreground/50">—</span>}
                  </td>
                  {/* Transporte */}
                  <td className="px-4 py-3">
                    {p.tipoTransporte ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                        {p.tipoTransporte === 'AEREO' ? '✈️' : p.tipoTransporte === 'TERRESTRE' ? '🚌' : '🚶'}{' '}
                        {p.tipoTransporte}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50 text-xs">—</span>
                    )}
                  </td>
                  {/* Estado */}
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <StatusBadge estado={p.estadoRegistro} />
                  </td>
                  {/* Fecha */}
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(p.fechaRegistro).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  {/* Acciones */}
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <ParticipantActionMenu
                      participante={p}
                      onViewDetail={onViewDetail}
                    />
                  </td>
                </tr>
              ))
            )}
            
            {/* Filas vacías para mantener altura constante */}
            {!loading && paged.length > 0 && Array.from({ length: emptyRows }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-[65px] opacity-0 pointer-events-none">
                <td colSpan={7}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (siempre visible) */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card mt-auto">
        <p className="text-xs text-muted-foreground">
          {filtered.length} participantes · página {page} de {totalPages}
        </p>
        <div className="flex gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent disabled:opacity-40 transition"
          >
            Anterior
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent disabled:opacity-40 transition"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
