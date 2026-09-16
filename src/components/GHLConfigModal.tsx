import React, { useState } from 'react';
import { Settings, X, CheckCircle2, Copy, Send, ExternalLink, HelpCircle, AlertCircle } from 'lucide-react';

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
  const [localWebhook, setLocalWebhook] = useState(webhookUrl);
  const [localBooking, setLocalBooking] = useState(bookingUrl);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [savedNotice, setSavedNotice] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Cabecera */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b-2 border-[#D7192B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D7192B] flex items-center justify-center text-white">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Integración con GoHighLevel (GHL)
              </h3>
              <p className="text-xs text-gray-400">
                Captura de leads, webhook automático y sistema de agendamiento
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          <form onSubmit={handleSave} className="space-y-4">
            {/* Campo 1: Webhook URL */}
            <div>
              <label className="block font-bold text-gray-900 mb-1">
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
                Al terminar el prediagnóstico, los datos del prospecto y su resultado se enviarán a esta URL automáticamente.
              </p>
            </div>

            {/* Campo 2: Booking URL */}
            <div>
              <label className="block font-bold text-gray-900 mb-1">
                Enlace del Calendario de GoHighLevel (Sesión Gratuita):
              </label>
              <input
                type="url"
                value={localBooking}
                onChange={(e) => setLocalBooking(e.target.value)}
                placeholder="https://api.leadconnectorhq.com/widget/booking/... o tu página de agendamiento"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-[#D7192B] focus:border-transparent outline-hidden bg-gray-50"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                El botón "Agendar mi Sesión de Diagnóstico Gratuita" abrirá directamente este enlace.
              </p>
            </div>

            {/* Botón Guardar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#111111] hover:bg-black text-white font-extrabold rounded-xl transition-all shadow-xs"
              >
                Guardar Configuración
              </button>

              {savedNotice && (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Configuración guardada en tu navegador
                </span>
              )}
            </div>
          </form>

          {/* Prueba de Envío en Vivo */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/70">
            <h4 className="font-extrabold text-gray-900 mb-1 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-[#D7192B]" />
              Probar Envío en Vivo hacia tu Webhook de GHL
            </h4>
            <p className="text-gray-600 text-[11px] mb-3 leading-relaxed">
              Haz clic para enviar un lead de prueba con datos simulados (Nombre, Correo, WhatsApp, Servicio Recomendado y Discrepancia) hacia tu URL de webhook:
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTest}
                disabled={isSendingTest || !localWebhook}
                className="px-4 py-2 bg-[#D7192B] hover:bg-[#b91222] disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                {isSendingTest ? 'Enviando prueba...' : 'Enviar Lead de Prueba a GHL'}
              </button>

              {testResult === 'success' && (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ¡Webhook recibido con éxito en GHL (200 OK)!
                </span>
              )}
              {testResult === 'error' && (
                <span className="text-red-700 font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  No se pudo conectar con la URL especificada.
                </span>
              )}
            </div>
          </div>

          {/* Parámetros URL para iFrame */}
          <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
              Tip Pro: Configuración dinámica sin tocar código
            </h4>
            <p className="text-blue-800 text-[11px] leading-relaxed mb-2">
              Cuando incrustes este iframe en una página o funnel de GoHighLevel, puedes pasar el webhook y el calendario como parámetros en el <code>src</code> del iframe:
            </p>
            <div className="bg-white border border-blue-200 rounded-lg p-2.5 font-mono text-[10px] text-gray-800 break-all select-all">
              {window.location.origin}/?webhook=TU_WEBHOOK_GHL&amp;booking_url=TU_CALENDARIO_GHL
            </div>
          </div>

          {/* Guía Rápida GoHighLevel */}
          <div>
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="text-gray-700 font-bold flex items-center gap-1 hover:text-[#D7192B] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showGuide ? 'Ocultar' : 'Ver'} Guía rápida: Cómo conectar en GoHighLevel (3 minutos)</span>
            </button>

            {showGuide && (
              <div className="mt-2.5 p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-[11px] text-gray-700 leading-relaxed">
                <p>
                  <strong>Paso 1:</strong> En tu subcuenta de GoHighLevel ve a <em>Automation → Workflows → Create Workflow (from scratch)</em>.
                </p>
                <p>
                  <strong>Paso 2:</strong> En el Trigger del Workflow elige <strong>«Inbound Webhook»</strong> y copia la URL proporcionada (terminada en <em>leadconnectorhq.com/hooks/...</em>). Pégala en el campo de arriba.
                </p>
                <p>
                  <strong>Paso 3:</strong> Haz clic en el botón rojo <em>«Enviar Lead de Prueba a GHL»</em>. En tu Workflow de GHL haz clic en <em>«Fetch Sample Requests»</em> para que GHL reconozca automáticamente los campos (Nombre, Email, WhatsApp, Servicio Recomendado, etc.).
                </p>
                <p>
                  <strong>Paso 4:</strong> En el Workflow agrega las acciones automáticas que desees: <em>Create/Update Contact</em>, <em>Add Tag: prediagnostico-completado</em>, y enviar notificación por email o WhatsApp a tu equipo.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pie */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">GoHighLevel LeadConnector Ready</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
