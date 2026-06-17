import { useState, useMemo } from 'react';
import { FileSpreadsheet, FileText, SlidersHorizontal, Download, Users, Search, Loader2 } from 'lucide-react';
import { useParticipantes } from '../hooks/useParticipantes';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const ESTADOS = [
  { value: 'Todos', label: 'Todos los estados' },
  { value: 'PRE_INSCRITO', label: 'Pre Inscrito' },
  { value: 'FALT_TRANSPORTE', label: 'Falt. Transporte' },
  { value: 'PENDIENTE_PAGO', label: 'Pendiente Pago' },
  { value: 'PAGO_PARCIAL', label: 'Pago Parcial' },
  { value: 'PAGO_COMPLETADO', label: 'Pago Completado' },
  { value: 'COMPLETADO', label: 'Completado' },
];

const TIPOS_TRANSPORTE = [
  { value: 'Todos', label: 'Todos los transportes' },
  { value: 'VUELOS', label: 'Vuelo / Aéreo' },
  { value: 'TERRESTRE', label: 'Terrestre' },
  { value: 'INDEPENDIENTE', label: 'Independiente' },
  { value: 'SIN_TRANSPORTE', label: 'Sin Transporte' },
];

export default function ReportesPage() {
  const { participantes, loading } = useParticipantes();
  const [filtroPais, setFiltroPais] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroTransporte, setFiltroTransporte] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Extraer países de forma dinámica de la lista de participantes
  const paisesDisponibles = useMemo(() => {
    const set = new Set(participantes.map(p => p.pais).filter(Boolean));
    return ['Todos', ...Array.from(set).sort()];
  }, [participantes]);

  // Aplicar filtros en memoria
  const filtered = useMemo(() => {
    return participantes.filter(p => {
      const pOk = filtroPais === 'Todos' || p.pais === filtroPais;
      const eOk = filtroEstado === 'Todos' || p.estadoRegistro === filtroEstado;
      
      let tOk = true;
      if (filtroTransporte !== 'Todos') {
        const trans = p.tipoTransporte || 'SIN_TRANSPORTE';
        tOk = trans === filtroTransporte;
      }

      const term = busqueda.toLowerCase().trim();
      const sOk = !term || 
        `${p.nombres} ${p.apellidos}`.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term) ||
        (p.nroDocumento && p.nroDocumento.includes(term));

      return pOk && eOk && tOk && sOk;
    });
  }, [participantes, filtroPais, filtroEstado, filtroTransporte, busqueda]);

  const exportCSV = () => {
    if (filtered.length === 0) return;
    try {
      const headers = ['Nombres', 'Apellidos', 'Email', 'País', 'Teléfono', 'Estado', 'Transporte', 'Empresa', 'Nro Vuelo/Viaje', 'Total Abonado', 'Tarifa Congelada', 'Fecha Registro'];
      const rows = filtered.map(p => [
        `"${p.nombres.replace(/"/g, '""')}"`,
        `"${p.apellidos.replace(/"/g, '""')}"`,
        `"${p.email.replace(/"/g, '""')}"`,
        `"${p.pais}"`,
        `"${p.telefono ?? ''}"`,
        `"${p.estadoRegistro}"`,
        `"${p.tipoTransporte ?? 'SIN_TRANSPORTE'}"`,
        `"${p.empresaTransporte ?? ''}"`,
        `"${p.nroVuelo ?? ''}"`,
        p.totalAbonado ?? 0,
        p.tarifaCongelada ?? 0,
        `"${new Date(p.fechaRegistro).toLocaleDateString('es-PE')}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_participantes_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Reporte CSV exportado correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al exportar CSV');
    }
  };

  const exportPDF = () => {
    if (filtered.length === 0) return;
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Encabezado
      doc.setFontSize(18);
      doc.setTextColor(31, 41, 55); // Gray 800
      doc.text('Reporte General de Participantes - Genesis', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128); // Gray 500
      doc.text(`Fecha de generación: ${new Date().toLocaleString('es-PE')}`, 14, 26);
      doc.text(`Total de registros filtrados: ${filtered.length}`, 14, 31);

      // Tabla de datos
      const tableHeaders = [['Participante', 'Email', 'País', 'Estado', 'Transporte', 'Pago ($)', 'Registro']];
      const tableData = filtered.map(p => [
        `${p.nombres} ${p.apellidos}`,
        p.email,
        p.pais,
        p.estadoRegistro.replace('_', ' '),
        p.tipoTransporte || 'SIN_TRANSPORTE',
        `$${p.totalAbonado ?? 0} / $${p.tarifaCongelada ?? 0}`,
        new Date(p.fechaRegistro).toLocaleDateString('es-PE')
      ]);

      autoTable(doc, {
        startY: 38,
        head: tableHeaders,
        body: tableData,
        theme: 'striped',
        headStyles: { fillStyle: 'Fills', fillColor: [0, 157, 225], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8.5, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 65 },
          2: { cellWidth: 20 },
          3: { cellWidth: 35 },
          4: { cellWidth: 35 },
          5: { cellWidth: 35 },
          6: { cellWidth: 25 },
        }
      });

      doc.save(`reporte_participantes_${new Date().toISOString().slice(0,10)}.pdf`);
      toast.success('Reporte PDF exportado correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al exportar PDF');
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-up max-w-[1400px] mx-auto">
      
      {/* Header with action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Reportes del Sistema
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Filtra, previsualiza y exporta la información de los participantes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={exportCSV}
            disabled={loading || filtered.length === 0}
            variant="outline"
            className="h-10 rounded-xl gap-2 font-medium"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar Excel</span>
          </Button>

          <Button
            onClick={exportPDF}
            disabled={loading || filtered.length === 0}
            className="h-10 rounded-xl gap-2 font-medium bg-primary text-white hover:bg-primary/90"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Exportar PDF</span>
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Filtros del Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre, email o documento..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  className="pl-9 h-10 bg-card border-border"
                />
              </div>
            </div>

            {/* Country Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">País</Label>
              <Select value={filtroPais} onValueChange={setFiltroPais}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent>
                  {paisesDisponibles.map(p => (
                    <SelectItem key={p} value={p}>
                      {p === 'Todos' ? 'Todos los países' : p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado de Registro</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map(e => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transport Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo de Transporte</Label>
              <Select value={filtroTransporte} onValueChange={setFiltroTransporte}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Seleccionar transporte" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_TRANSPORTE.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Preview Component */}
      <Card className="border-border/40 shadow-modern overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-card pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Previsualización de Datos
              </CardTitle>
              <CardDescription className="mt-1">
                Visualización detallada de los registros filtrados en tiempo real.
              </CardDescription>
            </div>
            <Badge variant="outline" className="h-6 font-semibold font-mono bg-muted/50 text-foreground">
              {filtered.length} registro(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="px-6 h-11">Participante</TableHead>
                  <TableHead className="px-6 h-11">País</TableHead>
                  <TableHead className="px-6 h-11">Estado de Registro</TableHead>
                  <TableHead className="px-6 h-11">Pago (USD)</TableHead>
                  <TableHead className="px-6 h-11">Transporte</TableHead>
                  <TableHead className="px-6 h-11 text-right">Fecha Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                        <span>Cargando datos de participantes...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                      No se encontraron participantes que coincidan con los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="px-6 py-3.5 font-medium">
                        <div className="flex flex-col">
                          <span className="text-foreground">{p.nombres} {p.apellidos}</span>
                          <span className="text-xs text-muted-foreground font-normal">{p.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-3.5">
                        <Badge variant="secondary" className="font-mono text-[11px] font-bold shadow-none">
                          {p.pais}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-3.5">
                        <Badge 
                          variant="secondary" 
                          className={
                            p.estadoRegistro === 'COMPLETADO' 
                              ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-semibold border-transparent' 
                              : p.estadoRegistro === 'PRE_INSCRITO'
                              ? 'bg-blue-500/10 text-blue-600 font-semibold border-transparent'
                              : p.estadoRegistro === 'PENDIENTE_PAGO'
                              ? 'bg-destructive/10 text-destructive font-semibold border-transparent'
                              : 'font-semibold border-transparent'
                          }
                        >
                          {p.estadoRegistro.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-3.5 font-mono text-[13px]">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            ${p.totalAbonado ?? 0} <span className="text-muted-foreground font-normal">/ ${p.tarifaCongelada ?? 0}</span>
                          </span>
                          {(p.totalAbonado ?? 0) >= (p.tarifaCongelada ?? 0) && (p.tarifaCongelada ?? 0) > 0 && (
                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">Cubierto</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-3.5 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {p.tipoTransporte || 'SIN_TRANSPORTE'}
                          </span>
                          {p.nroVuelo && (
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {p.empresaTransporte} - {p.nroVuelo}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-3.5 text-right font-mono text-[13px] text-muted-foreground">
                        {new Date(p.fechaRegistro).toLocaleDateString('es-PE')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
