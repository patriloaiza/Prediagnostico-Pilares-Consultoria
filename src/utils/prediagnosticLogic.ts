// Algoritmo de Verificación de Cimientos y Prediagnóstico Estratégico
// Metodología CREA Y MONETIZA® · Patricia Loaiza

import {
  PILLARS_DATA,
  EVOLUTIONARY_PROFILES,
  PREDIAGNOSTIC_QUESTIONS,
  PillarInfo,
  EvolutionaryProfile
} from '../data/prediagnosticData';

export interface UserLeadInfo {
  name: string;
  email: string;
  whatsapp: string;
  profession: string;              // Profesión o Área de Especialidad
  currentActivity: string;         // A qué se dedica hoy y a quién ayuda
  commercializationModel: string;  // Modelo de comercialización actual (servicios 1 a 1, infoproductos, etc.)
  payingClientsStatus: string;     // Situación real con clientes de pago
  company?: string;
  role?: string;
}

export interface PrediagnosticAnswers {
  [questionId: string]: string;
}

export interface IncoherenceDetail {
  id: string;
  severity: 'critica' | 'alta' | 'moderada';
  title: string;
  statementA: {
    questionNumber: number;
    questionCategory: string;
    answerText: string;
  };
  statementB: {
    questionNumber: number;
    questionCategory: string;
    answerText: string;
  };
  verdict: string;
  revealedTruth: string;
  actionRequired: string;
}

export interface PrediagnosticResult {
  lead: UserLeadInfo;
  profile: EvolutionaryProfile;
  recommendedPillar: PillarInfo;
  statedPillar: PillarInfo;
  hasContradiction: boolean;
  contradictionAnalysis: {
    title: string;
    explanation: string;
    riskOfSkipping: string;
  } | null;
  hasInternalIncoherence: boolean;
  detectedIncoherences: IncoherenceDetail[];
  gatingAnalysis: {
    isPilar4Blocked: boolean;
    isPilar3Blocked: boolean;
    blockReasonPilar4?: string;
    blockReasonPilar3?: string;
  };
  foundationStatus: {
    pilar1Score: number;
    pilar2Score: number;
    pilar3Score: number;
    pilar4Score: number;
    offerClarityOk: boolean;
    payingClientsOk: boolean;
    salesProcessOk: boolean;
    positioningOk: boolean;
    contentEngineOk: boolean;
    deliveryDocsOk: boolean;
    freedomScaleOk: boolean;
    incoherenceDetected: boolean;
  };
  evidences: string[];
  notFirstAdvice: {
    title: string;
    warning: string;
    recommendation: string;
  };
  strategicSummary: string;
  timestamp: string;
  scores: Record<string, number>;
}

export const COMMERCIAL_MODELS_LABELS: Record<string, string> = {
  servicios_1a1: 'Servicios profesionales / Consultoría 1 a 1 personalizada',
  infoproductos_cursos: 'Cursos grabados, talleres o productos digitales (infoproductos)',
  productos_fisicos: 'Productos físicos / Comercio / Agencia con equipo',
  servicios_y_productos: 'Combinación de servicios 1 a 1 y cursos/talleres',
  aun_no_comercializo: 'Aún no comercializo servicios ni productos (fase de idea o transición)'
};

export const PAYING_CLIENTS_LABELS: Record<string, string> = {
  activos_recurrentes: 'Clientes de pago recurrentes y agenda activa constante',
  irregulares: 'Clientes esporádicos o irregulares (meses buenos y meses en cero)',
  pocos_pasados: 'Pocos clientes en el pasado; actualmente con dificultad para cerrar',
  sin_clientes: 'Aún no he tenido mi primer cliente de pago en este negocio'
};

/**
 * Algoritmo de cálculo multicriterio con verificación de cimientos fácticos
 * e inmunidad contra sesgos declarados del prospecto.
 */
