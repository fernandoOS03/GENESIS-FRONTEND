import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { useWizardForm } from '../hooks/useWizardForm';
import ContenedorPregunta from './ContenedorPregunta';
import StepResumen from './steps/StepResumen';
import { CondParticipacion, TipoTransporte } from '../types/participante.types';
import { COUNTRY_OPTIONS, findCountry } from '@/lib/countryOptions';
import {
  GENEROS,
  TALLAS_POLO,
  SEDES_LIMA_OPCIONES,
  SEDES_OPCIONES,
  TIPOS_DOCUMENTO,
  MED_TRANSPORTE_OPCIONES,
  CONDICION_PARTICIPACION_OPCIONES,
  ROLES_OPCIONES,
} from '@/lib/constants';
import { uploadToCloudinary } from '../services/participante.service';
import { PiCaretUpLight, PiCaretDownLight, PiCheckCircleLight, PiCloudArrowUpLight, PiTrashLight, PiSpinnerLight } from 'react-icons/pi';
import { StickerLlamita, StickerEmail, StickerTelefono, StickerCarnet, StickerSolPeru, StickerCamiseta, StickerBus } from './Pegatinas';

const obtenerStickerActivo = (stepId: string) => {
  switch (stepId) {
    case 'documento':
      return <StickerCarnet className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 -rotate-3" />;
    case 'nombres_apellidos':
      return <StickerLlamita className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rotate-6 animate-pulse" />;
    case 'fecha_nacimiento':
      return <StickerLlamita className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 -rotate-6" />;
    case 'genero':
      return <StickerLlamita className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rotate-12" />;
    case 'pais_sede':
      return <StickerSolPeru className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rotate-12" />;
    case 'telefono':
      return <StickerTelefono className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rotate-6" />;
    case 'email':
      return <StickerEmail className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 -rotate-6" />;
    case 'talla_polo':
      return <StickerCamiseta className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rotate-3" />;
    case 'participacion':
      return <StickerCarnet className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rotate-3" />;
    case 'transporte_tipo':
    case 'transporte_detalles':
      return <StickerBus className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 -rotate-6" />;
    default:
      return null;
  }
};

