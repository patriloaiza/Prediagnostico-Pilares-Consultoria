import {
  PrediagnosticResult,
  COMMERCIAL_MODELS_LABELS,
  PAYING_CLIENTS_LABELS
} from './prediagnosticLogic';

export const OFFICIAL_ADMIN_EMAIL = 'patriloaiza.perez@gmail.com';

/**
 * Genera el cuerpo en HTML estructurado de alta fidelidad para el correo de GoHighLevel.
 * Utiliza estilos inline estándar compatibles con todos los clientes de correo (Gmail, Outlook, Apple Mail, etc.).
 * Replica fielmente el diseño del informe visual y PDF (encabezado corporativo, insignias rojas,
 * tarjetas de contraste, análisis de discrepancia, claves de crecimiento con lectura estratégica,
 * evidencias numeradas y botón de llamado a la acción para agendar).
 */
/**
 * Genera únicamente las tarjetas de diagnóstico estructuradas en HTML de alta fidelidad
 * (Contexto Comercial, Perfil de Madurez, Análisis de Enfoque con caja roja destacada,
 * Claves de Crecimiento con lectura estratégica, Solución Estratégica con modalidad y alcance,
 * Evidencias con insignias circulares numeradas 1..5, Advertencia en rojo, y Tabla de Puntuaciones).
 * Este bloque es EXACTAMENTE IDÉNTICO al del correo de Valeria (la que no agendó) y se inyecta
 * tanto en {{contact.diagnostico_estrategico_crea_y_monetiza}} como en los reportes de confirmación de cita.
 */
