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
    name: 'Escenario 1 (Prueba de Estrés): Quería IA y Sistematización sin Oferta ni Clientes',
    badge: 'Orientación Estratégica & Enfoque Rentable',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    targetService: 'Estrategia Comercial & Validación de Oferta (BMS)',
    hasContradictionExpected: true,
    description:
      'El prospecto marca que quiere Sistematización e IA (Pilar 4) y Contenidos de redes (Pilar 3). Sin embargo, sus respuestas muestran que aún no tiene oferta estandarizada ni clientes recurrentes. El sistema le explica con cercanía por qué primero debe asegurar clientes con el Pilar 1 antes de invertir en automatizaciones.',
    lead: {
      name: 'Alejandro Peña',
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
      q1: 'invisible',
      q2: '0',
      q3: '0',
      q4: '0',
      q5: '0',
      q6: '0',
      q7: '0',
      q8: '0',
      q9: '0',
      q10: 'pilar4',
      q11: 'offer',
      q12: 'pilar1_bias',
      q13: 'content',
      q14: 'system'
    }
  },
  {
    id: 'case_contradiction_p1',
    name: 'Escenario 2: Ilusión de Redes Sociales (Cree requerir Seguidores pero Cotiza a la Medida)',
    badge: 'Alineación Estratégica',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    targetService: 'Estrategia Comercial & Validación de Oferta (BMS)',
    hasContradictionExpected: true,
    description:
      'El prospecto cree que su mayor necesidad es "más contenido o viralidad", pero su oferta aún se cotiza a la medida y pierde prospectos por no tener precio firme. El sistema le recomienda consolidar primero una oferta de alto valor.',
    lead: {
      name: 'Mariana Gómez',
      email: 'mariana.gomez@nutricionpro.com',
      whatsapp: '+52 55 9876 5432',
      profession: 'Nutricionista Clínica & Coach de Hábitos',
      currentActivity: 'Consultas individuales de nutrición y planes alimenticios personalizados',
      commercializationModel: 'servicios_1a1',
      payingClientsStatus: 'irregulares',
      company: 'Nutrición Integral Gómez',
      role: 'Directora'
    },
    answers: {
      q1: 'invisible',
      q2: '0',
      q3: '0',
      q4: '1',
      q5: '0',
      q6: '0',
      q7: '0',
      q8: '0',
      q9: '0',
      q10: 'pilar3',
      q11: 'offer',
      q12: 'pilar1_bias',
      q13: 'content',
      q14: 'clarity'
    }
  },
  {
    id: 'case_pilar2_brand',
    name: 'Escenario 3: Oferta Validada pero Invisible (Requiere Marca Personal & Autoridad)',
    badge: 'Autoridad & Posicionamiento',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    targetService: 'Posicionamiento de Marca Personal & Autoridad',
    hasContradictionExpected: false,
    description:
      'Tiene una oferta sólida y clientes satisfechos, pero nadie lo conoce afuera y en el mundo digital compite como un commodity. Necesita blindar sus activos de marca y entrenar su agencia de IA para posicionarse como referente indiscutible.',
    lead: {
      name: 'Sofía Herrera',
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
      q2: '2',
      q3: '2',
      q4: '2',
      q5: '0',
      q6: '1',
      q7: '1',
      q8: '1',
      q9: '2',
      q10: 'pilar2',
      q11: 'brand',
      q12: 'pilar2_bias',
      q13: 'brand',
      q14: 'authority'
    }
  },
  {
    id: 'case_pilar3_leads',
    name: 'Escenario 4: Reputación y Oferta Sólida pero Sin Motor de Captación Continuo',
    badge: 'Atracción & Viral Sales Content',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    targetService: 'Motor de Contenidos Viral Sales Content',
    hasContradictionExpected: false,
    description:
      'Cuenta con una oferta validada y prestigio profesional, pero sus ventas dependen de recomendaciones esporádicas. Necesita instalar un canal de captación activa con guiones comerciales y videos que generen llamadas predecibles.',
    lead: {
      name: 'Fernando Morales',
      email: 'fernando.morales@finanzasclaras.com',
      whatsapp: '+57 315 889 0012',
      profession: 'Consultor de Finanzas Corporativas y Valoración',
      currentActivity: 'Asesorías financieras para directores de empresas medianas',
      commercializationModel: 'servicios_1a1',
      payingClientsStatus: 'activos_recurrentes',
      company: 'Morales Advisory Group',
      role: 'Socio Director'
    },
    answers: {
      q1: 'invisible',
      q2: '2',
      q3: '2',
      q4: '2',
      q5: '2',
      q6: '0',
      q7: '1',
      q8: '1',
      q9: '2',
      q10: 'pilar3',
      q11: 'visibility',
      q12: 'pilar3_bias',
      q13: 'content',
      q14: 'leads'
    }
  },
  {
    id: 'case_pilar4_saturado',
    name: 'Escenario 5: Consultor de Alto Nivel Saturado (Listo para Digital Business Day & IA)',
    badge: 'Escalabilidad & Digital Business Day',
    badgeColor: 'bg-zinc-900 text-white border-zinc-700',
    targetService: 'Sistematización de Negocio, Activos Digitales & IA',
    hasContradictionExpected: false,
    description:
      'Profesional consolidado con alta demanda y buena reputación, pero atrapado vendiendo horas de su vida. Cumple con todos los prerrequisitos (oferta probada, 10+ clientes, método estructurado) y requiere el Digital Business Day, activos de IA y su Plan 30·60·90.',
    lead: {
      name: 'Roberto Salazar',
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
      q2: '2',
      q3: '2',
      q4: '3',
      q5: '2',
      q6: '2',
      q7: '0',
      q8: '1',
      q9: '2',
      q10: 'pilar4',
      q11: 'scale',
      q12: 'pilar4_bias',
      q13: 'scale',
      q14: 'system'
    }
  },
  {
    id: 'case_pilar1_pricing_objection',
    name: 'Escenario 6: Desgaste Comercial con Frecuentes Objeciones de Precio',
    badge: 'Estructuración de Oferta BMS',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    targetService: 'Estrategia Comercial & Validación de Oferta (BMS)',
    hasContradictionExpected: true,
    description:
      'El prospecto cree que su problema es "falta de estatus o marca", pero al presentar cotizaciones los clientes regatean o hacen ghosting. El sistema dictamina que la solución de raíz es el Pilar 1 para construir un encuadre de valor irresistible y protocolo de cierre.',
    lead: {
      name: 'Camila Restrepo',
      email: 'camila.restrepo@psicovida.com',
      whatsapp: '+57 320 123 4567',
      profession: 'Psicoterapeuta y Consultora de Salud Mental',
      currentActivity: 'Atención terapéutica individual y talleres esporádicos para empresas',
      commercializationModel: 'servicios_1a1',
      payingClientsStatus: 'irregulares',
      company: 'Centro Psicológico Bienestar',
      role: 'Directora'
    },
    answers: {
      q1: 'invisible',
      q2: '1',
      q3: '0',
      q4: '1',
      q5: '1',
      q6: '0',
      q7: '0',
      q8: '0',
      q9: '1',
      q10: 'pilar2',
      q11: 'sales',
      q12: 'pilar1_bias',
      q13: 'sales',
      q14: 'clarity'
    }
  },
  {
    id: 'case_pilar2_commodity',
    name: 'Escenario 7: Abogado Corporativo Comoditizado (Cree requerir Redes → Requiere Marca)',
    badge: 'Marca Personal & Posicionamiento',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    targetService: 'Posicionamiento de Marca Personal & Autoridad',
    hasContradictionExpected: true,
    description:
      'Tiene una solución clara y clientes corporativos, pero en internet nadie lo conoce y compite por precio contra otros despachos. Cree que necesita videos virales, pero la prioridad real es blindar sus 12 activos de Marca Personal de Referente.',
    lead: {
      name: 'Javier Villalba',
      email: 'javier.villalba@derechofiscal.com',
      whatsapp: '+57 301 555 7890',
      profession: 'Abogado Especialista en Derecho Tributario y Corporativo',
      currentActivity: 'Asesoría y litigio tributario para medianas empresas',
      commercializationModel: 'servicios_1a1',
      payingClientsStatus: 'activos_recurrentes',
      company: 'Villalba & Asociados Abogados',
      role: 'Socio Fundador'
    },
    answers: {
      q1: 'invisible',
      q2: '2',
      q3: '1',
      q4: '2',
      q5: '0',
      q6: '0',
      q7: '1',
      q8: '1',
      q9: '2',
      q10: 'pilar3',
      q11: 'brand',
      q12: 'pilar2_bias',
      q13: 'brand',
      q14: 'authority'
    }
  },
  {
    id: 'case_pilar4_agency_bottleneck',
    name: 'Escenario 8: Socia Directora de Agencia con Cuello de Botella en la Entrega',
    badge: 'Sistematización & Delegación con IA',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    targetService: 'Sistematización de Negocio, Activos Digitales & IA',
    hasContradictionExpected: false,
    description:
      'Lleva más de 4 años en el mercado con clientes recurrentes de alta facturación, pero su método aún exige su presencia física para entregar cada fase. Requiere empaquetar activos digitales y desplegar agentes de IA para liberar su tiempo.',
    lead: {
      name: 'Beatriz Fonseca',
      email: 'beatriz.fonseca@talentoestrategico.com',
      whatsapp: '+57 318 999 1122',
      profession: 'Consultora de Cultura Organizacional y Gestión del Cambio',
      currentActivity: 'Acompañamiento a juntas directivas en procesos de reestructuración',
      commercializationModel: 'servicios_1a1',
      payingClientsStatus: 'activos_recurrentes',
      company: 'Fonseca Consulting Group',
      role: 'CEO & Consultora Principal'
    },
    answers: {
      q1: 'saturado',
      q2: '2',
      q3: '2',
      q4: '3',
      q5: '2',
      q6: '1',
      q7: '0',
      q8: '2',
      q9: '3',
      q10: 'pilar4',
      q11: 'scale',
      q12: 'pilar4_bias',
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
