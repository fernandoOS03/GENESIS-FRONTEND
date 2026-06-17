import { useState, useEffect } from 'react';
import { PiCheckCircleFill, PiWalletLight } from 'react-icons/pi';
import { toast } from 'sonner';
import axiosInstance from '@/api/axiosInstance';

interface TarifaResponseDTO {
  id: string;
  monto: number;
  fechaInicio: string;
  fechaFin: string;
  moneda: 'USD' | 'PEN';
}

interface PaymentManagerProps {
  cuentaId?: string;
  totalAbonado: number;
  tarifaCongelada: number;
  cuentaMoneda: 'USD' | 'PEN';
  onRefresh?: () => void;
  onSuccess?: () => void;
}

export default function PaymentManager({
  cuentaId,
  totalAbonado,
  tarifaCongelada,
  cuentaMoneda,
  onRefresh,
  onSuccess
}: PaymentManagerProps) {
  const [paymentType, setPaymentType] = useState<'completo' | 'parcial'>('completo');
  const [montoAbono, setMontoAbono] = useState('');
  const [saving, setSaving] = useState(false);
  const [tarifas, setTarifas] = useState<TarifaResponseDTO[]>([]);
  const [selectedMoneda, setSelectedMoneda] = useState<'USD' | 'PEN'>(cuentaMoneda);

  useEffect(() => {
    // Si la tarifa es 0 (no congelada aún), traemos las tarifas del backend
    // para saber cuánto cobrar en "Pago Completo" y dejar elegir la moneda.
    if (tarifaCongelada === 0 && cuentaId) {
      axiosInstance.get<TarifaResponseDTO[]>('/api/tarifas')
        .then(res => setTarifas(res.data))
        .catch(err => console.error("Error al cargar tarifas:", err));
    }
  }, [tarifaCongelada, cuentaId]);

  // Calculamos la tarifa y moneda efectivas
  const today = new Date().toISOString().split('T')[0];
  const isTarifaLocked = tarifaCongelada > 0;
  
  const effectiveMoneda = isTarifaLocked ? cuentaMoneda : selectedMoneda;
  
  const activeTariff = tarifas.find(t => 
    t.moneda === effectiveMoneda && 
    t.fechaInicio <= today && 
    t.fechaFin >= today
  );

  const effectiveTarifa = isTarifaLocked ? tarifaCongelada : (activeTariff?.monto || 0);
  const saldoPendiente = Math.max(0, effectiveTarifa - totalAbonado);
  const isCompletado = saldoPendiente === 0 && effectiveTarifa > 0 && isTarifaLocked;
  const symbol = effectiveMoneda === 'PEN' ? 'S/' : '$';

  const handlePay = async () => {
    if (!cuentaId) return;
    
    if (!isTarifaLocked && !activeTariff && paymentType === 'completo') {
      toast.error(`No hay una tarifa activa configurada para ${effectiveMoneda} en la fecha actual.`);
      return;
    }

    const montoFinal = paymentType === 'completo' ? saldoPendiente : parseFloat(montoAbono);

    if (!montoFinal || montoFinal <= 0) {
      toast.error('Ingresa un monto válido mayor a 0');
      return;
    }

    if (montoFinal > saldoPendiente) {
      toast.error(`El monto no puede superar el saldo pendiente (${symbol} ${saldoPendiente})`);
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.post('/api/pagos', {
        cuentaId,
        montoIngresado: montoFinal,
        tipoMoneda: effectiveMoneda
      });
      toast.success('Pago registrado correctamente');
      setMontoAbono('');
      if (onRefresh) onRefresh();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.friendlyMessage || err.response?.data?.message || 'Error al registrar el pago');
    } finally {
      setSaving(false);
    }
  };

  if (!cuentaId) {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-center">
        <p className="text-[12px] font-medium text-destructive">
          Este participante no tiene una cuenta de pago asociada aún.
        </p>
      </div>
    );
  }

  if (isCompletado) {
    return (
      <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-5 flex flex-col items-center justify-center text-center">
        <PiCheckCircleFill className="w-8 h-8 text-emerald-500 mb-2" />
        <h4 className="text-[14px] font-bold text-emerald-700 dark:text-emerald-400">Pago Completado</h4>
        <p className="text-[11px] text-emerald-600/80 mt-1">El participante no registra saldos pendientes.</p>
      </div>
    );
  }

  const porcentajePago = Math.min(100, (totalAbonado / (effectiveTarifa || 1)) * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Resumen de Pago */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Progreso de Pago</span>
          <span className="text-[13px] font-mono font-bold text-foreground">
            {symbol} {totalAbonado.toFixed(2)} <span className="text-muted-foreground/60 font-normal">/ {symbol} {effectiveTarifa.toFixed(2)}</span>
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500 ease-in-out" 
            style={{ 
              width: `${porcentajePago}%`,
              backgroundColor: porcentajePago >= 100 && effectiveTarifa > 0 ? '#10B981' : 'var(--primary)'
            }} 
          />
        </div>
      </div>
      {/* Radio Cards: Completo vs Parcial */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => { setPaymentType('completo'); setMontoAbono(''); }}
          className={`flex flex-col items-start p-3 rounded-md border text-left transition-all duration-150 ${
            paymentType === 'completo'
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-border bg-card hover:bg-muted'
          }`}
        >
          <span className={`text-[12px] font-bold ${paymentType === 'completo' ? 'text-primary' : 'text-foreground'}`}>
            Pago Completo
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Liquida el saldo restante
          </span>
        </button>
        <button
          onClick={() => setPaymentType('parcial')}
          className={`flex flex-col items-start p-3 rounded-md border text-left transition-all duration-150 ${
            paymentType === 'parcial'
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-border bg-card hover:bg-muted'
          }`}
        >
          <span className={`text-[12px] font-bold ${paymentType === 'parcial' ? 'text-primary' : 'text-foreground'}`}>
            Pago Parcial
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Abono a cuenta
          </span>
        </button>
      </div>

      {/* Selector de Moneda (Solo si NO está bloqueada) */}
      {!isTarifaLocked && (
        <div className="flex flex-col gap-2 p-3 bg-muted/30 border border-border rounded-md">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Moneda de Pago (Primer Abono)</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="moneda" 
                value="USD" 
                checked={effectiveMoneda === 'USD'} 
                onChange={() => setSelectedMoneda('USD')}
                className="text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span className="text-[12px] font-medium text-foreground">Dólares (USD)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="moneda" 
                value="PEN" 
                checked={effectiveMoneda === 'PEN'} 
                onChange={() => setSelectedMoneda('PEN')}
                className="text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span className="text-[12px] font-medium text-foreground">Soles (PEN)</span>
            </label>
          </div>
        </div>
      )}

      {/* Dynamic Content based on selection */}
      <div className="rounded-md bg-muted/40 border border-border p-4">
        {paymentType === 'completo' ? (
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              A Pagar (Saldo)
            </span>
            <div className="text-2xl font-bold font-mono text-foreground">
              {symbol} {saldoPendiente.toFixed(2)}
            </div>
            {!isTarifaLocked && !activeTariff && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                No hay tarifa activa en {effectiveMoneda} para la fecha de hoy.
              </p>
            )}
            <p className="text-[11px] text-muted-foreground leading-tight mt-1">
              La cuenta quedará sin deuda.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Monto del Abono
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground font-mono">
                  {symbol}
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={montoAbono}
                  onChange={e => setMontoAbono(e.target.value)}
                  disabled={saving}
                  className="w-full h-10 pl-8 pr-3 text-sm font-mono font-bold rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            {isTarifaLocked && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground">Moneda Bloqueada:</span>
                <span className="text-[10px] font-bold font-mono text-foreground px-2 py-0.5 rounded bg-muted">
                  {cuentaMoneda}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Action */}
      <button
        onClick={handlePay}
        disabled={saving || (paymentType === 'parcial' && !montoAbono) || (paymentType === 'completo' && !isTarifaLocked && !activeTariff)}
        className="w-full h-10 rounded-md bg-primary text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
      >
        <PiWalletLight className="w-4 h-4" />
        {saving ? 'Procesando...' : paymentType === 'completo' ? 'Liquidar Deuda' : 'Registrar Abono'}
      </button>
    </div>
  );
}
