import { calculatePrediagnostic, UserLeadInfo, PrediagnosticAnswers } from '../src/utils/prediagnosticLogic';
import {
  generateDiagnosticHtmlReport,
  generateAppointmentConfirmationHtmlReport,
  generateDiagnosticTextReport,
  OFFICIAL_ADMIN_EMAIL
} from '../src/utils/ghlEmailTemplate';
import { generatePrediagnosticMarkdown } from '../src/utils/exportPrediagnostic';
import { COMMERCIAL_MODELS_LABELS, PAYING_CLIENTS_LABELS } from '../src/utils/prediagnosticLogic';

const OFFICIAL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/skgSf0Kg3sY00t6Wdy38/webhook-trigger/75483c9f-2acf-41ee-9694-cebb8cdc4ab4';
const OFFICIAL_BOOKING = 'https://link.ghlespanol.com/widget/booking/aI6mS973gkCQmeyn08ST';

async function dispatchLead(
  lead: UserLeadInfo,
  answers: PrediagnosticAnswers,
  extraTags: string[] = []
) {
  const calcResult = calculatePrediagnostic(answers, lead);
  const bookingLink = OFFICIAL_BOOKING;
  const htmlEmailReport = generateDiagnosticHtmlReport(calcResult, bookingLink);
  const htmlAppointmentReport = generateAppointmentConfirmationHtmlReport(calcResult);
  const textEmailReport = generateDiagnosticTextReport(calcResult, bookingLink);
  const fullMarkdown = generatePrediagnosticMarkdown(calcResult);

  const tagsList = [
    'prediagnostico-completado',
    calcResult.hasContradiction ? 'discrepancia-detectada' : 'cimiento-alineado',
    calcResult.hasInternalIncoherence ? 'incoherencia-interna-detectada' : 'coherencia-confirmada',
    `servicio-prioritario-${calcResult.recommendedPillar.id}`,
    calcResult.gatingAnalysis.isPilar4Blocked ? 'veto-sistematizacion-prematura' : 'viable-etapas-avanzadas',
    ...extraTags
  ];

  const modelLabel = COMMERCIAL_MODELS_LABELS[calcResult.lead.commercializationModel] || calcResult.lead.commercializationModel;
  const clientsLabel = PAYING_CLIENTS_LABELS[calcResult.lead.payingClientsStatus] || calcResult.lead.payingClientsStatus;

  const ghlPayload = {
    name: lead.name,
    full_name: lead.name,
    first_name: lead.name.split(' ')[0],
    last_name: lead.name.split(' ').slice(1).join(' ') || '',
    email: lead.email,
    phone: lead.whatsapp,
    whatsapp: lead.whatsapp,
    admin_email: OFFICIAL_ADMIN_EMAIL,
    admin_copy_email: OFFICIAL_ADMIN_EMAIL,
    copia_para: OFFICIAL_ADMIN_EMAIL,

    // Plantillas de Correo para GoHighLevel
    email_html_completo: htmlEmailReport,
    diagnostico_email_html: htmlEmailReport,
    email_html_prediagnostico: htmlEmailReport,
    email_html_cita_confirmada: htmlAppointmentReport,
    email_html_agendado: htmlAppointmentReport,
    diagnostico_estrategico_crea_y_monetiza: htmlAppointmentReport,
    diagnostico_estrategico_html: htmlAppointmentReport,
    diagnostico_resumen_texto: textEmailReport,
    resultado_diagnostico: textEmailReport,
    resumen_ejecutivo: textEmailReport,
    markdown_completo: fullMarkdown,
    enlace_calendario: bookingLink,

    profesion: lead.profession,
    actividad_actual: lead.currentActivity,
    modelo_comercializacion: modelLabel,
    estado_clientes_pago: clientsLabel,
    perfil_profesional: calcResult.profile.title,
    servicio_recomendado: calcResult.recommendedPillar.name,
    programa_oficial: calcResult.recommendedPillar.serviceTitle,
    tags: tagsList.join(','),
    tags_array: tagsList
  };

  console.log(`Enviando lead: ${lead.name} (${lead.email}) con tags:`, tagsList);

  const res = await fetch(OFFICIAL_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ghlPayload)
  });

  console.log(`Respuesta GHL para ${lead.name}: Status ${res.status}`);
  return res.status;
}

async function run() {
  console.log('=== INICIANDO ENVÍO DE 2 PRUEBAS EXCLUSIVAS ===\n');

  // PRUEBA 1: SIN AGENDAR (Valeria Restrepo)
  // No tendrá la etiqueta "agendo-cita". En Flujo 2 esperará los 15 min (o timeout) y se irá por la rama NO AGENDÓ.
  const valeriaLead: UserLeadInfo = {
    name: 'Valeria Restrepo',
    email: 'patriloaiza.perez+valeria2026@gmail.com',
    whatsapp: '+57 312 987 6543',
    profession: 'Psicóloga Clínica & Mentora de Parejas',
    currentActivity: 'Sesiones individuales de terapia y programas de acompañamiento emocional',
    commercializationModel: 'servicios_1a1',
    payingClientsStatus: 'irregulares',
    company: 'Bienestar y Vínculos Consultoría',
    role: 'Directora'
  };

  const valeriaAnswers: PrediagnosticAnswers = {
    q1: 'invisible',
    q2: '1',
    q3: '1',
    q4: '2',
    q5: '0',
    q6: '0',
    q7: '0',
    q8: '0',
    q9: '1',
    q10: 'pilar1',
    q11: 'bms',
    q12: 'pilar1_bias',
    q13: 'bms',
    q14: 'foundation'
  };

  console.log('--- 1. Enviando Prueba 1: Valeria Restrepo (SIN AGENDAR) ---');
  await dispatchLead(valeriaLead, valeriaAnswers, []);
  console.log('✓ Prueba 1 (Valeria Restrepo - SIN AGENDAR) enviada con éxito.\n');

  // Esperar 4 segundos entre envíos
  console.log('Esperando 4 segundos para enviar la Prueba 2...\n');
  await new Promise((r) => setTimeout(r, 4000));

  // PRUEBA 2: QUE SÍ AGENDA (Mateo Carvajal)
  // Se envía primero el prediagnóstico y luego con la etiqueta 'agendo-cita'
  const mateoLead: UserLeadInfo = {
    name: 'Mateo Carvajal',
    email: 'patriloaiza.perez+mateo2026@gmail.com',
    whatsapp: '+57 320 876 5432',
    profession: 'Consultor Financiero & Estratega Patrimonial',
    currentActivity: 'Estructuración fiscal, planificación patrimonial y finanzas corporativas',
    commercializationModel: 'servicios_1a1',
    payingClientsStatus: 'activos_recurrentes',
    company: 'Carvajal Wealth Advisors',
    role: 'Socio Director'
  };

  const mateoAnswers: PrediagnosticAnswers = {
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
  };

  console.log('--- 2. Enviando Prueba 2: Mateo Carvajal (QUE SÍ AGENDA - con etiqueta agendo-cita) ---');
  // Se envía directamente con la etiqueta 'agendo-cita' para que la condición de GoHighLevel se cumpla de inmediato
  await dispatchLead(mateoLead, mateoAnswers, ['agendo-cita']);
  console.log('✓ Prueba 2 (Mateo Carvajal - SÍ AGENDÓ) enviada con éxito.\n');

  console.log('=== AMBAS PRUEBAS COMPLETADAS ===');
}

run().catch(console.error);
