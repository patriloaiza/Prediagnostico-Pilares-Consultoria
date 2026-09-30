// Datos Maestros del Prediagnóstico de Servicios Estratégicos · Metodología CREA Y MONETIZA®
// Patricia Loaiza

export interface PillarInfo {
  id: 'pilar1' | 'pilar2' | 'pilar3' | 'pilar4';
  internalCode: string; // Para control interno ('Pilar 1', 'Pilar 2', etc.)
  name: string; // Nombre comprensible para el prospecto
  categoryTag: string; // Etiqueta descriptiva
  serviceTitle: string; // Nombre oficial del programa
  duration: string;
  description: string;
  phases: string[];
  transformation: string;
  deliverables: string[];
  lessonsCount?: string;
  color: string;
  diagnosticUrl?: string;
}

export const PILLARS_DATA: Record<string, PillarInfo> = {
  pilar1: {
    id: 'pilar1',
    internalCode: 'Pilar 1',
    name: 'Estrategia Comercial & Validación de Oferta',
    categoryTag: 'Cimiento Comercial & Oferta de Alto Valor',
    serviceTitle: 'Consultoría Estratégica BMS (Business Marketing Strategy)',
    duration: '1 a 2 meses de consultoría e implementación',
    description:
      'Programa intensivo para estructurar tu experiencia profesional en un modelo de negocio rentable: definición de tu cliente ideal de alto valor, productización de tu oferta central, política de precios premium y protocolo de ventas predecible.',
    phases: [
      'Onboarding & Auditoría del Modelo Actual',
      'Diagnóstico Estratégico y Fugas de Conversión',
      'Definición de Oferta Irresistible y Entregables',
      'Arquitectura de Precios y Embudo Comercial',
      'Implementación de Activos de IA para Ventas',
      'Roadmap de Ejecución y Offboarding'
    ],
    transformation:
      'De vender servicios dispersos o depender de cotizaciones improvisadas a medida → a contar con una oferta clara, estandarizada y un proceso comercial que cierra con confianza.',
    deliverables: [
      'Arquitectura del modelo de negocio y catálogo productizado',
      'Oferta central de alto valor con entregables estandarizados',
      'Guión y protocolo comercial de cualificación y cierre',
      'Roadmap de procesos comerciales optimizados con IA'
    ],
    lessonsCount: '6 Fases de Acompañamiento Estratégico',
    color: '#D7192B'
  },
  pilar2: {
    id: 'pilar2',
    internalCode: 'Pilar 2',
    name: 'Posicionamiento de Marca Personal & Autoridad',
    categoryTag: 'Autoridad, Diferenciación & Reconocimiento',
    serviceTitle: 'Personal Brand Consulting',
    duration: '3 meses de acompañamiento y desarrollo de activos',
    description:
      'Programa integral para posicionarte como el referente indiscutible de tu sector: arquitectura de mensaje diferencial, construcción de tus 12 activos de autoridad, identidad visual ejecutiva y una agencia de IA propia entrenada con tu voz y metodología.',
    phases: [
      'Auditoría Profunda de Reputación y Posicionamiento',
      'Mensaje Diferencial y Declaración de Autoridad',
      'Desarrollo de los 12 Activos Blindados de Marca',
      'Estrategia de Percepción de Valor y Relaciones Públicas',
      'Agencia de IA Propia entrenada con tu tono y criterios',
      'Plan de Consolidación y Offboarding'
    ],
    transformation:
      'De ser un profesional muy competente que compite por precio en el anonimato → a una marca personal respetada, con alta autoridad percibida y demanda cualificada.',
    deliverables: [
      'Los 12 activos clave de marca personal y autoridad',
      'Manual de Voz Estratégica (Brand Voice Document)',
      'Estrategia de posicionamiento de la visibilidad a la rentabilidad',
      'Agente de IA personalizado entrenado con tu voz y conocimiento'
    ],
    lessonsCount: '6 Fases de Construcción de Marca',
    color: '#B91222'
  },
  pilar3: {
    id: 'pilar3',
    internalCode: 'Pilar 3',
    name: 'Sistema de Contenidos de Ventas & Atracción Cualificada',
    categoryTag: 'Atracción Orgánica, Guiones & Conversión en Redes',
    serviceTitle: 'Viral Sales Content System',
    duration: '2 a 3 meses de producción e implementación guiada',
    description:
      'Construcción e instalación de tu motor recurrente de generación de demanda: guiones estratégicos para video (VSL y Reels de venta), biblioteca de conocimiento de tu marca y GPTs entrenados para producir contenido que atrae clientes reales con presupuesto.',
    phases: [
      'Auditoría de Canales y Tráfico Actual',
      'Estrategia de Viralidad Orientada a Ventas (no a vanidad)',
      'Brand Knowledge Base y Modelos de IA',
      'Pack de Guiones de Alto Impacto (VSL, Carruseles y Reels)',
      'Páginas de Conversión y Captura de Prospectos',
      'Lanzamiento del Motor y Optimización Continua'
    ],
    transformation:
      'De publicar sin dirección sufriendo por likes vacíos y curiosos sin presupuesto → a un sistema de contenido estratégico que educa, convence y genera llamadas con compradores cualificados.',
    deliverables: [
      'Sistema de distribución de contenidos con propósito de venta',
      'Brand Knowledge Base y GPTs entrenados con tu conocimiento',
      'Paquete completo de guiones comerciales de alta conversión',
      'Estructura de página de captura/ventas y embudo automatizado'
    ],
    lessonsCount: '6 Fases de Implementación de Contenidos',
    color: '#8E0D19'
  },
  pilar4: {
    id: 'pilar4',
    internalCode: 'Pilar 4',
    name: 'Sistematización de Negocio, Activos Digitales & IA',
    categoryTag: 'Escalabilidad, Productos Digitales & Automatización',
    serviceTitle: 'Digital Business Day (Jornada Intensiva + Plan 30·60·90)',
    duration: 'Jornada Intensiva de Inmersión + 90 Días de Acompañamiento',
    description:
      'Intervención estratégica de alto nivel para consultores y profesionales consolidados que están saturados vendiendo horas: rediseño del modelo hacia activos digitales, implementación de 3 agentes de IA especializados y ejecución del Plan 30·60·90.',
    phases: [
      'Auditoría Operativa y Cuello de Botella del Fundador',
      'Jornada Intensiva: Digital Business Day (10:00 a 17:00)',
      'Estructuración de Ofertas Evergreen y Productos Digitales',
      'Creación y Despliegue de los 3 Agentes de IA a Medida',
      'Desacople de la Agenda Personal respecto a la Facturación',
      'Ejecución del Plan Guiado 30·60·90'
    ],
    transformation:
      'De un negocio exitoso pero asfixiante que depende al 100% de tu presencia física y tiempo → a un negocio sistematizado con ofertas escalables, activos de IA y libertad operativa.',
    deliverables: [
      'Rediseño completo de la arquitectura del negocio para escalar',
      '3 Agentes de IA a Medida (Estrategia, Marketing y Comercial)',
      'Estructura de productos digitales y activos monetizables',
      'Plan de Acción y Métricas a 30, 60 y 90 días'
    ],
    lessonsCount: 'Jornada Intensiva + 90 Días de Seguimiento',
    color: '#111111',
    diagnosticUrl: 'https://test.creaymonetiza.online/diagnostico-p4-page'
  }
};