export function generateDiagnosticCardsHtml(calc: PrediagnosticResult): string {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const firstName = name.split(' ')[0] || 'Emprendedor/a';
  const profile = calc.profile;
  const pillar = calc.recommendedPillar;
  const hasContradiction = calc.hasContradiction;
  const scores = calc.scores;
  const model = COMMERCIAL_MODELS_LABELS[calc.lead.commercializationModel] || calc.lead.commercializationModel;
  const clients = PAYING_CLIENTS_LABELS[calc.lead.payingClientsStatus] || calc.lead.payingClientsStatus;
  const profession = calc.lead.profession || 'Profesional / Consultor';
  const activity = calc.lead.currentActivity || 'Servicios profesionales';
  const incoherences = calc.detectedIncoherences || [];
  const evidences = calc.evidences || [];

  return `<!-- 1. CONTEXTO COMERCIAL VERIFICADO -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 22px;">
  <tr>
    <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb;">
      <div style="font-size: 11px; font-weight: 800; color: #D7192B; text-transform: uppercase; letter-spacing: 0.5px;">
        ✓ CONTEXTO COMERCIAL VERIFICADO
      </div>
    </td>
  </tr>
  <tr>
    <td style="padding: 14px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
        <tr>
          <td width="50%" style="padding: 4px 0; color: #6b7280;"><strong>Profesión / Área:</strong></td>
          <td width="50%" style="padding: 4px 0; color: #111827; font-weight: 700;">${profession}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;"><strong>Actividad Actual:</strong></td>
          <td style="padding: 4px 0; color: #111827;">${activity}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;"><strong>Modelo Comercial:</strong></td>
          <td style="padding: 4px 0; color: #111827;">${model}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;"><strong>Clientes de Pago:</strong></td>
          <td style="padding: 4px 0; color: #111827; font-weight: 700;">${clients}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- 2. PERFIL DE MADUREZ PROFESIONAL -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 22px; overflow: hidden;">
  <tr>
    <td style="background-color: #f3f4f6; padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
      <span style="font-size: 11px; font-weight: 800; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">
        PERFIL DE MADUREZ PROFESIONAL DE ${firstName.toUpperCase()}
      </span>
    </td>
  </tr>
  <tr>
    <td style="padding: 18px 16px;">
      <div style="font-size: 19px; font-weight: 900; color: #111827;">
        ${profile.title}
      </div>
      <div style="font-size: 13px; font-weight: 700; color: #D7192B; margin-top: 2px;">
        "${profile.subtitle}"
      </div>
      <p style="margin: 10px 0 14px 0; font-size: 13.5px; line-height: 1.6; color: #4b5563;">
        ${profile.description}
      </p>

      <!-- Cuadro Obstáculo y Paso Inmediato -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
        <tr>
          <td style="padding: 12px 14px;">
            <div style="font-size: 11.5px; font-weight: 800; color: #111827; text-transform: uppercase;">
              ⚡ Obstáculo Central de ${firstName}:
            </div>
            <div style="font-size: 12.5px; color: #6b7280; margin-top: 3px; line-height: 1.4;">
              ${profile.corePain}
            </div>
            <div style="margin-top: 10px; font-size: 11.5px; font-weight: 800; color: #111827; text-transform: uppercase;">
              🎯 Paso Inmediato para ${firstName}:
            </div>
            <div style="font-size: 12.5px; color: #6b7280; margin-top: 3px; line-height: 1.4;">
              ${profile.priorityNeed}
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- 3. ANÁLISIS DE ENFOQUE: TU RUTA MÁS RÁPIDA AL CRECIMIENTO -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; margin-bottom: 22px;">
  <tr>
    <td style="padding: 18px 16px;">
      <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px;">
        ANÁLISIS DE ENFOQUE PARA ${firstName.toUpperCase()}
      </div>
      <div style="font-size: 16px; font-weight: 900; color: #92400e; margin-top: 4px;">
        ${calc.contradictionAnalysis ? `${firstName}: ${calc.contradictionAnalysis.title}` : `Enfoque Estratégico de ${firstName} Alineado`}
      </div>

      <!-- Comparativa: Inicial vs Rentable -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 14px;">
        <tr>
          <td width="48%" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; vertical-align: top;">
            <div style="font-size: 10px; font-weight: 800; color: #6b7280; text-transform: uppercase;">
              TU IDEA INICIAL (${firstName}):
            </div>
            <div style="font-size: 12.5px; font-weight: 700; color: #374151; margin-top: 3px;">
              ${calc.statedPillar.name}
            </div>
          </td>
          <td width="4%">&nbsp;</td>
          <td width="48%" style="background-color: #ffffff; border: 2px solid #D7192B; border-radius: 8px; padding: 10px; vertical-align: top;">
            <div style="font-size: 10px; font-weight: 800; color: #D7192B; text-transform: uppercase;">
              EL PASO MÁS RENTABLE HOY (${firstName}):
            </div>
            <div style="font-size: 12.5px; font-weight: 800; color: #111827; margin-top: 3px;">
              ${pillar.name}
            </div>
          </td>
        </tr>
      </table>

      ${hasContradiction && calc.contradictionAnalysis ? `
      <div style="margin-top: 14px; font-size: 13px; line-height: 1.5; color: #78350f;">
        <strong>Lectura del Diagnóstico:</strong> ${calc.contradictionAnalysis.explanation}
      </div>
      <div style="margin-top: 8px; font-size: 12.5px; line-height: 1.5; color: #92400e; background-color: #fef3c7; padding: 10px; border-radius: 6px;">
        <strong>¿Por qué este es el camino más inteligente y seguro para ti?</strong><br>
        ${calc.contradictionAnalysis.riskOfSkipping}
      </div>
      ` : ''}
    </td>
  </tr>
</table>

<!-- 4. CLAVES DE CRECIMIENTO: OPORTUNIDADES IDENTIFICADAS -->
${incoherences.length > 0 ? `
<div style="margin-bottom: 22px;">
  <div style="font-size: 11px; font-weight: 800; color: #D7192B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
    CLAVES DE CRECIMIENTO PARA ${firstName.toUpperCase()}
  </div>
  <h3 style="margin: 0 0 12px 0; font-size: 17px; font-weight: 900; color: #111827;">
    Hallazgos Clave para Acelerar los Resultados de ${firstName}
  </h3>
  <p style="margin: 0 0 14px 0; font-size: 12.5px; color: #6b7280; line-height: 1.5;">
    Al analizar tus respuestas en conjunto, identificamos puntos ciegos comunes que suelen frenar a profesionales en tu especialidad (${profession}). Conocerlos te ahorra meses de desgaste:
  </p>

  ${incoherences.slice(0, 3).map((inc, i) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #fcd34d; border-radius: 10px; margin-bottom: 14px; overflow: hidden;">
    <tr>
      <td style="background-color: #fef3c7; padding: 10px 14px; border-bottom: 1px solid #fcd34d;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-size: 13px; font-weight: 800; color: #111827;">
              ${i + 1}. ${inc.title}
            </td>
            <td align="right">
              <span style="background-color: ${inc.severity === 'critica' ? '#D7192B' : '#d97706'}; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">
                ${inc.severity === 'critica' ? 'OPORTUNIDAD CLAVE' : 'AJUSTE RECOMENDADO'}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 14px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #111111; border-radius: 8px; padding: 12px; color: #ffffff;">
          <tr>
            <td style="padding: 4px 6px;">
              <div style="font-size: 11px; font-weight: 800; color: #fbbf24; text-transform: uppercase;">
                💡 LECTURA ESTRATÉGICA PARA ${firstName.toUpperCase()}:
              </div>
              <div style="font-size: 12px; color: #e5e7eb; margin-top: 3px; line-height: 1.4;">
                ${inc.verdict}
              </div>
              <div style="margin-top: 10px; font-size: 11px; font-weight: 800; color: #34d399; text-transform: uppercase;">
                🌱 EL SECRETO PARA CRECER CON SEGURIDAD:
              </div>
              <div style="font-size: 12px; color: #d1d5db; margin-top: 3px; line-height: 1.4;">
                ${inc.revealedTruth}
              </div>
              <div style="margin-top: 10px; font-size: 11px; font-weight: 800; color: #fde047; text-transform: uppercase;">
                🚀 PRÓXIMO PASO RECOMENDADO PARA ${firstName.toUpperCase()}:
              </div>
              <div style="font-size: 12px; color: #fef08a; margin-top: 3px; line-height: 1.4;">
                ${inc.actionRequired}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `).join('')}
</div>
` : ''}

<!-- 5. SOLUCIÓN ESTRATÉGICA RECOMENDADA -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-left: 5px solid #D7192B; border-radius: 12px; margin-bottom: 22px;">
  <tr>
    <td style="padding: 20px 18px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <span style="font-size: 11px; font-weight: 800; color: #D7192B; text-transform: uppercase; letter-spacing: 0.5px;">
              ★ SOLUCIÓN ESTRATÉGICA RECOMENDADA
            </span>
          </td>
          <td align="right">
            <span style="font-size: 11px; color: #6b7280; font-weight: 700; text-transform: uppercase;">
              ${pillar.categoryTag || 'CIMIENTO COMERCIAL & OFERTA DE ALTO VALOR'}
            </span>
          </td>
        </tr>
      </table>

      <div style="font-size: 20px; font-weight: 900; color: #111827; margin-top: 8px;">
        ${pillar.name}
      </div>
      <div style="font-size: 13.5px; font-weight: 700; color: #6b7280; margin-top: 2px;">
        ${pillar.serviceTitle}
      </div>

      <!-- Cuadro Modalidad y Alcance -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 14px 0;">
        <tr>
          <td width="48%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px;">
            <div style="font-size: 10px; font-weight: 800; color: #6b7280; text-transform: uppercase;">MODALIDAD Y DURACIÓN</div>
            <div style="font-size: 13px; font-weight: 800; color: #059669; margin-top: 3px;">${pillar.duration}</div>
          </td>
          <td width="4%">&nbsp;</td>
          <td width="48%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px;">
            <div style="font-size: 10px; font-weight: 800; color: #6b7280; text-transform: uppercase;">ALCANCE DEL SERVICIO</div>
            <div style="font-size: 13px; font-weight: 800; color: #111827; margin-top: 3px;">${pillar.lessonsCount || '6 Fases de Acompañamiento Estratégico'}</div>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 14px 0; font-size: 13px; line-height: 1.6; color: #4b5563;">
        ${pillar.description}
      </p>

      <!-- Transformación Diseñada -->
      <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px;">
        <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase;">
          ✨ TRANSFORMACIÓN DISEÑADA PARA ${firstName.toUpperCase()}:
        </div>
        <div style="font-size: 12.5px; color: #78350f; margin-top: 4px; line-height: 1.5;">
          ${pillar.transformation}
        </div>
      </div>
    </td>
  </tr>
</table>

<!-- 6. CLAVES IDENTIFICADAS EN LAS RESPUESTAS (EVIDENCIAS) -->
${evidences.length > 0 ? `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 22px;">
  <tr>
    <td style="padding: 18px 16px;">
      <div style="font-size: 14px; font-weight: 900; color: #111827; margin-bottom: 4px;">
        Claves Identificadas en las Respuestas de ${firstName}
      </div>
      <div style="font-size: 12px; color: #6b7280; margin-bottom: 14px;">
        Factores que confirman por qué este es el momento idóneo para concentrar tu energía en este pilar:
      </div>

      ${evidences.slice(0, 5).map((ev, idx) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
        <tr>
          <td width="26" style="vertical-align: top; padding-top: 2px;">
            <div style="width: 20px; height: 20px; background-color: #D7192B; color: #ffffff; border-radius: 50%; font-size: 11px; font-weight: 800; text-align: center; line-height: 20px;">
              ${idx + 1}
            </div>
          </td>
          <td style="font-size: 12.5px; color: #374151; line-height: 1.5; padding-left: 8px;">
            ${ev}
          </td>
        </tr>
      </table>
      `).join('')}
    </td>
  </tr>
</table>
` : ''}

<!-- 7. ADVERTENCIA CLAVE (LO QUE NO DEBE HACER) -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef2f2; border: 1px solid #fee2e2; border-left: 4px solid #ef4444; border-radius: 10px; margin-bottom: 22px;">
  <tr>
    <td style="padding: 14px 16px;">
      <div style="font-size: 12px; font-weight: 800; color: #b91c1c; text-transform: uppercase;">
        ⛔ LO QUE NO DEBES HACER EN ESTA ETAPA (${firstName.toUpperCase()}):
      </div>
      <div style="font-size: 13.5px; font-weight: 800; color: #991b1b; margin-top: 4px; line-height: 1.4;">
        ${calc.notFirstAdvice.warning}
      </div>
      <p style="margin: 6px 0 0 0; font-size: 12.5px; line-height: 1.5; color: #7f1d1d;">
        ${calc.notFirstAdvice.recommendation}
      </p>
    </td>
  </tr>
</table>

<!-- 8. RADIOGRAFÍA DE PUNTUACIONES -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; border-radius: 10px; margin-bottom: 26px;">
  <tr>
    <td style="padding: 14px 16px;">
      <div style="font-size: 11px; font-weight: 800; color: #374151; text-transform: uppercase; margin-bottom: 8px;">
        📊 PUNTUACIONES POR PILAR EVALUADO (100 PUNTOS MÁXIMO):
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 12.5px;">
        <tr>
          <td style="padding: 4px 0; color: #4b5563;">1. Estrategia & Oferta BMS:</td>
          <td align="right" style="padding: 4px 0; font-weight: 800; color: #111827;">${scores.pilar1} pts</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #4b5563;">2. Marca Personal & Autoridad:</td>
          <td align="right" style="padding: 4px 0; font-weight: 800; color: #111827;">${scores.pilar2} pts</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #4b5563;">3. Viral Sales Content:</td>
          <td align="right" style="padding: 4px 0; font-weight: 800; color: #111827;">${scores.pilar3} pts</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #4b5563;">4. Digital Business Day & IA:</td>
          <td align="right" style="padding: 4px 0; font-weight: 800; color: #111827;">${scores.pilar4} pts</td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

/**
 * Genera el cuerpo en HTML estructurado de alta fidelidad para el correo de GoHighLevel (NO agendó).
 * Utiliza estilos inline estándar compatibles con todos los clientes de correo (Gmail, Outlook, Apple Mail, etc.).
 * Replica fielmente el diseño del informe visual y PDF (encabezado corporativo, insignias rojas,
 * tarjetas de contraste, análisis de discrepancia, claves de crecimiento con lectura estratégica,
 * evidencias numeradas y botón de llamado a la acción para agendar).
 */
export function generateDiagnosticHtmlReport(
  calc: PrediagnosticResult,
  bookingUrl: string = 'https://link.ghlespanol.com/widget/booking/aI6mS973gkCQmeyn08ST'
): string {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const firstName = name.split(' ')[0] || 'Emprendedor/a';
  const profession = calc.lead.profession || 'Profesional / Consultor';
  const cardsHtml = generateDiagnosticCardsHtml(calc);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Informe Oficial de Prediagnóstico Estratégico · ${name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 24px 8px;">
    <tr>
      <td align="center">
        <!-- Contenedor Principal (Max 640px) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
          
          <!-- 1. ENCABEZADO CORPORATIVO OSCURO DE MARCA -->
          <tr>
            <td style="background-color: #0d0d0d; padding: 32px 24px; border-bottom: 4px solid #D7192B; text-align: center;">
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                <tr>
                  <td style="background-color: #D7192B; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 800; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase;">
                    METODOLOGÍA CREA Y MONETIZA®
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                Prediagnóstico Consultoría Requerida
              </h1>
              <div style="margin-top: 8px; font-size: 13px; color: #9ca3af;">
                Patricia Loaiza · Auditoría de Cimientos y Madurez Comercial
              </div>
              <div style="margin-top: 14px; display: inline-block; background-color: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 9999px; font-size: 12px; color: #fca5a5; font-weight: 700;">
                Auditoría Estratégica para: ${name}
              </div>
            </td>
          </tr>

          <!-- 2. INTRODUCCIÓN EMPÁTICA Y STATUS -->
          <tr>
            <td style="padding: 24px 24px 16px 24px; background-color: #ffffff;">
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #D7192B; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 13px; font-style: italic; line-height: 1.6; color: #7f1d1d;">
                  "<strong>${firstName}</strong>, llevas años construyendo experiencia... pero algo no cierra. ¿Es visibilidad? ¿Automatización? ¿O tu oferta aún tiene cuellos de botella invisibles? Nuestro motor de auditoría de evidencias te revela la verdad exacta — y te protege de invertir en lo que no toca."
                </p>
              </div>

              <!-- Saludo personalizado -->
              <h2 style="margin: 0 0 10px 0; font-size: 21px; font-weight: 900; color: #111827;">
                ¡Hola, <span style="color: #D7192B;">${firstName}</span>! 👋
              </h2>
              <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                Hemos procesado tus respuestas y tu situación profesional como <strong>${profession}</strong> para diseñar tu ruta más rentable y directa al crecimiento. A continuación encuentras la radiografía completa de tus resultados:
              </p>

              <!-- 3. TARJETAS MODULARES DE DIAGNÓSTICO -->
              ${cardsHtml}

              <!-- 4. GRAN LLAMADO A LA ACCIÓN (PERSUASIVO CON BOTÓN DESTACADO) -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #0d0d0d 0%, #1f2937 100%); border-radius: 16px; text-align: center; margin-bottom: 12px; border: 1px solid #374151; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
                <tr>
                  <td style="padding: 30px 24px;">
                    <div style="font-size: 11px; font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;">
                      SESIÓN ESTRATÉGICA 1 A 1 DE REGALO (45 MIN)
                    </div>
                    <h3 style="margin: 0 0 10px 0; font-size: 21px; font-weight: 900; color: #ffffff; line-height: 1.3;">
                      Revisemos a Fondo tu Hoja de Ruta, ${firstName}
                    </h3>
                    <p style="margin: 0 auto 20px auto; font-size: 13.5px; line-height: 1.6; color: #d1d5db; max-width: 480px;">
                      Tener este informe es el primer paso. El verdadero salto ocurre cuando analizamos juntos cómo destrabar tu facturación, proteger tu tiempo y aplicar este plan en tu negocio con precisión quirúrgica.
                    </p>

                    <div>
                      <a href="${bookingUrl}" target="_blank" style="display: inline-block; background-color: #D7192B; color: #ffffff; text-decoration: none; font-weight: 900; font-size: 15px; padding: 16px 36px; border-radius: 10px; box-shadow: 0 6px 20px rgba(215, 25, 43, 0.45); text-transform: uppercase; letter-spacing: 0.5px;">
                        📅 Agendar Mi Sesión Estratégica Gratuita →
                      </a>
                    </div>

                    <div style="margin-top: 14px; font-size: 11.5px; color: #9ca3af;">
                      ⏳ Cupo prioritario reservado para <strong>${firstName}</strong> · Sin costo por tiempo limitado
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- PIE DEL CORREO -->
          <!-- PIE DEL CORREO & CUMPLIMIENTO RGPD / GDPR -->
          <tr>
            <td style="background-color: #f9fafb; padding: 18px 24px; border-top: 1px solid #e5e7eb; text-align: center;">
              <div style="font-size: 11px; font-weight: 800; color: #4b5563; letter-spacing: 0.5px;">
                CREA Y MONETIZA®
              </div>
              <div style="font-size: 9.5px; color: #6b7280; margin-top: 2px;">
                Metodología de Consultoría e Investigación Estratégica · Patricia Loaiza
              </div>
              <div style="margin-top: 6px; font-size: 8.5px; line-height: 1.4; color: #9ca3af; max-width: 520px; margin-left: auto; margin-right: auto;">
                Recibes este correo porque solicitaste y completaste el prediagnóstico estratégico en nuestra plataforma. Tratamiento confidencial de datos personales conforme al RGPD y normativas de privacidad.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

/**
 * Genera el cuerpo en HTML estructurado de alta fidelidad para el correo cuando SÍ agendó.
 * Es IDÉNTICO visualmente al informe de prediagnóstico (mismo encabezado, tarjetas modulares,
 * insignias rojas, 5 evidencias, discrepancia y puntuaciones), pero con la tarjeta verde de
 * CITA 100% CONFIRMADA al inicio y sin el botón de agendar al final (ya que la cita ya está reservada).
 */
export function generateAppointmentConfirmationHtmlReport(
  calc: PrediagnosticResult
): string {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const firstName = name.split(' ')[0] || 'Emprendedor/a';
  const profession = calc.lead.profession || 'Profesional / Consultor';
  const cardsHtml = generateDiagnosticCardsHtml(calc);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cita Confirmada y Diagnóstico Estratégico · ${name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 24px 8px;">
    <tr>
      <td align="center">
        <!-- Contenedor Principal (Max 640px) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
          
          <!-- 1. ENCABEZADO CORPORATIVO OSCURO DE MARCA -->
          <tr>
            <td style="background-color: #0d0d0d; padding: 32px 24px; border-bottom: 4px solid #D7192B; text-align: center;">
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                <tr>
                  <td style="background-color: #D7192B; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 800; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase;">
                    METODOLOGÍA CREA Y MONETIZA®
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                Prediagnóstico Consultoría Requerida
              </h1>
              <div style="margin-top: 8px; font-size: 13px; color: #9ca3af;">
                Patricia Loaiza · Auditoría de Cimientos y Madurez Comercial
              </div>
              <div style="margin-top: 14px; display: inline-block; background-color: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 9999px; font-size: 12px; color: #fca5a5; font-weight: 700;">
                Auditoría Estratégica & Cita Confirmada para: ${name}
              </div>
            </td>
          </tr>

          <!-- 2. TARJETA DESTACADA: CITA 100% CONFIRMADA -->
          <tr>
            <td style="padding: 24px 24px 8px 24px; background-color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ecfdf5; border: 2px solid #10b981; border-radius: 14px; padding: 20px; text-align: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; background-color: #10b981; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 8px;">
                      ✓ CITA 100% CONFIRMADA
                    </span>
                    <h2 style="margin: 6px 0 6px 0; font-size: 20px; font-weight: 900; color: #065f46;">
                      ¡Tu Sesión Estratégica 1 a 1 está lista! 🎉
                    </h2>
                    <p style="margin: 0 0 16px 0; font-size: 13px; color: #047857; line-height: 1.5;">
                      Hola <strong>${firstName}</strong>, tu espacio de consultoría personalizada de 45 minutos ha quedado reservado con éxito.
                    </p>

                    <!-- Cuadro de Horario y Link -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; border: 1px solid #a7f3d0; margin-bottom: 16px; text-align: left;">
                      <tr>
                        <td style="padding: 10px 14px; font-size: 13px; color: #374151; border-bottom: 1px solid #ecfdf5;">
                          📅 <strong>Fecha y Hora:</strong> <span style="color: #065f46; font-weight: 800; font-size: 14px;">{{appointment.start_time}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; font-size: 13px; color: #374151;">
                          📎 <strong>Videollamada:</strong> <a href="{{appointment.meeting_location}}" style="color: #D7192B; font-weight: 700; text-decoration: underline;" target="_blank">Entrar a la reunión</a>
                        </td>
                      </tr>
                    </table>

                    <!-- Botón de acceso directo -->
                    <a href="{{appointment.meeting_location}}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 10px rgba(16,185,129,0.3);">
                      👉 Unirse a la Videollamada Aquí
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3. INSTRUCCIONES RÁPIDAS PARA LA SESIÓN -->
          <tr>
            <td style="padding: 8px 24px 16px 24px; background-color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb; padding: 12px 16px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                      💡 INSTRUCCIONES CLAVE PARA LA SESIÓN:
                    </div>
                    <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #4b5563; line-height: 1.6;">
                      <li>Conéctate puntual desde una computadora (laptop o desktop) con cámara y micrófono para poder compartir pantalla.</li>
                      <li>Ten a mano este correo con los resultados de tu prediagnóstico para ir directo a la solución.</li>
                      <li>Bloquea los 45 minutos completos sin distracciones para trabajar con foco total en tu modelo.</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 4. INTRODUCCIÓN AL DIAGNÓSTICO -->
          <tr>
            <td style="padding: 12px 24px 16px 24px; background-color: #ffffff;">
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #D7192B; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 13px; font-style: italic; line-height: 1.6; color: #7f1d1d;">
                  "<strong>${firstName}</strong>, llevas años construyendo experiencia... pero algo no cierra. ¿Es visibilidad? ¿Automatización? ¿O tu oferta aún tiene cuellos de botella invisibles? Nuestro motor de auditoría de evidencias te revela la verdad exacta — y te protege de invertir en lo que no toca."
                </p>
              </div>

              <!-- Saludo personalizado -->
              <h2 style="margin: 0 0 10px 0; font-size: 21px; font-weight: 900; color: #111827;">
                ¡Hola, <span style="color: #D7192B;">${firstName}</span>! 👋
              </h2>
              <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                Hemos procesado tus respuestas y tu situación profesional como <strong>${profession}</strong> para diseñar tu ruta más rentable y directa al crecimiento. A continuación encuentras la radiografía completa de tus resultados que analizaremos en nuestra sesión:
              </p>

              <!-- 5. TARJETAS MODULARES DE DIAGNÓSTICO (EXACTAMENTE IDÉNTICAS A LAS DE NO AGENDÓ) -->
              ${cardsHtml}

              <!-- 6. CIERRE DE COMPROMISO DE LA SESIÓN -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #0d0d0d 0%, #1f2937 100%); border-radius: 16px; text-align: center; margin-bottom: 12px; border: 1px solid #374151; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
                <tr>
                  <td style="padding: 26px 20px;">
                    <div style="font-size: 11px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;">
                      ✓ SESIÓN ESTRATÉGICA 1 A 1 CONFIRMADA
                    </div>
                    <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 900; color: #ffffff;">
                      Revisaremos a Fondo tu Hoja de Ruta, ${firstName}
                    </h3>
                    <p style="margin: 0 auto; font-size: 13px; line-height: 1.5; color: #d1d5db; max-width: 480px;">
                      Nos vemos el día <strong>{{appointment.start_time}}</strong> en el enlace de la reunión. Ten a mano este correo para ir directo a la solución quirúrgica.
                    </p>
                    <div style="margin-top: 14px; font-size: 12px; color: #9ca3af;">
                      Patricia Loaiza · Consultoría Estratégica Crea y Monetiza®
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 7. PIE DEL CORREO & CUMPLIMIENTO RGPD / GDPR -->
          <tr>
            <td style="background-color: #f9fafb; padding: 18px 24px; border-top: 1px solid #e5e7eb; text-align: center;">
              <div style="font-size: 11px; font-weight: 800; color: #4b5563; letter-spacing: 0.5px;">
                CREA Y MONETIZA®
              </div>
              <div style="font-size: 9.5px; color: #6b7280; margin-top: 2px;">
                Metodología de Consultoría e Investigación Estratégica · Patricia Loaiza
              </div>
              <div style="margin-top: 6px; font-size: 8.5px; line-height: 1.4; color: #9ca3af; max-width: 520px; margin-left: auto; margin-right: auto;">
                Recibes este correo porque completaste tu prediagnóstico estratégico y agendaste una sesión de consultoría personalizada 1 a 1 en Crea y Monetiza®. Tratamiento confidencial de datos personales conforme al RGPD y normativas de privacidad.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

/**
 * Genera el resumen ejecutivo persuasivo y completo en formato texto/markdown enriquecido.
 * Contiene todos los hallazgos sin recortar nada, con formato claro para notas de CRM y correos de texto plano.
 */
export function generateDiagnosticTextReport(
  calc: PrediagnosticResult,
  bookingUrl: string = 'https://link.ghlespanol.com/widget/booking/aI6mS973gkCQmeyn08ST'
): string {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const firstName = name.split(' ')[0] || 'Emprendedor/a';
  const model = COMMERCIAL_MODELS_LABELS[calc.lead.commercializationModel] || calc.lead.commercializationModel;
  const clients = PAYING_CLIENTS_LABELS[calc.lead.payingClientsStatus] || calc.lead.payingClientsStatus;
  const incoherences = calc.detectedIncoherences || [];
  const evidences = calc.evidences || [];

  return `METODOLOGÍA CREA Y MONETIZA® · Patricia Loaiza
INFORME OFICIAL DE PREDIAGNÓSTICO ESTRATÉGICO
--------------------------------------------------
👤 Contacto: ${name}
💼 Profesión / Especialidad: ${calc.lead.profession}
🎯 Actividad Actual: ${calc.lead.currentActivity}
📦 Modelo Comercial: ${model}
👥 Clientes de Pago: ${clients}
📧 Email: ${calc.lead.email}
📱 WhatsApp: ${calc.lead.whatsapp}
🏢 Empresa: ${calc.lead.company || 'No especificada'}

==================================================
1. NIVEL DE MADUREZ PROFESIONAL:
${calc.profile.title}
"${calc.profile.subtitle}"

${calc.profile.description}

⚡ Obstáculo Central: ${calc.profile.corePain}
🎯 Paso Inmediato: ${calc.profile.priorityNeed}

==================================================
2. ANÁLISIS DE ENFOQUE Y RUTA MÁS RÁPIDA:
• Tu idea inicial: ${calc.statedPillar.name}
• PASO QUE HOY TE DARÁ MAYOR RENTABILIDAD: ${calc.recommendedPillar.name}

${calc.hasContradiction && calc.contradictionAnalysis ? `⚠️ Discrepancia Detectada:
${calc.contradictionAnalysis.explanation}

¿Por qué este es el camino más inteligente para ti?
${calc.contradictionAnalysis.riskOfSkipping}\n` : 'Tu objetivo manifestado coincide con el cimiento que tu negocio requiere consolidar.'}
==================================================
3. CLAVES DE CRECIMIENTO (${incoherences.length} OPORTUNIDADES DETECTADAS):
${incoherences.map((inc, i) => `
[${i + 1}] ${inc.title.toUpperCase()} (${inc.severity === 'critica' ? 'OPORTUNIDAD CLAVE' : 'AJUSTE RECOMENDADO'})
• Tu perspectiva: "${inc.statementA.answerText}"
• La realidad actual: "${inc.statementB.answerText}"
💡 Lectura Estratégica: ${inc.verdict}
🌱 El Secreto para Crecer con Seguridad: ${inc.revealedTruth}
🚀 Próximo Paso Recomendado: ${inc.actionRequired}
`).join('\n')}
==================================================
4. SOLUCIÓN ESTRATÉGICA RECOMENDADA:
★ ${calc.recommendedPillar.name}
Programa Oficial: ${calc.recommendedPillar.serviceTitle}
Modalidad y Duración: ${calc.recommendedPillar.duration}
Alcance: ${calc.recommendedPillar.lessonsCount || 'Fases de Acompañamiento Estratégico'}

Descripción:
${calc.recommendedPillar.description}

✨ Transformación Diseñada para ${firstName}:
${calc.recommendedPillar.transformation}

==================================================
5. EVIDENCIAS CLAVE IDENTIFICADAS EN TUS RESPUESTAS:
${evidences.map((e, idx) => `${idx + 1}. ${e}`).join('\n')}

==================================================
6. LO QUE NO DEBES HACER EN ESTA ETAPA (ADVERTENCIA):
⛔ ${calc.notFirstAdvice.warning}
Justificación: ${calc.notFirstAdvice.recommendation}

==================================================
7. RADIOGRAFÍA DE PUNTUACIONES:
• Pilar 1 (Estrategia & Oferta BMS): ${calc.scores.pilar1} pts
• Pilar 2 (Marca Personal & Autoridad): ${calc.scores.pilar2} pts
• Pilar 3 (Viral Sales Content): ${calc.scores.pilar3} pts
• Pilar 4 (Digital Business Day & IA): ${calc.scores.pilar4} pts

==================================================
📅 PRÓXIMO PASO: SESIÓN ESTRATÉGICA 1 A 1 (45 MIN)
Reserva aquí tu sesión sin costo para analizar estos hallazgos y trazar tu plan:
${bookingUrl}
--------------------------------------------------
Información RGPD: Recibes este informe porque completaste el test de prediagnóstico en Crea y Monetiza®. Para cancelar suscripción: {{unsubscribe_url}}
`.trim();
}

/**
 * Genera el informe de diagnóstico estructurado de alta fidelidad visual en HTML (con tarjetas,
 * colores corporativos, bordes, tablas e insignias idénticas a las del correo de no agendó de Valeria)
 * para el campo de contacto de GoHighLevel (diagnostico_estrategico_crea_y_monetiza).
 * Al inyectarse en el correo de GoHighLevel (modo <> o a través de {{contact.diagnostico_estrategico_crea_y_monetiza}}),
 * se renderiza con la máxima fidelidad visual y diseño modular.
 */
export function generateAppointmentDiagnosticReport(calc: PrediagnosticResult): string {
  return generateDiagnosticCardsHtml(calc);
}

/**
 * Genera el informe en formato texto plano / markdown para notas internas del CRM de GoHighLevel
 * o clientes de correo sin soporte HTML.
 */
export function generateAppointmentDiagnosticTextReport(calc: PrediagnosticResult): string {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const firstName = name.split(' ')[0] || 'Emprendedor/a';
  const model = COMMERCIAL_MODELS_LABELS[calc.lead.commercializationModel] || calc.lead.commercializationModel;
  const clients = PAYING_CLIENTS_LABELS[calc.lead.payingClientsStatus] || calc.lead.payingClientsStatus;
  const incoherences = calc.detectedIncoherences || [];
  const evidences = calc.evidences || [];

  return `✓ CONTEXTO COMERCIAL VERIFICADO
• Profesión / Especialidad: ${calc.lead.profession}
• Actividad Actual: ${calc.lead.currentActivity}
• Modelo Comercial: ${model}
• Clientes de Pago: ${clients}
• Contacto: ${name} (${calc.lead.email} · ${calc.lead.whatsapp})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. PERFIL DE MADUREZ PROFESIONAL:
${calc.profile.title}
"${calc.profile.subtitle}"

${calc.profile.description}

⚡ Obstáculo Central de ${firstName}:
${calc.profile.corePain}

🎯 Paso Inmediato para ${firstName}:
${calc.profile.priorityNeed}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. ANÁLISIS DE ENFOQUE Y RUTA MÁS RÁPIDA:
• Tu idea inicial (${firstName}): ${calc.statedPillar.name}
• PASO QUE HOY TE DARÁ MAYOR RENTABILIDAD: ${calc.recommendedPillar.name}

${calc.hasContradiction && calc.contradictionAnalysis ? `⚠️ Discrepancia Detectada:
${calc.contradictionAnalysis.explanation}

¿Por qué este es el camino más inteligente y seguro para ti?
${calc.contradictionAnalysis.riskOfSkipping}` : 'Tu objetivo manifestado coincide con el cimiento que tu negocio requiere consolidar.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. SOLUCIÓN ESTRATÉGICA RECOMENDADA:
★ ${calc.recommendedPillar.name}
• Programa Oficial: ${calc.recommendedPillar.serviceTitle}
• Modalidad y Duración: ${calc.recommendedPillar.duration}
• Alcance: ${calc.recommendedPillar.lessonsCount || 'Fases de Acompañamiento Estratégico'}

Descripción:
${calc.recommendedPillar.description}

✨ Transformación Diseñada para ${firstName}:
${calc.recommendedPillar.transformation}
${incoherences.length > 0 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. CLAVES DE CRECIMIENTO (${incoherences.length} OPORTUNIDADES DETECTADAS):
${incoherences.map((inc, i) => `
[${i + 1}] ${inc.title.toUpperCase()} (${inc.severity === 'critica' ? 'OPORTUNIDAD CLAVE' : 'AJUSTE RECOMENDADO'})
• Tu perspectiva: "${inc.statementA.answerText}"
• La realidad actual: "${inc.statementB.answerText}"
💡 Lectura Estratégica: ${inc.verdict}
🌱 El Secreto para Crecer con Seguridad: ${inc.revealedTruth}
🚀 Próximo Paso Recomendado: ${inc.actionRequired}`).join('\n')}
` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. EVIDENCIAS CLAVE IDENTIFICADAS EN TUS RESPUESTAS:
${evidences.map((e, idx) => `[${idx + 1}] ${e}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. LO QUE NO DEBES HACER EN ESTA ETAPA (ADVERTENCIA):
⛔ ${calc.notFirstAdvice.warning}
Justificación: ${calc.notFirstAdvice.recommendation}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. RADIOGRAFÍA DE PUNTUACIONES (SOBRE 100 PTS MÁXIMO):
• Pilar 1 (Estrategia & Oferta BMS): ${calc.scores.pilar1} pts
• Pilar 2 (Marca Personal & Autoridad): ${calc.scores.pilar2} pts
• Pilar 3 (Viral Sales Content): ${calc.scores.pilar3} pts
• Pilar 4 (Digital Business Day & IA): ${calc.scores.pilar4} pts`.trim();
}

