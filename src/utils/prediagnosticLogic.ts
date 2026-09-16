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
  foundationStatus: {
    pilar1Score: number;
    pilar2Score: number;
    pilar3Score: number;
    pilar4Score: number;
    offerClarityOk: boolean;
    salesProcessOk: boolean;
    positioningOk: boolean;
    contentEngineOk: boolean;
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

/**
 * Algoritmo de cálculo multicriterio con verificación de cimientos fácticos
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

  // =========================================================================
  // MOTOR DE CONTROL DE VERACIDAD: AUDITORÍA DE INCOHERENCIAS CRUZADAS
  // =========================================================================
  const detectedIncoherences: IncoherenceDetail[] = [];

  // Helper para extraer el texto de la opción seleccionada
  const getOptText = (qId: string, val: string) => {
    const q = PREDIAGNOSTIC_QUESTIONS.find((item) => item.id === qId);
    return q?.options.find((o) => o.value === val)?.label || val;
  };

  // 1. INCOHERENCIA DE OFERTA: Afirma Oferta Estructurada (Q2=2) pero en Estrés no tiene oferta con precio firme (Q9='offer')
  if (answers.q2 === '2' && answers.q9 === 'offer') {
    detectedIncoherences.push({
      id: 'incoherence_offer_vs_stress',
      severity: 'critica',
      title: 'El Espejismo de la Oferta: Afirmación Teórica vs Realidad Operativa',
      statementA: {
        questionNumber: 2,
        questionCategory: 'Claridad y Productización de Oferta',
        answerText: getOptText('q2', answers.q2)
      },
      statementB: {
        questionNumber: 9,
        questionCategory: 'Prueba de Estrés (40 Prospectos Inmediatos)',
        answerText: getOptText('q9', answers.q9)
      },
      verdict:
        'Incoherencia Fáctica: En la Pregunta 2 aseguraste tener una oferta central definida con precio probado y entregables claros, pero al someterte a la prueba de estrés de 40 clientes en la Pregunta 9 confesaste que tu mayor cuello de botella sería "no tener una oferta única empaquetada con precio firme" y que tendrías que improvisar presupuestos perdiendo a la mayoría.',
      revealedTruth:
        'Tu oferta existe en tu cabeza como concepto o deseo, pero ante el mercado real NO está productizada ni tiene precio inquebrantable. Intentar hacer marketing o automatizar en este estado quemaría a tus prospectos.',
      actionRequired:
        'El algoritmo ajusta la ponderación: necesitas estructurar tu oferta central en el Pilar 1 antes de acelerar difusión.'
    });
  }

  // 2. INCOHERENCIA DE TRÁFICO VS COLAPSO OPERATIVO (Pide más clientes/redes pero ya colapsaría de tiempo)
  if ((answers.q8 === 'pilar3' || answers.q11 === 'leads') && (answers.q6 === '0' || answers.q1 === 'saturado')) {
    detectedIncoherences.push({
      id: 'incoherence_traffic_vs_saturation',
      severity: 'critica',
      title: 'Trampa del Crecimiento: Pedir Más Prospectos Estando Colapsado de Tiempo',
      statementA: {
        questionNumber: answers.q8 === 'pilar3' ? 8 : 11,
        questionCategory: 'Servicio Deseado / Meta Inmediata',
        answerText: answers.q8 === 'pilar3' ? getOptText('q8', answers.q8) : getOptText('q11', answers.q11)
      },
      statementB: {
        questionNumber: answers.q6 === '0' ? 6 : 1,
        questionCategory: 'Capacidad Operativa y Horas de Entrega',
        answerText: answers.q6 === '0' ? getOptText('q6', answers.q6) : getOptText('q1', answers.q1)
      },
      verdict:
        'Incoherencia de Capacidad: Quieres atraer más prospectos masivos mediante contenidos y redes, pero al mismo tiempo admites que estás saturado vendiendo horas o que con 10 clientes nuevos colapsarías por completo.',
      revealedTruth:
        'Abrir el grifo de prospectos cuando tu entrega es 100% manual destruirá tu calidad de vida y el servicio al cliente. Tu verdadero cuello de botella NO es la falta de leads, sino la falta de infraestructura escalable.',
      actionRequired:
        'El algoritmo dictamina que tu necesidad prioritaria es el Pilar 4 (Sistematización de Negocio, Activos Digitales & Agentes IA) para liberar tu tiempo antes de meter más volumen.'
    });
  }

  // 3. INCOHERENCIA DE VIRALIDAD SIN MARCA PERSONAL (Pide contenidos masivos pero es percibido como commodity)
  if ((answers.q8 === 'pilar3' || answers.q11 === 'leads') && (answers.q4 === '0' || answers.q9 === 'brand')) {
    detectedIncoherences.push({
      id: 'incoherence_traffic_without_brand',
      severity: 'alta',
      title: 'Contradicción de Difusión: Buscar Viralidad sin Posicionamiento de Autoridad',
      statementA: {
        questionNumber: answers.q8 === 'pilar3' ? 8 : 11,
        questionCategory: 'Servicio Deseado / Meta',
        answerText: answers.q8 === 'pilar3' ? getOptText('q8', answers.q8) : getOptText('q11', answers.q11)
      },
      statementB: {
        questionNumber: answers.q4 === '0' ? 4 : 9,
        questionCategory: 'Percepción de Marca y Autoridad',
        answerText: answers.q4 === '0' ? getOptText('q4', answers.q4) : getOptText('q9', answers.q9)
      },
      verdict:
        'Incoherencia de Posicionamiento: Buscas contratar el motor de contenidos y viralidad en redes, pero reconoces que en el mercado te perciben como "uno más del montón" o que prospectos fríos dudarían de tu autoridad.',
      revealedTruth:
        'El tráfico frío sin una marca personal con autoridad construida atrae únicamente a personas que comparan precios o piden rebajas. Publicar sin posicionamiento te convierte en un creador de contenido genérico.',
      actionRequired:
        'El algoritmo eleva la urgencia del Pilar 2 (Posicionamiento de Marca Personal & Autoridad) para blindar tu estatus antes de invertir en contenidos masivos.'
    });
  }

  // 4. INCOHERENCIA DE SISTEMATIZACIÓN PREMATURA: Quiere Sistematizar / IA (Q8='pilar4' o Q11='system') sin oferta validada
  if (
    (answers.q8 === 'pilar4' || answers.q11 === 'system') &&
    (answers.q2 === '0' || answers.q9 === 'offer')
  ) {
    detectedIncoherences.push({
      id: 'incoherence_premature_systematization',
      severity: 'critica',
      title: 'Intento de Sistematización Prematura: Automatizar el Caos',
      statementA: {
        questionNumber: answers.q8 === 'pilar4' ? 8 : 11,
        questionCategory: 'Servicio Solicitado / Meta de Transformación',
        answerText: answers.q8 === 'pilar4' ? getOptText('q8', answers.q8) : getOptText('q11', answers.q11)
      },
      statementB: {
        questionNumber: answers.q9 === 'offer' ? 9 : 2,
        questionCategory: 'Evidencia de Oferta y Cierre',
        answerText: answers.q9 === 'offer' ? getOptText('q9', answers.q9) : getOptText('q2', answers.q2)
      },
      verdict:
        'Violación Jerárquica de Negocio: Quieres contratar sistematización con agentes de IA o productos digitales, pero la evidencia fáctica muestra que tu oferta central todavía no está productizada ni tiene precio firme.',
      revealedTruth:
        'Automatizar o digitalizar un servicio que no convierte 1 a 1 de forma manual es un error crítico: multiplica los costos técnicos y produce frustración acelerada.',
      actionRequired:
        'El algoritmo bloquea el avance hacia el Pilar 4 y establece como paso no negociable la validación comercial en el Pilar 1.'
    });
  }

  // 5. INCOHERENCIA DE AUTORIDAD: Referente Indiscutible (Q4=2) vs Duda de Autoridad ante Prospectos Fríos (Q9='brand')
  if (answers.q4 === '2' && answers.q9 === 'brand') {
    detectedIncoherences.push({
      id: 'incoherence_authority_vs_stress',
      severity: 'alta',
      title: 'Espejismo de Marca: Reputación Cercana vs Autoridad Pública Digital',
      statementA: {
        questionNumber: 4,
        questionCategory: 'Autoridad y Percepción de Marca',
        answerText: getOptText('q4', answers.q4)
      },
      statementB: {
        questionNumber: 9,
        questionCategory: 'Prueba de Estrés ante Prospectos Fríos',
        answerText: getOptText('q9', answers.q9)
      },
      verdict:
        'Incoherencia de Reconocimiento: Dijiste ser un referente reconocido en tu especialidad, pero en la prueba de estrés reconoces que ante prospectos fríos temes que duden de tu autoridad o busquen alternativas más baratas.',
      revealedTruth:
        'Tu autoridad actual se sostiene en recomendaciones de boca en boca o clientes antiguos. En el mercado digital frío careces de los activos de marca que proyectan liderazgo indiscutible.',
      actionRequired:
        'Construir los 12 activos de autoridad y mensaje de posicionamiento de Marca Personal en el Pilar 2.'
    });
  }

  // 6. INCOHERENCIA COMERCIAL: Oferta Supuestamente Probada (Q2=2) vs Rechazo de Precios y Ghosting Sistemático (Q3='0')
  if (answers.q2 === '2' && answers.q3 === '0') {
    detectedIncoherences.push({
      id: 'incoherence_offer_vs_pricing',
      severity: 'alta',
      title: 'Discrepancia Comercial: Oferta Supuestamente Probada vs Objeción Sistemática de Precio',
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
        'Incoherencia de Validación: Indicaste tener una oferta probada con precio premium, pero admites que en la práctica los prospectos dicen que es caro, piden rebajas o desaparecen (ghosting).',
      revealedTruth:
        'Una oferta no está validada si genera fricción sistemática en el cierre. Falta un encuadre de valor irresistible y un protocolo comercial de cualificación.',
      actionRequired:
        'Reestructurar la propuesta de valor y el protocolo comercial en el Pilar 1, o elevar la percepción de estatus en el Pilar 2.'
    });
  }

  // 7. INCOHERENCIA DE FALSA NECESIDAD DE REHACER OFERTA: Pide Pilar 1 pero su oferta ya funciona y sufre por tiempo o prospección
  if (answers.q8 === 'pilar1' && answers.q2 === '2' && answers.q3 === '2' && (answers.q6 === '0' || answers.q5 === '0')) {
    const isSaturation = answers.q6 === '0';
    detectedIncoherences.push({
      id: 'incoherence_false_offer_need',
      severity: 'alta',
      title: 'Falso Diagnóstico: Querer Rehacer Oferta Cuando el Cuello de Botella es Operativo o de Difusión',
      statementA: {
        questionNumber: 8,
        questionCategory: 'Servicio que Creías Necesitar',
        answerText: getOptText('q8', answers.q8)
      },
      statementB: {
        questionNumber: isSaturation ? 6 : 5,
        questionCategory: isSaturation ? 'Capacidad Operativa' : 'Presencia Digital',
        answerText: isSaturation ? getOptText('q6', answers.q6) : getOptText('q5', answers.q5)
      },
      verdict:
        'Incoherencia de Enfoque: Solicitaste consultoría de oferta comercial, pero tus respuestas confirman que tus clientes ya entienden tu valor y pagan tus tarifas sin regatear. Tu dolor real es que no tienes tiempo (saturación) o no tienes canales activos de captación.',
      revealedTruth:
        'Modificar una oferta que ya funciona es una fuga de energía. Tu negocio necesita amplificar su alcance o sistematizar su entrega.',
      actionRequired:
        `El algoritmo redirige la recomendación hacia tu verdadero dolor estructural: ${isSaturation ? 'Pilar 4 (Sistematización & IA)' : 'Pilar 3 (Contenidos de Venta)'}.`
    });
  }

  const hasInternalIncoherence = detectedIncoherences.length > 0;

  // Incoherencias que invalidan específicamente la premisa de tener oferta validada
  const offerInvalidatedByIncoherence = detectedIncoherences.some(
    (inc) =>
      inc.id === 'incoherence_offer_vs_stress' ||
      inc.id === 'incoherence_premature_systematization'
  );

  // Estados de cimientos fácticos
  const effectiveOfferClarityOk = answers.q2 === '2' && !offerInvalidatedByIncoherence;
  const salesProcessOk = answers.q3 === '2';
  const positioningOk = answers.q4 === '2' && !detectedIncoherences.some((i) => i.id === 'incoherence_authority_vs_stress');
  const contentEngineOk = answers.q5 === '2';
  const freedomScaleOk = answers.q6 === '2' && answers.q7 === '2';

  // Analizar servicio declarado por el prospecto
  const statedPillarKey = answers.q8 || 'pilar1';
  const statedPillar = PILLARS_DATA[statedPillarKey] || PILLARS_DATA.pilar1;

  // =========================================================================
  // MOTOR DE DECISIÓN MULTICRITERIO DE LOS 4 PILARES (TRUE BOTTLENECK ENGINE)
  // =========================================================================
  // Evaluamos de manera equilibrada y objetiva qué pilar representa la mayor
  // necesidad real del negocio, sin sesgos unilaterales hacia ninguno de ellos.

  let needScoreP1 = scores.pilar1;
  let needScoreP2 = scores.pilar2;
  let needScoreP3 = scores.pilar3;
  let needScoreP4 = scores.pilar4;

  // Impulsos específicos para Pilar 1 (Estrategia Comercial & Oferta BMS):
  if (answers.q2 === '0') needScoreP1 += 10;
  if (answers.q1 === 'invisible' && answers.q2 !== '2') needScoreP1 += 8;
  if (answers.q9 === 'offer') needScoreP1 += 10;
  if (answers.q9 === 'sales') needScoreP1 += 7;
  if (answers.q11 === 'clarity') needScoreP1 += 10;
  if (answers.q10 === 'sales') needScoreP1 += 5;
  if (answers.q10 === 'none') needScoreP1 += 5;
  if (offerInvalidatedByIncoherence) needScoreP1 += 9;

  // Impulsos específicos para Pilar 2 (Marca Personal & Autoridad):
  if (answers.q4 === '0') needScoreP2 += 10;
  if (answers.q4 === '1') needScoreP2 += 7;
  if (answers.q9 === 'brand') needScoreP2 += 10;
  if (answers.q10 === 'brand') needScoreP2 += 9;
  if (answers.q11 === 'authority') needScoreP2 += 10;
  if (answers.q3 === '0' && answers.q2 === '2') needScoreP2 += 6; // Ghosting con oferta existente suele ser falta de autoridad

  // Impulsos específicos para Pilar 3 (Motor de Contenidos & Captación - Viral Sales Content):
  if (answers.q5 === '0') needScoreP3 += 10;
  if (answers.q5 === '1') needScoreP3 += 8;
  if (answers.q9 === 'visibility') needScoreP3 += 10;
  if (answers.q10 === 'content') needScoreP3 += 9;
  if (answers.q11 === 'leads') needScoreP3 += 10;

  // Impulsos específicos para Pilar 4 (Sistematización, Escala, Activos Digitales & IA):
  if (answers.q1 === 'saturado') needScoreP4 += 9;
  if (answers.q1 === 'legado') needScoreP4 += 8;
  if (answers.q6 === '0') needScoreP4 += 11;
  if (answers.q6 === '1') needScoreP4 += 6;
  if (answers.q7 === '0') needScoreP4 += 7;
  if (answers.q7 === '1') needScoreP4 += 5;
  if (answers.q9 === 'scale') needScoreP4 += 11;
  if (answers.q10 === 'scale') needScoreP4 += 9;
  if (answers.q11 === 'system') needScoreP4 += 10;

  // Regla de viabilidad técnica: no se puede sistematizar (P4) ni hacer viralidad (P3)
  // si el prospecto no tiene NINGUNA oferta comercial ni idea de a quién ayuda (Q2=0 y Q9=offer).
  if (answers.q2 === '0' && answers.q9 === 'offer') {
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
  // Cubre las 12 combinaciones posibles entre los 4 pilares con explicaciones estratégicas de alto nivel.
  const hasContradiction = statedPillar.id !== recommendedPillar.id;
  let contradictionAnalysis: PrediagnosticResult['contradictionAnalysis'] = null;

  if (hasContradiction) {
    const pair = `${statedPillar.id}->${recommendedPillar.id}`;

    switch (pair) {
      // 1. Quería Pilar 1 pero necesita Pilar 2 (Tiene oferta pero compite como commodity)
      case 'pilar1->pilar2':
        contradictionAnalysis = {
          title: 'Discrepancia de Diagnóstico: Rehacer Oferta vs Autoridad de Marca',
          explanation: `Manifestaste interés en revisar tu oferta comercial ("${statedPillar.name}"), pero la evidencia demuestra que tu cuello de botella no es lo que entregas, sino cómo te percibe el mercado: te ven como una opción genérica o eres desconocido fuera de tu círculo.`,
          riskOfSkipping:
            'Modificar el alcance de tu servicio o bajar precios sin construir tu Marca Personal de autoridad perpetuará que compitas contra otros profesionales por precio en lugar de ser elegido por reputación indiscutible.'
        };
        break;

      // 2. Quería Pilar 1 pero necesita Pilar 3 (Tiene oferta pero nadie lo conoce)
      case 'pilar1->pilar3':
        contradictionAnalysis = {
          title: 'Discrepancia de Tracción: Perfeccionar Oferta vs Generar Demanda Real',
          explanation: `Pensaste en contratar estructuración de oferta ("${statedPillar.name}"), pero tus respuestas confirman que tu servicio ya es sólido; tu problema es que nadie se entera de que existes porque no tienes un motor de contenidos ni presencia activa en redes.`,
          riskOfSkipping:
            'Quedarte atrapado en el perfeccionamiento eterno de tu oferta sin un sistema de captación es tener el mejor producto en una tienda a oscuras. Necesitas atraer compradores cualificados con Viral Sales Content.'
        };
        break;

      // 3. Quería Pilar 1 pero necesita Pilar 4 (Tiene oferta pero colapsa de tiempo)
      case 'pilar1->pilar4':
        contradictionAnalysis = {
          title: 'Discrepancia Operativa: Nuevas Ofertas vs Colapso de Horas Físicas',
          explanation: `Solicitaste estrategia de oferta ("${statedPillar.name}"), pero tu verdadero dolor es que estás saturado vendiendo horas físicas 1 a 1 y colapsarías de estrés si entran nuevos clientes.`,
          riskOfSkipping:
            'Crear o vender más servicios manuales sin antes sistematizar tu metodología en activos digitales y agentes de IA aumentará tu agotamiento y pondrá en riesgo la calidad de entrega y tu salud.'
        };
        break;

      // 4. Quería Pilar 2 pero necesita Pilar 1 (Quiere marca pero no tiene oferta vendible)
      case 'pilar2->pilar1':
        contradictionAnalysis = {
          title: 'Discrepancia de Base: Marca Personal vs Oferta Comercial Vendible',
          explanation: `Buscabas trabajar tu posicionamiento de marca ("${statedPillar.name}"), pero aún no cuentas con una oferta central productizada con precio firme ni protocolo de cierre predecible.`,
          riskOfSkipping:
            'Proyectar una marca de prestigio sin una oferta empaquetada ni un proceso comercial de cierre generará expectativas que no podrás monetizar. Primero definimos tu Oferta BMS; luego blindamos la marca.'
        };
        break;

      // 5. Quería Pilar 2 pero necesita Pilar 3 (Tiene marca pero le faltan contenidos de venta)
      case 'pilar2->pilar3':
        contradictionAnalysis = {
          title: 'Discrepancia de Distribución: Activos de Marca vs Flujo de Demanda',
          explanation: `Tu intuición pedía posicionamiento de marca ("${statedPillar.name}"), pero tu reputación y mensaje ya tienen respaldo; tu verdadera carencia es un canal de atracción continua que transforme atención en llamadas comerciales con regularidad.`,
          riskOfSkipping:
            'Seguir puliendo la imagen o la bio sin instalar guiones de venta (VSL y reels) ni un calendario de generación de demanda te dejará con una marca impecable pero sin prospectos calificados en la agenda.'
        };
        break;

      // 6. Quería Pilar 2 pero necesita Pilar 4 (Tiene marca pero está desbordado de trabajo)
      case 'pilar2->pilar4':
        contradictionAnalysis = {
          title: 'Discrepancia de Capacidad: Posicionamiento vs Liberación de Tiempo con IA',
          explanation: `Creíste requerir mayor autoridad de marca ("${statedPillar.name}"), pero tu modelo actual ya te tiene al límite de tu capacidad operativa y vendes el 100% de tu tiempo en vivo.`,
          riskOfSkipping:
            'Más autoridad atraerá clientes que no tendrás tiempo físico de atender sin colapsar. La prioridad no negociable es sistematizar tu conocimiento en productos digitales y desplegar agentes de IA en el Pilar 4.'
        };
        break;

      // 7. Quería Pilar 3 pero necesita Pilar 1 (Pide redes pero la oferta no está validada)
      case 'pilar3->pilar1':
        contradictionAnalysis = {
          title: 'Discrepancia Estratégica: Visibilidad vs Cimiento de Oferta',
          explanation: `Tú manifestaste interés en contratar "${statedPillar.name}" (difusión y redes), pero la evidencia objetiva demuestra que tu oferta aún no está estandarizada con precio firme ni cuentas con protocolo de cierre predecible.`,
          riskOfSkipping:
            'Producir contenido viral o buscar más visibilidad sin una oferta central productizada ni un proceso de cierre predecible es como bombear agua en un balde agujereado: atraerás curiosos o personas sin presupuesto, desgastando tu tiempo sin lograr ingresos reales. Primero consolidamos tu oferta y protocolo comercial; luego aceleramos el contenido.'
        };
        break;

      // 8. Quería Pilar 3 pero necesita Pilar 2 (Pide redes pero lo ven como commodity)
      case 'pilar3->pilar2':
        contradictionAnalysis = {
          title: 'Discrepancia de Autoridad: Contenido Masivo vs Marca Personal de Referente',
          explanation: `Creíste necesitar "${statedPillar.name}", pero la evidencia demuestra que en el mercado aún te perciben como una opción genérica o dudan de tu estatus ante prospectos fríos.`,
          riskOfSkipping:
            'Publicar contenido masivo sin un posicionamiento de marca claro te convierte en un creador de contenido genérico que atrae regateos de precio. Para cobrar tarifas de consultoría premium, primero debemos blindar los activos de tu Marca Personal y tu mensaje de autoridad.'
        };
        break;

      // 9. Quería Pilar 3 pero necesita Pilar 4 (Pide redes pero ya colapsaría con más clientes)
      case 'pilar3->pilar4':
        contradictionAnalysis = {
          title: 'Discrepancia de Capacidad Operativa: Atraer Tráfico vs Colapso de Entrega',
          explanation: `Buscabas captar más clientes mediante contenidos ("${statedPillar.name}"), pero admitiste que con clientes nuevos colapsarías por completo al vender exclusivamente tus horas en vivo.`,
          riskOfSkipping:
            'Acelerar la captación de prospectos cuando el negocio no tiene activos digitales ni automatización con IA deteriorará la calidad de entrega y provocará agotamiento extremo. Primero sistematizamos tu entrega en el Pilar 4.'
        };
        break;

      // 10. Quería Pilar 4 pero necesita Pilar 1 (Quiere IA pero no tiene oferta validada)
      case 'pilar4->pilar1':
        contradictionAnalysis = {
          title: 'Discrepancia de Escalabilidad: Automatizar antes de Validar',
          explanation: `Señalaste que buscabas "${statedPillar.name}" (productos digitales o automatización con IA), pero tus respuestas evidencian que tu modelo de negocio y oferta comercial principal todavía presentan dispersión y no están validados manualmente.`,
          riskOfSkipping:
            'No es posible sistematizar ni digitalizar un servicio que todavía no funciona de manera predecible en su versión central. Automatizar el desorden solo produce desorden a mayor velocidad y con mayor costo. La prioridad es consolidar primero tu oferta central.'
        };
        break;

      // 11. Quería Pilar 4 pero necesita Pilar 2 (Quiere productos digitales pero no tiene autoridad para vender en frío)
      case 'pilar4->pilar2':
        contradictionAnalysis = {
          title: 'Discrepancia de Tracción: Productos Digitales vs Autoridad de Marca',
          explanation: `Buscabas implementar "${statedPillar.name}", pero el mercado todavía no identifica con suficiente claridad tu liderazgo ni tu propuesta diferencial para convertir tráfico frío.`,
          riskOfSkipping:
            'Un modelo de negocio digital o infoproducto requiere una marca personal que transmita confianza inmediata para convertir prospectos fríos. La marca personal es el activo estratégico que disminuye el costo de adquisición de clientes.'
        };
        break;

      // 12. Quería Pilar 4 pero necesita Pilar 3 (Quiere productos digitales pero no tiene audiencia ni tráfico)
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
        title: 'NO empieces creando más contenido ni lanzando cursos digitales',
        warning:
          'Cualquier esfuerzo en redes sociales, diseño de páginas web o pauta publicitaria se diluirá si antes no defines con precisión qué problema resuelves, a quién ayudas y a qué precio con una oferta estructurada de alto valor.',
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
    ? ` Se detectaron ${detectedIncoherences.length} contradicción(es) o incoherencia(s) fáctica(s) en las respuestas que desmontan falsos positivos de validación comercial.`
    : '';

  const strategicSummary = `Diagnóstico de Precalificación para ${lead.name || 'el prospecto'}: Identificado en la etapa de "${profile.title}". Tras cruzar la evidencia fáctica frente al servicio deseado ("${statedPillar.name}"), el algoritmo dictamina como prioridad obligatoria el programa de "${recommendedPillar.name}" para resolver el verdadero cuello de botella antes de avanzar a etapas posteriores.${incoherenceNote}`;

  return {
    lead,
    profile,
    recommendedPillar,
    statedPillar,
    hasContradiction,
    contradictionAnalysis,
    hasInternalIncoherence,
    detectedIncoherences,
    foundationStatus: {
      pilar1Score: scores.pilar1,
      pilar2Score: scores.pilar2,
      pilar3Score: scores.pilar3,
      pilar4Score: scores.pilar4,
      offerClarityOk: effectiveOfferClarityOk,
      salesProcessOk,
      positioningOk,
      contentEngineOk,
      freedomScaleOk,
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
    ? `\n🚨 INCOHERENCIAS FÁCTICAS DETECTADAS EN TUS RESPUESTAS:
${res.detectedIncoherences
  .map(
    (inc, idx) =>
      `${idx + 1}. ${inc.title} [Severidad: ${inc.severity.toUpperCase()}]\n   • En ${inc.statementA.questionCategory}: "${inc.statementA.answerText}"\n   • Sin embargo en ${inc.statementB.questionCategory}: "${inc.statementB.answerText}"\n   • Verdad Fáctica: ${inc.revealedTruth}`
  )
  .join('\n\n')}\n`
    : '';

  return `📊 PREDIAGNÓSTICO ESTRATÉGICO · CREA Y MONETIZA®
Consultora: Patricia Loaiza

👤 PROSPECTO:
• Nombre: ${res.lead.name}
• Email: ${res.lead.email}
• WhatsApp: ${res.lead.whatsapp}
• Empresa: ${res.lead.company || 'N/A'}
• Rol: ${res.lead.role || 'N/A'}

🎯 PERFIL PROFESIONAL DETECTADO:
${res.profile.title}
"${res.profile.subtitle}"

🏆 SERVICIO ESTRATÉGICO RECOMENDADO POR EVIDENCIA:
${res.recommendedPillar.name}
Programa: ${res.recommendedPillar.serviceTitle}
Duración: ${res.recommendedPillar.duration}

${
  res.hasContradiction && c
    ? `⚠️ DISCREPANCIA DETECTADA:
El prospecto creía necesitar: ${res.statedPillar.name}
Pero la evidencia demuestra: ${res.recommendedPillar.name}
Motivo: ${c.explanation}
`
    : `✅ ALINEACIÓN CONFIRMADA:
El objetivo del prospecto coincide con la necesidad estructural de su negocio.`
}
${incoherenceSection}
📋 EVIDENCIAS DE SUS RESPUESTAS:
${res.evidences.map((e, idx) => `${idx + 1}. ${e}`).join('\n')}

⛔ LO QUE NO DEBE HACER PRIMERO:
${res.notFirstAdvice.warning}

🚀 TRANSFORMACIÓN ESPERADA:
${res.recommendedPillar.transformation}

Fecha: ${new Date(res.timestamp).toLocaleDateString()}
`;
}
