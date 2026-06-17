import { useState, useEffect } from 'react';
import { X, User, Navigation, Calendar, Hash, MapPin, Bus, AlertCircle, Plane } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useWizardForm } from '../../formulario/hooks/useWizardForm';
import PhoneInput from 'react-phone-number-input';
import type { CountryCode } from 'libphonenumber-js';
import { findCountry } from '@/lib/countryOptions';
import 'react-phone-number-input/style.css';
import { 
  GENEROS, 
  TALLAS_POLO, 
  SEDES_OPCIONES, 
  SEDES_LIMA_OPCIONES,
  MED_TRANSPORTE_OPCIONES, 
  CONDICION_PARTICIPACION_OPCIONES, 
  ROLES_OPCIONES, 
  TIPOS_DOCUMENTO 
} from '@/lib/constants';
import { COUNTRY_OPTIONS } from '@/lib/countryOptions';
import { TipoDocumento, CondParticipacion, TipoTransporte } from '../../formulario/types/participante.types';

interface AddParticipantModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddParticipantModal({ open, onClose }: AddParticipantModalProps) {
  const [tab, setTab] = useState<'personal' | 'viaje'>('personal');
  const { 
    formData, 
    updateField, 
    isSubmitting, 
    isSuccess, 
    submit, 
    reset,
    validationErrors,
    validateAll,
    error: submitError,
    showTransport
  } = useWizardForm(true); 

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isCountryAdmin = user?.rol === 'ROLE_COUNTRY_ADMIN';
  const userCountry = user?.pais;

  useEffect(() => {
    if (open) {
      reset();
      if (isCountryAdmin && userCountry) {
        updateField('pais', userCountry);
        const countryData = findCountry(userCountry);
        if (countryData) updateField('telefono', countryData.phoneCode);
      }
      setTab('personal');
    }
  }, [open, reset, isCountryAdmin, userCountry, updateField]);

  useEffect(() => {
    if (!showTransport && tab === 'viaje') {
      setTab('personal');
    }
  }, [showTransport, tab]);

  useEffect(() => {
    if (isSuccess && open) onClose();
  }, [isSuccess, open, onClose]);

  if (!open) return null;

  const handleSave = async () => {
    if (!validateAll()) {
      if (validationErrors.nombres || validationErrors.email || validationErrors.pais || validationErrors.tipoDocumento) {
        setTab('personal');
      } else if (validationErrors.tipoTransporte || validationErrors.nroVuelo) {
        setTab('viaje');
      }
      return; 
    }
    await submit();
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <SheetContent side="left" className="w-full sm:max-w-xl p-0 overflow-hidden bg-card border-r border-border flex flex-col">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-[15px] font-semibold text-foreground">
            Agregar Participante
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground mt-0.5">
            Completa los datos del nuevo participante
          </SheetDescription>
        </SheetHeader>

        <Tabs value={tab} onValueChange={(val) => setTab(val as 'personal' | 'viaje')} className="flex flex-col">
          <div className="px-6 pt-4 pb-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal" className="text-xs">
                <User className="w-3.5 h-3.5 mr-2" />
                Datos Personales
              </TabsTrigger>
              <TabsTrigger value="viaje" disabled={!showTransport} className="text-xs">
                <Plane className="w-3.5 h-3.5 mr-2" />
                Itinerario
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto thin-scrollbar px-6 py-4 space-y-5 max-h-[60vh]">
            {submitError && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-lg text-xs bg-destructive/10 border border-destructive/20 text-destructive">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{submitError}</p>
              </div>
            )}

