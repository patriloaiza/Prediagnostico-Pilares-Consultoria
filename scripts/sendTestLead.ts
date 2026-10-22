import { calculatePrediagnostic, UserLeadInfo, PrediagnosticAnswers, COMMERCIAL_MODELS_LABELS, PAYING_CLIENTS_LABELS } from '../src/utils/prediagnosticLogic';
import { generateDiagnosticHtmlReport, generateDiagnosticTextReport, OFFICIAL_ADMIN_EMAIL } from '../src/utils/ghlEmailTemplate';

const OFFICIAL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/skgSf0Kg3sY00t6Wdy38/webhook-trigger/75483c9f-2acf-41ee-9694-cebb8cdc4ab4';
const OFFICIAL_BOOKING = 'https://link.ghlespanol.com/widget/booking/aI6mS973gkCQmeyn08ST';

async function main() {
  const lead: UserLeadInfo = {
    name: 'Carlos Mendoza - Lead Oportunidad',
    email: 'patriloaiza.perez+carlos@gmail.com',
    whatsapp: '+57 312 987 6543',
    profession: 'Mentor de Negocios y Finanzas',
    currentActivity: 'Consultoría empresarial estratégica y finanzas para PYMES',
    commercializationModel: 'servicios_1a1',
    payingClientsStatus: 'irregulares',
    company: 'Mendoza Estrategia',
    role: 'Director'
  };

  const answers: PrediagnosticAnswers = {
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
    q14: 'system'
  };

  const calcResult = calculatePrediagnostic(answers, lead);

  const tagsList = [
    'prediagnostico-completado',
    calcResult.hasContradiction ? 'discrepancia-detectada' : 'cimiento-alineado',
    calcResult.hasInternalIncoherence ? 'incoherencia-interna-detectada' : 'coherencia-confirmada',
    `servicio-prioritario-${calcResult.recommendedPillar.id}`,
    calcResult.gatingAnalysis.isPilar4Blocked ? 'veto-sistematizacion-prematura' : 'viable-etapas-avanzadas'
  ];

  const modelLabel = COMMERCIAL_MODELS_LABELS[calcResult.lead.commercializationModel] || calcResult.lead.commercializationModel;
  const clientsLabel = PAYING_CLIENTS_LABELS[calcResult.lead.payingClientsStatus] || calcResult.lead.payingClientsStatus;

  const executiveEmailSummary = `🎯 PERFIL DE MADUREZ:
${calcResult.profile.title} ("${calcResult.profile.subtitle}")

🏆 PRIORIDAD #1 A RESOLVER:
${calcResult.recommendedPillar.name}
Programa Oficial: ${calcResult.recommendedPillar.serviceTitle} (${calcResult.recommendedPillar.duration})

⚠️ ANÁLISIS ESTRATÉGICO:
${calcResult.contradictionAnalysis?.explanation || 'Tu objetivo actual está alineado con la madurez de tu negocio.'}

⛔ LO QUE NO DEBES HACER EN ESTA ETAPA:
${calcResult.notFirstAdvice.warning}

📊 PUNTUACIONES:
• Estrategia & Oferta: ${calcResult.scores.pilar1} pts | • Marca Personal: ${calcResult.scores.pilar2} pts
• Contenidos de Venta: ${calcResult.scores.pilar3} pts | • Digitalización & IA: ${calcResult.scores.pilar4} pts`;

  const htmlEmailReport = generateDiagnosticHtmlReport(calcResult, OFFICIAL_BOOKING);
  const textEmailReport = generateDiagnosticTextReport(calcResult, OFFICIAL_BOOKING);

  const ghlPayload: Record<string, any> = {
    name: lead.name,
    full_name: lead.name,
    first_name: 'Carlos',
    last_name: 'Mendoza',
    email: lead.email,
    phone: lead.whatsapp,
    whatsapp: lead.whatsapp,

    admin_email: OFFICIAL_ADMIN_EMAIL,
    admin_copy_email: OFFICIAL_ADMIN_EMAIL,
    copia_para: OFFICIAL_ADMIN_EMAIL,
    notificacion_administrador: OFFICIAL_ADMIN_EMAIL,
    email_copia: OFFICIAL_ADMIN_EMAIL,

    diagnostico_email_html: htmlEmailReport,
    diagnostico_resumen_texto: textEmailReport,
    resultado_diagnostico_html: htmlEmailReport,
    resultado_diagnostico: textEmailReport,
    enlace_calendario: OFFICIAL_BOOKING,
    booking_url: OFFICIAL_BOOKING,

    diagnostico_perfil: `${calcResult.profile.title} ("${calcResult.profile.subtitle}")`,
    diagnostico_servicio_recomendado: calcResult.recommendedPillar.name,
    diagnostico_programa_oficial: `${calcResult.recommendedPillar.serviceTitle} (${calcResult.recommendedPillar.duration})`,
    diagnostico_motivo_discrepancia: calcResult.contradictionAnalysis?.explanation || 'Sin discrepancia; objetivo alineado con la madurez actual.',
    diagnostico_lo_que_no_debe_hacer: calcResult.notFirstAdvice.warning,
    diagnostico_advertencia: calcResult.notFirstAdvice.warning,

    profesion: lead.profession,
    actividad_actual: lead.currentActivity,
    modelo_comercializacion: modelLabel,
    estado_clientes_pago: clientsLabel,

    resumen_ejecutivo: executiveEmailSummary,
    resumen_diagnostico: executiveEmailSummary,
    resultado_diagnostico_texto: executiveEmailSummary,
    diagnostico_estrategico_crea_y_monetiza: executiveEmailSummary,

    perfil_profesional: calcResult.profile.title,
    perfil_subtitulo: calcResult.profile.subtitle,
    servicio_recomendado: calcResult.recommendedPillar.name,
    programa_oficial: calcResult.recommendedPillar.serviceTitle,
    motivo_discrepancia: calcResult.contradictionAnalysis?.explanation || 'Sin discrepancia.',
    lo_que_no_debe_hacer: calcResult.notFirstAdvice.warning,

    tags: tagsList.join(','),
    tags_array: tagsList,

    puntuacion_pilar1: calcResult.scores.pilar1,
    puntuacion_pilar2: calcResult.scores.pilar2,
    puntuacion_pilar3: calcResult.scores.pilar3,
    puntuacion_pilar4: calcResult.scores.pilar4
  };

  console.log('Sending webhook to:', OFFICIAL_WEBHOOK);
  console.log('Lead Name:', ghlPayload.name);
  console.log('Lead Email:', ghlPayload.email);

  const response = await fetch(OFFICIAL_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ghlPayload)
  });

  const responseText = await response.text();
  console.log('HTTP Status:', response.status);
  console.log('Response body:', responseText);

  if (response.ok) {
    console.log('SUCCESS: Lead delivered to GoHighLevel webhook successfully!');
  } else {
    console.error('ERROR: Failed to deliver lead.');
  }
}

main().catch(console.error);