export default function FormularioConversacional() {
  const {
    formData,
    isSubmitting,
    isSuccess,
    error,
    updateField,
    submit,
  } = useWizardForm();

  // Ocultar alerta automáticamente después de unos segundos
  const [mostrarError, setMostrarError] = useState(false);
  useEffect(() => {
    if (error) {
      setMostrarError(true);
      const timer = setTimeout(() => setMostrarError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const [indicePregunta, setIndicePregunta] = useState(0);
  const [erroresLocales, setErroresLocales] = useState<Record<string, string>>({});
  const [subiendoBoleto, setSubiendoBoleto] = useState(false);
  const [errorBoleto, setErrorBoleto] = useState<string | null>(null);
  const selectorArchivoRef = useRef<HTMLInputElement>(null);

  // Determinar dinámicamente si requiere transporte (Lima no requiere, provincias y extranjeros sí)
  const requiereTransporte = useMemo(() => {
    if (formData.pais !== 'PE') return true;
    return !SEDES_LIMA_OPCIONES.some((s) => s.value === formData.sede);
  }, [formData.pais, formData.sede]);

  // Lista dinámica de preguntas — nuevo orden solicitado
  const preguntasActuales = useMemo(() => {
    const lista = [
      {
        id: 'documento',
        titulo: 'Documento de Identidad',
        subtitulo: 'Selecciona tu tipo de documento e introduce el número correspondiente.',
      },
      {
        id: 'nombres_apellidos',
        titulo: '¿Cómo te llamas?',
        subtitulo: 'Por favor ingresa tus nombres y apellidos tal como figuran en tu documento.',
      },
      {
        id: 'fecha_nacimiento',
        titulo: '¿Cuál es tu fecha de nacimiento?',
        subtitulo: 'Por favor, selecciona tu fecha de nacimiento.',
      },
      {
        id: 'genero',
        titulo: '¿Cuál es tu género?',
        subtitulo: 'Selecciona la opción con la que te identificas.',
      },
      {
        id: 'pais_sede',
        titulo: '¿Cuál es tu nacionalidad?',
        subtitulo: 'Selecciona tu país de origen. Si eres de Perú, indica también tu sede local.',
      },
      {
        id: 'telefono',
        titulo: '¿Cuál es tu número de teléfono?',
        subtitulo: 'Introduce un número de teléfono válido para contactarte por WhatsApp.',
      },
      {
        id: 'email',
        titulo: '¿Cuál es tu correo electrónico?',
        subtitulo: 'Te enviaremos la confirmación de registro para el World Camp 2027 a esta dirección.',
      },
      {
        id: 'talla_polo',
        titulo: '¿Qué talla de polo utilizas?',
        subtitulo: 'Esta talla se utilizará para los recuerdos oficiales durante el campamento.',
      },
      {
        id: 'participacion',
        titulo: 'Condición de Participación',
        subtitulo: 'Selecciona tu condición de registro en el evento y tu cargo si eres miembro.',
      },
    ];

    if (requiereTransporte) {
      lista.push(
        {
          id: 'transporte_tipo',
          titulo: '¿Cómo llegarás al campamento?',
          subtitulo: 'Selecciona el medio de transporte que vas a usar. Si aún no tienes boleto, puedes omitir este paso.',
        },
        {
          id: 'transporte_detalles',
          titulo: 'Detalles de tu llegada y retorno',
          subtitulo: 'Registra las empresas, número de vuelo (si aplica), fechas y adjunta un comprobante.',
        }
      );
    }

    lista.push({
      id: 'resumen',
      titulo: 'Confirma tus datos',
      subtitulo: 'Revisa que todo esté correcto antes de enviar tu inscripción.',
    });

    return lista;
  }, [requiereTransporte]);

  // Si cambia la cantidad de preguntas y quedamos fuera de rango, reajustar
  useEffect(() => {
    if (indicePregunta >= preguntasActuales.length) {
      setIndicePregunta(preguntasActuales.length - 1);
    }
  }, [preguntasActuales, indicePregunta]);

  // Validar pregunta activa
  const validarPreguntaActiva = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    const pregunta = preguntasActuales[indicePregunta];
    if (!pregunta) return true;

    if (pregunta.id === 'nombres_apellidos') {
      if (!formData.nombres.trim()) errs.nombres = 'Ingresa tus nombres.';
      if (!formData.apellidos.trim()) errs.apellidos = 'Ingresa tus apellidos.';
    } else if (pregunta.id === 'documento') {
      if (!formData.tipoDocumento) errs.tipoDocumento = 'Selecciona un tipo de documento.';
      if (!formData.nroDocumento.trim()) errs.nroDocumento = 'Ingresa el número de documento.';
    } else if (pregunta.id === 'email') {
      if (!formData.email.trim()) errs.email = 'Ingresa tu correo electrónico.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        errs.email = 'El correo electrónico no es válido.';
    } else if (pregunta.id === 'pais_sede') {
      if (!formData.pais) errs.pais = 'Selecciona un país.';
      if (formData.pais === 'PE' && !formData.sede) errs.sede = 'Selecciona una sede.';
    } else if (pregunta.id === 'telefono') {
      if (!formData.telefono || !isValidPhoneNumber(formData.telefono)) {
        errs.telefono = 'Ingresa un número de teléfono válido con prefijo internacional.';
      }
    } else if (pregunta.id === 'genero') {
      if (!formData.genero) errs.genero = 'Selecciona tu género.';
    } else if (pregunta.id === 'fecha_nacimiento') {
      if (!formData.fechaNacimiento) errs.fechaNacimiento = 'Selecciona tu fecha de nacimiento.';
    } else if (pregunta.id === 'talla_polo') {
      if (!formData.tallaPolo) errs.tallaPolo = 'Selecciona tu talla de polo.';
    } else if (pregunta.id === 'participacion') {
      if (!formData.condParticipacion) errs.condParticipacion = 'Selecciona tu condición de participación.';
      if (formData.condParticipacion === CondParticipacion.MIEMBRO && !formData.rol)
        errs.rol = 'Selecciona un rol para miembros.';
    } else if (pregunta.id === 'transporte_tipo') {
      if (!formData.tipoTransporte) errs.tipoTransporte = 'Selecciona un medio de transporte o salta este paso.';
    } else if (pregunta.id === 'transporte_detalles') {
      const tipo = formData.tipoTransporte;
      if (tipo === TipoTransporte.AEREO || tipo === TipoTransporte.TERRESTRE) {
        if (!formData.empresaTransporte.trim()) errs.empresaTransporte = 'Ingresa la empresa de transporte.';
        if (!formData.fechaLlegada) errs.fechaLlegada = 'Selecciona la fecha de llegada.';
        if (!formData.fechaIda) errs.fechaIda = 'Selecciona la fecha de ida.';
      }
      if (tipo === TipoTransporte.AEREO) {
        if (!formData.nroVuelo.trim()) errs.nroVuelo = 'Ingresa el número de vuelo.';
      }
      if (tipo === TipoTransporte.TERRESTRE) {
        if (!formData.lugarLlegada.trim()) errs.lugarLlegada = 'Ingresa el lugar de llegada.';
      }
      if (tipo === TipoTransporte.INDEPENDIENTE) {
        if (!formData.fechaLlegada) errs.fechaLlegada = 'Selecciona la fecha de llegada.';
        if (!formData.fechaIda) errs.fechaIda = 'Selecciona la fecha de ida.';
      }
    }

    setErroresLocales(errs);
    return Object.keys(errs).length === 0;
  }, [indicePregunta, preguntasActuales, formData]);

  const irSiguiente = useCallback(() => {
    if (!validarPreguntaActiva()) return;
    if (indicePregunta < preguntasActuales.length - 1) {
      setIndicePregunta((prev) => prev + 1);
      setErroresLocales({});
    } else {
      submit();
    }
  }, [indicePregunta, preguntasActuales, validarPreguntaActiva, submit]);

  const irAnterior = useCallback(() => {
    if (indicePregunta > 0) {
      setIndicePregunta((prev) => prev - 1);
      setErroresLocales({});
    }
  }, [indicePregunta]);

  // Manejar el salto de transporte
  const saltarTransporte = useCallback(() => {
    updateField('tipoTransporte', '');
    updateField('empresaTransporte', '');
    updateField('nroVuelo', '');
    updateField('fechaLlegada', '');
    updateField('fechaIda', '');
    updateField('lugarLlegada', '');
    updateField('boletoUrl', null);
    updateField('boletoNombre', '');

    // Ir a la última pregunta (Resumen)
    const indexResumen = preguntasActuales.findIndex((p) => p.id === 'resumen');
    if (indexResumen !== -1) {
      setIndicePregunta(indexResumen);
      setErroresLocales({});
    }
  }, [preguntasActuales, updateField]);

  // Escuchar tecla Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const activeElem = document.activeElement;
        if (
          activeElem?.tagName === 'BUTTON' ||
          activeElem?.tagName === 'TEXTAREA' ||
          preguntasActuales[indicePregunta]?.id === 'resumen'
        ) {
          return;
        }
        e.preventDefault();
        irSiguiente();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [irSiguiente, indicePregunta, preguntasActuales]);

  // Subida de archivos
  const handleSubidaArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoBoleto(true);
    setErrorBoleto(null);
    try {
      const url = await uploadToCloudinary(file);
      updateField('boletoUrl', url);
      updateField('boletoNombre', file.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir el archivo.';
      setErrorBoleto(msg);
      updateField('boletoUrl', null);
      updateField('boletoNombre', '');
    } finally {
      setSubiendoBoleto(false);
      if (selectorArchivoRef.current) selectorArchivoRef.current.value = '';
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center" style={{ gap: '1.5rem' }}>
        {/* Pegatinas festivas del éxito */}
        <div className="flex items-center gap-3">
          <StickerLlamita className="w-20 h-20 -rotate-12" />
          <StickerSolPeru className="w-16 h-16 rotate-6" />
          <StickerEmail className="w-16 h-16 -rotate-6" />
        </div>

        {/* Mensaje de bienvenida */}
        <div style={{ maxWidth: '440px' }}>
          <h2
            className="font-bold"
            style={{ fontSize: '1.75rem', color: 'var(--foreground)', letterSpacing: '-0.03em', lineHeight: 1.15 }}
          >
            ¡Bienvenido al{' '}
            <span style={{ color: '#BE0A2F' }}>World Camp 2027</span>!
          </h2>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Tu inscripción fue procesada correctamente. En breve recibirás la confirmación a tu correo.
          </p>
        </div>

        {/* Banda andina decorativa */}
        <div className="banda-andina w-full max-w-xs" style={{ borderRadius: 8, height: 8 }} />
      </div>
    );
  }

  const preguntaActiva = preguntasActuales[indicePregunta];

  return (
    <>
      {/* ─── Notificación Top-Down (Alertas) ─── */}
      <AnimatePresence>
        {mostrarError && error && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-4 left-4 right-4 z-[999999] max-w-md mx-auto"
          >
            <div
              className="relative overflow-hidden rounded-xl px-5 py-4 shadow-xl flex items-center gap-3"
              style={{
                background: '#FFF0F3',
                border: '2.5px solid #BE0A2F',
                boxShadow: '4px 4px 0px 0px rgba(190, 10, 47, 0.4)',
              }}
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-white"
                style={{ background: '#BE0A2F' }}
              >
                !
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: '#BE0A2F' }}>
                  Aviso
                </p>
                <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--foreground)' }}>
                  {error}
                </p>
              </div>
              <button
                onClick={() => setMostrarError(false)}
                className="text-[#BE0A2F] opacity-70 hover:opacity-100 transition-opacity font-black text-lg"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    <div className="flex flex-col h-full justify-between">

      {/* Contenido Conversacional Animado — ocupa todo el espacio restante con scroll propio */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="w-full max-w-4xl py-4 mx-auto">
          <AnimatePresence mode="wait">
            {preguntaActiva && (
              <ContenedorPregunta
                key={preguntaActiva.id}
                indice={indicePregunta + 1}
                total={preguntasActuales.length}
                titulo={preguntaActiva.titulo}
                subtitulo={preguntaActiva.subtitulo}
                obligatorio={preguntaActiva.id !== 'transporte_tipo' && preguntaActiva.id !== 'transporte_detalles' && preguntaActiva.id !== 'resumen'}
                layout={preguntaActiva.id === 'resumen' ? 'split' : 'standard'}
                sticker={obtenerStickerActivo(preguntaActiva.id)}
              >

                {/* 1. NOMBRES Y APELLIDOS */}
                {preguntaActiva.id === 'nombres_apellidos' && (
                  <div className="w-full space-y-3 sm:space-y-5">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider font-bold text-primary">Nombres</label>
                      <Input
                        type="text"
                        className="h-12 sm:h-14 text-base rounded-xl border-border bg-white text-foreground focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 shadow-sm"
                        placeholder="Escribe tus nombres..."
                        value={formData.nombres}
                        onChange={(e) => updateField('nombres', e.target.value)}
                        autoFocus
                      />
                      {erroresLocales.nombres && <p className="text-xs text-destructive mt-1">{erroresLocales.nombres}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider font-bold text-primary">Apellidos</label>
                      <Input
                        type="text"
                        className="h-12 sm:h-14 text-base rounded-xl border-border bg-white text-foreground focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 shadow-sm"
                        placeholder="Escribe tus apellidos..."
                        value={formData.apellidos}
                        onChange={(e) => updateField('apellidos', e.target.value)}
                      />
                      {erroresLocales.apellidos && <p className="text-xs text-destructive mt-1">{erroresLocales.apellidos}</p>}
                    </div>
                  </div>
                )}

                {/* 2. DOCUMENTO DE IDENTIDAD */}
                {preguntaActiva.id === 'documento' && (
                  <div className="w-full space-y-3 sm:space-y-5">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider font-bold text-primary">Tipo de Documento</label>
                      <Select
                        value={formData.tipoDocumento}
                        onValueChange={(val) => updateField('tipoDocumento', val as any)}
                      >
                        <SelectTrigger className="w-full text-base py-3 sm:py-5 px-3 sm:px-4 bg-white border border-border rounded-xl">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPOS_DOCUMENTO.map((doc) => (
                            <SelectItem key={doc.value} value={doc.value}>{doc.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {erroresLocales.tipoDocumento && <p className="text-xs text-destructive mt-1">{erroresLocales.tipoDocumento}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider font-bold text-primary">Número de Documento</label>
                      <Input
                        type="text"
                        className="h-12 sm:h-14 text-base rounded-xl border-border bg-white text-foreground focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 shadow-sm"
                        placeholder="Escribe el número de documento..."
                        value={formData.nroDocumento}
                        onChange={(e) => updateField('nroDocumento', e.target.value)}
                      />
                      {erroresLocales.nroDocumento && <p className="text-xs text-destructive mt-1">{erroresLocales.nroDocumento}</p>}
                    </div>
                  </div>
                )}

                {/* 3. EMAIL */}
                {preguntaActiva.id === 'email' && (
                  <div className="w-full space-y-1">
                    <label className="text-xs uppercase tracking-wider font-bold text-primary">Correo Electrónico</label>
                    <Input
                      type="email"
                      className="h-12 sm:h-14 text-base rounded-xl border-border bg-white text-foreground focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 shadow-sm"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      autoFocus
                    />
                    {erroresLocales.email && <p className="text-xs text-destructive mt-1">{erroresLocales.email}</p>}
                  </div>
                )}

                {/* 4. PAIS Y SEDE */}
                {preguntaActiva.id === 'pais_sede' && (
                  <div className="w-full space-y-3 sm:space-y-5">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider font-bold text-primary">País de Residencia</label>
                      <Select
                        value={formData.pais}
                        onValueChange={(val) => {
                          updateField('pais', val);
                          updateField('sede', '');
                          const country = findCountry(val);
                          if (country) updateField('telefono', country.phoneCode);
                        }}
                      >
                        <SelectTrigger className="w-full text-base py-3 sm:py-5 px-3 sm:px-4 bg-white border border-border rounded-xl">
                          <SelectValue placeholder="Seleccionar país" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_OPTIONS.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {erroresLocales.pais && <p className="text-xs text-destructive mt-1">{erroresLocales.pais}</p>}
                    </div>
                    {formData.pais === 'PE' && (
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider font-bold text-primary">Sede del Campamento</label>
                        <Select value={formData.sede} onValueChange={(val) => updateField('sede', val)}>
                          <SelectTrigger className="w-full text-base py-3 sm:py-5 px-3 sm:px-4 bg-white border border-border rounded-xl">
                            <SelectValue placeholder="Seleccionar sede de registro" />
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
                        {erroresLocales.sede && <p className="text-xs text-destructive mt-1">{erroresLocales.sede}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. TELEFONO */}
                {preguntaActiva.id === 'telefono' && (
                  <div className="w-full space-y-1">
                    <label className="text-xs uppercase tracking-wider font-bold text-primary">Número de WhatsApp</label>
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry={(formData.pais || undefined) as any}
                      value={formData.telefono}
                      onChange={(val) => updateField('telefono', val || '')}
                      onCountryChange={(newCountry) => {
                        if (newCountry && newCountry !== formData.pais) {
                          updateField('pais', newCountry);
                          updateField('sede', '');
                        }
                      }}
                      className="phone-input-custom"
                      placeholder="Ingresa tu número..."
                    />
                    {erroresLocales.telefono && <p className="text-xs text-destructive mt-1">{erroresLocales.telefono}</p>}
                  </div>
                )}

                {/* 6. GENERO */}
                {preguntaActiva.id === 'genero' && (
                  <div className="w-full" style={{ gap: '0.5rem' }}>
                    <div className="grid grid-cols-2 gap-3">
                      {GENEROS.map((g) => {
                        const esSeleccionado = formData.genero === g.value;
                        return (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => updateField('genero', g.value)}
                            className={`tarjeta-opcion text-center ${esSeleccionado ? 'tarjeta-opcion--seleccionada' : ''}`}
                          >
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                    {erroresLocales.genero && <p className="text-xs mt-2" style={{ color: 'var(--destructive)' }}>{erroresLocales.genero}</p>}
                  </div>
                )}

                {/* 7. FECHA NACIMIENTO */}
                {preguntaActiva.id === 'fecha_nacimiento' && (
                  <div className="w-full space-y-1 max-w-xs">
                    <label className="text-xs uppercase tracking-wider font-bold text-primary">Fecha de Nacimiento</label>
                    <DatePicker
                      value={formData.fechaNacimiento}
                      onChange={(val) => updateField('fechaNacimiento', val)}
                      placeholder="Selecciona dd/mm/aaaa"
                      disableFuture
                      error={erroresLocales.fechaNacimiento}
                    />
                    {erroresLocales.fechaNacimiento && <p className="text-xs text-destructive mt-1">{erroresLocales.fechaNacimiento}</p>}
                  </div>
                )}

                {/* 8. TALLA DE POLO */}
                {preguntaActiva.id === 'talla_polo' && (
                  <div className="w-full">
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {TALLAS_POLO.map((t) => {
                        const esSeleccionado = formData.tallaPolo === t.value;
                        return (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => updateField('tallaPolo', t.value)}
                            className={`tarjeta-opcion text-center ${esSeleccionado ? 'tarjeta-opcion--seleccionada' : ''}`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                    {erroresLocales.tallaPolo && <p className="text-xs mt-2" style={{ color: 'var(--destructive)' }}>{erroresLocales.tallaPolo}</p>}
                  </div>
                )}

                {/* 9. PARTICIPACION Y ROL */}
                {preguntaActiva.id === 'participacion' && (
                  <div className="w-full space-y-3 sm:space-y-5">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider font-bold text-primary">Condición de Participación</label>
                      <Select
                        value={formData.condParticipacion}
                        onValueChange={(val) => {
                          updateField('condParticipacion', val as any);
                          if (val !== CondParticipacion.MIEMBRO) {
                            updateField('rol', '');
                          }
                        }}
                      >
                        <SelectTrigger className="w-full text-base py-3 sm:py-5 px-3 sm:px-4 bg-white border border-border rounded-xl">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONDICION_PARTICIPACION_OPCIONES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {erroresLocales.condParticipacion && <p className="text-xs text-destructive mt-1">{erroresLocales.condParticipacion}</p>}
                    </div>
                    {formData.condParticipacion === CondParticipacion.MIEMBRO && (
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider font-bold text-primary">Cargo o Rol de Servicio</label>
                        <Select value={formData.rol} onValueChange={(val) => updateField('rol', val)}>
                          <SelectTrigger className="w-full text-base py-3 sm:py-5 px-3 sm:px-4 bg-white border border-border rounded-xl">
                            <SelectValue placeholder="Seleccionar cargo" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES_OPCIONES.map((c) => (
                              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {erroresLocales.rol && <p className="text-xs text-destructive mt-1">{erroresLocales.rol}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* 10. TRANSPORTE TIPO */}
                {preguntaActiva.id === 'transporte_tipo' && (
                  <div className="w-full space-y-3">
                    <div className="flex flex-col gap-2">
                      {MED_TRANSPORTE_OPCIONES.map((t) => {
                        const esSeleccionado = formData.tipoTransporte === t.value;
                        return (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => {
                              updateField('tipoTransporte', t.value as any);
                              updateField('empresaTransporte', '');
                              updateField('nroVuelo', '');
                              updateField('fechaLlegada', '');
                              updateField('fechaIda', '');
                              updateField('lugarLlegada', '');
                              updateField('boletoUrl', null);
                            }}
                            className={`tarjeta-opcion ${esSeleccionado ? 'tarjeta-opcion--verde' : ''
                              }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                    {erroresLocales.tipoTransporte && <p className="text-xs" style={{ color: 'var(--destructive)' }}>{erroresLocales.tipoTransporte}</p>}

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        className="btn-festival-fantasma"
                        onClick={saltarTransporte}
                      >
                        Omitir paso de logística
                      </button>
                    </div>
                  </div>
                )}

                {/* 11. DETALLES TRANSPORTE */}
                {preguntaActiva.id === 'transporte_detalles' && (
                  <div className="w-full grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                    {/* Empresa de Transporte */}
                    {(formData.tipoTransporte === TipoTransporte.AEREO ||
                      formData.tipoTransporte === TipoTransporte.TERRESTRE) && (
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs uppercase tracking-wider font-bold text-primary">Empresa de Transporte</label>
                          <Input
                            type="text"
                            className="h-12 sm:h-14 text-base rounded-xl border-border bg-white text-foreground focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 shadow-sm"
                            value={formData.empresaTransporte}
                            onChange={(e) => updateField('empresaTransporte', e.target.value)}
                            placeholder={
                              formData.tipoTransporte === TipoTransporte.AEREO
                                ? 'Ej: LATAM, Avianca...'
                                : 'Ej: Cruz del Sur, Oltursa...'
                            }
                          />
                          {erroresLocales.empresaTransporte && <p className="text-xs text-destructive mt-1">{erroresLocales.empresaTransporte}</p>}
                        </div>
                      )}

                    {/* Nro Vuelo */}
                    {formData.tipoTransporte === TipoTransporte.AEREO && (
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs uppercase tracking-wider font-bold text-primary">Número de Vuelo</label>
                        <Input
                          type="text"
                          className="h-12 sm:h-14 text-base rounded-xl border-border bg-white text-foreground focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 shadow-sm"
                          value={formData.nroVuelo}
                          onChange={(e) => updateField('nroVuelo', e.target.value)}
                          placeholder="Ej: LA1402"
                        />
                        {erroresLocales.nroVuelo && <p className="text-xs text-destructive mt-1">{erroresLocales.nroVuelo}</p>}
                      </div>
                    )}

                    {/* Fechas */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-primary">Fechas de Llegada y Salida</label>
                      <DateRangePicker
                        fromValue={formData.fechaLlegada}
                        toValue={formData.fechaIda}
                        onFromChange={(val) => updateField('fechaLlegada', val)}
                        onToChange={(val) => updateField('fechaIda', val)}
                        fromError={erroresLocales.fechaLlegada}
                        toError={erroresLocales.fechaIda}
                      />
                    </div>

                    {/* Lugar de llegada */}
                    {formData.tipoTransporte === TipoTransporte.TERRESTRE && (
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs uppercase tracking-wider font-bold text-primary">Lugar de Llegada</label>
                        <Input
                          type="text"
                          className="h-12 sm:h-14 text-base rounded-xl border-border bg-white text-foreground focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 shadow-sm"
                          value={formData.lugarLlegada}
                          onChange={(e) => updateField('lugarLlegada', e.target.value)}
                          placeholder="Ej: Terminal Plaza Norte"
                        />
                        {erroresLocales.lugarLlegada && <p className="text-xs text-destructive mt-1">{erroresLocales.lugarLlegada}</p>}
                      </div>
                    )}

                    {/* Comprobante archivo */}
                    {(formData.tipoTransporte === TipoTransporte.AEREO ||
                      formData.tipoTransporte === TipoTransporte.TERRESTRE) && (
                        <div className="space-y-1 sm:col-span-2 pt-1">
                          <label className="text-xs uppercase tracking-wider font-bold text-primary block mb-2">Boleto / Comprobante (Opcional)</label>
                          <div
                            onClick={() => !subiendoBoleto && selectorArchivoRef.current?.click()}
                            className={`flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-3 transition-all duration-200 ${subiendoBoleto
                                ? 'cursor-not-allowed border-muted bg-muted/30 opacity-70'
                                : formData.boletoUrl
                                  ? 'border-green-500/50 bg-green-500/5 hover:bg-green-500/10'
                                  : 'border-border bg-white hover:border-primary/50 hover:bg-primary/5'
                              }`}
                          >
                            {subiendoBoleto ? (
                              <>
                                <PiSpinnerLight size={20} className="animate-spin text-primary" />
                                <span className="text-sm text-muted-foreground">Subiendo documento...</span>
                              </>
                            ) : formData.boletoUrl ? (
                              <>
                                <PiCheckCircleLight size={20} className="text-green-500" />
                                <span className="truncate text-green-700 text-sm font-medium">
                                  {formData.boletoNombre || 'Documento adjunto'}
                                </span>
                              </>
                            ) : (
                              <>
                                <PiCloudArrowUpLight size={20} className="text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Haz click para adjuntar archivo</span>
                              </>
                            )}
                          </div>
                          {errorBoleto && <p className="text-xs text-destructive mt-1">{errorBoleto}</p>}
                          {formData.boletoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                updateField('boletoUrl', null);
                                updateField('boletoNombre', '');
                                setErrorBoleto(null);
                              }}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-all underline cursor-pointer"
                            >
                              <PiTrashLight size={12} /> Eliminar boleto adjunto
                            </button>
                          )}
                          <input
                            ref={selectorArchivoRef}
                            type="file"
                            accept=".pdf,image/*"
                            onChange={handleSubidaArchivo}
                            className="hidden"
                          />
                        </div>
                      )}
                  </div>
                )}

                {/* 12. RESUMEN */}
                {preguntaActiva.id === 'resumen' && (
                  <StepResumen
                    formData={formData}
                    updateField={updateField}
                    transportSkipped={!formData.tipoTransporte}
                    showTransport={requiereTransporte}
                  />
                )}

              </ContenedorPregunta>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Barra de Navegación — Estilo Festival Andino con Botones Shadcn */}
      <div
        className="shrink-0 flex items-center justify-between"
        style={{
          borderTop: '2px solid var(--border)',
          paddingTop: '1rem',
          marginTop: '0.75rem',
        }}
      >
        {/* Botón Anterior */}
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground font-bold"
          onClick={irAnterior}
          disabled={indicePregunta === 0 || isSubmitting}
        >
          &larr; Anterior
        </Button>

        {/* Siguiente / Enviar + Chevrons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            onClick={irSiguiente}
            disabled={isSubmitting || subiendoBoleto}
            className="bg-primary text-primary-foreground hover:brightness-110 font-bold px-6 shadow-md rounded-xl h-11"
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PiSpinnerLight size={16} className="animate-spin" /> Procesando...
              </span>
            ) : indicePregunta === preguntasActuales.length - 1 ? (
              '✓ Enviar Registro'
            ) : (
              'Siguiente \u2192'
            )}
          </Button>


        </div>
      </div>

    </div>
    </>
  );
}