            <TabsContent value="personal" className="mt-0 space-y-4 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tipo de documento" error={validationErrors.tipoDocumento}>
                  <Select value={formData.tipoDocumento} onValueChange={val => updateField('tipoDocumento', val as TipoDocumento)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_DOCUMENTO.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Nro. documento" error={validationErrors.nroDocumento}>
                  <Input
                    placeholder="12345678"
                    value={formData.nroDocumento}
                    onChange={e => updateField('nroDocumento', e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombres" error={validationErrors.nombres}>
                  <Input
                    placeholder="Juan"
                    value={formData.nombres}
                    onChange={e => updateField('nombres', e.target.value)}
                  />
                </Field>
                <Field label="Apellidos" error={validationErrors.apellidos}>
                  <Input
                    placeholder="Pérez"
                    value={formData.apellidos}
                    onChange={e => updateField('apellidos', e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Email" error={validationErrors.email}>
                <Input
                  type="email"
                  placeholder="juan@email.com"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="País" error={validationErrors.pais}>
                  <Select 
                    value={formData.pais} 
                    disabled={isCountryAdmin}
                    onValueChange={val => {
                      updateField('pais', val);
                      updateField('sede', '');
                      const country = findCountry(val);
                      if (country) updateField('telefono', country.phoneCode);
                    }}
                  >
                    <SelectTrigger className={isCountryAdmin ? "opacity-80" : ""}>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_OPTIONS.filter(c => !isCountryAdmin || c.value === userCountry).map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Teléfono" error={validationErrors.telefono}>
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry={(formData.pais || undefined) as CountryCode | undefined}
                    value={formData.telefono}
                    onChange={(val) => updateField('telefono', val || '')}
                    onCountryChange={(newCountry) => {
                      if (newCountry && newCountry !== formData.pais) {
                        updateField('pais', newCountry);
                        updateField('sede', '');
                      }
                    }}
                    className="phone-input-custom"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {formData.pais === 'PE' ? (
                  <Field label="Sede" error={validationErrors.sede}>
                    <Select value={formData.sede} onValueChange={val => updateField('sede', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Lima</SelectLabel>
                          {SEDES_LIMA_OPCIONES.map(s => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Provincias</SelectLabel>
                          {SEDES_OPCIONES.map(s => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                ) : (
                  <div />
                )}
                <Field label="Género" error={validationErrors.genero}>
                  <Select value={formData.genero} onValueChange={val => updateField('genero', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {GENEROS.map(g => (
                        <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Fecha de nacimiento" error={validationErrors.fechaNacimiento}>
                  <DatePicker
                    value={formData.fechaNacimiento}
                    onChange={(val) => updateField('fechaNacimiento', val)}
                    placeholder="dd/mm/aaaa"
                    disableFuture
                    error={validationErrors.fechaNacimiento}
                  />
                </Field>
                <Field label="Talla polo" error={validationErrors.tallaPolo}>
                  <Select value={formData.tallaPolo} onValueChange={val => updateField('tallaPolo', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TALLAS_POLO.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 mt-2 border-t border-border">
                <Field label="Condición" error={validationErrors.condParticipacion}>
                  <Select value={formData.condParticipacion} onValueChange={val => updateField('condParticipacion', val as CondParticipacion)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDICION_PARTICIPACION_OPCIONES.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Rol (si es Miembro)" error={validationErrors.rol}>
                  {formData.condParticipacion === 'MIEMBRO' ? (
                    <Select value={formData.rol} onValueChange={val => updateField('rol', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES_OPCIONES.map(r => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex h-10 w-full rounded-md border border-dashed border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed items-center select-none">
                      No aplica
                    </div>
                  )}
                </Field>
              </div>
            </TabsContent>

            <TabsContent value="viaje" className="mt-0 space-y-4 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
              <Field label="Tipo de transporte" error={validationErrors.tipoTransporte}>
                <Select value={formData.tipoTransporte || "none"} onValueChange={val => updateField('tipoTransporte', val === "none" ? "" : val as TipoTransporte)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin transporte</SelectItem>
                    {MED_TRANSPORTE_OPCIONES.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              
              {formData.tipoTransporte && formData.tipoTransporte !== TipoTransporte.INDEPENDIENTE && (
                <div className="space-y-4 pt-2">
                  {(formData.tipoTransporte === TipoTransporte.AEREO || formData.tipoTransporte === TipoTransporte.TERRESTRE) && (
                    <div className={`grid ${formData.tipoTransporte === TipoTransporte.AEREO ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
                      <Field label="Aerolínea / Empresa" error={validationErrors.empresaTransporte}>
                        <Input
                          placeholder="Ej. LATAM Airlines"
                          value={formData.empresaTransporte}
                          onChange={e => updateField('empresaTransporte', e.target.value)}
                        />
                      </Field>
                      {formData.tipoTransporte === TipoTransporte.AEREO && (
                        <Field label="Nro. vuelo / Placa" error={validationErrors.nroVuelo}>
                          <Input
                            placeholder="LA1234"
                            value={formData.nroVuelo}
                            onChange={e => updateField('nroVuelo', e.target.value)}
                          />
                        </Field>
                      )}
                    </div>
                  )}

                  {formData.tipoTransporte === TipoTransporte.TERRESTRE && (
                    <Field label="Lugar de llegada" error={validationErrors.lugarLlegada}>
                      <Input
                        placeholder="Ej. Terminal Terrestre"
                        value={formData.lugarLlegada}
                        onChange={e => updateField('lugarLlegada', e.target.value)}
                      />
                    </Field>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    <Field label="Fechas de Llegada y Salida">
                      <DateRangePicker
                        fromValue={formData.fechaLlegada}
                        toValue={formData.fechaIda}
                        onFromChange={(val) => updateField('fechaLlegada', val)}
                        onToChange={(val) => updateField('fechaIda', val)}
                        fromError={validationErrors.fechaLlegada}
                        toError={validationErrors.fechaIda}
                      />
                    </Field>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs font-medium"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="text-xs font-semibold gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Guardando…
              </>
            ) : (
              'Guardar participante'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && (
        <span className="text-[11px] font-medium leading-tight text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}
