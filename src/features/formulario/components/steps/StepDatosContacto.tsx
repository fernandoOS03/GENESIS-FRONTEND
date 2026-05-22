import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import type { StepProps, TipoDocumento } from '../../types/participante.types';
import { COUNTRY_OPTIONS, findCountry } from '@/lib/countryOptions';
import {
  GENEROS,
  TALLAS_POLO,
  SEDES_LIMA_OPCIONES,
  SEDES_OPCIONES,
  TIPOS_DOCUMENTO,
} from '@/lib/constants';
import type { CountryCode } from 'libphonenumber-js';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

export default function StepDatosContacto({
  formData,
  updateField,
  validationErrors = {},
}: StepProps) {
  const phoneCountry = (formData.pais || undefined) as CountryCode | undefined;
  const isPeru = formData.pais === 'PE';
  const err = (field: string) => validationErrors[field];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

      {/* Tipo de Documento */}
      <div className="space-y-1">
        <Label htmlFor="tipoDocumento">
          Tipo de Documento <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.tipoDocumento}
          onValueChange={(val) => updateField('tipoDocumento', val as TipoDocumento)}
        >
          <SelectTrigger id="tipoDocumento" className={`w-full ${err('tipoDocumento') ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {TIPOS_DOCUMENTO.map((doc) => (
              <SelectItem key={doc.value} value={doc.value}>{doc.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={err('tipoDocumento')} />
      </div>

      {/* Nro Documento */}
      <div className="space-y-1">
        <Label htmlFor="nroDocumento">
          Nro. Documento <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nroDocumento"
          value={formData.nroDocumento}
          onChange={(e) => updateField('nroDocumento', e.target.value)}
          placeholder="Ej: 12345678"
          className={err('nroDocumento') ? 'border-destructive' : ''}
        />
        <FieldError message={err('nroDocumento')} />
      </div>

      {/* Nombres */}
      <div className="space-y-1">
        <Label htmlFor="nombres">
          Nombres <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nombres"
          value={formData.nombres}
          onChange={(e) => updateField('nombres', e.target.value)}
          placeholder="Tus nombres"
          className={err('nombres') ? 'border-destructive' : ''}
        />
        <FieldError message={err('nombres')} />
      </div>

      {/* Apellidos */}
      <div className="space-y-1">
        <Label htmlFor="apellidos">
          Apellidos <span className="text-destructive">*</span>
        </Label>
        <Input
          id="apellidos"
          value={formData.apellidos}
          onChange={(e) => updateField('apellidos', e.target.value)}
          placeholder="Tus apellidos"
          className={err('apellidos') ? 'border-destructive' : ''}
        />
        <FieldError message={err('apellidos')} />
      </div>

      {/* Email — fila completa */}
      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="email">
          Correo Electrónico <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="correo@ejemplo.com"
          className={err('email') ? 'border-destructive' : ''}
        />
        <FieldError message={err('email')} />
      </div>

      {/* País — solo, espacio libre al costado */}
      <div className="space-y-1">
        <Label htmlFor="pais">
          País <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.pais}
          onValueChange={(val) => {
            updateField('pais', val);
            updateField('sede', '');
            const country = findCountry(val);
            if (country) updateField('telefono', country.phoneCode);
          }}
        >
          <SelectTrigger id="pais" className={`w-full ${err('pais') ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Seleccionar país" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_OPTIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={err('pais')} />
      </div>

      {/* Sede — aparece al lado de País cuando es Perú, vacío si no */}
      {isPeru ? (
        <div className="space-y-1">
          <Label htmlFor="sede">
            Sede <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.sede} onValueChange={(val) => updateField('sede', val)}>
            <SelectTrigger id="sede" className={`w-full ${err('sede') ? 'border-destructive' : ''}`}>
              <SelectValue placeholder="Seleccionar sede" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__lima_header__" disabled className="font-semibold text-muted-foreground text-xs uppercase tracking-wide pt-1">
                — Lima
              </SelectItem>
              {SEDES_LIMA_OPCIONES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
              <SelectItem value="__provincias_header__" disabled className="font-semibold text-muted-foreground text-xs uppercase tracking-wide pt-2">
                — Provincias
              </SelectItem>
              {SEDES_OPCIONES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={err('sede')} />
        </div>
      ) : (
        <div aria-hidden="true" />
      )}

      {/* Teléfono + Género — mismo row */}
      <div className="space-y-1">
        <Label htmlFor="telefono">
          Teléfono <span className="text-destructive">*</span>
        </Label>
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry={phoneCountry}
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
        <FieldError message={err('telefono')} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="genero">
          Género <span className="text-destructive">*</span>
        </Label>
        <Select value={formData.genero} onValueChange={(val) => updateField('genero', val)}>
          <SelectTrigger id="genero" className={`w-full ${err('genero') ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {GENEROS.map((g) => (
              <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={err('genero')} />
      </div>

      {/* Fecha de Nacimiento + Talla de Polo — mismo row */}
      <div className="space-y-1">
        <Label htmlFor="fechaNacimiento">
          Fecha de Nacimiento <span className="text-destructive">*</span>
        </Label>
        <DatePicker
          value={formData.fechaNacimiento}
          onChange={(val) => updateField('fechaNacimiento', val)}
          placeholder="dd/mm/aaaa"
          disableFuture
          error={err('fechaNacimiento')}
        />
        <FieldError message={err('fechaNacimiento')} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="tallaPolo">
          Talla de Polo <span className="text-destructive">*</span>
        </Label>
        <Select value={formData.tallaPolo} onValueChange={(val) => updateField('tallaPolo', val)}>
          <SelectTrigger id="tallaPolo" className={`w-full ${err('tallaPolo') ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Talla" />
          </SelectTrigger>
          <SelectContent>
            {TALLAS_POLO.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={err('tallaPolo')} />
      </div>

    </div>
  );
}