export function calculatePrediagnostic(
  answers: PrediagnosticAnswers,
  lead: UserLeadInfo
): PrediagnosticResult {
  const scores = {
    pilar1: 0,
    pilar2: 0,
    pilar3: 0,
    pilar4: 0
  };

  const evidences: string[] = [];

  // Sumar ponderaciones según respuestas del prospecto
  PREDIAGNOSTIC_QUESTIONS.forEach((q) => {
    const selectedVal = answers[q.id];
    if (!selectedVal) return;

    const opt = q.options.find((o) => o.value === selectedVal);
    if (opt) {
      if (opt.scoreWeight) {
        if (opt.scoreWeight.pilar1) scores.pilar1 += opt.scoreWeight.pilar1;
        if (opt.scoreWeight.pilar2) scores.pilar2 += opt.scoreWeight.pilar2;
        if (opt.scoreWeight.pilar3) scores.pilar3 += opt.scoreWeight.pilar3;
        if (opt.scoreWeight.pilar4) scores.pilar4 += opt.scoreWeight.pilar4;
      }
      if (opt.evidenceComment) {
        evidences.push(opt.evidenceComment);
      }
    }
  });

  // Determinar perfil evolutivo del prospecto
  const profileKey = answers.q1 || 'invisible';
  const profile = EVOLUTIONARY_PROFILES[profileKey] || EVOLUTIONARY_PROFILES.invisible;

  // Helper para extraer el texto legible de la opción seleccionada
  const getOptText = (qId: string, val: string) => {
    const q = PREDIAGNOSTIC_QUESTIONS.find((item) => item.id === qId);
    return q?.options.find((o) => o.value === val)?.label || val;
  };

  // =========================================================================
  // GATES DE VIABILIDAD Y AUDITORÍA DE PRERREQUISITOS (METODOLOGÍA CREA Y MONETIZA®)
  // =========================================================================
  const lacksOfferValidation = answers.q2 === '0' || answers.q2 === '1';
  const lacksPayingClients =
    answers.q4 === '0' ||
    answers.q4 === '1' ||
    lead.payingClientsStatus === 'sin_clientes' ||
    lead.payingClientsStatus === 'pocos_pasados';
  const lacksDeliverablesDocs = answers.q9 === '0';
  const hasOfferStressBottleneck = answers.q11 === 'offer';
  const doesNotCommercialize = lead.commercializationModel === 'aun_no_comercializo';
  const confessedOfferBias = answers.q12 === 'pilar1_bias';

  // PILAR 4 (Sistematización & IA): Requiere OBLIGATORIAMENTE oferta probada, clientes reales y método
  const isPilar4Blocked =
    lacksOfferValidation ||
    lacksPayingClients ||
    lacksDeliverablesDocs ||
    hasOfferStressBottleneck ||
    doesNotCommercialize ||
    confessedOfferBias;

  // PILAR 3 (Viral Sales Content): Requiere oferta estructurada que no se improvise a medida
  const isPilar3Blocked =
    answers.q2 === '0' ||
    answers.q4 === '0' ||
    answers.q11 === 'offer' ||
    doesNotCommercialize;

  // =========================================================================
  // MOTOR DE CONTROL DE VERACIDAD: AUDITORÍA DE INCOHERENCIAS CRUZADAS
  // =========================================================================
  const detectedIncoherences: IncoherenceDetail[] = [];

  // 1. INCOHERENCIA DE SISTEMATIZACIÓN PREMATURA (Pide P4 o sistema en Q10/Q14 sin cimientos)
  if ((answers.q10 === 'pilar4' || answers.q14 === 'system') && isPilar4Blocked) {
    let reasonText = '';
    let triggeringQNum = 2;
    let triggeringCategory = 'Claridad y Productización de Oferta';
    let triggeringText = getOptText('q2', answers.q2);

    if (doesNotCommercialize) {
      reasonText = 'aún no comercializas ningún producto ni servicio en el mercado';
      triggeringCategory = 'Modelo de Comercialización Inicial';
      triggeringText = COMMERCIAL_MODELS_LABELS[lead.commercializationModel] || 'Fase de idea';
    } else if (lacksPayingClients) {
      triggeringQNum = 4;
      triggeringCategory = 'Historial de Clientes de Pago';
      triggeringText = getOptText('q4', answers.q4);
      reasonText = 'no tienes un flujo comprobado de clientes de pago recientes';
    } else if (lacksOfferValidation) {
      triggeringQNum = 2;
      triggeringCategory = 'Claridad y Productización de Oferta';
      triggeringText = getOptText('q2', answers.q2);
      reasonText = 'tu oferta no está estandarizada ni tiene precio firme (cotizas a la medida)';
    } else if (lacksDeliverablesDocs) {
      triggeringQNum = 9;
      triggeringCategory = 'Procedimientos y Documentación de Entrega';
      triggeringText = getOptText('q9', answers.q9);
      reasonText = 'tu servicio se improvisa en vivo y no existe ningún manual ni entregable estandarizado';
    } else if (hasOfferStressBottleneck) {
      triggeringQNum = 11;
      triggeringCategory = 'Prueba de Estrés (40 Prospectos)';
      triggeringText = getOptText('q11', answers.q11);
      reasonText = 'tu mayor cuello de botella confesado es no tener una oferta única con precio firme';
    }

    detectedIncoherences.push({
      id: 'incoherence_premature_systematization',
      severity: 'critica',
      title: 'El Peligro de Automatizar antes de Validar: Primero la Venta, Luego el Sistema',
      statementA: {
        questionNumber: answers.q10 === 'pilar4' ? 10 : 14,
        questionCategory: 'Servicio que Buscabas / Meta Deseada',
        answerText: answers.q10 === 'pilar4' ? getOptText('q10', answers.q10) : getOptText('q14', answers.q14)
      },
      statementB: {
        questionNumber: triggeringQNum,
        questionCategory: triggeringCategory,
        answerText: triggeringText
      },
      verdict: `Diagnóstico Estratégico: Tu intuición fue buscar sistematización con activos digitales y agentes de IA (Pilar 4), pero la realidad de tu negocio demuestra que ${reasonText}.`,
      revealedTruth:
        'En la Metodología CREA Y MONETIZA® de Patricia Loaiza cuidamos tu tiempo y dinero: automatizar un servicio que aún no se vende con fluidez en vivo genera gastos innecesarios y frustración. Primero creamos una oferta que convierta con facilidad en el mercado real.',
      actionRequired:
        'Tu camino más rentable y seguro es empezar por el Pilar 1 (Estrategia Comercial BMS): definir tu oferta irresistible, tus entregables y tu precio antes de sistematizar.'
    });
  }

  // 2. INCOHERENCIA DE TRÁFICO EN BALDE AGUJEREADO (Pide P3 o contenidos en Q10/Q14 sin oferta)
  if ((answers.q10 === 'pilar3' || answers.q14 === 'leads') && isPilar3Blocked) {
    detectedIncoherences.push({
      id: 'incoherence_traffic_without_offer',
      severity: 'critica',
      title: 'El Espejismo de las Redes: Más Seguidores no te darán Clientes sin una Oferta Irresistible',
      statementA: {
        questionNumber: answers.q10 === 'pilar3' ? 10 : 14,
        questionCategory: 'Servicio Deseado / Meta',
        answerText: answers.q10 === 'pilar3' ? getOptText('q10', answers.q10) : getOptText('q14', answers.q14)
      },
      statementB: {
        questionNumber: answers.q2 === '0' ? 2 : (answers.q4 === '0' ? 4 : 11),
        questionCategory: answers.q2 === '0' ? 'Productización de Oferta' : (answers.q4 === '0' ? 'Clientes de Pago' : 'Capacidad de Cierre'),
        answerText: answers.q2 === '0' ? getOptText('q2', answers.q2) : (answers.q4 === '0' ? getOptText('q4', answers.q4) : getOptText('q11', answers.q11))
      },
      verdict:
        'Diagnóstico Estratégico: Deseas acelerar la captación con contenidos y redes (Pilar 3), pero tu oferta comercial todavía se improvisa o no cuenta con entregables y precios firmes.',
      revealedTruth:
        'Atraer tráfico masivo sin tener una oferta empaquetada lista para cerrar es como bombear agua en un balde con agujeros: desgasta tu tiempo atendiendo curiosos que piden rebajas o no compran.',
      actionRequired:
        'Primero estructuramos tu oferta de alto valor en el Pilar 1; una vez blindada, cada publicación en redes atraerá compradores listos para pagar.'
    });
  }

  // 3. INCOHERENCIA DE OFERTA VS PRUEBA DE ESTRÉS (Dice tener oferta probada en Q2 pero en estrés no tiene oferta en Q11)
  if (answers.q2 === '2' && answers.q11 === 'offer') {
    detectedIncoherences.push({
      id: 'incoherence_offer_vs_stress',
      severity: 'critica',
      title: 'Tu Oferta ante el Mercado Real: De la Idea en la Mente al Paquete Vendible',
      statementA: {
        questionNumber: 2,
        questionCategory: 'Claridad y Productización de Oferta',
        answerText: getOptText('q2', answers.q2)
      },
      statementB: {
        questionNumber: 11,
        questionCategory: 'Prueba de Capacidad (40 Prospectos Inmediatos)',
        answerText: getOptText('q11', answers.q11)
      },
      verdict:
        'Diagnóstico Estratégico: Considerabas que tu oferta estaba estructurada, pero al imaginar la llegada de 40 clientes nuevos confesaste que tu mayor obstáculo sería no tener una oferta empaquetada con precio firme y tener que improvisar presupuestos.',
      revealedTruth:
        'Tener una gran trayectoria no es lo mismo que tener una oferta productizada. El mercado premia la claridad inmediata y castiga la improvisación.',
      actionRequired:
        'Estandarizar tus entregables y fijar precios inquebrantables en el Pilar 1 para presentar propuestas con total confianza y rapidez.'
    });
  }

  // 4. INCOHERENCIA DE TRÁFICO VS COLAPSO OPERATIVO (Pide contenidos pero ya colapsaría de tiempo)
  if ((answers.q10 === 'pilar3' || answers.q14 === 'leads') && (answers.q7 === '0' || answers.q1 === 'saturado')) {
    detectedIncoherences.push({
      id: 'incoherence_traffic_vs_saturation',
      severity: 'alta',
      title: 'El Riesgo de Saturación: Ordenar tu Entrega antes de Buscar Más Clientes',
      statementA: {
        questionNumber: answers.q10 === 'pilar3' ? 10 : 14,
        questionCategory: 'Servicio Deseado / Meta Inmediata',
        answerText: answers.q10 === 'pilar3' ? getOptText('q10', answers.q10) : getOptText('q14', answers.q14)
      },
      statementB: {
        questionNumber: answers.q7 === '0' ? 7 : 1,
        questionCategory: 'Capacidad Operativa y Horas de Entrega',
        answerText: answers.q7 === '0' ? getOptText('q7', answers.q7) : getOptText('q1', answers.q1)
      },
      verdict:
        'Diagnóstico Estratégico: Deseas más prospectos, pero al mismo tiempo admites que ya estás al límite de tu tiempo o que con clientes nuevos colapsarías de estrés.',
      revealedTruth:
        'Atraer más clientes cuando entregas todo 100% manual afectará tu calidad de vida y la satisfacción de tus clientes. Tu negocio te pide liberar tu tiempo primero.',
      actionRequired:
        'Estructurar tu método en activos escalables o agilizar tu entrega antes de abrir el grifo de prospectos.'
    });
  }

  // 5. INCOHERENCIA DE VIRALIDAD SIN MARCA PERSONAL (Pide contenidos masivos pero es percibido como commodity)
  if ((answers.q10 === 'pilar3' || answers.q14 === 'leads') && (answers.q5 === '0' || answers.q11 === 'brand')) {
    detectedIncoherences.push({
      id: 'incoherence_traffic_without_brand',
      severity: 'alta',
      title: 'La Diferenciación que Falta: Autoridad de Marca antes de Contenidos Masivos',
      statementA: {
        questionNumber: answers.q10 === 'pilar3' ? 10 : 14,
        questionCategory: 'Servicio Deseado / Meta',
        answerText: answers.q10 === 'pilar3' ? getOptText('q10', answers.q10) : getOptText('q14', answers.q14)
      },
      statementB: {
        questionNumber: answers.q5 === '0' ? 5 : 11,
        questionCategory: 'Percepción de Marca y Autoridad',
        answerText: answers.q5 === '0' ? getOptText('q5', answers.q5) : getOptText('q11', answers.q11)
      },
      verdict:
        'Diagnóstico Estratégico: Buscas publicar más en redes, pero en el mercado te perciben como una opción más del montón o prospectos fríos dudarían de tu autoridad.',
      revealedTruth:
        'El contenido masivo sin una marca personal de autoridad atrae clientes que regatean. Para cobrar tarifas altas necesitas ser percibido como el referente indiscutible.',
      actionRequired:
        'Construir tus activos de Marca Personal en el Pilar 2 para que los clientes te elijan por tu reputación y no por ser la opción más económica.'
    });
  }

  // 6. INCOHERENCIA DE AUTORIDAD: Referente Indiscutible (Q5=2) vs Duda de Autoridad ante Prospectos Fríos (Q11='brand')
  if (answers.q5 === '2' && answers.q11 === 'brand') {
    detectedIncoherences.push({
      id: 'incoherence_authority_vs_stress',
      severity: 'alta',
      title: 'El Salto de Autoridad: De ser Conocido en tu Círculo a Referente Digital',
      statementA: {
        questionNumber: 5,
        questionCategory: 'Autoridad y Percepción de Marca',
        answerText: getOptText('q5', answers.q5)
      },
      statementB: {
        questionNumber: 11,
        questionCategory: 'Prueba de Capacidad ante Prospectos Fríos',
        answerText: getOptText('q11', answers.q11)
      },
      verdict:
        'Diagnóstico Estratégico: Tienes una excelente reputación con clientes conocidos, pero ante prospectos fríos en internet cuesta transmitir confianza inmediata.',
      revealedTruth:
        'El boca a boca es excelente pero tiene un techo. En el entorno digital necesitas activos de autoridad que proyecten liderazgo las 24 horas del día.',
      actionRequired:
        'Desarrollar tu arquitectura de mensaje y tus 12 activos de autoridad en el Pilar 2.'
    });
  }

  // 7. INCOHERENCIA COMERCIAL: Oferta Supuestamente Probada (Q2=2) vs Rechazo de Precios y Ghosting Sistemático (Q3='0')
  if (answers.q2 === '2' && answers.q3 === '0') {
    detectedIncoherences.push({
      id: 'incoherence_offer_vs_pricing',
      severity: 'alta',
      title: 'Objeciones de Precio: Cómo Evitar que te Digan "Es Caro" o Desaparezcan',
      statementA: {
        questionNumber: 2,
        questionCategory: 'Claridad y Productización de Oferta',
        answerText: getOptText('q2', answers.q2)
      },
      statementB: {
        questionNumber: 3,
        questionCategory: 'Proceso Comercial y Fijación de Precios',
        answerText: getOptText('q3', answers.q3)
      },
      verdict:
        'Diagnóstico Estratégico: Tu servicio entrega gran valor, pero en la práctica los prospectos piden descuentos o desaparecen tras escuchar la tarifa.',
      revealedTruth:
        'Cuando los prospectos regatean o hacen "ghosting", el obstáculo rara vez es el dinero; casi siempre es la falta de un encuadre de valor irresistible en la propuesta.',
      actionRequired:
        'Reestructurar la propuesta de valor y el protocolo de cierre en el Pilar 1 para que tu tarifa sea indiscutible.'
    });
  }

  // 8. DESACTIVACIÓN DE SESGO POR CONFESIÓN EN EL FILTRO ANTI-SESGO (Q12)
  if (confessedOfferBias && (answers.q10 === 'pilar4' || answers.q10 === 'pilar3')) {
    detectedIncoherences.push({
      id: 'incoherence_anti_bias_confession',
      severity: 'critica',
      title: 'Tu Mayor Acierto: Claridad sobre lo que Tu Negocio Necesita Primero',
      statementA: {
        questionNumber: 10,
        questionCategory: 'Servicio que Considerabas Inicialmente',
        answerText: getOptText('q10', answers.q10)
      },
      statementB: {
        questionNumber: 12,
        questionCategory: 'Momento de Claridad y Sinceridad',
        answerText: getOptText('q12', answers.q12)
      },
      verdict:
        'Diagnóstico Estratégico: Aunque tu intuición inicial miraba hacia cursos o redes, reconociste con total sinceridad que el verdadero freno es que tu oferta central aún no está clara ni validada.',
      revealedTruth:
        'Tener la valentía de reconocer el cimiento que falta es el paso más inteligente de un profesional: te ahorra meses de dar vueltas en círculos sin monetizar.',
      actionRequired:
        'Enfocarnos al 100% en el Pilar 1 (Estrategia Comercial BMS) para construir una oferta que cierre clientes de forma predecible.'
    });
  }

  const hasInternalIncoherence = detectedIncoherences.length > 0;

  // Analizar servicio declarado por el prospecto
  const statedPillarKey = answers.q10 || 'pilar1';
  const statedPillar = PILLARS_DATA[statedPillarKey] || PILLARS_DATA.pilar1;

  // =========================================================================
  // MOTOR DE DECISIÓN MULTICRITERIO DE LOS 4 PILARES (CON HARD GATING)
  // =========================================================================
  let needScoreP1 = scores.pilar1;
  let needScoreP2 = scores.pilar2;
  let needScoreP3 = scores.pilar3;
  let needScoreP4 = scores.pilar4;

  // Impulsos específicos para Pilar 1 (Estrategia Comercial & Oferta BMS):
  if (answers.q2 === '0') needScoreP1 += 12;
  if (answers.q2 === '1') needScoreP1 += 7;
  if (answers.q1 === 'invisible') needScoreP1 += 8;
  if (answers.q4 === '0') needScoreP1 += 12;
  if (answers.q4 === '1') needScoreP1 += 7;
  if (answers.q9 === '0') needScoreP1 += 8;
  if (answers.q11 === 'offer') needScoreP1 += 12;
  if (answers.q11 === 'sales') needScoreP1 += 8;
  if (answers.q12 === 'pilar1_bias') needScoreP1 += 15;
  if (answers.q14 === 'clarity') needScoreP1 += 10;
  if (lead.payingClientsStatus === 'sin_clientes') needScoreP1 += 12;
  if (lead.commercializationModel === 'aun_no_comercializo') needScoreP1 += 15;

  // Impulsos específicos para Pilar 2 (Marca Personal & Autoridad):
  if (answers.q5 === '0') needScoreP2 += 10;
  if (answers.q5 === '1') needScoreP2 += 7;
  if (answers.q11 === 'brand') needScoreP2 += 10;
  if (answers.q12 === 'pilar2_bias') needScoreP2 += 12;
  if (answers.q13 === 'brand') needScoreP2 += 8;
  if (answers.q14 === 'authority') needScoreP2 += 10;
  if (answers.q3 === '0' && answers.q2 === '2') needScoreP2 += 6;

  // Impulsos específicos para Pilar 3 (Motor de Contenidos & Captación):
  if (answers.q6 === '0') needScoreP3 += 9;
  if (answers.q6 === '1') needScoreP3 += 7;
  if (answers.q11 === 'visibility') needScoreP3 += 10;
  if (answers.q12 === 'pilar3_bias') needScoreP3 += 12;
  if (answers.q13 === 'content') needScoreP3 += 8;
  if (answers.q14 === 'leads') needScoreP3 += 10;

  // Impulsos específicos para Pilar 4 (Sistematización & IA):
  if (answers.q1 === 'saturado') needScoreP4 += 8;
  if (answers.q1 === 'legado') needScoreP4 += 8;
  if (answers.q7 === '0') needScoreP4 += 10;
  if (answers.q7 === '1') needScoreP4 += 5;
  if (answers.q8 === '2') needScoreP4 += 5;
  if (answers.q9 === '2' || answers.q9 === '3') needScoreP4 += 8;
  if (answers.q11 === 'scale') needScoreP4 += 10;
  if (answers.q12 === 'pilar4_bias') needScoreP4 += 12;
  if (answers.q13 === 'scale') needScoreP4 += 8;
  if (answers.q14 === 'system') needScoreP4 += 8;

  // =========================================================================
  // APLICACIÓN ESTRICTA DE GATING JERÁRQUICO (INMUNIDAD ANTE SESGOS)
  // =========================================================================
  // Si el prospecto carece de oferta probada, clientes de pago o método estructurado:
  // PILAR 4 QUEDA INMEDIATA Y CATEGÓRICAMENTE VETADO COMO RECOMENDACIÓN PRIMARIA.
  if (isPilar4Blocked) {
    needScoreP4 = -999;
    needScoreP1 += 25; // Reorientar prioridad al cimiento comercial obligatorio
  }

  // Si no tiene oferta estandarizada, PILAR 3 TAMBIÉN QUEDA BLOQUEADO.
  if (isPilar3Blocked) {
    needScoreP3 = Math.min(needScoreP3, needScoreP1 - 15);
    needScoreP1 += 15;
  }

  // Ranking dinámico entre los 4 pilares
  const rankedPillars: Array<{ key: 'pilar1' | 'pilar2' | 'pilar3' | 'pilar4'; score: number }> = [
    { key: 'pilar4', score: needScoreP4 },
    { key: 'pilar3', score: needScoreP3 },
    { key: 'pilar2', score: needScoreP2 },
    { key: 'pilar1', score: needScoreP1 }
  ];

  rankedPillars.sort((a, b) => b.score - a.score);
  const recommendedKey = rankedPillars[0].key;
  const recommendedPillar = PILLARS_DATA[recommendedKey];

  // ==========================================
  // DETECCIÓN DE DISCREPANCIAS (SERVICIO DESEADO VS SERVICIO NECESARIO)
  // ==========================================
  const hasContradiction = statedPillar.id !== recommendedPillar.id;
  let contradictionAnalysis: PrediagnosticResult['contradictionAnalysis'] = null;

  if (hasContradiction) {
    const pair = `${statedPillar.id}->${recommendedPillar.id}`;

    switch (pair) {
      case 'pilar4->pilar1':
        contradictionAnalysis = {
          title: 'El Orden Correcto: Consolidar tu Oferta antes de Automatizar',
          explanation: `Notamos que tu interés inicial era "${statedPillar.name}" (activos digitales y herramientas de IA). Sin embargo, tus respuestas demuestran que tu mayor oportunidad hoy está en empaquetar una oferta irresistible con precio firme y ventas constantes.`,
          riskOfSkipping:
            'En la Metodología CREA Y MONETIZA® cuidamos tu inversión: automatizar un servicio que aún no se vende con fluidez en vivo genera gastos innecesarios y frustración. Primero creamos una oferta que convierta con facilidad en el Pilar 1; luego sistematizamos.'
        };
        break;

      case 'pilar3->pilar1':
        contradictionAnalysis = {
          title: 'El Espejismo de las Redes: Más Seguidores no te darán Clientes sin una Oferta Irresistible',
          explanation: `Manifestaste interés en "${statedPillar.name}" (redes y contenidos), pero la realidad de tu negocio demuestra que tu oferta aún no está estandarizada con precio firme ni protocolo de cierre predecible.`,
          riskOfSkipping:
            'Producir contenido viral o buscar más visibilidad sin una oferta clara de alto valor es como bombear agua en un balde agujereado: atraerás curiosos o personas que piden rebajas, desgastando tu energía sin lograr ingresos reales. Primero consolidamos tu oferta en el Pilar 1; luego aceleramos el contenido.'
        };
        break;

      case 'pilar1->pilar2':
        contradictionAnalysis = {
          title: 'Discrepancia de Diagnóstico: Rehacer Oferta vs Autoridad de Marca',
          explanation: `Manifestaste interés en revisar tu oferta comercial ("${statedPillar.name}"), pero la evidencia demuestra que tu cuello de botella no es lo que entregas, sino cómo te percibe el mercado: te ven como una opción genérica o eres desconocido fuera de tu círculo.`,
          riskOfSkipping:
            'Modificar el alcance de tu servicio o bajar precios sin construir tu Marca Personal de autoridad perpetuará que compitas contra otros profesionales por precio en lugar de ser elegido por reputación indiscutible.'
        };
        break;

      case 'pilar1->pilar3':
        contradictionAnalysis = {
          title: 'Discrepancia de Tracción: Perfeccionar Oferta vs Generar Demanda Real',
          explanation: `Pensaste en contratar estructuración de oferta ("${statedPillar.name}"), pero tus respuestas confirman que tu servicio ya es sólido; tu problema es que nadie se entera de que existes porque no tienes un motor de contenidos ni presencia activa en redes.`,
          riskOfSkipping:
            'Quedarte atrapado en el perfeccionamiento eterno de tu oferta sin un sistema de captación es tener el mejor producto en una tienda a oscuras. Necesitas atraer compradores cualificados con Viral Sales Content.'
        };
        break;

      case 'pilar1->pilar4':
        contradictionAnalysis = {
          title: 'Discrepancia Operativa: Nuevas Ofertas vs Colapso de Horas Físicas',
          explanation: `Solicitaste estrategia de oferta ("${statedPillar.name}"), pero tu verdadero dolor es que estás saturado vendiendo horas físicas 1 a 1 y colapsarías de estrés si entran nuevos clientes.`,
          riskOfSkipping:
            'Crear o vender más servicios manuales sin antes sistematizar tu metodología en activos digitales y agentes de IA aumentará tu agotamiento y pondrá en riesgo la calidad de entrega y tu salud.'
        };
        break;

      case 'pilar2->pilar1':
        contradictionAnalysis = {
          title: 'Discrepancia de Base: Marca Personal vs Oferta Comercial Vendible',
          explanation: `Buscabas trabajar tu posicionamiento de marca ("${statedPillar.name}"), pero aún no cuentas con una oferta central productizada con precio firme ni protocolo de cierre predecible.`,
          riskOfSkipping:
            'Proyectar una marca de prestigio sin una oferta empaquetada ni un proceso comercial de cierre generará expectativas que no podrás monetizar. Primero definimos tu Oferta BMS; luego blindamos la marca.'
        };
        break;

      case 'pilar2->pilar3':
        contradictionAnalysis = {
          title: 'Discrepancia de Distribución: Activos de Marca vs Flujo de Demanda',
          explanation: `Tu intuición pedía posicionamiento de marca ("${statedPillar.name}"), pero tu reputación y mensaje ya tienen respaldo; tu verdadera carencia es un canal de atracción continua que transforme atención en llamadas comerciales con regularidad.`,
          riskOfSkipping:
            'Seguir puliendo la imagen o la bio sin instalar guiones de venta ni un calendario de generación de demanda te dejará con una marca impecable pero sin prospectos calificados en la agenda.'
        };
        break;

      case 'pilar2->pilar4':
        contradictionAnalysis = {
          title: 'Discrepancia de Capacidad: Posicionamiento vs Liberación de Tiempo con IA',
          explanation: `Creíste requerir mayor autoridad de marca ("${statedPillar.name}"), pero tu modelo actual ya te tiene al límite de tu capacidad operativa y vendes el 100% de tu tiempo en vivo.`,
          riskOfSkipping:
            'Más autoridad atraerá clientes que no tendrás tiempo físico de atender sin colapsar. La prioridad no negociable es sistematizar tu conocimiento en productos digitales y desplegar agentes de IA en el Pilar 4.'
        };
        break;

      case 'pilar3->pilar2':
        contradictionAnalysis = {
          title: 'Discrepancia de Autoridad: Contenido Masivo vs Marca Personal de Referente',
          explanation: `Creíste necesitar "${statedPillar.name}", pero la evidencia demuestra que en el mercado aún te perciben como una opción genérica o dudan de tu estatus ante prospectos fríos.`,
          riskOfSkipping:
            'Publicar contenido masivo sin un posicionamiento de marca claro te convierte en un creador de contenido genérico que atrae regateos de precio. Primero debemos blindar los activos de tu Marca Personal y tu mensaje de autoridad.'
        };
        break;

      case 'pilar3->pilar4':
        contradictionAnalysis = {
          title: 'Discrepancia de Capacidad Operativa: Atraer Tráfico vs Colapso de Entrega',
          explanation: `Buscabas captar más clientes mediante contenidos ("${statedPillar.name}"), pero admitiste que con clientes nuevos colapsarías por completo al vender exclusivamente tus horas en vivo.`,
          riskOfSkipping:
            'Acelerar la captación de prospectos cuando el negocio no tiene activos digitales ni automatización con IA deteriorará la calidad de entrega y provocará agotamiento extremo. Primero sistematizamos tu entrega en el Pilar 4.'
        };
        break;

      case 'pilar4->pilar2':
        contradictionAnalysis = {
          title: 'Discrepancia de Tracción: Productos Digitales vs Autoridad de Marca',
          explanation: `Buscabas implementar "${statedPillar.name}", pero el mercado todavía no identifica con suficiente claridad tu liderazgo ni tu propuesta diferencial para convertir tráfico frío.`,
          riskOfSkipping:
            'Un modelo de negocio digital requiere una marca personal que transmita confianza inmediata para convertir prospectos fríos. La marca personal es el activo estratégico que disminuye el costo de adquisición de clientes.'
        };
        break;

      case 'pilar4->pilar3':
        contradictionAnalysis = {
          title: 'Discrepancia de Audiencia: Sistematizar sin Motor de Demanda',
          explanation: `Tu interés era implementar activos digitales y automatización ("${statedPillar.name}"), pero tu ecosistema no cuenta con un flujo activo de prospectos ni presencia en canales que alimenten el sistema.`,
          riskOfSkipping:
            'Construir sistemas automatizados sin un motor de contenidos que atraiga prospectos calificados es construir un puente hacia la nada. Necesitas instalar primero el motor Viral Sales Content en el Pilar 3.'
        };
        break;

      default:
        contradictionAnalysis = {
          title: 'Ajuste de Ruta Estratégica',
          explanation: `Tu intuición inicial se inclinaba hacia "${statedPillar.name}", pero la evidencia multicriterio de tus respuestas demuestra que el verdadero cuello de botella que frena tu crecimiento está en "${recommendedPillar.name}".`,
          riskOfSkipping:
            'Abordar una fase avanzada sin haber consolidado el cimiento que la sustenta genera fugas de tiempo, presupuesto y frustración profesional.'
        };
        break;
    }
  }

  // ==========================================
  // CONSEJO: LO QUE DEFINITIVAMENTE NO DEBES HACER PRIMERO
  // ==========================================
  let notFirstAdvice = {
    title: 'Lo que NO debes hacer primero',
    warning: '',
    recommendation: ''
  };

  switch (recommendedPillar.id) {
    case 'pilar1':
      notFirstAdvice = {
        title: 'NO empieces creando cursos grabados, automatizaciones con IA ni más contenidos en redes',
        warning:
          'Cualquier esfuerzo en redes sociales, herramientas de IA o infoproductos se diluirá si antes no defines con precisión qué problema resuelves, a quién ayudas y a qué precio con una oferta estructurada de alto valor probada en vivo.',
        recommendation:
          'Tu primer paso no negociable es sentarte a trabajar la Arquitectura del Negocio y la Oferta BMS para tener un sistema de conversión claro, predecible y vendible.'
      };
      break;
    case 'pilar2':
      notFirstAdvice = {
        title: 'NO empieces por viralidad masiva sin posicionamiento de autoridad',
        warning:
          'Publicar videos diarios o seguir tendencias solo te hará parecer un creador de contenido más del montón si no están construidos tus activos de marca personal y tu mensaje diferencial indiscutible.',
        recommendation:
          'Construye primero tu posicionamiento estratégico de referente, tu identidad ejecutiva y la agencia de IA entrenada con tu voz y metodología.'
      };
      break;
    case 'pilar3':
      notFirstAdvice = {
        title: 'NO cambies de logo ni rediseñes tu web una vez más',
        warning:
          'Tu oferta y posicionamiento son adecuados; modificar el aspecto estético superficial no te traerá clientes nuevos. Tu verdadero obstáculo es la falta de un sistema constante de captación cualificada.',
        recommendation:
          'Necesitas implementar el sistema de Viral Sales Content: guiones de video orientados a ventas (VSL y Reels) y contenido estructurado que genere llamadas comerciales reales.'
      };
      break;
    case 'pilar4':
      notFirstAdvice = {
        title: 'NO sigas aceptando clientes 1 a 1 en el formato tradicional',
        warning:
          'Aceptar más clientes de consultoría vendiendo tus horas físicas solo acelerará tu agotamiento o deteriorará la calidad de entrega. Ya tienes un negocio probado; tu error es seguir operando de forma manual.',
        recommendation:
          'El paso correcto es realizar la jornada intensiva del Digital Business Day: auditar tu modelo, desplegar tus 3 agentes de IA y diseñar tus ofertas escalables con el plan 30·60·90.'
      };
      break;
  }

  // Resumen estratégico ejecutivo corto y contundente
  const incoherenceNote = hasInternalIncoherence
    ? ` Se identificaron ${detectedIncoherences.length} puntos ciegos clave a resolver para proteger la inversión y acelerar resultados.`
    : '';

  const gatingNote = isPilar4Blocked && (statedPillar.id === 'pilar4')
    ? ' [RECOMENDACIÓN ESTRATÉGICA: Se priorizó consolidar la oferta en el Pilar 1 antes de avanzar a automatización].'
    : '';

  const strategicSummary = `Diagnóstico de Orientación para ${lead.name || 'el prospecto'} (${lead.profession || 'Profesional'}). Modelo: ${COMMERCIAL_MODELS_LABELS[lead.commercializationModel] || 'Servicios'}. Clientes: ${PAYING_CLIENTS_LABELS[lead.payingClientsStatus] || 'En validación'}. Perfil: "${profile.title}". Tras analizar tu situación actual frente a tu preferencia inicial ("${statedPillar.name}"), el plan más rentable y seguro es el programa de "${recommendedPillar.name}".${incoherenceNote}${gatingNote}`;

  return {
    lead,
    profile,
    recommendedPillar,
    statedPillar,
    hasContradiction,
    contradictionAnalysis,
    hasInternalIncoherence,
    detectedIncoherences,
    gatingAnalysis: {
      isPilar4Blocked,
      isPilar3Blocked,
      blockReasonPilar4: isPilar4Blocked
        ? 'Recomendado comenzar por validar la oferta y clientes recurrentes antes de automatizar.'
        : undefined,
      blockReasonPilar3: isPilar3Blocked
        ? 'Recomendado estructurar la oferta comercial con precio firme antes de acelerar difusión.'
        : undefined
    },
    foundationStatus: {
      pilar1Score: scores.pilar1,
      pilar2Score: scores.pilar2,
      pilar3Score: scores.pilar3,
      pilar4Score: scores.pilar4,
      offerClarityOk: answers.q2 === '2',
      payingClientsOk: answers.q4 === '2' || answers.q4 === '3',
      salesProcessOk: answers.q3 === '2',
      positioningOk: answers.q5 === '2',
      contentEngineOk: answers.q6 === '2',
      deliveryDocsOk: answers.q9 === '2' || answers.q9 === '3',
      freedomScaleOk: answers.q7 === '2' && answers.q8 === '2',
      incoherenceDetected: hasInternalIncoherence
    },
    evidences: evidences.slice(0, 5),
    notFirstAdvice,
    strategicSummary,
    timestamp: new Date().toISOString(),
    scores
  };
}

