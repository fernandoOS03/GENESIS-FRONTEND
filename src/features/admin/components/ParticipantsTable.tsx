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

// Ya no usamos emojis de bandera

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
      <ChevronDown className="w-3 h-3 opacity-20" />
    );

  const COLS = [
    { label: 'Participante', key: 'nombres' as SortKey },
    { label: 'Correo', key: null },
    { label: 'País', key: 'pais' as SortKey },
    { label: 'Teléfono', key: null },
    { label: 'Transporte', key: null },
    { label: 'Pago', key: null },
    { label: 'Estado', key: 'estadoRegistro' as SortKey },
    { label: 'Registro', key: 'fechaRegistro' as SortKey },
    { label: '', key: null },
  ];

  return (
    <div
      className="bg-transparent overflow-hidden"
    >
      {/* Table toolbar */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: 'var(--muted-foreground)' }}
          />
          <input
            type="text"
            placeholder="Buscar participante…"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg transition-all duration-150"
            style={{
              background: 'var(--muted)',
              border: '1px solid transparent',
              color: 'var(--foreground)',
              outline: 'none',
            }}
            onFocus={e => {
              (e.target as HTMLInputElement).style.borderColor = 'var(--primary)';
              (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(0,157,225,0.12)';
            }}
            onBlur={e => {
              (e.target as HTMLInputElement).style.borderColor = 'transparent';
              (e.target as HTMLInputElement).style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Total badge */}
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: 'var(--muted)',
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {filtered.length} participantes
        </span>

        <div className="flex-1" />

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150"
          title="Actualizar"
          style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)', background: 'transparent' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--muted)';
            (e.currentTarget as HTMLElement).style.color = 'var(--foreground)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)';
          }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Add */}
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-white"
          style={{ background: 'var(--primary)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#0085C1';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--primary)';
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {COLS.map(col => (
                <th
                  key={col.label}
                  className={`text-left px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest ${
                    col.key ? 'cursor-pointer select-none' : ''
                  }`}
                  style={{ color: 'var(--muted-foreground)' }}
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

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }} className="odd:bg-white even:bg-muted/30">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-5 py-3">
                      <div
                        className="h-3.5 rounded animate-pulse"
                        style={{
                          width: j === 0 ? '60%' : j === 8 ? '20%' : '45%',
                          background: 'var(--muted)',
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-14 text-center text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {search ? 'Sin resultados para la búsqueda.' : 'No hay participantes registrados aún.'}
                </td>
              </tr>
            ) : (
              paged.map((p) => (
                <tr
                  key={p.id}
                  className="group cursor-pointer transition-colors duration-100 odd:bg-white even:bg-muted/40 hover:bg-accent/60"
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                  onClick={() => onViewDetail(p)}
                >
                  {/* Participante */}
                  <td className="px-5 py-2.5">
                    <span className="font-medium text-[13px] leading-tight" style={{ color: 'var(--foreground)' }}>
                      {p.nombres} {p.apellidos}
                    </span>
                  </td>

                  {/* Correo */}
                  <td className="px-5 py-2.5 text-[12px]" style={{ color: 'var(--muted-foreground)' }}>
                    {p.email}
                  </td>

                  {/* País */}
                  <td className="px-5 py-2.5">
                    <span className="flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--foreground)' }}>
                      <span
                        className="font-mono text-[13px] font-semibold"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}
                      >
                        {p.pais}
                      </span>
                    </span>
                  </td>

                  {/* Teléfono */}
                  <td
                    className="px-5 py-2.5 text-[12px]"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
                  >
                    {p.telefono ?? <span style={{ opacity: 0.35 }}>—</span>}
                  </td>

                  {/* Transporte */}
                  <td className="px-5 py-2.5">
                    {p.tipoTransporte ? (
                      <span
                        className="inline-flex items-center text-[11px] font-medium capitalize"
                        style={{ color: '#0070A3' }}
                      >
                        {p.tipoTransporte}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--muted-foreground)', opacity: 0.35, fontSize: 12 }}>—</span>
                    )}
                  </td>

                  {/* Pago */}
                  <td className="px-5 py-2.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[11px] font-bold" style={{ color: 'var(--foreground)' }}>
                        ${p.totalAbonado ?? 0} <span className="opacity-50 font-normal">/ ${p.tarifaCongelada ?? 0}</span>
                      </span>
                      {(p.totalAbonado ?? 0) >= (p.tarifaCongelada ?? 0) && (p.tarifaCongelada ?? 0) > 0 && (
                        <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-600">Cubierto</span>
                      )}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-2.5" onClick={e => e.stopPropagation()}>
                    <StatusBadge estado={p.estadoRegistro} />
                  </td>

                  {/* Fecha */}
                  <td
                    className="px-5 py-2.5 text-[11px]"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
                  >
                    {new Date(p.fechaRegistro).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-2.5" onClick={e => e.stopPropagation()}>
                    <ParticipantActionMenu participante={p} onViewDetail={onViewDetail} />
                  </td>
                </tr>
              ))
            )}

            {/* Empty filler rows */}
            {!loading && paged.length > 0 && Array.from({ length: emptyRows }).map((_, i) => (
              <tr key={`empty-${i}`} className="pointer-events-none opacity-0" style={{ height: 49 }}>
                <td colSpan={9} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <p
          className="text-[11px]"
          style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
        >
          {filtered.length} registros · pág. {page} / {totalPages}
        </p>
        <div className="flex gap-1.5">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-[11px] rounded-md font-medium transition-all duration-150 disabled:opacity-30"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              if (page !== 1) (e.currentTarget as HTMLElement).style.background = 'var(--muted)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            ← Anterior
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 text-[11px] rounded-md font-medium transition-all duration-150 disabled:opacity-30"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              if (page !== totalPages) (e.currentTarget as HTMLElement).style.background = 'var(--muted)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
