import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWizardForm } from '../hooks/useWizardForm';
import StepIndicator from './StepIndicator';
import StepDatosContacto from './steps/StepDatosContacto';
import StepParticipacion from './steps/StepParticipacion';
import StepTransporte from './steps/StepTransporte';
import StepResumen from './steps/StepResumen';

const stepVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -200 : 200, opacity: 0 }),
};

export default function WizardForm() {
  const {
    currentStep, totalSteps, stepLabels, formData,
    isSubmitting, isSuccess, error, direction, validationErrors,
    showTransport, transportSkipped, updateField,
    next, prev, goToStep, skipTransport, submit, reset,
  } = useWizardForm();

  const stepProps = { formData, updateField, validationErrors };

  const steps = showTransport
    ? [
        <StepDatosContacto key="datos" {...stepProps} />,
        <StepParticipacion key="part" {...stepProps} />,
        <StepTransporte key="trans" {...stepProps} onSkip={skipTransport} />,
        <StepResumen key="resumen" {...stepProps} transportSkipped={transportSkipped} showTransport={showTransport} />,
      ]
    : [
        <StepDatosContacto key="datos" {...stepProps} />,
        <StepParticipacion key="part" {...stepProps} />,
        <StepResumen key="resumen" {...stepProps} transportSkipped={false} showTransport={false} />,
      ];

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-5 py-12 px-4">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
          <h2 className="text-xl font-bold text-foreground">¡Registro Exitoso!</h2>
          <p className="mt-1 text-muted-foreground text-sm">Tu información ha sido enviada correctamente.</p>
        </motion.div>
        <Button onClick={reset} variant="outline" className="mt-2 rounded-xl text-sm">
          Registrar otro participante
        </Button>
      </div>
    );
  }

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex flex-col h-full lg:max-h-full">

      {/* StepIndicator — fijo arriba */}
      <div className="shrink-0 mb-3">
        <StepIndicator stepLabels={stepLabels} currentStep={currentStep} goToStep={goToStep} />
      </div>

      {/* Contenido del paso — scrollable en todos los tamaños */}
      <div className="flex-1 min-h-0 overflow-y-auto pt-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full pb-4"
          >
            {steps[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error */}
      {error && (
        <div className="shrink-0 mt-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Navegación */}
      <div className="shrink-0 mt-3 pt-3 flex items-center justify-between border-t border-border">
        <Button
          variant="ghost"
          onClick={prev}
          disabled={currentStep === 0}
          className="gap-1.5 text-sm h-10 px-4"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </Button>

        {isLastStep ? (
          <Button
            onClick={submit}
            disabled={isSubmitting}
            className="gap-2 px-6 h-10 text-sm shadow-sm"
          >
            {isSubmitting ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enviando...
              </>
            ) : (
              <>Enviar Registro <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></>
            )}
          </Button>
        ) : (
          <Button
            onClick={next}
            className="gap-2 px-6 h-10 text-sm"
          >
            Siguiente
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