export interface EvolutionaryProfile {
  id: 'invisible' | 'saturado' | 'legado';
  title: string;
  subtitle: string;
  description: string;
  corePain: string;
  priorityNeed: string;
  naturalPillarFallback: 'pilar1' | 'pilar4';
}

export const EVOLUTIONARY_PROFILES: Record<string, EvolutionaryProfile> = {
  invisible: {
    id: 'invisible',
    title: 'Experto Invisible',
    subtitle: 'Años de conocimiento y experiencia real, pero con poca tracción comercial visible',
    description:
      'Posees una sólida trayectoria profesional o técnica, pero tu negocio aún no cuenta con una oferta productizada, clara y empaquetada. Dependes de recomendaciones informales y te cuesta poner precio firme a tu valor.',
    corePain: 'Falta de estructura de oferta y proceso comercial predecible.',
    priorityNeed:
      'Definir una oferta central de alto valor y un protocolo de cierre antes de invertir en redes sociales o herramientas complejas.',
    naturalPillarFallback: 'pilar1'
  },
  saturado: {
    id: 'saturado',
    title: 'Profesional Saturado',
    subtitle: 'Tienes clientes y facturación, pero eres el cuello de botella operativo absoluto',
    description:
      'Has validado que tu servicio funciona y la gente te contrata, pero entregas todo de forma manual en sesiones individuales. Tu agenda está colapsada y si dejas de trabajar un mes, los ingresos se frenan en seco.',
    corePain: 'Techo crítico de tiempo, energía y dependencia operativa total de tu presencia.',
    priorityNeed:
      'Sistematizar tu método en activos digitales, implementar agentes de IA y pasar de vender horas a vender soluciones estructuradas.',
    naturalPillarFallback: 'pilar4'
  },
  legado: {
    id: 'legado',
    title: 'Visionario del Legado',
    subtitle: 'Trayectoria consolidada que busca trascender y construir un patrimonio empresarial autónomo',
    description:
      'Cuentas con autoridad reconocida y estabilidad, pero deseas empaquetar tu metodología para que opere sin ti mediante productos digitales, sistemas con IA y programas de formación de alto impacto.',
    corePain: 'Riesgo de que el conocimiento acumulado dependa exclusivamente de ti.',
    priorityNeed:
      'Transformar tu propiedad intelectual en activos digitales escalables y desplegar una arquitectura de negocio automatizada.',
    naturalPillarFallback: 'pilar4'
  }
};

