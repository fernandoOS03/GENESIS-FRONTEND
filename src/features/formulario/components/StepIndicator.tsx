interface StepIndicatorProps {
  stepLabels: string[];
  currentStep: number;
  goToStep: (step: number) => void;
}

export default function StepIndicator({
  stepLabels,
  currentStep,
  goToStep,
}: StepIndicatorProps) {
  return (
    <div className="mb-4">
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = index <= currentStep;

          return (
            <div key={`${label}-${index}`} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => isClickable && goToStep(index)}
                disabled={!isClickable}
                className="flex flex-col items-center gap-1.5 group disabled:cursor-default"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110'
                      : isCompleted
                        ? 'bg-primary/80 text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </button>

              {/* Connector line */}
              {index < stepLabels.length - 1 && (
                <div className="mx-2 h-0.5 flex-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{
                      width: isCompleted ? '100%' : isActive ? '50%' : '0%',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: simplified */}
      <div className="flex sm:hidden items-center justify-between">
        <span className="text-sm font-semibold text-primary">
          Paso {currentStep + 1} de {stepLabels.length}
        </span>
        <span className="text-sm text-muted-foreground">
          {stepLabels[currentStep]}
        </span>
      </div>

      {/* Mobile progress bar */}
      <div className="mt-2 sm:hidden h-1.5 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((currentStep + 1) / stepLabels.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
