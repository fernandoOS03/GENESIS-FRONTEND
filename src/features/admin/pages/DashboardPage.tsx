import { useState, useEffect, useMemo } from 'react';
import { X, Activity, Users, Globe2, PlaneTakeoff, CreditCard, LayoutDashboard } from 'lucide-react';
import { useParticipantes } from '../hooks/useParticipantes';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardPage() {
  const { participantes, loading, error, stats } = useParticipantes();
  const [showWelcome, setShowWelcome] = useState(false);

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? 'Administrador';

  useEffect(() => {
    const enterTimer = setTimeout(() => setShowWelcome(true), 300);
    const exitTimer = setTimeout(() => setShowWelcome(false), 5300);
    return () => { clearTimeout(enterTimer); clearTimeout(exitTimer); };
  }, []);

  const estados = [
    { label: 'Total', value: stats.total, color: 'text-foreground', bg: 'bg-muted', icon: Users, info: 'Todos los registros' },
    { label: 'Pre Inscrito', value: stats.preInscrito, color: 'text-blue-600', bg: 'bg-blue-500/10', icon: Activity, info: 'Completaron formulario inicial' },
    { label: 'Falt. Transp.', value: stats.faltTransporte, color: 'text-orange-500', bg: 'bg-orange-500/10', icon: PlaneTakeoff, info: 'Sin transporte' },
    { label: 'Pdte. Pago', value: stats.pendientePago, color: 'text-destructive', bg: 'bg-destructive/10', icon: CreditCard, info: 'Deben realizar pago' },
    { label: 'Pago Parcial', value: stats.pagoParcial, color: 'text-purple-600', bg: 'bg-purple-500/10', icon: CreditCard, info: 'Parte del total pagado' },
    { label: 'Pago Completo', value: stats.pagoCompletado, color: 'text-cyan-600', bg: 'bg-cyan-500/10', icon: CreditCard, info: 'Tarifa completa pagada' },
    { label: 'Completado', value: stats.completado, color: 'text-emerald-600', bg: 'bg-emerald-500/10', icon: Activity, info: 'Proceso finalizado' },
  ];

  const { timelineData, statesData, transportData, countryData } = useMemo(() => {
    if (!participantes || participantes.length === 0) return { timelineData: [], statesData: [], transportData: [], countryData: [] };

    // Timeline
    const datesMap: Record<string, number> = {};
    participantes.forEach(p => {
      if (!p.fechaRegistro) return;
      const dateStr = p.fechaRegistro.split('T')[0];
      datesMap[dateStr] = (datesMap[dateStr] || 0) + 1;
    });
    const timelineData = Object.keys(datesMap).sort().map(date => ({
      date: format(parseISO(date), 'd MMM', { locale: es }),
      count: datesMap[date],
    }));

    // States
    const stateColors: Record<string, string> = {
      'PRE_INSCRITO': '#3B82F6',
      'FALT_TRANSPORTE': '#F97316',
      'PENDIENTE_PAGO': '#EF4444',
      'PAGO_PARCIAL': '#A855F7',
      'PAGO_COMPLETADO': '#06B6D4',
      'COMPLETADO': '#10B981',
    };
    const statesData = Object.entries(
      participantes.reduce((acc, p) => {
        const state = p.estadoRegistro || 'OTRO';
        acc[state] = (acc[state] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ 
      name: name.replace('_', ' '), 
      value, 
      color: stateColors[name] || '#94A3B8' 
    }));

    // Transport
    const transportColors: Record<string, string> = {
      'VUELOS': '#0EA5E9',
      'TERRESTRE': '#8B5CF6',
      'INDEPENDIENTE': '#14B8A6',
      'SIN_TRANSPORTE': '#94A3B8'
    };
    const transportData = Object.entries(
      participantes.reduce((acc, p) => {
        const t = p.tipoTransporte || 'SIN_TRANSPORTE';
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value, color: transportColors[name] || '#94A3B8' }));

    // Countries
    const countryDataRaw = Object.entries(
      participantes.reduce((acc, p) => {
        const pais = p.pais || 'Desconocido';
        acc[pais] = (acc[pais] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));
    countryDataRaw.sort((a, b) => b.value - a.value);
    const countryData = countryDataRaw.slice(0, 7);

    return { timelineData, statesData, transportData, countryData };
  }, [participantes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Welcome Popup (10m) */}
      <div 
        className={`fixed top-1/2 left-4 z-50 bg-primary text-secondary backdrop-blur-md rounded-[20px] shadow-modal transition-all duration-700 ease-in-out border border-primary/20 w-[220px] ${
          showWelcome ? 'opacity-100 -translate-y-1/2 translate-x-0' : 'opacity-0 -translate-y-1/2 -translate-x-12 pointer-events-none'
        }`}
      >
        <div className="p-5 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <h2 className="font-bold text-[15px] text-secondary leading-tight mt-0.5">
              ¡Hola de nuevo, {firstName}!
            </h2>
            <button 
              onClick={() => setShowWelcome(false)}
              className="text-secondary/60 hover:text-secondary transition-colors p-1.5 -mt-1.5 -mr-2 bg-transparent rounded-full hover:bg-black/10 flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[13px] text-secondary/80 font-medium leading-relaxed">
            Tu centro de mando logístico y financiero.
          </p>
        </div>
      </div>

      <div className="p-8 animate-fade-up space-y-8 max-w-[1400px] mx-auto relative z-10">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Dashboard Analítico
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Vista general del progreso, logística y finanzas del evento.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-medium">
            Error: {error}
          </div>
        )}



        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {estados.map(estado => {
            const Icon = estado.icon;
            return (
              <div 
                key={estado.label} 
                className="bg-card rounded-2xl p-4 shadow-sm border border-border/40 flex flex-col group relative overflow-hidden transition-all hover:shadow-md hover:border-border/80"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${estado.bg}`}>
                  <Icon className={`w-4 h-4 ${estado.color}`} />
                </div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 cursor-help">
                  {estado.label}
                </p>
                <p className={`text-2xl font-bold font-mono leading-none ${estado.color}`}>
                  {estado.value}
                </p>

                {/* Tooltip */}
                <div className="absolute top-[110%] left-1/2 -translate-x-1/2 w-48 p-2.5 bg-foreground text-background text-xs rounded-xl shadow-modern opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center font-medium leading-tight">
                  {estado.info}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Timeline Chart */}
          <div className="lg:col-span-2 bg-card rounded-[24px] shadow-sm border border-border/40 p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-foreground">Flujo de Registros</h2>
              <p className="text-xs text-muted-foreground">Cantidad de pre-inscripciones en el tiempo</p>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    itemStyle={{ color: 'var(--foreground)', fontWeight: 600, fontSize: '14px' }}
                    labelStyle={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="count" name="Registros" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* States Pie Chart */}
          <div className="bg-card rounded-[24px] shadow-sm border border-border/40 p-6 flex flex-col">
            <div className="mb-2">
              <h2 className="text-base font-semibold text-foreground">Estado General</h2>
              <p className="text-xs text-muted-foreground">Progreso de la logística y pagos</p>
            </div>
            <div className="flex-1 min-h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {statesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px 12px' }} 
                    itemStyle={{ color: 'var(--foreground)', fontWeight: 600, fontSize: '13px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={72} 
                    iconType="circle" 
                    wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: 'var(--foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
          
          {/* Transport Bar Chart */}
          <div className="bg-card rounded-[24px] shadow-sm border border-border/40 p-6 flex flex-col">
            <div className="mb-6 flex items-center gap-2">
              <PlaneTakeoff className="w-4 h-4 text-muted-foreground" />
              <div>
                <h2 className="text-base font-semibold text-foreground">Logística de Transporte</h2>
                <p className="text-xs text-muted-foreground">Distribución del tipo de viaje</p>
              </div>
            </div>
            <div className="flex-1 min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transportData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--foreground)', fontWeight: 500 }} width={120} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)' }} 
                    itemStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                  />
                  <Bar dataKey="value" name="Pasajeros" radius={[0, 4, 4, 0]} barSize={24}>
                    {transportData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Countries Bar Chart */}
          <div className="bg-card rounded-[24px] shadow-sm border border-border/40 p-6 flex flex-col">
            <div className="mb-6 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-muted-foreground" />
              <div>
                <h2 className="text-base font-semibold text-foreground">Top Países</h2>
                <p className="text-xs text-muted-foreground">Orígenes con más registros (Top 7)</p>
              </div>
            </div>
            <div className="flex-1 min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--foreground)', fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)' }} 
                    itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
                  />
                  <Bar dataKey="value" name="Participantes" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
