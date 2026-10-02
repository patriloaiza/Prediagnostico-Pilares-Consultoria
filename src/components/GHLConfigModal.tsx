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
  Sparkles,
  ShieldAlert,
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowRight
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
  const [activeTab, setActiveTab] = useState<'audit' | 'workflow' | 'templates' | 'setup'>('audit');
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

  // Plantilla para Flujo 2: Cuando NO agendó (lee directo del webhook entrante)
  const emailTemplateNoBooking = `Hola {{contact.first_name}},

Aquí tienes el informe completo de tu Prediagnóstico Estratégico en Crea y Monetiza®:

NIVEL DE MADUREZ DETECTADO:
{{inboundWebhookRequest.diagnostico_perfil}}

PRIORIDAD #1 A RESOLVER:
{{inboundWebhookRequest.diagnostico_servicio_recomendado}}

Programa Recomendado: {{inboundWebhookRequest.diagnostico_programa_oficial}}

ANÁLISIS ESTRATÉGICO:
{{inboundWebhookRequest.diagnostico_motivo_discrepancia}}

LO QUE NO DEBES HACER AHORA:
{{inboundWebhookRequest.diagnostico_lo_que_no_debe_hacer}}

PUNTUACIONES DE TUS 4 PILARES:
1. Estrategia & Oferta: {{inboundWebhookRequest.puntuacion_pilar1}} pts
2. Marca Personal: {{inboundWebhookRequest.puntuacion_pilar2}} pts
3. Contenido de Ventas: {{inboundWebhookRequest.puntuacion_pilar3}} pts
4. Digital Business & IA: {{inboundWebhookRequest.puntuacion_pilar4}} pts

Ahora es momento de agendar tu sesión 1 a 1 de Regalo (45 min):
{{inboundWebhookRequest.enlace_calendario}}

¡Nos vemos pronto!
Patricia Loaiza - Crea y Monetiza®`;

  // Plantilla para Flujo 3: Cuando SÍ agendó (lee de los campos guardados en el contacto)
  const emailTemplateYesBooking = `Hola {{contact.first_name}},

¡Tu cita para la Sesión Estratégica 1 a 1 está confirmada! 🎉

📅 Fecha y Hora de tu sesión: {{appointment.start_time}}
🔗 Enlace de la reunión: {{appointment.meeting_location}}

Para aprovechar al máximo nuestros 45 minutos juntos, he preparado una copia del resultado de tu Prediagnóstico que analizaremos a fondo:

--------------------------------------------------
🎯 PERFIL DETECTADO:
{{contact.perfil_profesional}}

🏆 SERVICIO PRIORITARIO RECOMENDADO:
{{contact.servicio_recomendado}}

⚠️ ANÁLISIS ESTRATÉGICO:
{{contact.motivo_discrepancia}}

⛔ LO QUE NO DEBES HACER:
{{contact.lo_que_no_debe_hacer}}
--------------------------------------------------

Ten a mano este correo el día de nuestra sesión. Revisaremos exactamente cómo destrabar tu facturación y escalar tus servicios de alto valor.

¡Nos vemos pronto!

Patricia Loaiza · Crea y Monetiza®
Copia enviada a: ${OFFICIAL_ADMIN_EMAIL}`;

  const emailTemplateAllInOne = `Hola {{contact.first_name}},

Aquí tienes el informe completo y consolidado de tu Prediagnóstico Estratégico en Crea y Monetiza®:

{{inboundWebhookRequest.resumen_ejecutivo}}

--------------------------------------------------
👉 Reserva aquí tu Sesión Estratégica 1 a 1 de 45 minutos (Sin Costo):
${bookingUrl || '{{inboundWebhookRequest.enlace_calendario}}'}
--------------------------------------------------

Patricia Loaiza · Crea y Monetiza®`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Cabecera */}
        <div className="bg-[#111111] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-[#D7192B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D7192B] flex items-center justify-center text-white shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Auditoría y Corrección de Automatizaciones GHL
              </h3>
              <p className="text-xs text-gray-300">
                Garantiza que siempre te llegue la copia a <strong className="text-white underline">{OFFICIAL_ADMIN_EMAIL}</strong>
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
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2 gap-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 font-extrabold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'audit'
                ? 'border-[#D7192B] text-[#D7192B] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-[#D7192B]" />
            <span>Auditoría de tus 2 Flujos (Corrección de Copias)</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-2.5 font-extrabold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'workflow'
                ? 'border-[#D7192B] text-[#D7192B] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Paso a Paso en GoHighLevel</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2.5 font-extrabold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'templates'
                ? 'border-[#D7192B] text-[#D7192B] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Plantillas de Correo Listas</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2.5 font-extrabold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'setup'
                ? 'border-[#D7192B] text-[#D7192B] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Conexión & Lead de Prueba</span>
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs space-y-6">

          {/* TAB 0: AUDITORÍA ESPECÍFICA DE LAS CAPTURAS */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              
              {/* Resumen Superior */}
              <div className="bg-gradient-to-r from-gray-900 to-black text-white p-4 sm:p-5 rounded-2xl border-l-4 border-[#D7192B] shadow-md">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-white mb-1">
                      Diagnóstico Forense de tus 2 Automatizaciones
                    </h4>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      Revisando tus registros de ejecución y la configuración de tus dos flujos (<strong>2 CM - Prediagnostico NO AGENDA</strong> y <strong>3. Confirmar agendamiento</strong>), detectamos exactamente por qué no te están llegando las copias a tu correo <strong className="text-white underline">{OFFICIAL_ADMIN_EMAIL}</strong> en todos los casos:
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparativa Caso Fernando vs Caso María */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Caso Fernando Morales (NO agendó) */}
                <div className="border-2 border-red-200 bg-red-50/50 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-red-200">
                    <span className="font-black text-red-900 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      CASO 1: NO AGENDÓ (Ej. Fernando Morales)
                    </span>
                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Flujo 2: NO AGENDA
                    </span>
                  </div>

                  <div className="space-y-2.5 text-[11px] text-gray-700">
                    <p>
                      <strong>Lo que pasó en tus registros:</strong> Fernando llenó el prediagnóstico, esperó los 15 minutos, cayó en la rama <em>«None»</em> y GoHighLevel ejecutó la acción <em>«Correo electrónico No Agendaste Tu Cita»</em> (a las 1:14 pm).
                    </p>
                    <div className="p-2.5 bg-white rounded-xl border border-red-300 text-red-900 font-medium">
                      ❌ <strong>¿Por qué no te llegó copia a ti?</strong>
                      <br />
                      Porque en GoHighLevel la acción <strong>«Send Email»</strong> por defecto <u>únicamente</u> le manda el correo al prospecto (<code>{'{{contact.email}}'}</code>). No tiene configurado el campo <strong>«Cc»</strong> (Copia) ni hay una acción de notificación para ti en esa rama.
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 font-bold">
                      ✅ <strong>La Solución Inmediata:</strong>
                      <ol className="list-decimal pl-4 mt-1 space-y-1 font-normal text-[11px]">
                        <li>Abre la acción <strong>«Correo electrónico No Agendaste Tu Cita»</strong>.</li>
                        <li>En el panel lateral derecho, abre <strong>«Configuraciones adicionales»</strong> o despliega el campo <strong>«Cc»</strong>.</li>
                        <li>Escribe exactamente tu correo: <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-400 font-bold text-gray-900 select-all">{OFFICIAL_ADMIN_EMAIL}</code>.</li>
                        <li><em>(Opcional recomendado)</em> Agrega justo después una acción <strong>Internal Notification</strong> (Tipo: Email) enviada a tu correo.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Caso María Vélez (SÍ agendó) */}
                <div className="border-2 border-emerald-200 bg-emerald-50/50 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-200">
                    <span className="font-black text-emerald-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      CASO 2: SÍ AGENDÓ (Ej. María Vélez)
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Flujo 3: Confirmar Agendamiento
                    </span>
                  </div>

                  <div className="space-y-2.5 text-[11px] text-gray-700">
                    <p>
                      <strong>Lo que pasó en tus registros:</strong> María agendó en el calendario a la 1:03 pm. Entró al Flujo 3, se le añadió la etiqueta <code>agendo-cita</code>, y se ejecutaron <em>«Enviar correo de confirmación y diagnóstico»</em> y <em>«Internal Notification»</em>. Luego a la 1:17 pm en el Flujo 2 se detectó la etiqueta y terminó sin enviar correo de no agendó.
                    </p>
                    <div className="p-2.5 bg-white rounded-xl border border-amber-300 text-amber-950 font-medium">
                      ⚠️ <strong>Los 2 errores detectados en este caso:</strong>
                      <br />
                      1. La acción <strong>Internal Notification</strong> en GHL muchas veces se deja como <em>«In-App Notification»</em> (la campana de la app de GHL) o como <em>«Assigned User»</em> (si el contacto no tiene usuario asignado, el correo no sale).
                      <br />
                      2. <strong>¡Variables Vacías!</strong> En el Flujo 3 el activador es la <u>Cita</u> (no el Webhook). Por eso <code>{'{{inboundWebhookRequest...}}'}</code> llega <strong>en blanco</strong> en el Flujo 3.
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 font-bold">
                      ✅ <strong>La Solución Inmediata:</strong>
                      <ol className="list-decimal pl-4 mt-1 space-y-1 font-normal text-[11px]">
                        <li>En la acción <strong>Internal Notification</strong>: selecciona Tipo: <strong>Email</strong>, y en «Send to» elige <strong>Custom Email</strong> escribiendo <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-400 font-bold text-gray-900 select-all">{OFFICIAL_ADMIN_EMAIL}</code>.</li>
                        <li>En el correo de confirmación, agrega también en el campo <strong>Cc</strong> tu correo.</li>
                        <li>Usa campos del contacto (ver pestaña de Estructura) para que los datos del diagnóstico no salgan vacíos.</li>
                      </ol>
                    </div>
                  </div>
                </div>

              </div>

              {/* Guía Visual: Las 3 Modificaciones Exactas en tu Pantalla de GHL */}
              <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-white shadow-xs space-y-4">
                <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs">
                    🛠️
                  </span>
                  Pasos exactos para aplicar en tu cuenta de GoHighLevel hoy mismo:
                </h4>

                <div className="space-y-3">
                  
                  {/* Modificación 1 */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#D7192B] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-gray-900 text-xs">
                          En el Flujo «2 CM - Prediagnostico NO AGENDA»: Agregar CC al correo de No Agendaste
                        </strong>
                        <button
                          onClick={() => handleCopy(OFFICIAL_ADMIN_EMAIL, 'copy_email_1')}
                          className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-[10px] font-bold rounded cursor-pointer transition-colors"
                        >
                          {copiedKey === 'copy_email_1' ? '¡Copiado!' : 'Copiar Email'}
                        </button>
                      </div>
                      <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
                        Entra a la acción <em>«Correo electrónico No Agendaste Tu Cita»</em>. En la columna derecha donde escribes el correo, busca la sección de remitente o despliega <strong>«Configuraciones adicionales» / «Cc»</strong> y pega <code className="bg-white px-1 py-0.5 rounded border font-bold text-[#D7192B]">{OFFICIAL_ADMIN_EMAIL}</code>.
                        <br />
                        <span className="text-emerald-700 font-semibold">
                          → Resultado: Cada vez que un usuario como Fernando Morales reciba el correo de los 15 minutos, te llegará a ti una copia instantánea e idéntica a tu Gmail.
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Modificación 2 */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#D7192B] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-gray-900 text-xs">
                          En el Flujo «3. Confirmar agendamiento»: Configurar «Internal Notification»
                        </strong>
                      </div>
                      <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
                        Haz clic en la acción <em>«Internal Notification»</em> que ya tienes creada:
                        <br />
                        • <strong>Type of Notification:</strong> Selecciona <strong>Email</strong> (no In-App Notification).
                        <br />
                        • <strong>Send to:</strong> Selecciona <strong>Custom Email</strong> (NO «Assigned User»).
                        <br />
                        • <strong>To Email:</strong> Pega <code className="bg-white px-1 py-0.5 rounded border font-bold text-[#D7192B]">{OFFICIAL_ADMIN_EMAIL}</code>.
                        <br />
                        • <strong>Subject:</strong> <code>🚨 [NUEVA CITA CONFIRMADA] - {'{{contact.name}}'}</code>.
                        <br />
                        • Además, entra en la acción <em>«Enviar correo de confirmación y diagnóstico»</em> y agrega tu email en el campo <strong>Cc</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Modificación 3 */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#D7192B] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div className="flex-1">
                      <strong className="text-gray-900 text-xs">
                        Para que las variables del diagnóstico NO salgan vacías en el Flujo 3:
                      </strong>
                      <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
                        En tu captura del Flujo 2 tienes el paso 2: <em>«Actualizar campos personalizados del contacto»</em>.
                        Asegúrate de que en ese paso se guarde la variable:
                        <br />
                        Campo: <strong>Resumen Diagnóstico</strong> (Custom Field tipo Texto Multi-línea) → Valor: <code className="bg-white px-1 py-0.5 rounded border text-[#D7192B] font-bold">{'{{inboundWebhookRequest.resumen_ejecutivo}}'}</code>.
                        <br />
                        Luego, en el Flujo 3, en lugar de usar <code>{'{{inboundWebhookRequest...}}'}</code>, usas <code className="bg-white px-1 py-0.5 rounded border text-emerald-700 font-bold">{'{{contact.resumen_diagnostico}}'}</code> (ver Plantilla 2 en la siguiente pestaña).
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 1: ESTRUCTURA DEL WORKFLOW */}
          {activeTab === 'workflow' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  Estructura Óptima de tus 2 Flujos de Trabajo
                </h4>
                <p className="text-amber-800 leading-relaxed text-xs">
                  Tu arquitectura con 2 flujos (uno activado por Webhook con espera de 15 minutos y condición de tag, y otro activado por la Cita) es <strong>completamente correcta y profesional</strong>. Solo requiere asegurar los enlaces de notificación hacia tu buzón personal.
                </p>
              </div>

              {/* Diagrama Comparativo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Flujo 2 */}
                <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 space-y-3">
                  <div className="flex items-center gap-2 font-black text-gray-900 text-xs pb-2 border-b border-gray-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Flujo 2: Prediagnóstico NO AGENDA</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-gray-700">
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <strong>1. Trigger:</strong> Webhook Entrante (App Prediagnóstico).
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <strong>2. Crear / Actualizar Contacto.</strong>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <strong>3. Actualizar Campos:</strong> Guardar <code>{'{{inboundWebhookRequest.resumen_ejecutivo}}'}</code> en el campo <code>Resumen Diagnóstico</code>.
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <strong>4. Espera 15 minutos:</strong> Tiempo para que la persona mire el calendario.
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <strong>5. Condición:</strong> ¿Tiene tag <code>agendo-cita</code>?
                      <br />
                      • <strong>SÍ:</strong> Fin (No se envía correo duplicado).
                      <br />
                      • <strong>NO:</strong> Correo con Diagnóstico + Botón Agenda (Con <strong>Cc</strong> a {OFFICIAL_ADMIN_EMAIL}).
                    </div>
                  </div>
                </div>

                {/* Flujo 3 */}
                <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 space-y-3">
                  <div className="flex items-center gap-2 font-black text-gray-900 text-xs pb-2 border-b border-gray-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>Flujo 3: Confirmar Agendamiento</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-gray-700">
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <strong>1. Trigger:</strong> Cita Creada en Calendario (Appointment Created).
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <strong>2. Añadir Tag:</strong> <code>agendo-cita</code> (evita que el Flujo 2 le mande el correo de no agendó).
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <strong>3. Enviar Correo Confirmación:</strong> Detalles de la cita + copia del diagnóstico desde <code>{'{{contact.resumen_diagnostico}}'}</code> (Con <strong>Cc</strong> a {OFFICIAL_ADMIN_EMAIL}).
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <strong>4. Internal Notification:</strong> Tipo Email a <code>{OFFICIAL_ADMIN_EMAIL}</code> avisándote de la nueva cita.
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <strong>5. Fin.</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: PLANTILLAS DE CORREO LISTAS */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              
              {/* Plantilla para Flujo 2: Cuando NO agendó */}
              <div className="border border-red-200 bg-red-50/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D7192B]" />
                    <h4 className="font-extrabold text-gray-900 text-xs">
                      Para Flujo 2 («NO AGENDA»): Correo cuando pasaron los 15 min sin agendar
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
                  <strong>Campo Cc / Bcc:</strong> <code className="bg-white px-1 py-0.5 rounded border font-bold text-[#D7192B]">{OFFICIAL_ADMIN_EMAIL}</code>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-[11px] text-gray-800 whitespace-pre-wrap max-h-52 overflow-y-auto leading-relaxed">
                  {emailTemplateNoBooking}
                </div>
              </div>

              {/* Plantilla para Flujo 3: Cuando SÍ agendó */}
              <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <h4 className="font-extrabold text-gray-900 text-xs">
                      Para Flujo 3 («CONFIRMAR AGENDAMIENTO»): Correo con datos de la cita + Diagnóstico
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
                  <strong>Campo Cc / Bcc:</strong> <code className="bg-white px-1 py-0.5 rounded border font-bold text-emerald-700">{OFFICIAL_ADMIN_EMAIL}</code>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-[11px] text-gray-800 whitespace-pre-wrap max-h-52 overflow-y-auto leading-relaxed">
                  {emailTemplateYesBooking}
                </div>
              </div>

              {/* Plantilla Consolidada 3: Resumen Ejecutivo en 1 Variable */}
              <div className="border border-indigo-200 bg-indigo-50/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <h4 className="font-extrabold text-gray-900 text-xs">
                      Alternativa Todo en Uno: Reporte Completo en 1 Sola Variable
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

                <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-[11px] text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                  {emailTemplateAllInOne}
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
                    placeholder="https://link.ghlespanol.com/widget/booking/... o tu página de agendamiento"
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
