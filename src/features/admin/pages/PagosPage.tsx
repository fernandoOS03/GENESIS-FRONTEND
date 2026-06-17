import { useState, useEffect, useMemo } from 'react';
import { DollarSign, Plus, Calendar, MoreHorizontal, Edit, Trash } from 'lucide-react';
import axiosInstance from '@/api/axiosInstance';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Tarifa {
  id: string;
  monto: number;
  moneda: 'USD' | 'PEN' | string;
  fechaInicio: string;
  fechaFin: string;
}

export default function PagosPage() {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [monto, setMonto] = useState('');
  const [montoPen, setMontoPen] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  
  const [editingTarifaGroup, setEditingTarifaGroup] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTarifas = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get<Tarifa[]>('/api/tarifas');
      setTarifas(data);
    } catch (err) {
      console.error('Error cargando tarifas', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTarifas();
  }, []);

  // Agrupar tarifas por fecha de vigencia para mostrarlas juntas
  const groupedTarifas = useMemo(() => {
    const groups: Record<string, { key: string; fechaInicio: string; fechaFin: string; usd?: number; pen?: number }> = {};
    tarifas.forEach(t => {
      const key = `${t.fechaInicio}_${t.fechaFin}`;
      if (!groups[key]) {
        groups[key] = { key, fechaInicio: t.fechaInicio, fechaFin: t.fechaFin };
      }
      if (t.moneda === 'USD') {
        groups[key].usd = t.monto;
      } else if (t.moneda === 'PEN' || t.moneda === 'SOL') {
        groups[key].pen = t.monto;
      }
    });
    return Object.values(groups).sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio));
  }, [tarifas]);

  const handleEditClick = (tarifaGroup: any) => {
    setEditingTarifaGroup(tarifaGroup);
    setMonto(tarifaGroup.usd?.toString() || '');
    setMontoPen(tarifaGroup.pen?.toString() || '');
    setFechaInicio(tarifaGroup.fechaInicio);
    setFechaFin(tarifaGroup.fechaFin);
    setOpenEditModal(true);
  };

  const handleCreateTarifa = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!monto || !montoPen || !fechaInicio || !fechaFin) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      setError('La fecha de inicio no puede ser mayor a la fecha de fin.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Enviar dos peticiones en paralelo (una para cada moneda)
      await Promise.all([
        axiosInstance.post('/api/tarifas', {
          monto: parseFloat(monto),
          moneda: 'USD',
          fechaInicio,
          fechaFin,
        }),
        axiosInstance.post('/api/tarifas', {
          monto: parseFloat(montoPen),
          moneda: 'PEN',
          fechaInicio,
          fechaFin,
        })
      ]);
      setOpenModal(false);
      setMonto('');
      setMontoPen('');
      setFechaInicio('');
      setFechaFin('');
      loadTarifas();
    } catch (err: any) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al crear las tarifas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTarifa = async (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy update for UI presentation
    setOpenEditModal(false);
    setEditingTarifaGroup(null);
  };

  return (
    <div className="p-8 space-y-8 animate-fade-up max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Configuración de Tarifas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra los precios de inscripción globales según rango de fechas.
          </p>
        </div>

        <Sheet open={openModal} onOpenChange={setOpenModal}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva Tarifa
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md overflow-hidden bg-card border-r border-border flex flex-col p-0">
            <SheetHeader className="px-6 py-4 border-b border-border">
              <SheetTitle className="text-[15px] font-semibold text-foreground">Crear Nueva Tarifa</SheetTitle>
              <SheetDescription className="text-[12px] text-muted-foreground mt-0.5">
                Define los montos en dólares y soles para el periodo de vigencia.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreateTarifa} className="flex flex-col flex-1">
              <div className="px-6 py-5 space-y-4 overflow-y-auto thin-scrollbar">
                {error && <p className="text-sm text-destructive">{error}</p>}
                
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tarifa USD ($)</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={monto} 
                    onChange={e => setMonto(e.target.value)} 
                    placeholder="Ej. 100.00" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tarifa PEN (S/)</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={montoPen} 
                    onChange={e => setMontoPen(e.target.value)} 
                    placeholder="Ej. 370.00" 
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha Inicio</Label>
                  <Input 
                    type="date" 
                    value={fechaInicio} 
                    onChange={e => setFechaInicio(e.target.value)} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Fin</Label>
                  <Input 
                    type="date" 
                    value={fechaFin} 
                    onChange={e => setFechaFin(e.target.value)} 
                    required
                  />
                </div>
              </div>

              </div>

              <div className="mt-auto px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-2.5">
                <Button type="button" variant="outline" onClick={() => setOpenModal(false)} disabled={isSubmitting} className="text-[13px] font-medium">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="text-[13px] font-semibold">
                  {isSubmitting ? 'Guardando...' : 'Guardar Tarifa'}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>

        {/* Modal de Edición (Panel Lateral) */}
        <Sheet open={openEditModal} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpenEditModal(false);
            setEditingTarifaGroup(null);
          }
        }}>
          <SheetContent side="left" className="w-full sm:max-w-md overflow-hidden bg-card border-r border-border flex flex-col p-0">
            <SheetHeader className="px-6 py-4 border-b border-border">
              <SheetTitle className="text-[15px] font-semibold text-foreground">Editar Tarifa</SheetTitle>
              <SheetDescription className="text-[12px] text-muted-foreground mt-0.5">
                Actualiza los montos y fechas de la tarifa seleccionada.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleUpdateTarifa} className="flex flex-col flex-1">
              <div className="px-6 py-5 space-y-4 overflow-y-auto thin-scrollbar">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tarifa USD ($)</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={monto} 
                      onChange={e => setMonto(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tarifa PEN (S/)</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={montoPen} 
                      onChange={e => setMontoPen(e.target.value)} 
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Fecha Inicio</Label>
                    <Input 
                      type="date" 
                      value={fechaInicio} 
                      onChange={e => setFechaInicio(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Fecha Fin</Label>
                    <Input 
                      type="date" 
                      value={fechaFin} 
                      onChange={e => setFechaFin(e.target.value)} 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-auto px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-2.5">
                <Button type="button" variant="outline" onClick={() => setOpenEditModal(false)} disabled={isSubmitting} className="text-[13px] font-medium">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="text-[13px] font-semibold">
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Historial de Tarifas
          </CardTitle>
          <CardDescription>
            Listado de todas las tarifas configuradas en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Monto USD</TableHead>
                <TableHead>Monto PEN</TableHead>
                <TableHead>Inicio Vigencia</TableHead>
                <TableHead>Fin Vigencia</TableHead>
                <TableHead className="w-[80px] text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    Cargando tarifas...
                  </TableCell>
                </TableRow>
              ) : groupedTarifas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    No hay tarifas configuradas.
                  </TableCell>
                </TableRow>
              ) : (
                groupedTarifas.map((t) => (
                  <TableRow key={t.key}>
                    <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                      {t.usd !== undefined ? `$${t.usd.toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell className="font-semibold text-blue-600 dark:text-blue-400 font-mono">
                      {t.pen !== undefined ? `S/ ${t.pen.toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell>{new Date(t.fechaInicio).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(t.fechaFin).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem onClick={() => handleEditClick(t)} className="gap-2 cursor-pointer">
                            <Edit className="h-4 w-4" />
                            Editar Tarifa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                            <Trash className="h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
