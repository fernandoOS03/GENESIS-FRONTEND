import { useState, useEffect } from 'react';
import { X, User, Plane, AlertCircle } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { useWizardForm } from '../../formulario/hooks/useWizardForm';
import PhoneInput from 'react-phone-number-input';
import type { CountryCode } from 'libphonenumber-js';
import { findCountry } from '@/lib/countryOptions';
import 'react-phone-number-input/style.css';
import { 
  GENEROS, 
  TALLAS_POLO, 
  SEDES_OPCIONES, 
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
    error: submitError
  } = useWizardForm();

  // Reset state when opening/closing
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  // Close when success
  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  if (!open) return null;

  const handleSave = async () => {
    if (!validateAll()) {
      // Si hay errores, forzamos la vista al tab que tenga el error para que el usuario lo vea
      // (Por heurística simple, si no hay 'tipoTransporte' valid fallará en transporte, pero personal primero)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">Agregar Participante</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Completa los datos usando el formulario unificado</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent transition" disabled={isSubmitting}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          <button
            onClick={() => setTab('personal')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition ${
              tab === 'personal'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-4 h-4" /> Datos Personales & Participación
          </button>
          <button
            onClick={() => setTab('viaje')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition ${
              tab === 'viaje'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Plane className="w-4 h-4" /> Itinerario de viaje
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {submitError && (
             <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{submitError}</p>
             </div>
          )}

          {tab === 'personal' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tipo de documento" error={validationErrors.tipoDocumento}>
                  <select 
                    className="input-field bg-background" 
                    value={formData.tipoDocumento} 
                    onChange={e => updateField('tipoDocumento', e.target.value as TipoDocumento)}
                  >
                    <option value="">Seleccionar…</option>
                    {TIPOS_DOCUMENTO.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Nro. documento" error={validationErrors.nroDocumento}>
                  <input type="text" placeholder="12345678" className="input-field bg-background" 
                    value={formData.nroDocumento} onChange={e => updateField('nroDocumento', e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombres" error={validationErrors.nombres}>
                  <input type="text" placeholder="Juan" className="input-field bg-background" 
                    value={formData.nombres} onChange={e => updateField('nombres', e.target.value)} />
                </Field>
                <Field label="Apellidos" error={validationErrors.apellidos}>
                  <input type="text" placeholder="Pérez" className="input-field bg-background" 
                     value={formData.apellidos} onChange={e => updateField('apellidos', e.target.value)} />
                </Field>
              </div>
              <Field label="Email" error={validationErrors.email}>
                <input type="email" placeholder="juan@email.com" className="input-field bg-background" 
                   value={formData.email} onChange={e => updateField('email', e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="País" error={validationErrors.pais}>
                   <select 
                     className="input-field bg-background" 
                     value={formData.pais} 
                     onChange={e => {
                       const val = e.target.value;
                       updateField('pais', val);
                       updateField('sede', '');
                       const country = findCountry(val);
                       if (country) updateField('telefono', country.phoneCode);
                     }}
                   >
                    <option value="">Seleccionar…</option>
                    {COUNTRY_OPTIONS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
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
                    className="phone-input-custom !bg-background !border-border"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {formData.pais === 'PE' ? (
                  <Field label="Sede" error={validationErrors.sede}>
                    <select className="input-field bg-background" value={formData.sede} onChange={e => updateField('sede', e.target.value)}>
                      <option value="">Seleccionar…</option>
                      {SEDES_OPCIONES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </Field>
                ) : (
                  <div /> // Espaciador para mantener el grid
                )}
                <Field label="Género" error={validationErrors.genero}>
                  <select className="input-field bg-background" value={formData.genero} onChange={e => updateField('genero', e.target.value)}>
                    <option value="">Seleccionar…</option>
                    {GENEROS.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
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
                  <select className="input-field bg-background" value={formData.tallaPolo} onChange={e => updateField('tallaPolo', e.target.value)}>
                    <option value="">Seleccionar…</option>
                    {TALLAS_POLO.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 mt-2">
                <Field label="Condición" error={validationErrors.condParticipacion}>
                  <select className="input-field bg-background" value={formData.condParticipacion} onChange={e => updateField('condParticipacion', e.target.value as CondParticipacion)}>
                    <option value="">Seleccionar…</option>
                     {CONDICION_PARTICIPACION_OPCIONES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                     ))}
                  </select>
                </Field>
                <Field label="Rol (si es Miembro)" error={validationErrors.rol}>
                  {formData.condParticipacion === 'MIEMBRO' ? (
                    <select className="input-field bg-background" value={formData.rol} onChange={e => updateField('rol', e.target.value)}>
                      <option value="">Seleccionar…</option>
                       {ROLES_OPCIONES.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                       ))}
                    </select>
                  ) : (
                    <div className="input-field bg-muted/50 border-dashed text-muted-foreground flex items-center justify-center opacity-50 cursor-not-allowed">
                      No aplica
                    </div>
                  )}
                </Field>
              </div>
            </>
          ) : (
            <>
              <Field label="Tipo de transporte" error={validationErrors.tipoTransporte}>
                <select className="input-field bg-background" value={formData.tipoTransporte} onChange={e => updateField('tipoTransporte', e.target.value as TipoTransporte)}>
                   <option value="">Sin transporte</option>
                   {MED_TRANSPORTE_OPCIONES.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
              </Field>
              
              {formData.tipoTransporte && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Aerolínea / Empresa" error={validationErrors.empresaTransporte}>
                      <input type="text" placeholder="Ej. LATAM Airlines" className="input-field bg-background" 
                        value={formData.empresaTransporte} onChange={e => updateField('empresaTransporte', e.target.value)} />
                    </Field>
                    <Field label="Nro. vuelo / Placa" error={validationErrors.nroVuelo}>
                      <input type="text" placeholder="LA1234" className="input-field bg-background" 
                        value={formData.nroVuelo} onChange={e => updateField('nroVuelo', e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Lugar de llegada" error={validationErrors.lugarLlegada}>
                    <input type="text" placeholder="Av. Principal 123" className="input-field bg-background" 
                      value={formData.lugarLlegada} onChange={e => updateField('lugarLlegada', e.target.value)} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Fecha y Hora de llegada" error={validationErrors.fechaLlegada}>
                      <input type="datetime-local" className="input-field bg-background" 
                        value={formData.fechaLlegada} onChange={e => updateField('fechaLlegada', e.target.value)} />
                    </Field>
                    <Field label="Fecha y Hora de retorno" error={validationErrors.fechaIda}>
                      <input type="datetime-local" className="input-field bg-background" 
                        value={formData.fechaIda} onChange={e => updateField('fechaIda', e.target.value)} />
                    </Field>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
          <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm rounded-xl border border-border hover:bg-accent transition disabled:opacity-50">
            Cancelar
          </button>
          <button 
             onClick={handleSave} 
             disabled={isSubmitting}
             className="flex items-center gap-2 px-5 py-2 text-sm rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition shadow-sm disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                 <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                 Guardando...
              </>
            ) : "Guardar participante"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {error && <span className="text-[10px] text-red-500 font-medium px-1 leading-tight">{error}</span>}
    </div>
  );
}
