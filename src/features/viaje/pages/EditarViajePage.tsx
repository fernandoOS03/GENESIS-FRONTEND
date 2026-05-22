import { useRef } from 'react';
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
import { useEditarViaje } from '../hooks/useEditarViaje';
import { TipoTransporte } from '../../formulario/types/participante.types';
import { MED_TRANSPORTE_OPCIONES } from '@/lib/constants';
import {
  PiAirplaneTakeoffLight,
  PiCalendarDotsLight,
  PiFileTextLight,
  PiLockSimpleLight,
} from 'react-icons/pi';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

function SuccessScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 text-center py-10 transition-all duration-300">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">¡Datos de viaje registrados!</h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Tus datos de transporte fueron guardados. ¡Nos vemos en el campamento!
        </p>
      </div>
    </div>
  );
}

const sidebarItems = [
  { Icon: PiAirplaneTakeoffLight, text: 'Aéreo, Terrestre o Independiente' },
  { Icon: PiCalendarDotsLight, text: 'Fechas de llegada y partida' },
  { Icon: PiFileTextLight, text: 'Adjunta tu boleto (opcional)' },
];

export default function EditarViajePage() {
  const {
    token, formData, validationErrors, isSubmitting, isSuccess,
    error, uploading, uploadError, isTokenInvalid, updateField, handleFileUpload, removeFile, submit,
  } = useEditarViaje();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tipo = formData.tipoTransporte;
  const err = (field: string) => validationErrors[field];

  const showEmpresa = tipo === TipoTransporte.AEREO || tipo === TipoTransporte.TERRESTRE;
  const showNroVuelo = tipo === TipoTransporte.AEREO;
  const showLugarLlegada = tipo === TipoTransporte.TERRESTRE;
  const showFechas = tipo === TipoTransporte.AEREO || tipo === TipoTransporte.TERRESTRE || tipo === TipoTransporte.INDEPENDIENTE;
  const showArchivo = tipo === TipoTransporte.AEREO || tipo === TipoTransporte.TERRESTRE;  // Modal CSS puro con Tailwind (bloqueante)
  const isModalOpen = isTokenInvalid || !token;

  return (
    <div className="min-h-screen flex bg-background relative">
      {/* Modal Overlay Personalizado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="px-6 pt-8 pb-2 flex flex-col items-center gap-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-2">
                <svg className="h-7 w-7 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">Enlace inválido o expirado</h2>
            </div>
            <div className="px-6 pb-6 text-center">
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Parece que este enlace de edición ha expirado o es inválido. 
                Por favor, solicita un nuevo enlace para actualizar tu información de viaje.
              </p>
              <div className="flex justify-center w-full">
                <Button 
                  type="button"
                  variant="default"
                  className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-medium rounded-xl h-11 px-8 shadow-md shadow-[#25D366]/20 transition-all flex items-center gap-2"
                  onClick={() => window.open('https://wa.me/numerodesoporteaquiporponer?text=Hola,%20mi%20enlace%20de%20edici%C3%B3n%20expir%C3%B3.%20%C2%BFMe%20pueden%20generar%20uno%20nuevo?', '_blank')}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  Solicitar nuevo enlace
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Panel izquierdo — solo desktop ── */}
      <aside className="hidden lg:flex lg:w-[42.857%] shrink-0 flex-col sticky top-0 h-screen overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80 relative">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Crect x='0' y='0' width='1' height='40'/%3E%3Crect x='0' y='0' width='40' height='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative flex flex-col justify-between h-full p-8 xl:p-10 text-primary-foreground">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold tracking-tight">Génesis</span>
          </div>

          <div className="space-y-6">
            <div className="text-[88px] font-black leading-none text-white/8 select-none">✈</div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-white/20" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/50">Datos de viaje</span>
                <div className="h-px flex-1 bg-white/20" />
              </div>
              <div>
                <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
                  Registra tu<br /><span className="text-white/60">transporte</span>
                </h1>
                <p className="mt-2 text-white/60 text-sm leading-relaxed">
                  Coordinaremos tu llegada al campamento de forma segura.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {sidebarItems.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-white/75">
                  <Icon className="shrink-0 text-white/80" size={18} />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-white/35">
              <PiLockSimpleLight size={14} />
              Conexión segura · Datos protegidos
            </div>
          </div>

          <p className="text-xs text-white/25">© {new Date().getFullYear()} Génesis</p>
        </div>
      </aside>

      {/* ── Panel derecho (formulario) ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Header mobile */}
        <header className="lg:hidden border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
          <div className="px-5 py-3.5 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <svg className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <span className="font-bold text-foreground text-sm">Génesis</span>
          </div>
        </header>

        <div className="px-5 py-8 sm:px-8 lg:px-10 xl:px-12 max-w-2xl mx-auto lg:max-w-2xl">
          <>
            {isSuccess ? (
              <SuccessScreen key="success" />
            ) : (
              <div
                key="form"
                className="space-y-6 max-w-2xl transition-all duration-300"
              >
                {/* Título */}
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Datos de viaje</p>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">¿Cómo llegarás?</h2>
                  <p className="text-sm text-muted-foreground">Completa la información de tu transporte.</p>
                </div>

                {error && (
                  <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Medio de Transporte */}
                  <div className="space-y-1">
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
                        updateField('boletoNombre', '');
                      }}
                    >
                      <SelectTrigger id="tipoTransporte" className={`w-full ${err('tipoTransporte') ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {MED_TRANSPORTE_OPCIONES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={err('tipoTransporte')} />
                  </div>

                  {/* Campos dinámicos */}
                  <>
                    {tipo && (
                      <div
                        key={`fields-${tipo}`}
                        className="overflow-hidden transition-all duration-300"
                      >
                        <div className="space-y-4">
                          {showEmpresa && (
                            <div className="space-y-1">
                              <Label htmlFor="empresaTransporte">
                                Empresa de Transporte <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="empresaTransporte"
                                value={formData.empresaTransporte}
                                onChange={(e) => updateField('empresaTransporte', e.target.value)}
                                placeholder={tipo === TipoTransporte.AEREO ? 'Ej: LATAM, Avianca...' : 'Ej: Cruz del Sur...'}
                                className={err('empresaTransporte') ? 'border-destructive' : ''}
                              />
                              <FieldError message={err('empresaTransporte')} />
                            </div>
                          )}

                          {showNroVuelo && (
                            <div className="space-y-1">
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

                          {showFechas && (
                            <div className="space-y-1">
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

                          {showLugarLlegada && (
                            <div className="space-y-1">
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

                          {showArchivo && (
                            <div className="space-y-1">
                              <Label>Boleto / Comprobante <span className="text-muted-foreground font-normal">(opcional)</span></Label>
                              <div
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                                  uploading ? 'cursor-not-allowed border-border bg-muted opacity-70'
                                  : formData.boletoUrl ? 'border-green-500/50 bg-green-500/5'
                                  : 'border-input/50 bg-muted/30 hover:bg-muted/50'
                                }`}
                              >
                                {uploading ? (
                                  <><svg className="h-4 w-4 shrink-0 animate-spin text-primary" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg><span className="text-muted-foreground">Subiendo...</span></>
                                ) : formData.boletoUrl ? (
                                  <><svg className="h-4 w-4 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="truncate text-green-700 font-medium text-xs">{formData.boletoNombre || formData.boletoUrl}</span></>
                                ) : (
                                  <><svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg><span className="text-muted-foreground">Toca para seleccionar archivo</span></>
                                )}
                              </div>
                              {uploadError && <p className="mt-1 text-xs text-destructive">{uploadError}</p>}
                              {formData.boletoUrl && (
                                <button type="button" onClick={removeFile} className="text-xs text-muted-foreground underline hover:text-destructive">
                                  Eliminar archivo
                                </button>
                              )}
                              <input ref={fileInputRef} type="file" accept=".pdf,image/*"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); e.target.value = ''; }}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                </div>

                {/* Botón */}
                <Button
                  onClick={submit}
                  disabled={isSubmitting || uploading}
                  className="w-full h-11 text-sm rounded-xl shadow-md shadow-primary/20"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      Guardando...
                    </span>
                  ) : 'Guardar datos de viaje →'}
                </Button>
              </div>
            )}
          </>
        </div>
      </main>
    </div>
  );
}
