import { calculatePrediagnostic, COMMERCIAL_MODELS_LABELS, PAYING_CLIENTS_LABELS } from '../src/utils/prediagnosticLogic';
import { generateDiagnosticHtmlReport, generateDiagnosticTextReport, OFFICIAL_ADMIN_EMAIL } from '../src/utils/ghlEmailTemplate';
import { AUTOMATED_TEST_CASES } from '../src/components/AutomatedTestsModal';

const OFFICIAL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/skgSf0Kg3sY00t6Wdy38/webhook-trigger/75483c9f-2acf-41ee-9694-cebb8cdc4ab4';
const OFFICIAL_BOOKING = 'https://link.ghlespanol.com/widget/booking/aI6mS973gkCQmeyn08ST';

async function main() {
  const baseCase = AUTOMATED_TEST_CASES[1] || AUTOMATED_TEST_CASES[0];
  
  // Lead para Patricia Loaiza
  const lead = {
    name: 'Patricia Loaiza (Prueba Automatización)',
    email: 'patriloaiza.perez@gmail.com',
    whatsapp: '+57 300 123 4567',
    profession: 'Consultora de Negocios y Estrategia',
    currentActivity: 'Servicios de consultoría estratégica y programas de alto valor',
    commercializationModel: 'servicios_1a1',
    payingClientsStatus: 'irregulares',
    company: 'Crea y Monetiza®',
    role: 'Fundadora & Directora'
  };

  const calcResult = calculatePrediagnostic(baseCase.answers, lead);

  const tagsList = [
    'prediagnostico-completado',
    calcResult.hasContradiction ? 'discrepancia-detectada' : 'cimiento-alineado',
    calcResult.hasInternalIncoherence ? 'incoherencia-interna-detectada' : 'coherencia-confirmada',
    `servicio-prioritario-${calcResult.recommendedPillar.id}`,
    calcResult.gatingAnalysis.isPilar4Blocked ? 'veto-sistematizacion-prematura' : 'viable-etapas-avanzadas'
  ];

  const modelLabel = COMMERCIAL_MODELS_LABELS[calcResult.lead.commercializationModel] || calcResult.lead.commercializationModel;
  const clientsLabel = PAYING_CLIENTS_LABELS[calcResult.lead.payingClientsStatus] || calcResult.lead.payingClientsStatus;

  const formattedNoteText = `📋 RESUMEN PREDIAGNÓSTICO ESTRATÉGICO CREA Y MONETIZA®
👤 Contacto: ${calcResult.lead.name}
🎓 Profesión: ${calcResult.lead.profession}
💼 Actividad Actual: ${calcResult.lead.currentActivity}
📦 Modelo Comercial: ${modelLabel}
👥 Clientes de Pago: ${clientsLabel}
🏢 Empresa: ${calcResult.lead.company || 'No especificada'}
📱 WhatsApp: ${calcResult.lead.whatsapp}
🎯 Perfil Evolutivo: ${calcResult.profile.title} ("${calcResult.profile.subtitle}")
--------------------------------------------------
🔍 SITUACIÓN Y SERVICIO RECOMENDADO:
• Servicio que busca: ${calcResult.statedPillar.name}
• SERVICIO PRIORITARIO REAL: ${calcResult.recommendedPillar.name}
• Programa Oficial: ${calcResult.recommendedPillar.serviceTitle} (${calcResult.recommendedPillar.duration})
⚠️ ¿TIENE DISCREPANCIA?: ${calcResult.hasContradiction ? 'SÍ' : 'NO'}
• Motivo Discrepancia: ${calcResult.contradictionAnalysis?.explanation || 'Sin discrepancia; objetivo alineado con la madurez actual.'}
• Riesgo de saltarse el paso: ${calcResult.contradictionAnalysis?.riskOfSkipping || 'N/A'}
🚨 AUDITORÍA DE PRERREQUISITOS:
• ¿Veto de Pilar 4 aplicado?: ${calcResult.gatingAnalysis.isPilar4Blocked ? 'SÍ (Bloqueado por falta de oferta validada o clientes recurrentes)' : 'NO'}
• ¿Veto de Pilar 3 aplicado?: ${calcResult.gatingAnalysis.isPilar3Blocked ? 'SÍ (Bloqueado por falta de oferta estructurada)' : 'NO'}
⛔ LO QUE NO DEBE HACER:
${calcResult.notFirstAdvice.warning}

🔎 EVIDENCIAS CLAVE DETECTADAS:
${calcResult.evidences.map((e) => `• ${e}`).join('\n')}

📊 PUNTUACIONES:
• Pilar 1 (Estrategia y Oferta BMS): ${calcResult.scores.pilar1} pts
• Pilar 2 (Marca Personal & Autoridad): ${calcResult.scores.pilar2} pts
• Pilar 3 (Viral Sales Content): ${calcResult.scores.pilar3} pts
• Pilar 4 (Digital Business Day & IA): ${calcResult.scores.pilar4} pts`;

  const bookingLink = OFFICIAL_BOOKING;
  const htmlEmailReport = generateDiagnosticHtmlReport(calcResult, bookingLink);
  const textEmailReport = generateDiagnosticTextReport(calcResult, bookingLink);

  const ghlPayload: Record<string, any> = {
    name: calcResult.lead.name.trim(),
    full_name: calcResult.lead.name.trim(),
    first_name: 'Patricia',
    last_name: 'Loaiza (Prueba)',
    email: 'patriloaiza.perez@gmail.com',
    phone: calcResult.lead.whatsapp.trim(),
    whatsapp: calcResult.lead.whatsapp.trim(),

    // Admin email
    admin_email: OFFICIAL_ADMIN_EMAIL,
    admin_copy_email: OFFICIAL_ADMIN_EMAIL,
    copia_para: OFFICIAL_ADMIN_EMAIL,
    notificacion_administrador: OFFICIAL_ADMIN_EMAIL,
    email_copia: OFFICIAL_ADMIN_EMAIL,

    // Plantillas de Correo para GoHighLevel
    diagnostico_email_html: htmlEmailReport,
    diagnostico_resumen_texto: textEmailReport,
    resultado_diagnostico_html: htmlEmailReport,
    resultado_diagnostico: textEmailReport,
    enlace_calendario: bookingLink,
    booking_url: bookingLink,

    // Variables directas para workflows
    diagnostico_perfil: `${calcResult.profile.title} ("${calcResult.profile.subtitle}")`,
    diagnostico_servicio_recomendado: calcResult.recommendedPillar.name,
    diagnostico_programa_oficial: `${calcResult.recommendedPillar.serviceTitle} (${calcResult.recommendedPillar.duration})`,
    diagnostico_motivo_discrepancia: calcResult.contradictionAnalysis?.explanation || 'Sin discrepancia; objetivo alineado con la madurez actual.',
    diagnostico_lo_que_no_debe_hacer: calcResult.notFirstAdvice.warning,
    diagnostico_advertencia: calcResult.notFirstAdvice.warning,
    
    // Datos profesionales contextuales
    profesion: calcResult.lead.profession,
    profession: calcResult.lead.profession,
    'profesion o especialidad': calcResult.lead.profession,
    actividad_actual: calcResult.lead.currentActivity,
    'a que se dedica': calcResult.lead.currentActivity,
    current_activity: calcResult.lead.currentActivity,
    modelo_comercializacion: modelLabel,
    'modelo de comercializacion': modelLabel,
    commercial_model: modelLabel,
    estado_clientes_pago: clientsLabel,
    'clientes de pago': clientsLabel,
    paying_clients_status: clientsLabel,

    // Texto consolidado para Nota y Campo Personalizado de GHL
    resumen_ejecutivo: formattedNoteText,
    'Resumen Ejecutivo': formattedNoteText,
    'resumen ejecutivo': formattedNoteText,
    resumen_diagnostico: formattedNoteText,
    'resumen diagnostico': formattedNoteText,
    'Resumen Diagnostico': formattedNoteText,
    'Resumen Diagnóstico': formattedNoteText,
    resultado_diagnostico_texto: formattedNoteText,
    'Resultado Diagnostico': formattedNoteText,
    'Resultado Diagnóstico': formattedNoteText,
    resumen_completo: formattedNoteText,
    nota_completa: formattedNoteText,
    resumen: formattedNoteText,
    note: formattedNoteText,
    notes: formattedNoteText,
    nota: formattedNoteText,
    body: formattedNoteText,
    body_text: formattedNoteText,
    comentarios: formattedNoteText,
    observaciones: formattedNoteText,
    
    // Empresa y rol
    'company name': calcResult.lead.company || 'No especificada',
    company_name: calcResult.lead.company || 'No especificada',
    role: calcResult.lead.role || calcResult.lead.profession,
    
    // Perfil y diagnóstico
    'perfil profesional': calcResult.profile.title,
    perfil_profesional: calcResult.profile.title,
    'perfil subtitulo': calcResult.profile.subtitle,
    perfil_subtitulo: calcResult.profile.subtitle,
    
    // Servicios
    'servicio deseado': calcResult.statedPillar.name,
    servicio_deseado: calcResult.statedPillar.name,
    'servicio recomendado': calcResult.recommendedPillar.name,
    servicio_recomendado: calcResult.recommendedPillar.name,
    'programa oficial': calcResult.recommendedPillar.serviceTitle,
    programa_oficial: calcResult.recommendedPillar.serviceTitle,
    'duracion estimada': calcResult.recommendedPillar.duration,
    duracion_estimada: calcResult.recommendedPillar.duration,
    
    // Análisis de discrepancia y gating
    'tiene discrepancia': calcResult.hasContradiction ? 'SÍ' : 'NO',
    tiene_discrepancia: calcResult.hasContradiction ? 'SÍ' : 'NO',
    'motivo discrepancia': calcResult.contradictionAnalysis?.explanation || 'Sin discrepancia; objetivo alineado con la madurez actual.',
    motivo_discrepancia: calcResult.contradictionAnalysis?.explanation || 'Sin discrepancia; objetivo alineado con la madurez actual.',
    'riesgo de saltarse paso': calcResult.contradictionAnalysis?.riskOfSkipping || 'N/A',
    riesgo_de_saltarse_paso: calcResult.contradictionAnalysis?.riskOfSkipping || 'N/A',
    'lo que no debe hacer': calcResult.notFirstAdvice.warning,
    lo_que_no_debe_hacer: calcResult.notFirstAdvice.warning,
    veto_pilar4_aplicado: calcResult.gatingAnalysis.isPilar4Blocked ? 'SÍ' : 'NO',
    veto_pilar3_aplicado: calcResult.gatingAnalysis.isPilar3Blocked ? 'SÍ' : 'NO',
    
    // Tags
    tags: tagsList.join(','),
    tags_array: tagsList,
    
    // Puntuaciones
    puntuacion_pilar1: calcResult.scores.pilar1,
    puntuacion_pilar2: calcResult.scores.pilar2,
    puntuacion_pilar3: calcResult.scores.pilar3,
    puntuacion_pilar4: calcResult.scores.pilar4,
    puntuaciones: calcResult.scores,
    fecha_evaluacion: new Date().toISOString()
  };

  console.log('Enviando webhook de prueba a GoHighLevel...');
  console.log('URL Webhook:', OFFICIAL_WEBHOOK);
  console.log('Email destino:', ghlPayload.email);
  console.log('Servicio recomendado:', ghlPayload.servicio_recomendado);

  const res = await fetch(OFFICIAL_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ghlPayload)
  });

  console.log('Status code HTTP:', res.status, res.statusText);
  const text = await res.text();
  console.log('Respuesta GHL:', text);
}

main().catch(console.error);