export interface QuestionOption {
  value: string;
  label: string;
  scoreWeight?: {
    pilar1?: number;
    pilar2?: number;
    pilar3?: number;
    pilar4?: number;
  };
  evidenceComment?: string;
  riskFlag?: string;
}

export interface PrediagnosticQuestion {
  id: string;
  stepNumber: number;
  category: string;
  question: string;
  hint: string;
  foundationTarget: 'pilar1' | 'pilar2' | 'pilar3' | 'pilar4' | 'profile' | 'stated';
  options: QuestionOption[];
}

export const PREDIAGNOSTIC_QUESTIONS: PrediagnosticQuestion[] = [
  {
    id: 'q1',
    stepNumber: 1,
    category: '01 · MOMENTO ACTUAL DE TU ACTIVIDAD',
    question: '¿Cuál de las siguientes realidades describe con mayor exactitud tu situación profesional hoy?',
    hint: 'Determinar con sinceridad tu situación actual nos permite recomendar la solución precisa para tu etapa, sin saltarnos pasos indispensables.',
    foundationTarget: 'profile',
    options: [
      {
        value: 'invisible',
        label: 'Cuento con años de experiencia y dominio técnico, pero todavía no tengo una oferta comercial definida, clara y visible en el mercado.',
        scoreWeight: { pilar1: 5, pilar2: 2 },
        evidenceComment: 'Te ubicas en la etapa de Experto Invisible: amplio conocimiento acumulado pero ausencia de empaquetado comercial estructurado.'
      },
      {
        value: 'saturado',
        label: 'Tengo clientes y facturo, pero vendo mi tiempo 1 a 1 y el negocio depende al 100% de mi esfuerzo físico y operativo diario.',
        scoreWeight: { pilar4: 4, pilar1: 1 },
        evidenceComment: 'Te encuentras en la etapa de Profesional Saturado: negocio en marcha pero con un techo crítico de tiempo y agotamiento personal.'
      },
      {
        value: 'legado',
        label: 'Tengo una trayectoria consolidada y necesito sistematizar mi método en activos, productos digitales e IA para no depender de mi presencia.',
        scoreWeight: { pilar4: 4, pilar2: 2 },
        evidenceComment: 'Te encuentras en la etapa de Visionario del Legado: buscas empaquetar tu patrimonio intelectual para que funcione de manera autónoma.'
      }
    ]
  },
  {
    id: 'q2',
    stepNumber: 2,
    category: '02 · EVIDENCIA: CLARIDAD Y PRODUCTIZACIÓN DE LA OFERTA',
    question: 'Si un cliente potencial calificado te pide una solución, ¿qué tan estandarizada y definida está tu oferta?',
    hint: 'Tener una oferta productizada significa que sabes con exactitud qué incluye, cuánto dura, qué resultado garantiza y cuál es su precio firme sin improvisar.',
    foundationTarget: 'pilar1',
    options: [
      {
        value: '0',
        label: 'No tengo un paquete estándar; suelo escuchar lo que el cliente quiere y redacto propuestas o cotizaciones a medida según la ocasión.',
        scoreWeight: { pilar1: 6 },
        evidenceComment: 'Evidencia crítica: No cuentas con una oferta productizada; operas improvisando servicios a la medida con alto desgaste.'
      },
      {
        value: '1',
        label: 'Tengo varias ideas y servicios en mente, pero me cuesta resumirlos en una propuesta de alto valor con alcance y precio indiscutibles.',
        scoreWeight: { pilar1: 4, pilar2: 1 },
        evidenceComment: 'Evidencia de dispersión: Tienes tracción pero falta ordenar el catálogo en una propuesta central clara y sólida.'
      },
      {
        value: '2',
        label: 'Tengo una oferta central definida, con entregables claros, precio premium probado y resultados comprobables con clientes satisfechos.',
        scoreWeight: { pilar3: 1, pilar4: 2 },
        evidenceComment: 'Evidencia de cimiento validado: Tu oferta central está estructurada y lista para escalar o recibir mayor difusión.'
      }
    ]
  },
  {
    id: 'q3',
    stepNumber: 3,
    category: '03 · EVIDENCIA: PROCESO COMERCIAL Y FIJACIÓN DE PRECIOS',
    question: 'Cuando presentas tus honorarios a un prospecto, ¿qué ocurre habitualmente en la conversación de venta?',
    hint: 'La forma en que el cliente reacciona a tus precios revela si tu problema es de conversión comercial, de encuadre de valor o de autoridad de marca.',
    foundationTarget: 'pilar1',
    options: [
      {
        value: '0',
        label: 'Con frecuencia me dicen que es caro, me piden rebajas o terminan desapareciendo sin responder ("ghosting").',
        scoreWeight: { pilar1: 5, pilar2: 2 },
        evidenceComment: 'Evidencia de fuga comercial: Tu propuesta no transmite valor percibido suficiente o el proceso de cierre no está estructurado.'
      },
      {
        value: '1',
        label: 'Cierro algunos clientes pero el proceso es largo, desgastante y depende de múltiples reuniones y justificaciones.',
        scoreWeight: { pilar1: 3 },
        evidenceComment: 'Evidencia de ineficiencia comercial: Falta un protocolo de cualificación y cierre que filtre a los clientes indecisos.'
      },
      {
        value: '2',
        label: 'Quienes me contactan comprenden el valor de lo que hago y pagan mis tarifas con confianza y sin regatear.',
        scoreWeight: { pilar4: 2, pilar3: 2 },
        evidenceComment: 'Evidencia de conversión validada: Tu proceso comercial funciona adecuadamente y permite sostener precios firmes.'
      }
    ]
  },
  {
    id: 'q4',
    stepNumber: 4,
    category: '04 · TRAYECTORIA RECIENTE: CLIENTES DE PAGO EN LOS ÚLTIMOS 6 MESES',
    question: 'En los últimos 6 meses, ¿cuántos clientes reales han pagado por tu servicio o producto principal?',
    hint: 'La tracción comercial se mide en clientes reales atendidos, lo que nos permite saber si tu oferta ya está probada o si necesita consolidarse.',
    foundationTarget: 'pilar1',
    options: [
      {
        value: '0',
        label: '0 clientes de pago: Aún no tengo facturación ni he cobrado por esta oferta en el mercado.',
        scoreWeight: { pilar1: 6 },
        evidenceComment: 'Punto de partida inicial: Aún no registras clientes de pago recientes; consolidar tu oferta primero evitará que malgastes recursos en etapas avanzadas.'
      },
      {
        value: '1',
        label: '1 o 2 clientes esporádicos: Amigos, conocidos o referidos aislados que han pagado de forma excepcional.',
        scoreWeight: { pilar1: 4, pilar2: 1 },
        evidenceComment: 'Tracción inicial: Clientes esporádicos o conocidos; el siguiente paso es estandarizar tu propuesta para atraer clientes que no te conocen.'
      },
      {
        value: '2',
        label: 'Entre 3 y 9 clientes de pago: He tenido ventas pero los ingresos aún son irregulares e impredecibles.',
        scoreWeight: { pilar1: 2, pilar2: 2, pilar3: 2 },
        evidenceComment: 'Tracción en marcha: Cuentas con validación pero tus ventas son irregulares; necesitas consolidar tu proceso comercial y flujo de prospectos.'
      },
      {
        value: '3',
        label: 'Más de 10 clientes de pago: Cuento con flujo comercial activo, demanda comprobada y clientes habituales.',
        scoreWeight: { pilar4: 3, pilar3: 2 },
        evidenceComment: 'Tracción confirmada: Tienes un flujo continuo de clientes que respalda tu experiencia y te permite dar el salto a sistematizar.'
      }
    ]
  },
  {
    id: 'q5',
    stepNumber: 5,
    category: '05 · EVIDENCIA: AUTORIDAD Y PERCEPCIÓN DE MARCA',
    question: 'Si un prospecto compara tu perfil o propuesta con otros profesionales de tu área, ¿por qué razón te elegiría?',
    hint: 'La autoridad de marca hace que el cliente te busque por quién eres y no por ser la opción más económica de la lista.',
    foundationTarget: 'pilar2',
    options: [
      {
        value: '0',
        label: 'Sinceramente me perciben como uno más; mi comunicación o perfil no muestra una diferencia contundente frente a otros.',
        scoreWeight: { pilar2: 5, pilar1: 1 },
        evidenceComment: 'Evidencia de comoditización: Tu autoridad profesional no está respaldada por activos de marca ni mensaje diferencial.'
      },
      {
        value: '1',
        label: 'Tengo gran reputación en mi círculo cercano, pero afuera en el mercado digital soy prácticamente desconocido.',
        scoreWeight: { pilar2: 4, pilar3: 1 },
        evidenceComment: 'Evidencia de marca no proyectada: Tienes la experiencia pero te faltan los activos públicos de posicionamiento.'
      },
      {
        value: '2',
        label: 'Soy un referente reconocido en mi especialidad; los clientes llegan buscando trabajar específicamente conmigo.',
        scoreWeight: { pilar4: 2, pilar3: 2 },
        evidenceComment: 'Evidencia de marca consolidada: Cuentas con autoridad y reputación probadas en tu sector.'
      }
    ]
  },
  {
    id: 'q6',
    stepNumber: 6,
    category: '06 · EVIDENCIA: CONTENIDO Y GENERACIÓN DE DEMANDA',
    question: '¿Qué tipo de atención genera tu presencia digital o tus publicaciones en redes sociales hoy?',
    hint: 'El contenido estratégico no busca aplausos vacíos ni likes de amigos; busca atraer tomadores de decisión con presupuesto para comprarte.',
    foundationTarget: 'pilar3',
    options: [
      {
        value: '0',
        label: 'No publico o lo hago de manera esporádica e improvisada; no tengo tiempo ni un sistema para generar contenido.',
        scoreWeight: { pilar3: 4, pilar1: 1 },
        evidenceComment: 'Evidencia de canal inexistente: No cuentas con un motor de atracción orgánica ni presencia recurrente en canales clave.'
      },
      {
        value: '1',
        label: 'Publico con esfuerzo pero solo consigo interacciones de curiosos, colegas o personas que buscan consejos gratuitos.',
        scoreWeight: { pilar3: 4, pilar1: 2 },
        evidenceComment: 'Evidencia de contenido desalineado de la venta: Tu contenido no está diseñado con guiones de conversión comercial.'
      },
      {
        value: '2',
        label: 'Tengo un sistema constante de contenido que atrae prospectos cualificados y genera conversaciones de venta con regularidad.',
        scoreWeight: { pilar4: 2 },
        evidenceComment: 'Evidencia de motor de contenidos activo: Tu estrategia de difusión genera demanda cualificada de forma predecible.'
      }
    ]
  },
  {
    id: 'q7',
    stepNumber: 7,
    category: '07 · EVIDENCIA: CAPACIDAD OPERATIVA Y CUELLO DE BOTELLA',
    question: 'Si el próximo mes te llegaran 10 nuevos clientes que aceptan tu servicio al instante, ¿qué sucedería con tu vida?',
    hint: 'Revela si tu negocio está preparado para crecer o si tu modelo actual colapsaría bajo mayor demanda.',
    foundationTarget: 'pilar4',
    options: [
      {
        value: '0',
        label: 'Colapsaría por completo; no tendría horas físicas para atenderlos y tendría que rechazar clientes o quemarme de estrés.',
        scoreWeight: { pilar4: 5, pilar1: 1 },
        evidenceComment: 'Evidencia de cuello de botella crítico: Tu modelo de entrega es 100% manual y no resiste un aumento de demanda sin destruirte.'
      },
      {
        value: '1',
        label: 'Podría absorber algunos con dificultad, pero se deterioraría la calidad de mi entrega y terminaría trabajando noches y fines de semana.',
        scoreWeight: { pilar4: 3 },
        evidenceComment: 'Evidencia de fragilidad operativa: Necesitas estructurar metodologías y automatizaciones antes de acelerar la captación.'
      },
      {
        value: '2',
        label: 'Podría recibirlos sin problemas gracias a mis metodologías estructuradas, activos digitales o sistemas de IA.',
        scoreWeight: { pilar3: 2, pilar2: 1 },
        evidenceComment: 'Evidencia de capacidad operativa: Cuentas con infraestructura suficiente para asumir mayor volumen de negocio.'
      }
    ]
  },
  {
    id: 'q8',
    stepNumber: 8,
    category: '08 · EVIDENCIA: ACTIVOS DIGITALES Y METODOLOGÍA PROPIA',
    question: '¿Qué porcentaje de tu conocimiento profesional está empaquetado en herramientas, manuales o activos que operen sin ti?',
    hint: 'Los activos incluyen productos digitales, entrenamientos en video, guías metodológicas, herramientas de software o agentes de IA propios.',
    foundationTarget: 'pilar4',
    options: [
      {
        value: '0',
        label: '0%: Todo mi conocimiento está en mi cabeza y lo entrego exclusivamente en vivo mediante mi tiempo presente.',
        scoreWeight: { pilar1: 3 },
        evidenceComment: 'Evidencia de dependencia absoluta del tiempo: Tu conocimiento no ha sido transformado en activos reutilizables.'
      },
      {
        value: '1',
        label: 'Tengo materiales dispersos (documentos, plantillas o grabaciones), pero no constituyen un producto empaquetado ni vendible.',
        scoreWeight: { pilar1: 2, pilar4: 2 },
        evidenceComment: 'Evidencia de activos desarticulados: Tienes material de gran valor que requiere ser empaquetado en una solución digital.'
      },
      {
        value: '2',
        label: 'Tengo activos productizados y sistemas con IA que entregan valor y generan ingresos sin necesidad de mi intervención directa.',
        scoreWeight: { pilar4: 3 },
        evidenceComment: 'Evidencia de productización madura: Cuentas con activos digitales operando en tu modelo de negocio.'
      }
    ]
  },
  {
    id: 'q9',
    stepNumber: 9,
    category: '09 · ESTRUCTURA OPERATIVA: MANUALES Y DOCUMENTACIÓN DE TU MÉTODO',
    question: 'Si mañana contrataras a un asistente o quisieras desplegar un Agente de IA para entregar tu servicio, ¿qué documentación encontraría?',
    hint: 'Para que un negocio pueda delegar o sistematizarse con herramientas de IA, sus procesos deben estar ordenados en guías claras.',
    foundationTarget: 'pilar4',
    options: [
      {
        value: '0',
        label: 'Nada documentado: Todo se improvisa en vivo según lo que el cliente pida en cada sesión; está 100% en mi cabeza.',
        scoreWeight: { pilar1: 5 },
        evidenceComment: 'Oportunidad de estandarización: Tu entrega es muy personalizada y vive en tu mente; antes de automatizar te conviene estructurar tu paso a paso en el Pilar 1.'
      },
      {
        value: '1',
        label: 'Apuntes, presentaciones o plantillas sueltas, pero ningún manual estandarizado paso a paso que otra persona o IA pueda replicar.',
        scoreWeight: { pilar1: 3, pilar4: 1 },
        evidenceComment: 'Materiales valiosos en desarrollo: Tienes piezas útiles que necesitan convertirse en un método empaquetado para ahorrarte tiempo.'
      },
      {
        value: '2',
        label: 'Tengo un método claro estructurado que sigo en orden, pero todavía requiere mi acompañamiento manual en cada etapa.',
        scoreWeight: { pilar4: 3, pilar2: 1 },
        evidenceComment: 'Método probado en vivo: Tienes una secuencia clara lista para transformarse en productos digitales o activos con IA.'
      },
      {
        value: '3',
        label: 'Metodología productizada con manuales operativos, guías y entregables estandarizados lista para delegar o automatizar con IA.',
        scoreWeight: { pilar4: 5 },
        evidenceComment: 'Estructura madura y lista: Cuentas con la base procedimental para multiplicar tu impacto con tecnología y agentes de IA.'
      }
    ]
  },
  {
    id: 'q10',
    stepNumber: 10,
    category: '10 · PRIORIDAD DECLARADA (LO QUE TÚ CREES QUE NECESITAS)',
    question: 'Si tuvieras que contratar hoy mismo una consultoría estratégica, ¿cuál de los siguientes servicios solicitarías en primer lugar?',
    hint: 'Esta es tu intuición inicial. El diagnóstico la analizará frente a tu situación actual para confirmar si es el paso más rentable hoy o si hay algo previo que resolver.',
    foundationTarget: 'stated',
    options: [
      {
        value: 'pilar1',
        label: 'Estrategia Comercial & Validación de Oferta: Ordenar mi modelo, crear una oferta irresistible y un sistema de venta predecible.',
        scoreWeight: { pilar1: 1 }
      },
      {
        value: 'pilar2',
        label: 'Posicionamiento de Marca Personal & Autoridad: Construir mis activos de marca para ser reconocido como un referente indiscutible.',
        scoreWeight: { pilar2: 1 }
      },
      {
        value: 'pilar3',
        label: 'Sistema de Contenidos de Ventas & Redes: Generar visibilidad continua, guiones de video y captación de clientes cualificados.',
        scoreWeight: { pilar3: 1 }
      },
      {
        value: 'pilar4',
        label: 'Sistematización de Negocio, Activos Digitales & IA: Escalar sin vender mi tiempo, crear productos digitales y desplegar agentes de IA.',
        scoreWeight: { pilar4: 1 }
      }
    ]
  },
  {
    id: 'q11',
    stepNumber: 11,
    category: '11 · PRUEBA DE CAPACIDAD: ¿QUÉ PASARÍA ANTE 40 PROSPECTOS EN UN DÍA?',
    question: 'Imagina que una campaña o video tuyo se hace viral y mañana te contactan 40 personas interesadas en tus servicios. ¿Cuál sería el mayor obstáculo para convertir esa atención en facturación limpia?',
    hint: 'Este ejercicio mental revela cuál es el eslabón de tu negocio que requiere atención prioritaria para crecer con tranquilidad.',
    foundationTarget: 'pilar1',
    options: [
      {
        value: 'offer',
        label: 'No tener una oferta única empaquetada con precio firme; tendría que improvisar presupuestos y perdería a la mayoría.',
        scoreWeight: { pilar1: 6 },
        evidenceComment: 'Punto ciego en la oferta: El verdadero desafío no es la falta de personas interesadas, sino contar con una oferta clara y lista para cerrar.'
      },
      {
        value: 'sales',
        label: 'No tener un embudo o protocolo comercial para filtrar, agendar y cerrar ventas sin pasarme el día en llamadas improductivas.',
        scoreWeight: { pilar1: 5 },
        evidenceComment: 'Oportunidad en el cierre: Requiere un protocolo comercial que califique al prospecto y cierre llamadas con fluidez.'
      },
      {
        value: 'brand',
        label: 'Que al buscarme en internet o ver mis perfiles duden de mi autoridad y no estén dispuestos a pagar tarifas altas.',
        scoreWeight: { pilar2: 5 },
        evidenceComment: 'Oportunidad de autoridad: Hace falta consolidar tu presencia y activos de marca para sostener precios premium.'
      },
      {
        value: 'scale',
        label: 'Que si cierro a la mitad no tendría tiempo ni vida para atenderlos a todos; mi cuello de botella es la entrega operativa.',
        scoreWeight: { pilar4: 5 },
        evidenceComment: 'Oportunidad de escala: Vendes tus horas personales; tu camino más rápido a la tranquilidad es sistematizar la entrega.'
      },
      {
        value: 'visibility',
        label: 'En realidad mi oferta y mi entrega están impecables; lo único que me falta de verdad es justamente que más gente me conozca.',
        scoreWeight: { pilar3: 4 },
        evidenceComment: 'Cimiento sólido: Tu oferta funciona; tu acelerador natural es la difusión estratégica y los contenidos orientados a venta.'
      }
    ]
  },
  {
    id: 'q12',
    stepNumber: 12,
    category: '12 · MOMENTO DE SINCERIDAD: EL VERDADERO FRENO DE TU NEGOCIO HOY',
    question: 'Siendo 100% honesto contigo mismo, ¿cuál es la razón de fondo por la que hoy tu negocio no factura lo que deseas?',
    hint: 'La honestidad contigo mismo es el atajo más rápido hacia los resultados: enfocar la energía donde realmente mueve la aguja.',
    foundationTarget: 'pilar1',
    options: [
      {
        value: 'pilar1_bias',
        label: 'Sinceramente me he enfocado en pensar en cursos, diseño, automatizaciones o redes cuando en el fondo sé que mi oferta central no está clara ni validada.',
        scoreWeight: { pilar1: 7 },
        evidenceComment: 'Sinceridad estratégica: Reconoces que antes de invertir en cursos, diseño o redes, la prioridad más rentable es definir y validar tu oferta central.'
      },
      {
        value: 'pilar2_bias',
        label: 'Sé exactamente qué solución entrego y funciona con clientes, pero soy un desconocido en el mercado digital y nadie me percibe como autoridad.',
        scoreWeight: { pilar2: 7 },
        evidenceComment: 'Claridad en tu posicionamiento: Tu trabajo es excelente pero necesitas proyectar tu estatus de referente para cobrar lo que mereces.'
      },
      {
        value: 'pilar3_bias',
        label: 'Tengo buena oferta y reputación, pero no tengo un canal activo y constante de contenidos que genere llamadas comerciales regulares.',
        scoreWeight: { pilar3: 7 },
        evidenceComment: 'Claridad en la captación: Tu modelo funciona; lo que necesitas es instalar un motor continuo de atracción de clientes cualificados.'
      },
      {
        value: 'pilar4_bias',
        label: 'Tengo clientes y facturación de sobra, pero mi negocio depende tanto de mis horas presenciales que estoy al borde del colapso operativo.',
        scoreWeight: { pilar4: 7 },
        evidenceComment: 'Claridad en la escalabilidad: Has validado tu valor; tu paso prioritario es liberarte operativamente con activos digitales e IA.'
      }
    ]
  },
  {
    id: 'q13',
    stepNumber: 13,
    category: '13 · HISTORIAL: EXPERIENCIAS Y RECURSOS INVERTIDOS',
    question: 'En los últimos meses, ¿en qué área has invertido tiempo, dinero o energía sin conseguir el retorno esperado?',
    hint: 'Identificar dónde has tenido frustraciones pasadas ayuda a evitar repetir el error de construir sobre cimientos débiles.',
    foundationTarget: 'pilar1',
    options: [
      {
        value: 'content',
        label: 'Invertí en redes sociales, reels o diseño visual, pero solo obtuve "likes" de curiosos y casi ninguna venta real.',
        scoreWeight: { pilar3: 4, pilar1: 2 },
        evidenceComment: 'Evidencia histórica: Inversión en visibilidad sin guiones comerciales de venta; necesitas el motor Viral Sales Content.'
      },
      {
        value: 'brand',
        label: 'Cambié logotipos, web o estética, pero sigo con la misma dificultad para justificar mis precios y cerrar clientes.',
        scoreWeight: { pilar2: 4, pilar1: 2 },
        evidenceComment: 'Evidencia histórica: El diseño cosmético no sustituye la verdadera autoridad de Marca Personal ni el posicionamiento de referente.'
      },
      {
        value: 'sales',
        label: 'Intenté prospectar o insistir en ventas, pero sentí mucho desgaste y tuve que rebajar mis precios para que aceptaran.',
        scoreWeight: { pilar1: 4, pilar2: 2 },
        evidenceComment: 'Evidencia histórica: Vender a la fuerza sin posicionamiento de autoridad deteriora los márgenes y desgasta al consultor.'
      },
      {
        value: 'scale',
        label: 'Sumé más clientes pero terminé agotado, trabajando fines de semana y sin tiempo para mi vida personal.',
        scoreWeight: { pilar4: 5 },
        evidenceComment: 'Evidencia histórica: Crecer en el modelo tradicional de vender horas genera saturación; urge sistematizar con IA.'
      },
      {
        value: 'none',
        label: 'No he probado ninguna estrategia formal todavía; he operado de forma completamente empírica e intuitiva.',
        scoreWeight: { pilar1: 3 },
        evidenceComment: 'Sin antecedentes estratégicos formales: Momento propicio para construir con orden desde los cimientos.'
      }
    ]
  },
  {
    id: 'q14',
    stepNumber: 14,
    category: '14 · RESULTADO CONCRETO Y TRANSFORMACIÓN ESPERADA',
    question: 'Si realizáramos un acompañamiento estratégico personalizado, ¿cuál es la primera victoria concreta que necesitas celebrar?',
    hint: 'Alinear tus expectativas con el resultado medible de mayor impacto directo en tu negocio.',
    foundationTarget: 'pilar1',
    options: [
      {
        value: 'clarity',
        label: 'Tener una oferta central clara y de alto valor, saber a quién le hablo y contar con un proceso comercial que cierre ventas con fluidez.',
        scoreWeight: { pilar1: 5 },
        evidenceComment: 'Objetivo prioritario: Claridad estratégica, oferta productizada y conversión comercial robusta.'
      },
      {
        value: 'authority',
        label: 'Ser reconocido en el mercado como la máxima autoridad de mi nicho, con activos de marca que atraigan confianza de alto nivel.',
        scoreWeight: { pilar2: 5 },
        evidenceComment: 'Objetivo prioritario: Autoridad de marca personal y posicionamiento premium indiscutible.'
      },
      {
        value: 'leads',
        label: 'Instalar un sistema continuo de contenidos y guiones de venta que atraiga un flujo regular de prospectos con presupuesto real.',
        scoreWeight: { pilar3: 5 },
        evidenceComment: 'Objetivo prioritario: Máquina de captación mediante contenidos comerciales y viralidad estratégica.'
      },
      {
        value: 'system',
        label: 'Sistematizar mi método en productos digitales y agentes de IA para desacoplar mis ingresos de mis horas de trabajo físico.',
        scoreWeight: { pilar4: 4 },
        evidenceComment: 'Objetivo prioritario: Modelo de negocio digital escalable, activos monetizables y automatización con IA.'
      }
    ]
  }
];
