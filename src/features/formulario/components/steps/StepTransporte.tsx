import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { AnimatePresence, motion } from 'framer-motion';
import type { StepProps } from '../../types/participante.types';
import { TipoTransporte } from '../../types/participante.types';
import { MED_TRANSPORTE_OPCIONES } from '@/lib/constants';
import { uploadToCloudinary } from '../../services/participante.service';

interface StepTransporteProps extends StepProps {
  onSkip: () => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-destructive">{message}</p>;
}

export default function StepTransporte({
  formData,
  updateField,
  validationErrors = {},
  onSkip,
}: StepTransporteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const tipo = formData.tipoTransporte;

  const showEmpresa = tipo === TipoTransporte.AEREO || tipo === TipoTransporte.TERRESTRE;
  const showNroVuelo = tipo === TipoTransporte.AEREO;
  const showLugarLlegada = tipo === TipoTransporte.TERRESTRE;
  const showFechas =
    tipo === TipoTransporte.AEREO ||
    tipo === TipoTransporte.TERRESTRE ||
    tipo === TipoTransporte.INDEPENDIENTE;
  const showArchivo = tipo === TipoTransporte.AEREO || tipo === TipoTransporte.TERRESTRE;

  const err = (field: string) => validationErrors[field];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadToCloudinary(file);
      updateField('boletoUrl', url);
      updateField('boletoNombre', file.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir el archivo.';
      setUploadError(msg);
      updateField('boletoUrl', null);
      updateField('boletoNombre', '');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Transporte y Logística
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Datos de tu viaje. Este paso es opcional.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          className="shrink-0 border-primary/30 text-primary hover:bg-primary/5"
        >
          Saltar este paso
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Medio de Transporte */}
        <div className="space-y-2">
          <Label htmlFor="tipoTransporte">
            Medio de Transporte <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.tipoTransporte}
            onValueChange={(val) => {
              updateField('tipoTransporte', val as TipoTransporte);
              updateField('empresaTransporte', '');
              updateField('nroVuelo', '');
              updateField('fechaLlegada', '');
              updateField('fechaIda', '');
              updateField('lugarLlegada', '');
              updateField('boletoUrl', null);
            }}
          >
            <SelectTrigger
              id="tipoTransporte"
              className={`w-full ${err('tipoTransporte') ? 'border-destructive' : ''}`}
            >
              <SelectValue placeholder="Seleccionar medio de transporte" />
            </SelectTrigger>
            <SelectContent>
              {MED_TRANSPORTE_OPCIONES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={err('tipoTransporte')} />
        </div>

        {/* Campos dinámicos según el tipo */}
        <AnimatePresence>
          {tipo && (
            <motion.div
              key={`transport-fields-${tipo}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Empresa de Transporte */}
                {showEmpresa && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="empresaTransporte">
                      Empresa de Transporte <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="empresaTransporte"
                      value={formData.empresaTransporte}
                      onChange={(e) => updateField('empresaTransporte', e.target.value)}
                      placeholder={
                        tipo === TipoTransporte.AEREO
                          ? 'Ej: LATAM, Avianca...'
                          : 'Ej: Cruz del Sur, Oltursa...'
                      }
                      className={err('empresaTransporte') ? 'border-destructive' : ''}
                    />
                    <FieldError message={err('empresaTransporte')} />
                  </div>
                )}

                {/* Nro de Vuelo — solo AEREO */}
                {showNroVuelo && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="nroVuelo">
                      Nro. de Vuelo <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nroVuelo"
                      value={formData.nroVuelo}
                      onChange={(e) => updateField('nroVuelo', e.target.value)}
                      placeholder="Ej: LA2045"
                      className={err('nroVuelo') ? 'border-destructive' : ''}
                    />
                    <FieldError message={err('nroVuelo')} />
                  </div>
                )}

                {/* Range Calendar de Fechas */}
                {showFechas && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label>
                      Fechas de Llegada y Salida <span className="text-destructive">*</span>
                    </Label>
                    <DateRangePicker
                      fromValue={formData.fechaLlegada}
                      toValue={formData.fechaIda}
                      onFromChange={(val) => updateField('fechaLlegada', val)}
                      onToChange={(val) => updateField('fechaIda', val)}
                      fromError={err('fechaLlegada')}
                      toError={err('fechaIda')}
                    />
                  </div>
                )}

                {/* Lugar de Llegada — solo TERRESTRE */}
                {showLugarLlegada && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="lugarLlegada">
                      Lugar de Llegada <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lugarLlegada"
                      value={formData.lugarLlegada}
                      onChange={(e) => updateField('lugarLlegada', e.target.value)}
                      placeholder="Ej: Terminal Terrestre Plaza Norte"
                      className={err('lugarLlegada') ? 'border-destructive' : ''}
                    />
                    <FieldError message={err('lugarLlegada')} />
                  </div>
                )}

                {/* Archivo boleto */}
                {showArchivo && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="boletoUrl">
                      Boleto / Comprobante (PDF o Imagen)
                    </Label>
                    <div
                      onClick={() => !uploading && fileInputRef.current?.click()}
                      className={`flex cursor-pointer items-center gap-3 rounded-[4px] border px-4 py-3 text-base transition-colors ${
                        uploading
                          ? 'cursor-not-allowed border-border bg-muted opacity-70'
                          : formData.boletoUrl
                          ? 'border-green-500/50 bg-green-500/5'
                          : 'border-input bg-background hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      {uploading ? (
                        <>
                          <svg className="h-5 w-5 shrink-0 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          <span className="text-muted-foreground">Subiendo archivo...</span>
                        </>
                      ) : formData.boletoUrl ? (
                        <>
                          <svg className="h-5 w-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="truncate text-green-700 text-sm font-medium">{formData.boletoNombre || formData.boletoUrl}</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-muted-foreground">Haz click para seleccionar archivo</span>
                        </>
                      )}
                    </div>
                    {uploadError && (
                      <p className="mt-1 text-sm text-destructive">{uploadError}</p>
                    )}
                    {formData.boletoUrl && (
                      <button
                        type="button"
                        onClick={() => { updateField('boletoUrl', null); setUploadError(null); }}
                        className="text-xs text-muted-foreground underline hover:text-destructive"
                      >
                        Eliminar archivo
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="boletoUrl"
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
