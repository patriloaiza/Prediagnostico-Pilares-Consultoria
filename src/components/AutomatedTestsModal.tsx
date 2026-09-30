import React from 'react';
import { Sparkles, X, User, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
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
    id: 'case_forced_pilar4_without_foundation',
    name: 'Caso Especial (Prueba del Usuario): Forzar Pilar 4 y Redes sin Oferta ni Clientes',
    badge: 'Orientación Estratégica & Enfoque Rentable',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    targetService: 'Estrategia Comercial & Validación de Oferta (BMS)',
    hasContradictionExpected: true,
    description:
      'Simulación exacta del ejercicio del usuario: El prospecto marca que quiere Sistematización e IA (Pilar 4) y Contenidos de redes (Pilar 3). Sin embargo, sus respuestas muestran que aún no tiene oferta estandarizada ni clientes recurrentes. El sistema le explica con cercanía por qué primero debe asegurar clientes con el Pilar 1 antes de invertir en automatizaciones.',
    lead: {
      name: 'Dr. Alejandro Peña',
      email: 'alejandro.pena@consultoriaejemplo.com',
      whatsapp: '+57 300 765 4321',
      profession: 'Psicólogo y Mentor de Liderazgo',
      currentActivity: 'Atiendo sesiones individuales presenciales de coaching y apoyo emocional',
      commercializationModel: 'servicios_1a1',
      payingClientsStatus: 'sin_clientes',
      company: 'Peña Liderazgo',
      role: 'Fundador'
    },
    answers: {
      q1: 'invisible', // Experto invisible: conocimiento pero sin oferta visible
      q2: '0', // No tiene paquete estándar, cotiza a la medida
      q3: '0', // Dicen que es caro o ghosting
      q4: '0', // 0 clientes de pago en los últimos 6 meses
      q5: '0', // Lo perciben como uno más
      q6: '0', // No publica o esporádico
      q7: '0', // Colapsaría con 10 clientes
      q8: '0', // 0% empaquetado, todo en mi cabeza
      q9: '0', // Se improvisa en vivo, no hay manuales
      q10: 'pilar4', // Quería sistematización e IA
      q11: 'offer', // Prueba de capacidad: cuello de botella es no tener oferta única
      q12: 'pilar1_bias', // Sinceridad: admite que la oferta aún no está clara ni validada
      q13: 'content', // Frustración: invirtió en redes sin retorno
      q14: 'system' // Buscaba sistematizar
    }
  },
  {
    id: 'case_contradiction_p1',
    name: 'Caso 1: Enfoque en Redes Sociales (Cree necesitar Viralidad → Requiere Validar su Oferta)',
    badge: 'Alineación Estratégica',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    targetService: 'Estrategia Comercial & Validación de Oferta (BMS)',
    hasContradictionExpected: true,
    description:
      'El prospecto cree que su mayor necesidad es "más contenido o seguidores", pero su oferta aún se cotiza a la medida. El sistema le recomienda consolidar primero una oferta de alto valor para convertir cada futuro seguidor en un cliente real.',
    lead: {
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@testlead.com',
      whatsapp: '+52 55 9876 5432',
      profession: 'Consultor de Negocios y Finanzas',
      currentActivity: 'Asesoro a empresas a ordenar sus números e impuestos',
      commercializationModel: 'servicios_1a1',
      payingClientsStatus: 'irregulares',
      company: 'Mendoza Consultores',
      role: 'Director y Fundador'
    },
    answers: {
      q1: 'invisible',
      q2: '0', // Oferta no clara ni productizada (cotizaciones a medida)
      q3: '0', // Clientes dicen que es caro o regatean
      q4: '1', // 1 o 2 clientes esporádicos
      q5: '0', // Perfil comoditizado
      q6: '0', // Sin sistema de contenido
      q7: '0', // Colapsaría con 10 clientes
      q8: '0', // Cero activos digitales
      q9: '0', // Nada documentado
      q10: 'pilar3', // ¡DECLARÓ QUERER CONTENIDOS Y REDES!
      q11: 'offer', // Prueba de estrés: su obstáculo es no tener oferta única
      q12: 'pilar1_bias', // Reconoce que la oferta no está clara
      q13: 'content', // Frustración previa: publicó videos y solo obtuvo likes vacíos
      q14: 'clarity' // Desea orden y claridad de oferta
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
      profession: 'Médica Especialista y Terapeuta de Bienestar',
      currentActivity: 'Atiendo pacientes en consulta privada y dirijo programas de salud preventiva',
      commercializationModel: 'servicios_1a1',
      payingClientsStatus: 'activos_recurrentes',
      company: 'Clínica & Consultoría Bienestar',
      role: 'Especialista y Conferencista'
    },
    answers: {
      q1: 'invisible',
      q2: '2', // Oferta central probada y estructurada
      q3: '2', // Clientes que la conocen pagan bien
      q4: '2', // Entre 3 y 9 clientes regulares
      q5: '0', // Pero afuera su perfil no se diferencia
      q6: '1', // Publica pero atrae curiosos
      q7: '1', // Capacidad media
      q8: '1', // Materiales dispersos
      q9: '2', // Método estructurado manual
      q10: 'pilar2', // Busca posicionamiento y marca de referente
      q11: 'brand', // Prueba de estrés: necesita autoridad que justifique precios premium
      q12: 'pilar2_bias',
      q13: 'brand',
      q14: 'authority'
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
      'Profesional consolidado con alta demanda y buena reputación, pero atrapado vendiendo horas de su vida. Si para 30 días el negocio colapsa. Cumple con todos los prerrequisitos (oferta probada, 10+ clientes, método estructurado) y requiere el Digital Business Day, activos de IA y su Plan 30·60·90.',
    lead: {
      name: 'Ing. Roberto Salazar',
      email: 'roberto.salazar@testlead.com',
      whatsapp: '+34 612 345 678',
      profession: 'Consultor de Estrategia Operativa e Ingeniería',
      currentActivity: 'Asesoro a directivos de empresas industriales en optimización de plantas',
      commercializationModel: 'servicios_1a1',
      payingClientsStatus: 'activos_recurrentes',
      company: 'Salazar Business Advisory',
      role: 'Consultor Senior y Socio Director'
    },
    answers: {
      q1: 'saturado',
      q2: '2', // Oferta probada y validada
      q3: '2', // Proceso de venta validado
      q4: '3', // Más de 10 clientes de pago comprobados
      q5: '2', // Buena reputación
      q6: '2', // Presencia activa
      q7: '0', // Colapsaría con 10 clientes (cuello de botella de tiempo)
      q8: '1', // Materiales de valor
      q9: '2', // Método estructurado que sigue en orden
      q10: 'pilar4', // Busca productos digitales y activos de IA
      q11: 'scale', // Prueba de estrés: su freno es la entrega operativa
      q12: 'pilar4_bias', // Dolor es la saturación
      q13: 'scale',
      q14: 'system'
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
                Pruebas Automáticas y Escenarios Estratégicos
              </h3>
              <p className="text-xs text-gray-400">
                Comprueba cómo el sistema guía al prospecto hacia su paso más rentable y seguro
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
            Selecciona uno de los escenarios para comprobar en tiempo real cómo el sistema analiza la situación del negocio, <strong>protege al cliente de dar pasos en falso</strong> y le recomienda con total claridad el programa que le generará los mejores resultados hoy:
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
                    Servicio asignado por evidencia:{' '}
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
