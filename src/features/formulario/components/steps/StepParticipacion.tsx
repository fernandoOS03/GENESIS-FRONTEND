import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import type { StepProps } from '../../types/participante.types';
import { CondParticipacion } from '../../types/participante.types';
import {
  CONDICION_PARTICIPACION_OPCIONES,
  ROLES_OPCIONES,
} from '@/lib/constants';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

export default function StepParticipacion({
  formData,
  updateField,
  validationErrors = {},
}: StepProps) {
  const isMiembro = formData.condParticipacion === CondParticipacion.MIEMBRO;
  const err = (field: string) => validationErrors[field];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Condición de Participación
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Indica tu condición y cargo dentro del evento.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Condición de Participación */}
        <div className="space-y-2">
          <Label htmlFor="condParticipacion">
            Condición <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.condParticipacion}
            onValueChange={(val) => {
              updateField('condParticipacion', val as CondParticipacion);
              // Limpiar cargo al cambiar condición
              if (val !== CondParticipacion.MIEMBRO) {
                updateField('rol', '');
              }
            }}
          >
            <SelectTrigger
              id="condParticipacion"
              className={`w-full ${err('condParticipacion') ? 'border-destructive' : ''}`}
            >
              <SelectValue placeholder="Seleccionar condición" />
            </SelectTrigger>
            <SelectContent>
              {CONDICION_PARTICIPACION_OPCIONES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={err('condParticipacion')} />
        </div>

        {/* Cargo — visible solo si MIEMBRO */}
        <AnimatePresence>
          {isMiembro && (
            <motion.div
              key="cargo-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                <Label htmlFor="rol">
                  Rol <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.rol}
                  onValueChange={(val) => updateField('rol', val)}
                >
                  <SelectTrigger
                    id="rol"
                    className={`w-full ${err('rol') ? 'border-destructive' : ''}`}
                  >
                    <SelectValue placeholder="Seleccionar cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES_OPCIONES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={err('rol')} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
