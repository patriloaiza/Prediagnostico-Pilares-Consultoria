import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ShieldAlert,
  Clock,
  Layers,
  FileSpreadsheet,
  Sparkles,
  Flame,
  Zap,
  Lock,
  Users
} from 'lucide-react';
import {
  PREDIAGNOSTIC_QUESTIONS,
  PILLARS_DATA,
  EVOLUTIONARY_PROFILES
} from '../data/prediagnosticData';
import {
  UserLeadInfo,
  PrediagnosticAnswers,
  PrediagnosticResult,
  calculatePrediagnostic
} from '../utils/prediagnosticLogic';

interface PrediagnosticViewProps {
  defaultWebhookUrl?: string;
  defaultBookingUrl?: string;
}

const envWebhook =
  (import.meta as any).env?.VITE_GHL_WEBHOOK_URL ||
  'https://services.leadconnectorhq.com/hooks/skgSf0Kg3sY00t6Wdy38/webhook-trigger/75483c9f-2acf-41ee-9694-cebb8cdc4ab4';
const envBooking = (import.meta as any).env?.VITE_GHL_BOOKING_URL || '';

export const PrediagnosticView: React.FC<PrediagnosticViewProps> = ({
  defaultWebhookUrl = envWebhook,
  defaultBookingUrl = envBooking || 'https://api.leadconnectorhq.com/widget/booking'
}) => {
  // Estado del flujo: 0 = Captura de Datos, 1..11 = Preguntas de Evidencia, 12 = Resumen y Agendamiento
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [lead, setLead] = useState<UserLeadInfo>({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    role: ''
  });
  const [answers, setAnswers] = useState<PrediagnosticAnswers>({});
  const [result, setResult] = useState<PrediagnosticResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Temporizador de reserva de cupo (FOMO: 14 minutos 59 segundos)
  const [timeLeft, setTimeLeft] = useState<number>(14 * 60 + 59);

  // Parámetros de GoHighLevel (leídos desde URL ?webhook=... o ?booking_url=... o localStorage)
  const [ghlWebhook, setGhlWebhook] = useState<string>('');
  const [ghlBookingUrl, setGhlBookingUrl] = useState<string>(defaultBookingUrl);

  useEffect(() => {
    // Si la app está incrustada en un iframe en GoHighLevel, lee los parámetros pasados en el src
    const params = new URLSearchParams(window.location.search);
    const urlHook = params.get('webhook') || params.get('ghl_webhook');
    const urlBooking = params.get('booking_url') || params.get('calendar_url');

    const savedHook = localStorage.getItem('crea_monetiza_ghl_webhook');
    const savedBooking = localStorage.getItem('crea_monetiza_ghl_booking');

    const finalHook = urlHook || savedHook || defaultWebhookUrl;
    const finalBooking = urlBooking || savedBooking || defaultBookingUrl;

    setGhlWebhook(finalHook);
    setGhlBookingUrl(finalBooking);
  }, [defaultWebhookUrl, defaultBookingUrl]);

  // Pre-carga los datos del prospecto en el enlace del calendario de GoHighLevel
  const getBookingUrlWithLead = () => {
    if (!ghlBookingUrl) return '#';
    try {
      const url = new URL(ghlBookingUrl);
      if (lead.name) url.searchParams.set('name', lead.name);
      if (lead.name) url.searchParams.set('first_name', lead.name.split(' ')[0] || '');
      if (lead.name) url.searchParams.set('last_name', lead.name.split(' ').slice(1).join(' ') || '');
      if (lead.email) url.searchParams.set('email', lead.email);
      if (lead.whatsapp) url.searchParams.set('phone', lead.whatsapp);
      return url.toString();
    } catch {
      const separator = ghlBookingUrl.includes('?') ? '&' : '?';
      const params = new URLSearchParams();
      if (lead.name) params.set('name', lead.name);
      if (lead.email) params.set('email', lead.email);
      if (lead.whatsapp) params.set('phone', lead.whatsapp);
      return `${ghlBookingUrl}${separator}${params.toString()}`;
    }
  };

  // Contador regresivo para aumentar urgencia una vez que se llega al paso 12
  useEffect(() => {
    if (currentStep !== 12) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Notificar al iframe padre (GoHighLevel) sobre cambios de altura
  useEffect(() => {
    const notifyHeight = () => {
      if (typeof window !== 'undefined' && window.parent) {
        const height = Math.max(
          document.documentElement.scrollHeight || 0,
          document.body.scrollHeight || 0,
          850
        );
        window.parent.postMessage({ type: 'bms-resize', height }, '*');
      }
    };
    notifyHeight();
    const timeout = setTimeout(notifyHeight, 250);
    return () => clearTimeout(timeout);
  }, [currentStep, result, errorMessage]);

  // Manejar cambio en inputs de datos del prospecto
  const handleLeadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  // Validar datos antes de avanzar desde el paso 0
  const handleStartQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.name.trim() || !lead.email.trim() || !lead.whatsapp.trim()) {
      setErrorMessage('Por favor completa tu Nombre, Correo y WhatsApp para personalizar tu diagnóstico.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Seleccionar una opción
  const handleSelectOption = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrorMessage(null);
  };

  // Navegar a siguiente paso
  const handleNextStep = () => {
    if (currentStep >= 1 && currentStep <= 11) {
      const qKey = `q${currentStep}`;
      if (!answers[qKey]) {
        setErrorMessage('Por favor selecciona una opción para avanzar.');
        return;
      }
    }

    setErrorMessage(null);
    if (currentStep === 11) {
      // Calcular resultados
      const calc = calculatePrediagnostic(answers, lead);
      setResult(calc);
      setCurrentStep(12);

      // Si hay webhook configurado, enviar automáticamente a GoHighLevel en segundo plano
      if (ghlWebhook) {
        executeWebhookDispatch(calc, ghlWebhook);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navegar al paso anterior
  const handlePrevStep = () => {
    setErrorMessage(null);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Despacho de Webhook hacia GoHighLevel (completamente invisible para el prospecto)
  const executeWebhookDispatch = async (calcResult: PrediagnosticResult, url: string) => {
    try {
      const tagsList = [
        'prediagnostico-completado',
        calcResult.hasContradiction ? 'discrepancia-detectada' : 'cimiento-alineado',
        calcResult.hasInternalIncoherence ? 'incoherencia-interna-detectada' : 'coherencia-confirmada',
        `servicio-prioritario-${calcResult.recommendedPillar.id}`
      ];

      const ghlPayload = {
        name: calcResult.lead.name,
        first_name: calcResult.lead.name.split(' ')[0] || '',
        last_name: calcResult.lead.name.split(' ').slice(1).join(' ') || '',
        email: calcResult.lead.email,
        phone: calcResult.lead.whatsapp,
        whatsapp: calcResult.lead.whatsapp,
        company_name: calcResult.lead.company || '',
        role: calcResult.lead.role || '',
        tags: tagsList.join(','),
        tags_array: tagsList,
        perfil_profesional: calcResult.profile.title,
        perfil_subtitulo: calcResult.profile.subtitle,
        servicio_deseado: calcResult.statedPillar.name,
        servicio_recomendado: calcResult.recommendedPillar.name,
        programa_oficial: calcResult.recommendedPillar.serviceTitle,
        duracion_estimada: calcResult.recommendedPillar.duration,
        tiene_discrepancia: calcResult.hasContradiction ? 'SÍ' : 'NO',
        motivo_discrepancia: calcResult.contradictionAnalysis?.explanation || 'Sin discrepancia; objetivo alineado.',
        riesgo_de_saltarse_paso: calcResult.contradictionAnalysis?.riskOfSkipping || 'N/A',
        tiene_incoherencias_internas: calcResult.hasInternalIncoherence ? 'SÍ' : 'NO',
        total_incoherencias_detectadas: calcResult.detectedIncoherences.length,
        incoherencias_detalle: calcResult.detectedIncoherences
          .map((i) => `[${i.title}]: ${i.verdict} -> Verdad: ${i.revealedTruth}`)
          .join(' || ') || 'Ninguna incoherencia detectada.',
        lo_que_no_debe_hacer: calcResult.notFirstAdvice.warning,
        evidencias_clave: calcResult.evidences.join(' | '),
        resumen_ejecutivo: calcResult.strategicSummary,
        puntuacion_pilar1: calcResult.scores.pilar1,
        puntuacion_pilar2: calcResult.scores.pilar2,
        puntuacion_pilar3: calcResult.scores.pilar3,
        puntuacion_pilar4: calcResult.scores.pilar4,
        puntuaciones: calcResult.scores,
        fecha_evaluacion: new Date().toISOString()
      };

      // Intentar primero con Content-Type: application/json estándar
      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ghlPayload)
        });
      } catch (corsErr) {
        // En caso de que el navegador en iframe bloquee CORS en OPTIONS, emitir en fallback seguro
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(ghlPayload)
        });
      }
    } catch (err) {
      console.warn('Silent webhook dispatch log:', err);
    }
  };

  // Porcentaje de progreso
  const progressPercent =
    currentStep === 0 ? 5 : currentStep === 12 ? 100 : Math.round((currentStep / 11) * 95);

  const currentQuestion = PREDIAGNOSTIC_QUESTIONS.find((q) => q.stepNumber === currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Encabezado Corporativo CREA Y MONETIZA */}
      <div className="bg-[#080808] text-white rounded-2xl p-6 sm:p-8 mb-6 border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D7192B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D7192B] bg-[#D7192B]/10 px-2.5 py-1 rounded">
              METODOLOGÍA CREA Y MONETIZA®
            </span>
            <span className="text-xs text-gray-400 font-mono">Patricia Loaiza</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Prediagnóstico Consultoría Requerida
          </h1>
          <p className="text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
            Llevas años construyendo experiencia... pero algo no cierra. ¿Es visibilidad? ¿Automatización? ¿O tu oferta aún tiene cuellos de botella invisibles? Un diagnóstico de 3 minutos te lo revela — y te ahorra invertir en lo que no toca.
          </p>
        </div>

        {/* Barra de progreso interactiva */}
        <div className="mt-6 pt-4 border-t border-gray-800/80">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>
              {currentStep === 0
                ? 'Paso Inicial · Información de Contacto'
                : currentStep === 12
                ? 'Diagnóstico Completado'
                : `Pregunta ${currentStep} de 11 · ${currentQuestion?.category || ''}`}
            </span>
            <span className="font-mono font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#D7192B] h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alerta de Error */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2 animate-shake">
          <AlertTriangle className="w-4 h-4 text-[#D7192B] shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* PASO 0: DATOS DEL PROSPECTO (NOMBRE, CORREO, WHATSAPP) */}
      {/* ============================================================ */}
      {currentStep === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D7192B]">
                Paso 0 · Contexto Profesional
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                Antes de comenzar, cuéntame sobre ti
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Ingresa tus datos de contacto para personalizar tu diagnóstico y verificar la
                disponibilidad de tu Sesión Estratégica Gratuita.
              </p>
            </div>

            <form onSubmit={handleStartQuestions} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Nombre completo <span className="text-[#D7192B]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={lead.name}
                  onChange={handleLeadChange}
                  placeholder="Ej. Carlos Mendoza"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Correo electrónico <span className="text-[#D7192B]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={lead.email}
                  onChange={handleLeadChange}
                  placeholder="carlos@tuempresa.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  WhatsApp (con código de país) <span className="text-[#D7192B]">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={lead.whatsapp}
                  onChange={handleLeadChange}
                  placeholder="+57 300 123 4567"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Empresa o Negocio (opcional)
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={lead.company}
                    onChange={handleLeadChange}
                    placeholder="Ej. Mendoza Consultores"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Rol o Especialidad (opcional)
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={lead.role}
                    onChange={handleLeadChange}
                    placeholder="Ej. Consultor / Fundador"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#D7192B] hover:bg-[#b91222] text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <span>Comenzar Prediagnóstico (11 preguntas)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PASOS 1 AL 11: PREGUNTAS DE EVIDENCIA */}
      {/* ============================================================ */}
      {currentStep >= 1 && currentStep <= 11 && currentQuestion && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#D7192B]">
              {currentQuestion.category}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-1 leading-snug">
              {currentQuestion.question}
            </h3>
            {currentQuestion.hint && (
              <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200/80">
                💡 <strong className="text-gray-700">Criterio metodológico:</strong>{' '}
                {currentQuestion.hint}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelectOption(currentQuestion.id, opt.value)}
                  className={`cursor-pointer p-4 sm:p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                    isSelected
                      ? 'border-[#D7192B] bg-rose-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-400 bg-white'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#D7192B] bg-[#D7192B]' : 'border-gray-400 bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed font-medium">
                    {opt.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-[#D7192B] hover:bg-[#b91222] text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md"
            >
              <span>{currentStep === 11 ? 'Calcular Diagnóstico y Evidencia →' : 'Siguiente →'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PASO 12: RESUMEN CORTO, DISCREPANCIA Y FOMO DE ALTA CONVERSIÓN */}
      {/* ============================================================ */}
      {currentStep === 12 && result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* BANNER DE FOMO Y CUPOS LIMITADOS (ALTA URGENCIA) */}
          <div className="bg-gradient-to-r from-[#D7192B] to-[#990d1b] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-red-400/40 relative overflow-hidden animate-pulse-subtle">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Flame className="w-6 h-6 text-amber-300 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-black/40 text-amber-300 px-2 py-0.5 rounded">
                      BENEFICIO POR TIEMPO LIMITADO
                    </span>
                    <span className="text-xs font-mono font-bold text-white/90">
                      ⏱ Reserva activa: {formatTimer(timeLeft)}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-white mt-0.5">
                    ¡Solo los primeros 5 en agendar reciben la Sesión de Diagnóstico 100% GRATIS!
                  </h4>
                </div>
              </div>

              <div className="bg-black/40 rounded-xl px-3.5 py-2 text-right self-stretch sm:self-auto border border-white/10 shrink-0">
                <span className="text-[10px] text-gray-300 uppercase tracking-wider block font-bold">
                  Disponibilidad de Agenda
                </span>
                <span className="text-sm sm:text-base font-black text-amber-300 flex items-center justify-end gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>¡QUEDAN SOLO 2 CUPOS!</span>
                </span>
              </div>
            </div>

            {/* Barra visual de escasez (3 de 5 cupos tomados) */}
            <div className="mt-3.5 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between text-xs text-white/90 font-bold mb-1.5">
                <span>Cupos gratuitos reservados hoy: 3 de 5</span>
                <span className="text-amber-300 font-mono">60% de capacidad ocupada</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden p-0.5">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: '60%' }}
                />
              </div>
            </div>
          </div>

          {/* Bloque Superior: Resumen Ejecutivo y Perfil */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D7192B]" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#D7192B]">
                  Diagnóstico Estratégico para {result.lead.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                {result.lead.company ? `${result.lead.company} · ` : ''}{result.lead.whatsapp}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Perfil de Madurez Profesional
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-0.5">
                  {result.profile.title}
                </h2>
                <p className="text-sm font-semibold text-[#D7192B] mt-0.5">
                  "{result.profile.subtitle}"
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed max-w-2xl">
                  {result.profile.description}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs shrink-0 self-stretch sm:self-auto sm:w-64">
                <strong className="block text-gray-900 font-extrabold mb-1">Obstáculo Central:</strong>
                <p className="text-gray-600 leading-snug">{result.profile.corePain}</p>
                <strong className="block text-gray-900 font-extrabold mt-3 mb-1">
                  Paso Inmediato:
                </strong>
                <p className="text-gray-600 leading-snug">{result.profile.priorityNeed}</p>
              </div>
            </div>
          </div>

          {/* Bloque Central: Discrepancia Fáctica (Lo que el cliente cree querer vs lo que evidencia necesitar) */}
          <div
            className={`rounded-2xl border-2 p-6 sm:p-8 shadow-sm ${
              result.hasContradiction
                ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {result.hasContradiction ? (
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <span className="text-xs font-black uppercase tracking-wider">
                {result.hasContradiction
                  ? 'Verificación Fáctica: Discrepancia entre Deseo y Necesidad Real'
                  : 'Verificación Fáctica: Cimientos Alineados'}
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-black mb-2">
              {result.contradictionAnalysis
                ? result.contradictionAnalysis.title
                : 'Tu objetivo coincide con la necesidad estructural de tu negocio'}
            </h4>

            {/* Comparativa visual de dos cajas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="p-3.5 bg-white rounded-xl border border-gray-200">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500 block">
                  Lo que manifestaste buscar:
                </span>
                <span className="text-sm font-bold text-gray-800">{result.statedPillar.name}</span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border-2 border-[#D7192B] shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#D7192B] block">
                  Lo que la evidencia dictamina como prioridad:
                </span>
                <span className="text-sm font-extrabold text-gray-900">
                  {result.recommendedPillar.name}
                </span>
              </div>
            </div>

            {result.contradictionAnalysis && (
              <div className="space-y-3 text-xs sm:text-sm leading-relaxed mt-3">
                <p className="text-gray-800 font-medium">
                  {result.contradictionAnalysis.explanation}
                </p>
                <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200">
                  <strong className="text-amber-900 block font-bold mb-0.5">
                    ¿Por qué es indispensable este orden?
                  </strong>
                  <p className="text-gray-700">{result.contradictionAnalysis.riskOfSkipping}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bloque: Control de Veracidad y Auditoría de Incoherencias Fácticas */}
          {result.hasInternalIncoherence && (
            <div className="rounded-2xl border-2 border-red-500 bg-red-50/80 p-6 sm:p-8 shadow-sm text-red-950">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider text-red-700">
                  Control de Veracidad: {result.detectedIncoherences.length} Incoherencia(s) Fáctica(s) Detectada(s)
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-red-950 mb-1">
                Auditoría de Respuestas Cruzadas: Verificación de la Verdad Fáctica
              </h4>
              <p className="text-xs sm:text-sm text-red-900/90 leading-relaxed mb-4">
                Para proteger tu inversión y evitar que destines tiempo o dinero a etapas avanzadas sobre un cimiento frágil, nuestro algoritmo sometió tus respuestas a pruebas de estrés cruzadas. Se detectaron contradicciones entre lo que crees tener y lo que tus respuestas operativas revelan:
              </p>

              <div className="space-y-4">
                {result.detectedIncoherences.map((inc, index) => (
                  <div
                    key={inc.id || index}
                    className="bg-white rounded-xl border border-red-200 shadow-xs overflow-hidden"
                  >
                    <div className="bg-red-100/90 px-4 py-2.5 border-b border-red-200 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-red-950">
                        {index + 1}. {inc.title}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded ${
                          inc.severity === 'critica'
                            ? 'bg-red-700 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {inc.severity === 'critica' ? 'Severidad Crítica' : 'Incoherencia Alta'}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3.5">
                      {/* Comparación visual de afirmaciones enfrentadas */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                            En Pregunta {inc.statementA.questionNumber} ({inc.statementA.questionCategory}):
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-gray-800 italic">
                            "{inc.statementA.answerText}"
                          </div>
                        </div>

                        <div className="bg-red-50/70 rounded-lg p-3 border border-red-200">
                          <div className="text-[10px] font-bold text-red-700 uppercase tracking-wide mb-1">
                            Sin embargo, en Pregunta {inc.statementB.questionNumber} ({inc.statementB.questionCategory}):
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-red-950 italic">
                            "{inc.statementB.answerText}"
                          </div>
                        </div>
                      </div>

                      {/* Veredicto y verdad revelada */}
                      <div className="bg-neutral-900 text-white rounded-xl p-4 space-y-2.5 text-xs sm:text-sm">
                        <div>
                          <span className="text-amber-400 block text-[11px] uppercase tracking-wider font-black mb-0.5">
                            ⚖️ Veredicto del Algoritmo:
                          </span>
                          <p className="text-gray-200 leading-relaxed">{inc.verdict}</p>
                        </div>

                        <div className="pt-2 border-t border-neutral-800">
                          <span className="text-red-400 block text-[11px] uppercase tracking-wider font-black mb-0.5">
                            🔍 La Verdad Comercial que Prevalece:
                          </span>
                          <p className="text-gray-300 leading-relaxed font-medium">{inc.revealedTruth}</p>
                        </div>

                        <div className="pt-2 border-t border-neutral-800 text-xs text-emerald-400 font-semibold flex items-start gap-1.5">
                          <span className="shrink-0">🛡️</span>
                          <span><strong>Ajuste Fáctico Aplicado:</strong> {inc.actionRequired}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bloque de Servicio Recomendado */}
          <div className="bg-[#111111] text-white rounded-2xl border-4 border-[#D7192B] shadow-xl p-6 sm:p-8 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="bg-[#D7192B] text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded">
                SOLUCIÓN ESTRATÉGICA RECOMENDADA
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {result.recommendedPillar.categoryTag}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
              {result.recommendedPillar.name}
            </h3>
            <p className="text-base text-gray-300 font-medium mt-1">
              {result.recommendedPillar.serviceTitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="bg-black/60 border border-gray-800 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
                    Modalidad y Duración
                  </span>
                  <span className="text-sm font-extrabold text-white">
                    {result.recommendedPillar.duration}
                  </span>
                </div>
              </div>

              <div className="bg-black/60 border border-gray-800 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D7192B]/20 text-[#D7192B] flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
                    Alcance del Servicio
                  </span>
                  <span className="text-sm font-extrabold text-white">
                    {result.recommendedPillar.lessonsCount || `${result.recommendedPillar.phases.length} Fases`}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
              {result.recommendedPillar.description}
            </p>

            {/* Transformación */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#D7192B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold block mb-0.5">Transformación esperada:</strong>
                <span>{result.recommendedPillar.transformation}</span>
              </div>
            </div>
          </div>

          {/* Bloque de Evidencias Detectadas */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h4 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#D7192B]" />
              <span>Evidencias Fácticas Detectadas en tus Respuestas</span>
            </h4>
            <p className="text-xs text-gray-600 mb-4">
              Razones objetivas por las cuales no es conveniente avanzar a servicios posteriores sin resolver esto primero:
            </p>
            <ul className="space-y-2">
              {result.evidences.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-gray-800 bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-start gap-2.5"
                >
                  <span className="w-4 h-4 rounded-full bg-[#D7192B] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* LLAMADO A LA ACCIÓN PRINCIPAL (FOMO DE AGENDAMIENTO GOHIGHLEVEL) */}
          <div className="bg-gradient-to-br from-[#080808] via-[#141414] to-[#200508] text-white rounded-2xl border-3 border-[#D7192B] shadow-2xl p-6 sm:p-9 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-[#D7192B]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              
              <div className="inline-flex items-center gap-1.5 bg-[#D7192B]/20 text-[#D7192B] border border-[#D7192B]/50 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Solo 2 Cupos Gratuitos Restantes</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Asegura tu Sesión de Diagnóstico 1 a 1 sin Costo
              </h3>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-gray-300 max-w-lg mx-auto">
                <span className="text-gray-400 line-through mr-2">Precio regular: $250 USD</span>
                <span className="text-amber-300 font-extrabold text-sm uppercase tracking-wide">
                  GRATIS para las primeras 5 personas
                </span>
                <p className="mt-1 text-gray-300 text-[11px]">
                  Al completarse los 2 cupos de esta semana, el calendario se cerrará y la sesión volverá a su costo habitual.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl mx-auto">
                Durante esta sesión 1 a 1 de 30 minutos con Patricia Loaiza, analizaremos tus respuestas,
                desmontaremos el sesgo detectado y trazaremos el plan de acción para implementar{' '}
                <strong className="text-white">{result.recommendedPillar.name}</strong>.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getBookingUrlWithLead()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-9 py-4.5 rounded-xl bg-[#D7192B] hover:bg-[#b91222] text-white text-base font-black flex items-center justify-center gap-2.5 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 tracking-wide"
                >
                  <Calendar className="w-5 h-5" />
                  <span>RESERVAR UNO DE LOS 2 CUPOS GRATIS AHORA</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Acceso directo al calendario oficial de Patricia Loaiza · Sin compromiso</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
