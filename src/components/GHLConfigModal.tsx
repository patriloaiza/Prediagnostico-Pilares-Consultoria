import React, { useState } from 'react';
import {
  Settings,
  X,
  CheckCircle2,
  Copy,
  Send,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  Mail,
  GitFork,
  Clock,
  Calendar,
  Check,
  FileText,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { OFFICIAL_ADMIN_EMAIL } from '../utils/ghlEmailTemplate';

interface GHLConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhookUrl: string;
  onSaveWebhookUrl: (url: string) => void;
  bookingUrl: string;
  onSaveBookingUrl: (url: string) => void;
  onSendTestLead: () => Promise<boolean>;
}

export const GHLConfigModal: React.FC<GHLConfigModalProps> = ({
  isOpen,
  onClose,
  webhookUrl,
  onSaveWebhookUrl,
  bookingUrl,
  onSaveBookingUrl,
  onSendTestLead
}) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'templates' | 'setup'>('workflow');
  const [localWebhook, setLocalWebhook] = useState(webhookUrl);
  const [localBooking, setLocalBooking] = useState(bookingUrl);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWebhookUrl(localWebhook.trim());
    onSaveBookingUrl(localBooking.trim());
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleTest = async () => {
    setIsSendingTest(true);
    setTestResult('idle');
    try {
      const ok = await onSendTestLead();
      setTestResult(ok ? 'success' : 'error');
    } catch {
      setTestResult('error');
    } finally {
      setIsSendingTest(false);
    }
  };

  const emailTemplateNoBooking = `Hola {{contact.first_name}},

Gracias por completar tu Prediagnóstico Estratégico en Crea y Monetiza®.

Aquí tienes el resultado de tu evaluación:

--------------------------------------------------
🎯 PERFIL DETECTADO:
{{inboundWebhookRequest.perfil_profesional}}

🏆 SERVICIO PRIORITARIO RECOMENDADO:
{{inboundWebhookRequest.servicio_recomendado}}
Programa Oficial: {{inboundWebhookRequest.programa_oficial}}

⚠️ MOTIVO Y CUELLO DE BOTELLA:
{{inboundWebhookRequest.motivo_discrepancia}}

⛔ LO QUE NO DEBES HACER AHORA:
{{inboundWebhookRequest.lo_que_no_debe_hacer}}
--------------------------------------------------

Noté que aún no has reservado tu Sesión 1 a 1 Gratuita (valorada en $250 USD) para repasar estos resultados y diseñar tu plan de acción a la medida.

He reservado temporalmente 1 cupo para ti. Puedes agendar el día y la hora que mejor te acomode en el siguiente enlace:

👉 Agendar mi Sesión Gratuita:
${bookingUrl || '{{inboundWebhookRequest.enlace_calendario}}'}

¡Nos vemos en la sesión!

Patricia Loaiza
Crea y Monetiza®
Email de contacto: ${OFFICIAL_ADMIN_EMAIL}`;

  const emailTemplateYesBooking = `Hola {{contact.first_name}},

¡Tu cita para la Sesión Estratégica 1 a 1 está confirmada! 🎉

📅 Fecha y Hora de tu sesión: {{appointment.start_time}}
🔗 Enlace de la reunión: {{appointment.meeting_location}}

Para aprovechar al máximo nuestros 30 minutos juntos, he preparado una copia del resultado de tu Prediagnóstico que analizaremos a fondo:

--------------------------------------------------
🎯 PERFIL DETECTADO:
{{inboundWebhookRequest.perfil_profesional}}

🏆 SERVICIO PRIORITARIO RECOMENDADO:
{{inboundWebhookRequest.servicio_recomendado}} ({{inboundWebhookRequest.programa_oficial}})

⚠️ ANÁLISIS ESTRATÉGICO:
{{inboundWebhookRequest.motivo_discrepancia}}

⛔ LO QUE NO DEBES HACER:
{{inboundWebhookRequest.lo_que_no_debe_hacer}}
--------------------------------------------------

Ten a mano este correo el día de nuestra sesión. Revisaremos exactamente cómo destrabar tu facturación y escalar tus servicios de alto valor.

¡Nos vemos pronto!

Patricia Loaiza
Crea y Monetiza®
Copia enviada a: ${OFFICIAL_ADMIN_EMAIL}`;

  const emailTemplateAllInOne = `Hola {{contact.first_name}},

Aquí tienes el informe completo y consolidado de tu Prediagnóstico Estratégico en Crea y Monetiza®:

{{inboundWebhookRequest.resumen_ejecutivo}}

--------------------------------------------------
👉 Reserva aquí tu Sesión Estratégica 1 a 1 de 30 minutos (Sin Costo):
${bookingUrl || '{{inboundWebhookRequest.enlace_calendario}}'}
--------------------------------------------------

Patricia Loaiza · Crea y Monetiza®`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Cabecera */}
        <div className="bg-[#111111] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-[#D7192B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D7192B] flex items-center justify-center text-white shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Guía de Automatización en GoHighLevel (GHL)
              </h3>
              <p className="text-xs text-gray-300">
                Envío de copias del diagnóstico al prospecto con copia a <strong className="text-white">{OFFICIAL_ADMIN_EMAIL}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-2.5 font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'workflow'
                ? 'border-[#D7192B] text-[#D7192B] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>1. Estructura del Workflow (Si Agendó vs No Agendó)</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2.5 font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'templates'
                ? 'border-[#D7192B] text-[#D7192B] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Plantillas de Correo Listas</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2.5 font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'setup'
                ? 'border-[#D7192B] text-[#D7192B] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>3. Conexión & Prueba en Vivo</span>
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs space-y-6">

          {/* TAB 1: ESTRUCTURA DEL WORKFLOW */}
          {activeTab === 'workflow' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  ¿Cómo hacer que envíe el diagnóstico y diferencie si agendó o no?
                </h4>
                <p className="text-amber-800 leading-relaxed text-xs">
                  En este momento el correo llega solo cuando no agenda porque no tiene una <strong>bifurcación (If/Else)</strong> con un tiempo de espera para que la persona complete el calendario. Además, no se incluye el diagnóstico porque falta insertar la variable del resultado en el correo. Aquí tienes el flujo exacto paso a paso:
                </p>
              </div>

              {/* Diagrama de Pasos */}
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h5 className="font-extrabold text-gray-900 text-xs">
                      Disparador (Trigger): Inbound Webhook
                    </h5>
                    <p className="text-gray-600 text-[11px] mt-0.5 leading-relaxed">
                      El prospecto termina el prediagnóstico y la app envía inmediatamente todos sus datos y su resultado a tu webhook de GHL.
                    </p>
                  </div>
                </div>

                <div className="border-2 border-indigo-300 rounded-xl p-3.5 bg-indigo-50/70 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h5 className="font-extrabold text-indigo-950 text-xs">
                      Paso Clave: Guardar el Diagnóstico en el Contacto (Update Contact Field)
                    </h5>
                    <p className="text-indigo-900 text-[11px] mt-0.5 leading-relaxed">
                      Crea un Custom Field de tipo <strong>Texto Largo (Multi-line)</strong> llamado <code>Resumen Diagnóstico</code>. 
                      Agrega la acción <strong>Update Contact Field</strong> asignando <code>{'{{inboundWebhookRequest.resumen_ejecutivo}}'}</code> a ese campo.
                      <br />
                      <strong>¿Por qué es indispensable?</strong> Porque cuando la persona agenda después en el calendario, GoHighLevel solo puede leer datos guardados en el contacto con <code>{'{{contact.resumen_diagnostico}}'}</code>.
                    </p>
                  </div>
                </div>

                <div className="border border-blue-200 rounded-xl p-3.5 bg-blue-50/70 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h5 className="font-extrabold text-blue-950 text-xs">
                      Acción Clave: Wait (Esperar 15 o 20 minutos)
                    </h5>
                    <p className="text-blue-900 text-[11px] mt-0.5 leading-relaxed">
                      <strong>¡El secreto para no enviar el correo equivocado!</strong> Dale al usuario 15 minutos para que revise su informe en pantalla y seleccione su fecha en el calendario. Sin este tiempo de espera, GHL enviaría de inmediato el correo de "no agendaste" mientras la persona apenas está mirando los horarios.
                    </p>
                  </div>
                </div>

                <div className="border border-purple-200 rounded-xl p-4 bg-purple-50/60">
                  <div className="flex items-center gap-2 font-extrabold text-purple-950 text-xs mb-2">
                    <GitFork className="w-4 h-4 text-purple-700" />
                    <span>Acción: Condición If / Else (Bifurcación en GHL)</span>
                  </div>
                  <p className="text-purple-900 text-[11px] mb-3 leading-relaxed">
                    Crea una condición llamada <strong>¿Agendó Cita?</strong> evaluando:  
                    <br />
                    <em>Contact Details → Tags includes "cita-agendada"</em>  
                    <strong> O </strong>  
                    <em>Appointment Status is Confirmed</em>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {/* Rama SI */}
                    <div className="bg-white border-2 border-emerald-400 rounded-xl p-3 shadow-xs">
                      <div className="flex items-center gap-1.5 font-black text-emerald-800 text-xs mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>RAMA SÍ (Si Agendó Cita)</span>
                      </div>
                      <p className="text-[11px] text-gray-700 leading-relaxed mb-2">
                        Agrega la acción <strong>Send Email</strong> con el asunto:  
                        <br />
                        <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[10px] text-gray-900">
                          ¡Cita confirmada! + Tu Diagnóstico Estratégico
                        </span>
                      </p>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[10px] text-emerald-900 space-y-1">
                        <div><strong>Para:</strong> {'{{contact.email}}'}</div>
                        <div><strong>Cc (Copia):</strong> <span className="font-mono select-all bg-white px-1 rounded">{OFFICIAL_ADMIN_EMAIL}</span></div>
                        <div><strong>Contenido:</strong> Detalles de su cita + Resumen de su Diagnóstico (ver Plantilla 2).</div>
                      </div>
                    </div>

                    {/* Rama NO */}
                    <div className="bg-white border-2 border-[#D7192B] rounded-xl p-3 shadow-xs">
                      <div className="flex items-center gap-1.5 font-black text-[#D7192B] text-xs mb-1">
                        <Calendar className="w-4 h-4 text-[#D7192B]" />
                        <span>RAMA NO (Si NO Agendó Cita)</span>
                      </div>
                      <p className="text-[11px] text-gray-700 leading-relaxed mb-2">
                        Agrega la acción <strong>Send Email</strong> con el asunto:  
                        <br />
                        <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[10px] text-gray-900">
                          Aquí tienes tu Diagnóstico Estratégico (+ Tu Sesión de Regalo)
                        </span>
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-[10px] text-red-900 space-y-1">
                        <div><strong>Para:</strong> {'{{contact.email}}'}</div>
                        <div><strong>Cc (Copia):</strong> <span className="font-mono select-all bg-white px-1 rounded">{OFFICIAL_ADMIN_EMAIL}</span></div>
                        <div><strong>Contenido:</strong> Copia completa de su diagnóstico + Botón para agendar la sesión de regalo (ver Plantilla 1).</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Copia en GoHighLevel */}
                <div className="bg-gray-100 border border-gray-300 rounded-xl p-3.5 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-gray-900 text-xs">
                      ¿Cómo poner la copia a tu correo en GoHighLevel?
                    </h5>
                    <p className="text-gray-700 text-[11px] mt-0.5 leading-relaxed">
                      En la acción <strong>Send Email</strong> de tu Workflow, despliega el campo <strong>«Cc»</strong> o <strong>«Bcc»</strong> y escribe exactamente:  
                      <span className="inline-block bg-white px-2 py-0.5 rounded border border-gray-300 font-mono font-bold text-gray-900 mx-1 select-all">
                        {OFFICIAL_ADMIN_EMAIL}
                      </span>
                      Así, cada vez que el prospecto reciba su correo con el diagnóstico, a ti te llegará una copia idéntica a tu bandeja de entrada en tiempo real.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLANTILLAS DE CORREO LISTAS */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              {/* Plantilla 1: Si NO Agendó */}
              <div className="border border-red-200 bg-red-50/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D7192B]" />
                    <h4 className="font-extrabold text-gray-900 text-xs">
                      Plantilla 1: Cuando NO Agendó (Envía Diagnóstico + Invitación con Calendario)
                    </h4>
                  </div>
                  <button
                    onClick={() => handleCopy(emailTemplateNoBooking, 'temp_no_booking')}
                    className="px-3 py-1 bg-[#111111] hover:bg-black text-white font-bold rounded-lg text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedKey === 'temp_no_booking' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Texto</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-gray-600 mb-2 font-medium">
                  <strong>Asunto recomendado:</strong> Aquí tienes tu Diagnóstico Estratégico {'{{contact.first_name}}'} (+ Tu Sesión de Regalo)
                  <br />
                  <strong>Campo Cc / Bcc:</strong> <code className="bg-white px-1 py-0.5 rounded border">{OFFICIAL_ADMIN_EMAIL}</code>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-[11px] text-gray-800 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
                  {emailTemplateNoBooking}
                </div>
              </div>

              {/* Plantilla 2: Si SÍ Agendó */}
              <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <h4 className="font-extrabold text-gray-900 text-xs">
                      Plantilla 2: Cuando SÍ Agendó (Confirmación de Cita + Copia de su Diagnóstico)
                    </h4>
                  </div>
                  <button
                    onClick={() => handleCopy(emailTemplateYesBooking, 'temp_yes_booking')}
                    className="px-3 py-1 bg-[#111111] hover:bg-black text-white font-bold rounded-lg text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedKey === 'temp_yes_booking' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Texto</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-gray-600 mb-2 font-medium">
                  <strong>Asunto recomendado:</strong> ¡Cita confirmada! + Tu Diagnóstico Estratégico {'{{contact.first_name}}'}
                  <br />
                  <strong>Campo Cc / Bcc:</strong> <code className="bg-white px-1 py-0.5 rounded border">{OFFICIAL_ADMIN_EMAIL}</code>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-[11px] text-gray-800 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
                  {emailTemplateYesBooking}
                </div>
              </div>

              {/* Plantilla 3: Reporte Consolidado Todo en Uno */}
              <div className="border border-indigo-200 bg-indigo-50/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <h4 className="font-extrabold text-gray-900 text-xs">
                      Plantilla 3 (La más fácil y a prueba de fallos): Todo el Reporte en 1 Sola Variable
                    </h4>
                  </div>
                  <button
                    onClick={() => handleCopy(emailTemplateAllInOne, 'temp_all_in_one')}
                    className="px-3 py-1 bg-[#111111] hover:bg-black text-white font-bold rounded-lg text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedKey === 'temp_all_in_one' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Texto</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-gray-600 mb-2 font-medium">
                  <strong>Asunto:</strong> Tu Informe de Prediagnóstico Estratégico · Crea y Monetiza®
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-[11px] text-gray-800 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                  {emailTemplateAllInOne}
                </div>
              </div>

              {/* Nota Clave sobre la Sintaxis de GoHighLevel */}
              <div className="border border-amber-300 bg-amber-50 rounded-xl p-3 text-[11px] text-amber-900">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  ¿Por qué las variables salían vacías en tu correo de prueba?
                </p>
                <p className="mt-1 leading-relaxed text-amber-800">
                  En GoHighLevel la etiqueta oficial para datos de Webhook lleva la palabra <strong>Request</strong> (ej: <code>{'{{inboundWebhookRequest.perfil_profesional}}'}</code>). 
                  Además, en el editor de correos de GHL puedes hacer clic en el botón de etiquetas <strong>«Custom Values» → «Inbound Webhook»</strong> para insertar cualquier variable directamente sin escribir nada a mano.
                </p>
              </div>

              {/* Tabla de Variables que envía la app a GHL */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h5 className="font-extrabold text-gray-900 text-xs mb-2">
                  Variables que la aplicación le envía a tu Webhook de GHL (Sintaxis Oficial GHL):
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <code className="text-[#D7192B] font-bold">{'{{inboundWebhookRequest.resumen_ejecutivo}}'}</code>
                    <p className="text-gray-500 mt-0.5">El reporte completo y estructurado listo para leer.</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <code className="text-[#D7192B] font-bold">{'{{inboundWebhookRequest.servicio_recomendado}}'}</code>
                    <p className="text-gray-500 mt-0.5">Ej: Pilar 1: Estrategia y Oferta BMS</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <code className="text-[#D7192B] font-bold">{'{{inboundWebhookRequest.programa_oficial}}'}</code>
                    <p className="text-gray-500 mt-0.5">Ej: Programa Intensivo BMS 1 a 1 (4 a 6 semanas)</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <code className="text-[#D7192B] font-bold">{'{{inboundWebhookRequest.motivo_discrepancia}}'}</code>
                    <p className="text-gray-500 mt-0.5">Análisis del por qué no debe saltarse etapas.</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <code className="text-[#D7192B] font-bold">{'{{inboundWebhookRequest.lo_que_no_debe_hacer}}'}</code>
                    <p className="text-gray-500 mt-0.5">Advertencia estratégica personalizada.</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <code className="text-[#D7192B] font-bold">{'{{inboundWebhookRequest.enlace_calendario}}'}</code>
                    <p className="text-gray-500 mt-0.5">Enlace a la agenda del calendario.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONEXIÓN & PRUEBA EN VIVO */}
          {activeTab === 'setup' && (
            <div className="space-y-5">
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block font-bold text-gray-900 mb-1 text-xs">
                    Webhook de GoHighLevel (Inbound Webhook en Workflows):
                  </label>
                  <input
                    type="url"
                    value={localWebhook}
                    onChange={(e) => setLocalWebhook(e.target.value)}
                    placeholder="https://services.leadconnectorhq.com/hooks/..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-[#D7192B] focus:border-transparent outline-hidden bg-gray-50"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Pega aquí la URL de tu Inbound Webhook de GoHighLevel.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1 text-xs">
                    Enlace de tu Calendario de GoHighLevel (Sesión 1 a 1 de Regalo):
                  </label>
                  <input
                    type="url"
                    value={localBooking}
                    onChange={(e) => setLocalBooking(e.target.value)}
                    placeholder="https://api.leadconnectorhq.com/widget/booking/... o tu subpágina de agendamiento"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-[#D7192B] focus:border-transparent outline-hidden bg-gray-50"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Es el enlace que abrirá el botón "Reservar el Cupo Gratis" al finalizar el diagnóstico.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#111111] hover:bg-black text-white font-extrabold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Guardar Configuración
                  </button>

                  {savedNotice && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Configuración guardada en tu navegador
                    </span>
                  )}
                </div>
              </form>

              {/* Prueba de Envío en Vivo */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h4 className="font-extrabold text-gray-900 mb-1 flex items-center gap-1.5 text-xs">
                  <Send className="w-3.5 h-3.5 text-[#D7192B]" />
                  Enviar Lead de Prueba a GHL (Para que reconozca los campos de una vez)
                </h4>
                <p className="text-gray-600 text-[11px] mb-3 leading-relaxed">
                  Haz clic para enviar un lead de prueba completo a tu Webhook con todas las variables del diagnóstico (Nombre, Email, WhatsApp, Perfil, Servicio Recomendado, Discrepancia, Lo que no debe hacer y copia para <code className="bg-white px-1 rounded">{OFFICIAL_ADMIN_EMAIL}</code>).  
                  Luego ve a tu Workflow de GHL y haz clic en <strong>«Fetch Sample Requests»</strong>.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTest}
                    disabled={isSendingTest || !localWebhook}
                    className="px-4 py-2 bg-[#D7192B] hover:bg-[#b91222] disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    {isSendingTest ? 'Enviando lead de prueba...' : '🚀 Enviar Lead de Prueba a GHL'}
                  </button>

                  {testResult === 'success' && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ¡Lead de prueba recibido con éxito en tu Webhook de GHL (200 OK)!
                    </span>
                  )}
                  {testResult === 'error' && (
                    <span className="text-red-700 font-bold flex items-center gap-1 text-xs">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      No se pudo conectar con la URL del Webhook. Revisa la URL.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Pie */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <UserCheck className="w-4 h-4 text-[#D7192B]" />
            <span>Notificaciones administrativas dirigidas a: <strong>{OFFICIAL_ADMIN_EMAIL}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold transition-all cursor-pointer text-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
