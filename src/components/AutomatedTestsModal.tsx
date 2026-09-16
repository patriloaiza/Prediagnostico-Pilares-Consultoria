import React from 'react';
import { Sparkles, X, User, ArrowRight } from 'lucide-react';
import { PrediagnosticAnswers, UserLeadInfo } from '../utils/prediagnosticLogic';

export interface TestCase {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  targetService: string;
  hasContradictionExpected: boolean;
  description: string;
  lead: UserLeadInfo;
  answers: PrediagnosticAnswers;
}

export const AUTOMATED_TEST_CASES: TestCase[] = [
  {
    id: 'case_contradiction_p1',
    name: 'Caso 1: Sesgo Típico (Cree necesitar Redes y Contenido → Requiere Validar su Oferta)',
    badge: 'Discrepancia Crítica Detectada',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    targetService: 'Estrategia Comercial & Validación de Oferta (BMS)',
    hasContradictionExpected: true,
    description:
      'El prospecto cree que su problema es "falta de contenido o seguidores", pero su oferta es ambigua y no tiene un proceso comercial estandarizado. El algoritmo bloquea la inversión en contenidos y le asigna consolidar su oferta para no malgastar recursos.',
    lead: {
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@testlead.com',
      whatsapp: '+52 55 9876 5432',
      company: 'Mendoza Consultores',
      role: 'Director y Fundador'
    },
    answers: {
      q1: 'invisible',
      q2: '0', // Oferta no clara ni productizada (cotizaciones a medida)
      q3: '0', // Clientes dicen que es caro o regatean
      q4: '0', // Perfil comoditizado
      q5: '0', // Sin sistema de contenido
      q6: '0', // Colapsaría con 10 clientes
      q7: '0', // Cero activos digitales
      q8: 'pilar3', // ¡DECLARÓ QUERER CONTENIDOS Y REDES!
      q9: 'offer', // Prueba de estrés: su obstáculo es no tener oferta única
      q10: 'content', // Frustración previa: publicó videos y solo obtuvo likes vacíos
      q11: 'clarity' // Desea orden y claridad de oferta
    }
  },
  {
    id: 'case_pilar2_brand',
    name: 'Caso 2: Oferta Validada pero Sin Autoridad Pública (Requiere Marca Personal)',
    badge: 'Autoridad & Posicionamiento',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    targetService: 'Posicionamiento de Marca Personal & Autoridad',
    hasContradictionExpected: false,
    description:
      'Tiene una oferta sólida y clientes satisfechos, pero nadie lo conoce afuera y en el mundo digital compite como un commodity. Necesita blindar sus activos de marca y entrenar su agencia de IA.',
    lead: {
      name: 'Dra. Sofía Herrera',
      email: 'sofia.herrera@testlead.com',
      whatsapp: '+57 310 456 7890',
      company: 'Clínica & Consultoría Bienestar',
      role: 'Especialista y Conferencista'
    },
    answers: {
      q1: 'invisible',
      q2: '2', // Oferta central probada y estructurada
      q3: '2', // Clientes que la conocen pagan bien
      q4: '0', // Pero afuera su perfil no se diferencia
      q5: '1', // Publica pero atrae curiosos
      q6: '1', // Capacidad media
      q7: '1', // Materiales dispersos
      q8: 'pilar2', // Busca posicionamiento y marca de referente
      q9: 'brand', // Prueba de estrés: necesita autoridad que justifique precios premium
      q10: 'brand',
      q11: 'authority'
    }
  },
  {
    id: 'case_pilar4_saturado',
    name: 'Caso 3: Consultor Saturado (Requiere Sistematización & Digital Business Day)',
    badge: 'Escalabilidad & Digital Business Day',
    badgeColor: 'bg-zinc-900 text-white border-zinc-700',
    targetService: 'Sistematización de Negocio, Activos Digitales & IA',
    hasContradictionExpected: false,
    description:
      'Profesional consolidado con alta demanda y buena reputación, pero atrapado vendiendo horas de su vida. Si para 30 días el negocio colapsa. Requiere el Digital Business Day, activos de IA y su Plan 30·60·90.',
    lead: {
      name: 'Ing. Roberto Salazar',
      email: 'roberto.salazar@testlead.com',
      whatsapp: '+34 612 345 678',
      company: 'Salazar Business Advisory',
      role: 'Consultor Senior y Socio Director'
    },
    answers: {
      q1: 'saturado',
      q2: '2', // Oferta probada y validada
      q3: '2', // Proceso de venta validado
      q4: '2', // Buena reputación
      q5: '2', // Presencia activa
      q6: '0', // Colapsaría con 10 clientes (cuello de botella de tiempo)
      q7: '0', // Todo su conocimiento está en su cabeza
      q8: 'pilar4', // Busca productos digitales y activos de IA
      q9: 'scale', // Prueba de estrés: su freno es la entrega operativa
      q10: 'scale',
      q11: 'system'
    }
  }
];

interface AutomatedTestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCase: (testCase: TestCase, viewResultsDirectly: boolean) => void;
}

export const AutomatedTestsModal: React.FC<AutomatedTestsModalProps> = ({
  isOpen,
  onClose,
  onApplyCase
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Cabecera del Modal */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b-2 border-[#D7192B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D7192B] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Pruebas Automáticas del Diagnóstico
              </h3>
              <p className="text-xs text-gray-400">
                Verifica al instante la detección de sesgos y la recomendación estratégica
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

        {/* Lista de Escenarios */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <p className="text-xs text-gray-600 leading-relaxed">
            Selecciona uno de los 3 casos prediseñados para verificar cómo el algoritmo analiza las
            respuestas, identifica si el prospecto tiene una discrepancia entre lo que cree que
            necesita y lo que la evidencia fáctica exige, y le asigna el servicio de consultoría
            correcto:
          </p>

          <div className="space-y-3.5">
            {AUTOMATED_TEST_CASES.map((tc) => (
              <div
                key={tc.id}
                className="border border-gray-200 hover:border-gray-300 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${tc.badgeColor}`}
                  >
                    {tc.badge}
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {tc.lead.name}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-gray-900 mb-1">{tc.name}</h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{tc.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gray-200/80">
                  <span className="text-[11px] text-gray-600 font-medium">
                    Servicio recomendado:{' '}
                    <strong className="text-gray-900 font-bold">{tc.targetService}</strong>
                  </span>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        onApplyCase(tc, false);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold transition-all"
                      title="Cargar respuestas en el cuestionario para revisar paso a paso"
                    >
                      Cargar en encuesta
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onApplyCase(tc, true);
                        onClose();
                      }}
                      className="px-3 py-1 text-xs rounded-lg bg-[#D7192B] hover:bg-[#b91222] text-white font-extrabold flex items-center gap-1.5 transition-all shadow-xs"
                      title="Calcular y mostrar inmediatamente el informe de resultados"
                    >
                      <span>Ver Resultados</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie del modal */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>Metodología CREA Y MONETIZA® · Patricia Loaiza</span>
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
