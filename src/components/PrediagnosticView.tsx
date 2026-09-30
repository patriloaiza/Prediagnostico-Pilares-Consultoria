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
  Users,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  Ban
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
  calculatePrediagnostic,
  COMMERCIAL_MODELS_LABELS,
  PAYING_CLIENTS_LABELS
} from '../utils/prediagnosticLogic';
import { AutomatedTestsModal, TestCase } from './AutomatedTestsModal';

interface PrediagnosticViewProps {
  defaultWebhookUrl?: string;
  defaultBookingUrl?: string;
  onOpenTestModal?: () => void;
}

const OFFICIAL_WEBHOOK =
  'https://services.leadconnectorhq.com/hooks/skgSf0Kg3sY00t6Wdy38/webhook-trigger/75483c9f-2acf-41ee-9694-cebb8cdc4ab4';
const OFFICIAL_BOOKING = 'https://link.ghlespanol.com/widget/booking/aI6mS973gkCQmeyn08ST';

const envWebhook = (import.meta as any).env?.VITE_GHL_WEBHOOK_URL || OFFICIAL_WEBHOOK;
const envBooking = (import.meta as any).env?.VITE_GHL_BOOKING_URL || OFFICIAL_BOOKING;

export const PrediagnosticView: React.FC<PrediagnosticViewProps> = ({
  defaultWebhookUrl = envWebhook,
  defaultBookingUrl = envBooking,
  onOpenTestModal
}) => {
  const TOTAL_QUESTIONS = PREDIAGNOSTIC_QUESTIONS.length;
  const RESULTS_STEP = TOTAL_QUESTIONS + 1;

  // Estado del flujo: 0 = Contexto y Datos, 1..TOTAL_QUESTIONS = Preguntas, RESULTS_STEP = Resumen y Agendamiento
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);
  const [lead, setLead] = useState<UserLeadInfo>({
    name: '',
    email: '',
    whatsapp: '',
    profession: '',
    currentActivity: '',
    commercializationModel: 'servicios_1a1',
    payingClientsStatus: 'irregulares',
    company: '',
    role: ''
  });
  const [answers, setAnswers] = useState<PrediagnosticAnswers>({});
  const [result, setResult] = useState<PrediagnosticResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSendingWebhook, setIsSendingWebhook] = useState<boolean>(false);
  const [webhookSent, setWebhookSent] = useState<boolean>(false);

  // Temporizador de reserva de cupo (FOMO: 14 minutos 59 segundos)
  const [timeLeft, setTimeLeft] = useState<number>(14 * 60 + 59);

  // Parámetros de GoHighLevel (leídos desde URL o defaults oficiales)
  const [ghlWebhook, setGhlWebhook] = useState<string>(defaultWebhookUrl || OFFICIAL_WEBHOOK);
  const [ghlBookingUrl, setGhlBookingUrl] = useState<string>(defaultBookingUrl || OFFICIAL_BOOKING);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlHook = params.get('webhook') || params.get('ghl_webhook');
    const urlBooking = params.get('booking_url') || params.get('calendar_url');

    localStorage.removeItem('crea_monetiza_ghl_webhook');
    let savedBooking = localStorage.getItem('crea_monetiza_ghl_booking');

    if (savedBooking && !savedBooking.includes('aI6mS973gkCQmeyn08ST')) {
      localStorage.removeItem('crea_monetiza_ghl_booking');
      savedBooking = null;
    }

    const finalHook = urlHook || OFFICIAL_WEBHOOK;
    const finalBooking = urlBooking || savedBooking || OFFICIAL_BOOKING;

    setGhlWebhook(finalHook);
    setGhlBookingUrl(finalBooking);
  }, [defaultWebhookUrl, defaultBookingUrl]);

  // Garantizar envío automático al entrar al paso de resultados
  useEffect(() => {
    if (currentStep === RESULTS_STEP && result && !webhookSent && !isSendingWebhook) {
      executeWebhookDispatch(result, OFFICIAL_WEBHOOK);
    }
  }, [currentStep, result, webhookSent, isSendingWebhook, RESULTS_STEP]);

  // Pre-carga los datos del prospecto en el enlace del calendario de GoHighLevel
  const getBookingUrlWithLead = () => {
    const baseBooking = OFFICIAL_BOOKING;
    try {
      const url = new URL(baseBooking);
      if (lead.name) url.searchParams.set('name', lead.name.trim());
      if (lead.name) url.searchParams.set('first_name', lead.name.trim().split(' ')[0] || '');
      if (lead.name) url.searchParams.set('last_name', lead.name.trim().split(' ').slice(1).join(' ') || '');
      if (lead.email) url.searchParams.set('email', lead.email.trim());
      if (lead.whatsapp) url.searchParams.set('phone', lead.whatsapp.trim());
      return url.toString();
    } catch {
      return OFFICIAL_BOOKING;
    }
  };

  // Contador regresivo para aumentar urgencia una vez que se llega a resultados
  useEffect(() => {
    if (currentStep !== RESULTS_STEP) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep, RESULTS_STEP]);

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

  // Manejar cambio en inputs de texto
  const handleLeadChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  // Validar datos antes de avanzar desde el paso 0
  const handleStartQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = lead.name.trim();
    const cleanEmail = lead.email.trim();
    const cleanPhone = lead.whatsapp.trim().replace(/[^0-9+]/g, '');
    const cleanProfession = lead.profession.trim();
    const cleanActivity = lead.currentActivity.trim();

    if (!cleanName || cleanName.length < 3) {
      setErrorMessage('Por favor ingresa tu Nombre completo para personalizar tu diagnóstico.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Por favor ingresa un Correo electrónico válido.');
      return;
    }

    const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || digitsOnly.length < 7) {
      setErrorMessage('Por favor ingresa un número de WhatsApp válido (con código de país, ej. +57 300 123 4567).');
      return;
    }

    if (!cleanProfession || cleanProfession.length < 3) {
      setErrorMessage('Por favor indica tu Profesión o Área de Especialidad (ej. Abogado, Psicólogo, Mentor de Negocios, Ingeniero, etc.).');
      return;
    }

    if (!cleanActivity || cleanActivity.length < 5) {
      setErrorMessage('Por favor describe brevemente a qué te dedicas hoy y a quién ayudas para contextualizar tu evaluación.');
      return;
    }

    setErrorMessage(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Seleccionar una opción en preguntas
  const handleSelectOption = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrorMessage(null);
  };

  // Navegar a siguiente paso
  const handleNextStep = () => {
    if (currentStep >= 1 && currentStep <= TOTAL_QUESTIONS) {
      const qKey = `q${currentStep}`;
      if (!answers[qKey]) {
        setErrorMessage('Por favor selecciona una opción para avanzar.');
        return;
      }
    }

    setErrorMessage(null);
    if (currentStep === TOTAL_QUESTIONS) {
      const calc = calculatePrediagnostic(answers, lead);
      setResult(calc);
      setCurrentStep(RESULTS_STEP);

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

  // Cargar caso de prueba automatizado
  const handleApplyTestCase = (testCase: TestCase, viewResultsDirectly: boolean) => {
    setLead(testCase.lead);
    setAnswers(testCase.answers);
    setErrorMessage(null);

    if (viewResultsDirectly) {
      const calc = calculatePrediagnostic(testCase.answers, testCase.lead);
      setResult(calc);
      setCurrentStep(RESULTS_STEP);
    } else {
      setCurrentStep(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Despacho de Webhook hacia GoHighLevel
  const executeWebhookDispatch = async (calcResult: PrediagnosticResult, url?: string) => {
    const targetUrl = url || ghlWebhook || OFFICIAL_WEBHOOK;
    setIsSendingWebhook(true);

    try {
      const tagsList = [
        'prediagnostico-completado',
        calcResult.hasContradiction ? 'discrepancia-detectada' : 'cimiento-alineado',
        calcResult.hasInternalIncoherence ? 'incoherencia-interna-detectada' : 'coherencia-confirmada',
        `servicio-prioritario-${calcResult.recommendedPillar.id}`,
        calcResult.gatingAnalysis.isPilar4Blocked ? 'veto-sistematizacion-prematura' : 'viable-etapas-avanzadas'
      ];

      const modelLabel = COMMERCIAL_MODELS_LABELS[calcResult.lead.commercializationModel] || calcResult.lead.commercializationModel;
      const clientsLabel = PAYING_CLIENTS_LABELS[calcResult.lead.payingClientsStatus] || calcResult.lead.payingClientsStatus;

      const formattedNoteText = `📋 RESUMEN PREDIAGNÓSTICO ESTRATÉGICO CREA Y MONETIZA®
👤 Contacto: ${calcResult.lead.name}
🎓 Profesión: ${calcResult.lead.profession}
💼 Actividad Actual: ${calcResult.lead.currentActivity}
📦 Modelo Comercial: ${modelLabel}
👥 Clientes de Pago: ${clientsLabel}
🏢 Empresa: ${calcResult.lead.company || 'No especificada'}
📱 WhatsApp: ${calcResult.lead.whatsapp}
🎯 Perfil Evolutivo: ${calcResult.profile.title} ("${calcResult.profile.subtitle}")
--------------------------------------------------
🔍 SITUACIÓN Y SERVICIO RECOMENDADO:
• Servicio que busca: ${calcResult.statedPillar.name}
• SERVICIO PRIORITARIO REAL: ${calcResult.recommendedPillar.name}
• Programa Oficial: ${calcResult.recommendedPillar.serviceTitle} (${calcResult.recommendedPillar.duration})
⚠️ ¿TIENE DISCREPANCIA?: ${calcResult.hasContradiction ? 'SÍ' : 'NO'}
• Motivo Discrepancia: ${calcResult.contradictionAnalysis?.explanation || 'Sin discrepancia; objetivo alineado con la madurez actual.'}
• Riesgo de saltarse el paso: ${calcResult.contradictionAnalysis?.riskOfSkipping || 'N/A'}
🚨 AUDITORÍA DE PRERREQUISITOS:
• ¿Veto de Pilar 4 aplicado?: ${calcResult.gatingAnalysis.isPilar4Blocked ? 'SÍ (Bloqueado por falta de oferta validada o clientes recurrentes)' : 'NO'}
• ¿Veto de Pilar 3 aplicado?: ${calcResult.gatingAnalysis.isPilar3Blocked ? 'SÍ (Bloqueado por falta de oferta estructurada)' : 'NO'}
⛔ LO QUE NO DEBE HACER:
${calcResult.notFirstAdvice.warning}

🔎 EVIDENCIAS CLAVE DETECTADAS:
${calcResult.evidences.map((e) => `• ${e}`).join('\n')}

📊 PUNTUACIONES:
• Pilar 1 (Estrategia y Oferta BMS): ${calcResult.scores.pilar1} pts
• Pilar 2 (Marca Personal & Autoridad): ${calcResult.scores.pilar2} pts
• Pilar 3 (Viral Sales Content): ${calcResult.scores.pilar3} pts
• Pilar 4 (Digital Business Day & IA): ${calcResult.scores.pilar4} pts`;

      const ghlPayload: Record<string, any> = {
        name: calcResult.lead.name.trim(),
        full_name: calcResult.lead.name.trim(),
        first_name: calcResult.lead.name.trim().split(' ')[0] || '',
        last_name: calcResult.lead.name.trim().split(' ').slice(1).join(' ') || '',
        email: calcResult.lead.email.trim(),
        phone: calcResult.lead.whatsapp.trim(),
        whatsapp: calcResult.lead.whatsapp.trim(),
        
        // Datos profesionales contextuales
        profesion: calcResult.lead.profession,
        profession: calcResult.lead.profession,
        'profesion o especialidad': calcResult.lead.profession,
        actividad_actual: calcResult.lead.currentActivity,
        'a que se dedica': calcResult.lead.currentActivity,
        current_activity: calcResult.lead.currentActivity,
        modelo_comercializacion: modelLabel,
        'modelo de comercializacion': modelLabel,
        commercial_model: modelLabel,
        estado_clientes_pago: clientsLabel,
        'clientes de pago': clientsLabel,
        paying_clients_status: clientsLabel,

        // Texto consolidado para Nota de GHL
        resumen_ejecutivo: formattedNoteText,
        'Resumen Ejecutivo': formattedNoteText,
        'resumen ejecutivo': formattedNoteText,
        resumen_completo: formattedNoteText,
        nota_completa: formattedNoteText,
        resumen: formattedNoteText,
        note: formattedNoteText,
        notes: formattedNoteText,
        nota: formattedNoteText,
        body: formattedNoteText,
        body_text: formattedNoteText,
        comentarios: formattedNoteText,
        observaciones: formattedNoteText,
        
        // Empresa y rol
        'company name': calcResult.lead.company || 'No especificada',
        company_name: calcResult.lead.company || 'No especificada',
        role: calcResult.lead.role || calcResult.lead.profession,
        
        // Perfil y diagnóstico
        'perfil profesional': calcResult.profile.title,
        perfil_profesional: calcResult.profile.title,
        'perfil subtitulo': calcResult.profile.subtitle,
        perfil_subtitulo: calcResult.profile.subtitle,
        
        // Servicios
        'servicio deseado': calcResult.statedPillar.name,
        servicio_deseado: calcResult.statedPillar.name,
        'servicio recomendado': calcResult.recommendedPillar.name,
        servicio_recomendado: calcResult.recommendedPillar.name,
        'programa oficial': calcResult.recommendedPillar.serviceTitle,
        programa_oficial: calcResult.recommendedPillar.serviceTitle,
        'duracion estimada': calcResult.recommendedPillar.duration,
        duracion_estimada: calcResult.recommendedPillar.duration,
        
        // Análisis de discrepancia y gating
        'tiene discrepancia': calcResult.hasContradiction ? 'SÍ' : 'NO',
        tiene_discrepancia: calcResult.hasContradiction ? 'SÍ' : 'NO',
        'motivo discrepancia': calcResult.contradictionAnalysis?.explanation || 'Sin discrepancia; objetivo alineado con la madurez actual.',
        motivo_discrepancia: calcResult.contradictionAnalysis?.explanation || 'Sin discrepancia; objetivo alineado con la madurez actual.',
        'riesgo de saltarse paso': calcResult.contradictionAnalysis?.riskOfSkipping || 'N/A',
        riesgo_de_saltarse_paso: calcResult.contradictionAnalysis?.riskOfSkipping || 'N/A',
        'lo que no debe hacer': calcResult.notFirstAdvice.warning,
        lo_que_no_debe_hacer: calcResult.notFirstAdvice.warning,
        veto_pilar4_aplicado: calcResult.gatingAnalysis.isPilar4Blocked ? 'SÍ' : 'NO',
        veto_pilar3_aplicado: calcResult.gatingAnalysis.isPilar3Blocked ? 'SÍ' : 'NO',
        
        // Tags
        tags: tagsList.join(','),
        tags_array: tagsList,
        
        // Incoherencias y evidencias
        tiene_incoherencias_internas: calcResult.hasInternalIncoherence ? 'SÍ' : 'NO',
        total_incoherencias_detectadas: calcResult.detectedIncoherences.length,
        incoherencias_detalle: calcResult.detectedIncoherences
          .map((i) => `[${i.title}]: ${i.verdict} -> Verdad: ${i.revealedTruth}`)
          .join(' || ') || 'Ninguna incoherencia detectada.',
        evidencias_clave: calcResult.evidences.join(' | '),
        
        // Puntajes de los 4 pilares
        puntuacion_pilar1: calcResult.scores.pilar1,
        puntuacion_pilar2: calcResult.scores.pilar2,
        puntuacion_pilar3: calcResult.scores.pilar3,
        puntuacion_pilar4: calcResult.scores.pilar4,
        puntuaciones: calcResult.scores,
        fecha_evaluacion: new Date().toISOString()
      };

      let dispatched = false;

      try {
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ghlPayload),
          keepalive: true
        });
        if (res.ok || res.status < 400) {
          dispatched = true;
          setWebhookSent(true);
        }
      } catch (jsonErr) {
        console.warn('Fetch JSON delivery fallback:', jsonErr);
      }

      if (!dispatched && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        try {
          const blob = new Blob([JSON.stringify(ghlPayload)], { type: 'application/json' });
          const beaconSuccess = navigator.sendBeacon(targetUrl, blob);
          if (beaconSuccess) {
            dispatched = true;
            setWebhookSent(true);
          }
        } catch (_) {}
      }

      if (!dispatched && typeof document !== 'undefined') {
        try {
          const frameName = 'ghl_delivery_frame_' + Date.now();
          const hiddenIframe = document.createElement('iframe');
          hiddenIframe.name = frameName;
          hiddenIframe.style.display = 'none';
          hiddenIframe.style.position = 'absolute';
          hiddenIframe.style.width = '0';
          hiddenIframe.style.height = '0';
          hiddenIframe.style.border = '0';
          document.body.appendChild(hiddenIframe);

          const form = document.createElement('form');
          form.method = 'POST';
          form.action = targetUrl;
          form.target = frameName;
          form.style.display = 'none';

          Object.entries(ghlPayload).forEach(([key, val]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = typeof val === 'object' ? JSON.stringify(val) : String(val);
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
          setWebhookSent(true);

          setTimeout(() => {
            try {
              if (document.body.contains(form)) document.body.removeChild(form);
              if (document.body.contains(hiddenIframe)) document.body.removeChild(hiddenIframe);
            } catch (_) {}
          }, 4000);
        } catch (domErr) {
          console.warn('DOM form delivery log:', domErr);
        }
      }
    } catch (err) {
      console.warn('Webhook dispatch caught:', err);
    } finally {
      setIsSendingWebhook(false);
    }
  };

  // Porcentaje de progreso
  const progressPercent =
    currentStep === 0
      ? 5
      : currentStep === RESULTS_STEP
      ? 100
      : Math.round((currentStep / TOTAL_QUESTIONS) * 95);

  const currentQuestion = PREDIAGNOSTIC_QUESTIONS.find((q) => q.stepNumber === currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Encabezado Corporativo CREA Y MONETIZA */}
      <div className="bg-[#080808] text-white rounded-2xl p-6 sm:p-8 mb-6 border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D7192B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D7192B] bg-[#D7192B]/10 px-2.5 py-1 rounded">
                METODOLOGÍA CREA Y MONETIZA®
              </span>
              <span className="text-xs text-gray-400 font-mono">Patricia Loaiza</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onOpenTestModal) onOpenTestModal();
                else setIsTestModalOpen(true);
              }}
              className="text-[11px] text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 border border-white/10"
              title="Abrir panel de pruebas y escenarios de demostración"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Modo Pruebas / Escenarios</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Prediagnóstico Consultoría Requerida
          </h1>
          <p className="text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
            Llevas años construyendo experiencia... pero algo no cierra. ¿Es visibilidad? ¿Automatización? ¿O tu oferta aún tiene cuellos de botella invisibles? Nuestro motor de auditoría de evidencias te revela la verdad exacta — y te protege de invertir en lo que no toca.
          </p>
        </div>

        {/* Barra de progreso interactiva */}
        <div className="mt-6 pt-4 border-t border-gray-800/80">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>
              {currentStep === 0
                ? 'Paso Inicial · Contexto Profesional y Comercial'
                : currentStep === RESULTS_STEP
                ? 'Diagnóstico Completado'
                : `Pregunta ${currentStep} de ${TOTAL_QUESTIONS} · ${currentQuestion?.category || ''}`}
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
      {/* PASO 0: DATOS DE CONTACTO Y CONTEXTO PROFESIONAL/COMERCIAL */}
      {/* ============================================================ */}
      {currentStep === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D7192B]">
                Paso 0 · Contexto Profesional & Comercial
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                Antes de comenzar, cuéntanos sobre tu actividad
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl mx-auto">
                Para que la auditoría sea matemáticamente precisa y evite errores de interpretación sobre tu modelo, necesitamos conocer tu perfil, qué comercializas hoy y tu estado real de clientes.
              </p>
            </div>

            <form onSubmit={handleStartQuestions} className="space-y-5">
              {/* Bloque 1: Datos Personales */}
              <div className="bg-gray-50/80 p-4 sm:p-5 rounded-xl border border-gray-200 space-y-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#D7192B]" />
                  <span>1. Datos de Contacto Directo</span>
                </span>

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
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      WhatsApp (con indicativo de país) <span className="text-[#D7192B]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={lead.whatsapp}
                      onChange={handleLeadChange}
                      placeholder="+57 300 123 4567"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bloque 2: Profesión y Actividad Exacta */}
              <div className="bg-gray-50/80 p-4 sm:p-5 rounded-xl border border-gray-200 space-y-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D7192B]" />
                  <span>2. Tu Profesión y Propósito</span>
                </span>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    ¿Cuál es tu profesión o área de conocimiento? <span className="text-[#D7192B]">*</span>
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={lead.profession}
                    onChange={handleLeadChange}
                    placeholder="Ej. Abogado Corporativo, Psicólogo Clínico, Mentor de Negocios, Diseñador, etc."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all bg-white"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Tu disciplina o especialidad técnica principal.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    ¿A qué te dedicas exactamente hoy y a quién ayudas? <span className="text-[#D7192B]">*</span>
                  </label>
                  <textarea
                    name="currentActivity"
                    value={lead.currentActivity}
                    onChange={handleLeadChange}
                    rows={2}
                    placeholder="Ej. Asesoro a pymes a estructurar sus finanzas, o doy terapia individual a ejecutivos con burnout..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all bg-white resize-none"
                  />
                </div>
              </div>

              {/* Bloque 3: Modelo Comercial y Situación de Clientes */}
              <div className="bg-gray-50/80 p-4 sm:p-5 rounded-xl border border-gray-200 space-y-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#D7192B]" />
                  <span>3. Modelo de Comercialización & Situación con Clientes</span>
                </span>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    ¿Cuál es tu modelo actual de comercialización? <span className="text-[#D7192B]">*</span>
                  </label>
                  <select
                    name="commercializationModel"
                    value={lead.commercializationModel}
                    onChange={handleLeadChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all bg-white"
                  >
                    <option value="servicios_1a1">
                      Presto servicios profesionales o consultoría personalizada 1 a 1
                    </option>
                    <option value="infoproductos_cursos">
                      Comercializo cursos grabados, talleres o productos digitales (infoproductos)
                    </option>
                    <option value="productos_fisicos">
                      Comercializo productos físicos o dirijo un negocio comercial / agencia con equipo
                    </option>
                    <option value="servicios_y_productos">
                      Ofrezco una combinación de servicios 1 a 1 y cursos/talleres
                    </option>
                    <option value="aun_no_comercializo">
                      Aún no comercializo servicios ni productos (fase de idea, reinvención o lanzamiento)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    ¿Cuál es tu situación real con clientes de pago hoy? <span className="text-[#D7192B]">*</span>
                  </label>
                  <select
                    name="payingClientsStatus"
                    value={lead.payingClientsStatus}
                    onChange={handleLeadChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#D7192B] focus:border-transparent transition-all bg-white"
                  >
                    <option value="activos_recurrentes">
                      Tengo clientes de pago recurrentes y agenda activa constante
                    </option>
                    <option value="irregulares">
                      Tengo clientes esporádicos o irregulares (meses buenos y meses en cero)
                    </option>
                    <option value="pocos_pasados">
                      He tenido pocos clientes en el pasado; actualmente me cuesta cerrar nuevos
                    </option>
                    <option value="sin_clientes">
                      Aún no he tenido mi primer cliente de pago en este negocio
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Empresa o Marca Comercial (opcional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={lead.company}
                      onChange={handleLeadChange}
                      placeholder="Ej. Mendoza Consultores"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-gray-900 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D7192B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Cargo o Rol (opcional)
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={lead.role}
                      onChange={handleLeadChange}
                      placeholder="Ej. Fundador / Consultor Principal"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-gray-900 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D7192B]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-[#D7192B] hover:bg-[#b91222] text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 tracking-wide"
                >
                  <span>Iniciar Auditoría de Cimientos ({TOTAL_QUESTIONS} Preguntas)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tus datos son 100% confidenciales. Sin spam ni venta de información.</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PASOS 1 AL TOTAL_QUESTIONS: PREGUNTAS DE AUDITORÍA Y VERIFICACIÓN */}
      {/* ============================================================ */}
      {currentStep >= 1 && currentStep <= TOTAL_QUESTIONS && currentQuestion && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#D7192B]">
                {currentQuestion.category}
              </span>
              <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                Paso {currentStep} / {TOTAL_QUESTIONS}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-1 leading-snug">
              {currentQuestion.question}
            </h3>
            {currentQuestion.hint && (
              <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200/80 leading-relaxed">
                💡 <strong className="text-gray-800">Criterio metodológico:</strong>{' '}
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
              <span>{currentStep === TOTAL_QUESTIONS ? 'Calcular Diagnóstico y Evidencia →' : 'Siguiente →'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PASO FINAL: RESULTADOS, VERIFICACIÓN DE SESGOS Y AGENDAMIENTO */}
      {/* ============================================================ */}
      {currentStep === RESULTS_STEP && result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* BANNER DE FOMO Y CUPOS LIMITADOS */}
          <div className="bg-gradient-to-r from-[#D7192B] to-[#990d1b] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-red-400/40 relative overflow-hidden">
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

          {/* Bloque Superior: Ficha del Prospecto y Perfil de Madurez */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D7192B]" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#D7192B]">
                  Diagnóstico Personalizado para {result.lead.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                {result.lead.company ? `${result.lead.company} · ` : ''}{result.lead.whatsapp}
              </span>
            </div>

            {/* Ficha de Contexto Comercial Verificado */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-gray-500 uppercase tracking-wider font-bold block text-[10px]">
                  Profesión / Área:
                </span>
                <strong className="text-gray-900 font-extrabold text-xs block truncate">
                  {result.lead.profession}
                </strong>
              </div>
              <div>
                <span className="text-gray-500 uppercase tracking-wider font-bold block text-[10px]">
                  Actividad Actual:
                </span>
                <p className="text-gray-800 text-xs font-medium line-clamp-2">
                  {result.lead.currentActivity}
                </p>
              </div>
              <div>
                <span className="text-gray-500 uppercase tracking-wider font-bold block text-[10px]">
                  Modelo Comercial:
                </span>
                <span className="text-gray-800 text-xs font-medium block">
                  {COMMERCIAL_MODELS_LABELS[result.lead.commercializationModel] || result.lead.commercializationModel}
                </span>
              </div>
              <div>
                <span className="text-gray-500 uppercase tracking-wider font-bold block text-[10px]">
                  Clientes de Pago:
                </span>
                <span className="text-gray-800 text-xs font-medium block">
                  {PAYING_CLIENTS_LABELS[result.lead.payingClientsStatus] || result.lead.payingClientsStatus}
                </span>
              </div>
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

          {/* BANNER ESTRATÉGICO: CONSEJO CLAVE PARA PROTEGER TU NEGOCIO */}
          {result.gatingAnalysis.isPilar4Blocked && result.statedPillar.id === 'pilar4' && (
            <div className="bg-neutral-900 border-2 border-[#D7192B] rounded-2xl p-5 text-white shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#D7192B] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#D7192B] text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                      💡 CONSEJO ESTRATÉGICO CLAVE
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      El orden más inteligente para maximizar tus resultados
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">
                    Por qué te conviene consolidar una Oferta Irresistible antes de Sistematizar
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Notamos que tu gran meta es la sistematización, activos digitales y agentes de IA. ¡Es un objetivo extraordinario! Sin embargo, la experiencia nos demuestra que automatizar un servicio que aún no se vende con fluidez manual suele generar gastos y desgaste innecesario. Para cuidar tu inversión y asegurar resultados reales, te proponemos construir primero tu cimiento comercial en el <strong>Pilar 1 (Estrategia Comercial & Oferta BMS)</strong>. Una vez que tengas clientes satisfechos comprándote con regularidad, sistematizar será un paso rápido, fluido y verdaderamente rentable.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bloque Central: Alineación Estratégica de Enfoque */}
          <div
            className={`rounded-2xl border-2 p-6 sm:p-8 shadow-sm ${
              result.hasContradiction
                ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {result.hasContradiction ? (
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <span className="text-xs font-black uppercase tracking-wider">
                {result.hasContradiction
                  ? '🎯 ANÁLISIS DE ENFOQUE: TU RUTA MÁS RÁPIDA AL CRECIMIENTO'
                  : '✅ ENFOQUE ESTRATÉGICO 100% ALINEADO'}
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-black mb-2">
              {result.contradictionAnalysis
                ? result.contradictionAnalysis.title
                : 'Tu objetivo coincide perfectamente con lo que tu negocio necesita para crecer'}
            </h4>

            {/* Comparativa visual de dos cajas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="p-3.5 bg-white rounded-xl border border-gray-200">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500 block">
                  Tu idea o interés inicial:
                </span>
                <span className="text-sm font-bold text-gray-800">{result.statedPillar.name}</span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border-2 border-[#D7192B] shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#D7192B] block">
                  El paso que hoy te dará mayor rentabilidad y tranquilidad:
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
                    ¿Por qué este es el camino más inteligente y seguro?
                  </strong>
                  <p className="text-gray-700">{result.contradictionAnalysis.riskOfSkipping}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bloque: Hallazgos Clave para Acelerar tus Resultados */}
          {result.hasInternalIncoherence && (
            <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/60 p-6 sm:p-8 shadow-sm text-gray-900">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#D7192B] shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider text-[#D7192B]">
                  Claves de Crecimiento: {result.detectedIncoherences.length} Oportunidad(es) Identificada(s)
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-gray-900 mb-1">
                Hallazgos Clave para Acelerar tus Resultados y Cuidar tu Inversión
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                Al analizar tus respuestas en conjunto, identificamos puntos ciegos comunes que suelen frenar a profesionales talentosos. Conocerlos a tiempo te ahorra meses de esfuerzo y te permite enfocar tu energía donde realmente verás ingresos:
              </p>

              <div className="space-y-4">
                {result.detectedIncoherences.map((inc, index) => (
                  <div
                    key={inc.id || index}
                    className="bg-white rounded-xl border border-amber-200 shadow-xs overflow-hidden"
                  >
                    <div className="bg-amber-100/70 px-4 py-2.5 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-gray-900">
                        {index + 1}. {inc.title}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded ${
                          inc.severity === 'critica'
                            ? 'bg-[#D7192B] text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {inc.severity === 'critica' ? 'Oportunidad Clave' : 'Ajuste Recomendado'}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                            Tu perspectiva inicial ({inc.statementA.questionCategory}):
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-gray-800 italic">
                            "{inc.statementA.answerText}"
                          </div>
                        </div>

                        <div className="bg-amber-50/70 rounded-lg p-3 border border-amber-200">
                          <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wide mb-1">
                            La realidad actual de tu negocio ({inc.statementB.questionCategory}):
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-gray-900 italic">
                            "{inc.statementB.answerText}"
                          </div>
                        </div>
                      </div>

                      <div className="bg-neutral-900 text-white rounded-xl p-4 space-y-2.5 text-xs sm:text-sm">
                        <div>
                          <span className="text-amber-400 block text-[11px] uppercase tracking-wider font-black mb-0.5">
                            💡 Lectura Estratégica:
                          </span>
                          <p className="text-gray-200 leading-relaxed">{inc.verdict}</p>
                        </div>

                        <div className="pt-2 border-t border-neutral-800">
                          <span className="text-emerald-400 block text-[11px] uppercase tracking-wider font-black mb-0.5">
                            🌱 El Secreto para Crecer con Seguridad:
                          </span>
                          <p className="text-gray-300 leading-relaxed font-medium">{inc.revealedTruth}</p>
                        </div>

                        <div className="pt-2 border-t border-neutral-800 text-xs text-amber-300 font-semibold flex items-start gap-1.5">
                          <span className="shrink-0">🚀</span>
                          <span><strong>Tu Próximo Paso Recomendado:</strong> {inc.actionRequired}</span>
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

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#D7192B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold block mb-0.5">Transformación esperada:</strong>
                <span>{result.recommendedPillar.transformation}</span>
              </div>
            </div>
          </div>

          {/* Bloque de Claves y Factores Estratégicos Detectados */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h4 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D7192B]" />
              <span>Claves Identificadas en tus Respuestas</span>
            </h4>
            <p className="text-xs text-gray-600 mb-4">
              Factores que confirman por qué este es el momento idóneo para concentrar tu energía en este pilar:
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
                Durante esta sesión 1 a 1 de 30 minutos con Patricia Loaiza, profundizaremos en estos hallazgos,
                resolveremos tus dudas puntuales y trazaremos tu hoja de ruta personalizada para implementar{' '}
                <strong className="text-white">{result.recommendedPillar.name}</strong>.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getBookingUrlWithLead()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (result && !webhookSent) {
                      executeWebhookDispatch(result, ghlWebhook);
                    }
                  }}
                  className="w-full sm:w-auto px-9 py-4.5 rounded-xl bg-[#D7192B] hover:bg-[#b91222] text-white text-base font-black flex items-center justify-center gap-2.5 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 tracking-wide"
                >
                  <Calendar className="w-5 h-5" />
                  <span>RESERVAR UNO DE LOS 2 CUPOS GRATIS AHORA</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              <div className="flex flex-col items-center justify-center gap-1.5 pt-1">
                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Acceso directo al calendario oficial de Patricia Loaiza · Sin compromiso</span>
                </div>
                {webhookSent ? (
                  <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20">
                    <span>✓ Diagnóstico registrado en el sistema</span>
                  </div>
                ) : isSendingWebhook ? (
                  <div className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-white/5 px-3 py-0.5 rounded-full">
                    <span>Registrando diagnóstico con tu asesor...</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pruebas Automatizadas y Verificación de Sesgos */}
      <AutomatedTestsModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onApplyCase={handleApplyTestCase}
      />
    </div>
  );
};
