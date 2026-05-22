import WizardForm from '../components/WizardForm';
import {
  PiUserLight,
  PiTargetLight,
  PiBusLight,
  PiCheckCircleLight,
  PiLockSimpleLight,
} from 'react-icons/pi';

const sidebarItems = [
  { Icon: PiUserLight, text: 'Datos personales y de contacto' },
  { Icon: PiTargetLight, text: 'Condición y rol de participación' },
  { Icon: PiBusLight, text: 'Información de transporte (opcional)' },
  { Icon: PiCheckCircleLight, text: 'Resumen y confirmación final' },
];

export default function FormularioPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[100dvh] lg:h-screen lg:overflow-hidden bg-background">

      {/* ── Panel izquierdo sticky ── */}
      <aside className="hidden lg:flex lg:w-[42%] shrink-0 flex-col overflow-hidden bg-primary relative text-primary-foreground">
        
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Crect x='0' y='0' width='1' height='40'/%3E%3Crect x='0' y='0' width='40' height='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative flex flex-col justify-between h-full p-8 text-primary-foreground">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold tracking-tight">Génesis</span>
          </div>

          {/* Contenido central */}
          <div className="space-y-6">
            <div className="relative select-none -ml-2 leading-none">
              <div className="text-[80px] xl:text-[96px] font-black text-white/[0.07]">IYF</div>
              <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/20 -mt-1 ml-1">WC 2027 &middot; Perú</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-white/20" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/50">Inscripción</span>
                <div className="h-px flex-1 bg-white/20" />
              </div>
              <div>
                <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
                  Formulario de<br /><span className="text-white/60">Registro</span>
                </h1>
                <p className="mt-2 text-white/60 text-sm leading-relaxed">
                  Completa los pasos y únete al campamento más esperado del año.
                </p>
              </div>
            </div>

            {/* Steps list con react-icons */}
            <div className="space-y-2.5">
              {sidebarItems.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-white/75">
                  <Icon className="shrink-0 text-white/80" size={18} />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-white/35 pt-1">
              <PiLockSimpleLight size={14} />
              Conexión segura · Datos protegidos
            </div>
          </div>

          <p className="text-xs text-white/25">© {new Date().getFullYear()} Génesis</p>
        </div>
      </aside>

      {/* ── Panel derecho ── */}
      <main className="flex-1 flex flex-col min-w-0 lg:min-h-0 lg:overflow-hidden">

        {/* Header mobile */}
        <header className="lg:hidden shrink-0 border-b border-border bg-background/95 backdrop-blur">
          <div className="px-5 py-3.5 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <svg className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-foreground text-sm">Génesis</span>
          </div>
        </header>

        {/* Eyebrow — solo desktop */}
        <div className="hidden lg:block shrink-0 px-8 pt-4 pb-0">
          <h2 className="text-xl font-bold text-foreground tracking-tight mt-0.5">Comencemos</h2>
        </div>

        {/* Wizard — max-width para que los inputs no se estiren */}
        <div className="flex-1 flex flex-col px-5 sm:px-8 lg:px-8 py-4 min-h-0">
          {/* Título solo en móvil */}
          <div className="mb-4 lg:hidden">
            <h1 className="text-xl font-black tracking-tight text-foreground">Inscripción</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Completa los pasos para registrarte.</p>
          </div>

          {/* Formulario centrado en los 4/7 restantes */}
          <div className="max-w-2xl w-full mx-auto flex-1 min-h-0 bg-card rounded-2xl p-5 border border-slate-200/60 shadow-soft flex flex-col">
            <div className="relative z-10 flex-1 min-h-0 flex flex-col">
              <WizardForm />
            </div>
          </div>
        </div>

        <footer className="shrink-0 border-t border-border/50 py-2 text-center text-xs text-muted-foreground bg-white">
          © {new Date().getFullYear()} Génesis — Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}