/**
 * Prepara el resumen en texto plano para copiar a WhatsApp / Portapapeles
 */
export function formatPrediagnosticClipboard(res: PrediagnosticResult): string {
  const c = res.contradictionAnalysis;
  const incoherenceSection = res.hasInternalIncoherence
    ? `\n💡 CLAVES DE ENFOQUE Y OPORTUNIDADES IDENTIFICADAS:
${res.detectedIncoherences
  .map(
    (inc, idx) =>
      `${idx + 1}. ${inc.title} [${inc.severity === 'critica' ? 'Oportunidad Clave' : 'Ajuste Recomendado'}]\n   • Perspectiva inicial (${inc.statementA.questionCategory}): "${inc.statementA.answerText}"\n   • Realidad del negocio (${inc.statementB.questionCategory}): "${inc.statementB.answerText}"\n   • Clave de Crecimiento: ${inc.revealedTruth}`
  )
  .join('\n\n')}\n`
    : '';

  return `📊 PREDIAGNÓSTICO ESTRATÉGICO · CREA Y MONETIZA®
Consultora: Patricia Loaiza

👤 CONTEXTO PROFESIONAL Y COMERCIAL:
• Nombre: ${res.lead.name}
• Email: ${res.lead.email}
• WhatsApp: ${res.lead.whatsapp}
• Profesión / Especialidad: ${res.lead.profession || 'No especificada'}
• Actividad Actual: ${res.lead.currentActivity || 'No especificada'}
• Modelo de Comercialización: ${COMMERCIAL_MODELS_LABELS[res.lead.commercializationModel] || res.lead.commercializationModel || 'N/A'}
• Estado Clientes de Pago: ${PAYING_CLIENTS_LABELS[res.lead.payingClientsStatus] || res.lead.payingClientsStatus || 'N/A'}
• Empresa: ${res.lead.company || 'N/A'}
• Rol: ${res.lead.role || 'N/A'}

🎯 PERFIL EVOLUTIVO DETECTADO:
${res.profile.title}
"${res.profile.subtitle}"

🏆 SERVICIO ESTRATÉGICO RECOMENDADO POR EVIDENCIA:
${res.recommendedPillar.name}
Programa: ${res.recommendedPillar.serviceTitle}
Duración: ${res.recommendedPillar.duration}

${
  res.hasContradiction && c
    ? `🎯 ENFOQUE ESTRATÉGICO RECOMENDADO:
• Interés inicial del prospecto: ${res.statedPillar.name}
• Ruta de mayor rentabilidad hoy: ${res.recommendedPillar.name}
• Motivo estratégico: ${c.explanation}
`
    : `✅ ALINEACIÓN CONFIRMADA:
El objetivo del prospecto coincide con la prioridad de crecimiento de su negocio.`
}
${incoherenceSection}
📋 CLAVES IDENTIFICADAS EN SUS RESPUESTAS:
${res.evidences.map((e, idx) => `${idx + 1}. ${e}`).join('\n')}

💡 CONSEJO PARA EVITAR FUGAS DE TIEMPO Y DINERO:
${res.notFirstAdvice.warning}

🚀 TRANSFORMACIÓN ESPERADA:
${res.recommendedPillar.transformation}

Fecha: ${new Date(res.timestamp).toLocaleDateString()}
`;
}
