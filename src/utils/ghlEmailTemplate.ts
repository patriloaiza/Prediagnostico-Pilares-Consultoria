import { PrediagnosticResult } from './prediagnosticLogic';

export const OFFICIAL_ADMIN_EMAIL = 'patriloaiza.perez@gmail.com';

/**
 * Genera el cuerpo en HTML estructurado para el correo de GoHighLevel.
 * Utiliza estilos inline estándar para compatibilidad universal con clientes de correo (Gmail, Outlook, Apple Mail, etc.).
 */
export function generateDiagnosticHtmlReport(
  calc: PrediagnosticResult,
  bookingUrl: string = 'https://patricialoaiza.com'
): string {
  const name = calc.lead.name.trim();
  const firstName = name.split(' ')[0] || 'Emprendedor/a';
  const profile = calc.profile;
  const pillar = calc.recommendedPillar;
  const hasContradiction = calc.hasContradiction;
  const scores = calc.scores;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Informe de Prediagnóstico Estratégico</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Contenedor Principal -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
          
          <!-- Encabezado de Marca -->
          <tr>
            <td style="background-color: #111111; padding: 28px 24px; border-bottom: 4px solid #D7192B; text-align: center;">
              <div style="font-size: 11px; font-weight: 800; color: #D7192B; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">
                METODOLOGÍA DE CONSULTORÍA ESTRATÉGICA
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                CREA Y MONETIZA®
              </h1>
              <div style="margin-top: 6px; font-size: 13px; color: #9ca3af;">
                Informe Oficial de Prediagnóstico Estratégico
              </div>
            </td>
          </tr>

          <!-- Saludo y Contexto -->
          <tr>
            <td style="padding: 28px 24px 16px 24px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #111827;">
                Hola, <span style="color: #D7192B;">${firstName}</span> 👋
              </h2>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                Has completado exitosamente la evaluación de madurez para tu negocio de consultoría y servicios de alto valor. A continuación te presentamos tu hoja de ruta personalizada y el análisis de tus evidencias.
              </p>

              <!-- Tarjeta de Perfil Detectado -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-size: 11px; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                      NIVEL DE MADUREZ DETECTADO
                    </div>
                    <div style="font-size: 17px; font-weight: 900; color: #111827; margin-top: 4px;">
                      ${profile.title}
                    </div>
                    <div style="font-size: 13px; font-weight: 600; color: #D7192B; margin-top: 2px;">
                      "${profile.subtitle}"
                    </div>
                    <p style="margin: 8px 0 0 0; font-size: 13px; line-height: 1.5; color: #4b5563;">
                      ${profile.description}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Servicio Recomendado (Caja Destacada) -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #111111 0%, #1f2937 100%); border-radius: 14px; border-left: 6px solid #D7192B; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px; color: #ffffff;">
                    <div style="font-size: 11px; font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 1px;">
                      ★ SERVICIO PRIORITARIO RECOMENDADO
                    </div>
                    <div style="font-size: 20px; font-weight: 900; color: #ffffff; margin-top: 6px;">
                      ${pillar.name}
                    </div>
                    <div style="display: inline-block; margin-top: 8px; background-color: rgba(215, 25, 43, 0.25); border: 1px solid rgba(215, 25, 43, 0.6); padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; color: #fca5a5;">
                      Programa: ${pillar.serviceTitle} · ${pillar.duration}
                    </div>
                    <p style="margin: 12px 0 0 0; font-size: 13px; line-height: 1.5; color: #d1d5db;">
                      ${pillar.description}
                    </p>
                  </td>
                </tr>
              </table>

              ${hasContradiction && calc.contradictionAnalysis ? `
              <!-- Alerta de Discrepancia / Cuello de Botella -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <div style="font-size: 12px; font-weight: 800; color: #b45309; text-transform: uppercase;">
                      ⚠️ Discrepancia Estratégica Detectada
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #92400e; margin-top: 4px;">
                      Buscabas: ${calc.statedPillar.name}
                    </div>
                    <p style="margin: 6px 0 0 0; font-size: 13px; line-height: 1.5; color: #78350f;">
                      ${calc.contradictionAnalysis.explanation}
                    </p>
                    <div style="margin-top: 8px; font-size: 12px; font-weight: 600; color: #b45309;">
                      <strong>Riesgo de saltarse este paso:</strong> ${calc.contradictionAnalysis.riskOfSkipping}
                    </div>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Lo que NO debe hacer -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef2f2; border: 1px solid #fee2e2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <div style="font-size: 12px; font-weight: 800; color: #b91c1c; text-transform: uppercase;">
                      ⛔ Lo que NO debes hacer en esta etapa:
                    </div>
                    <p style="margin: 4px 0 0 0; font-size: 13px; line-height: 1.5; color: #7f1d1d;">
                      ${calc.notFirstAdvice.warning}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Puntuaciones de los 4 Pilares -->
              <div style="margin-bottom: 20px;">
                <div style="font-size: 13px; font-weight: 800; color: #111827; text-transform: uppercase; margin-bottom: 10px;">
                  📊 Puntuaciones por Pilar Evaluado:
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 8px 4px; color: #4b5563;">1. Estrategia & Oferta BMS</td>
                    <td align="right" style="padding: 8px 4px; font-weight: 800; color: #111827;">${scores.pilar1} pts</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 8px 4px; color: #4b5563;">2. Marca Personal & Autoridad</td>
                    <td align="right" style="padding: 8px 4px; font-weight: 800; color: #111827;">${scores.pilar2} pts</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 8px 4px; color: #4b5563;">3. Viral Sales Content</td>
                    <td align="right" style="padding: 8px 4px; font-weight: 800; color: #111827;">${scores.pilar3} pts</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 4px; color: #4b5563;">4. Digital Business Day & IA</td>
                    <td align="right" style="padding: 8px 4px; font-weight: 800; color: #111827;">${scores.pilar4} pts</td>
                  </tr>
                </table>
              </div>

              <!-- Llamado a la Acción para la Sesión 1 a 1 -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #111111; border-radius: 12px; text-align: center; margin: 24px 0 12px 0;">
                <tr>
                  <td style="padding: 24px 20px;">
                    <div style="font-size: 12px; font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 1px;">
                      SESIÓN DE DIAGNÓSTICO 1 A 1
                    </div>
                    <h3 style="margin: 6px 0 12px 0; font-size: 18px; font-weight: 900; color: #ffffff;">
                      Revisemos tu Hoja de Ruta Personalizada
                    </h3>
                    <p style="margin: 0 0 18px 0; font-size: 13px; line-height: 1.5; color: #d1d5db; max-width: 440px; margin-left: auto; margin-right: auto;">
                      En esta sesión estratégica de 30 minutos sin costo, analizaremos a fondo estos hallazgos para diseñar tu plan de acción exacto.
                    </p>
                    <div>
                      <a href="${bookingUrl}" target="_blank" style="display: inline-block; background-color: #D7192B; color: #ffffff; text-decoration: none; font-weight: 900; font-size: 14px; padding: 14px 28px; border-radius: 8px; box-shadow: 0 4px 14px rgba(215, 25, 43, 0.4); text-transform: uppercase;">
                        📅 Reservar Mi Sesión Gratuita →
                      </a>
                    </div>
                    <div style="margin-top: 12px; font-size: 11px; color: #9ca3af;">
                      Cupo reservado temporalmente para ${firstName}
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Pie del Correo -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 24px; border-top: 1px solid #e5e7eb; text-align: center;">
              <div style="font-size: 12px; font-weight: 800; color: #111827;">
                CREA Y MONETIZA®
              </div>
              <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">
                Consultoría y Estrategia por Patricia Loaiza
              </div>
              <div style="font-size: 10px; color: #9ca3af; margin-top: 8px;">
                Copia enviada a: ${calc.lead.email} · Notificación administrativa: ${OFFICIAL_ADMIN_EMAIL}
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

/**
 * Genera el resumen en texto plano del diagnóstico (para WhatsApp, notas o correos de texto plano).
 */
export function generateDiagnosticTextReport(
  calc: PrediagnosticResult,
  bookingUrl: string = 'https://patricialoaiza.com'
): string {
  const name = calc.lead.name.trim();
  const firstName = name.split(' ')[0] || 'Emprendedor/a';

  return `
📋 RESULTADO DE PREDIAGNÓSTICO ESTRATÉGICO · CREA Y MONETIZA®
--------------------------------------------------
👤 Contacto: ${name}
📧 Email: ${calc.lead.email}
📱 WhatsApp: ${calc.lead.whatsapp}
💼 Profesión / Especialidad: ${calc.lead.profession}
🎯 Perfil Evolutivo: ${calc.profile.title} ("${calc.profile.subtitle}")

🏆 SERVICIO PRIORITARIO RECOMENDADO:
${calc.recommendedPillar.name}
Programa Oficial: ${calc.recommendedPillar.serviceTitle} (${calc.recommendedPillar.duration})

${calc.hasContradiction && calc.contradictionAnalysis ? `⚠️ DISCREPANCIA DETECTADA:
Buscabas: ${calc.statedPillar.name}
Motivo: ${calc.contradictionAnalysis.explanation}
Riesgo: ${calc.contradictionAnalysis.riskOfSkipping}\n` : ''}
⛔ LO QUE NO DEBES HACER EN ESTA ETAPA:
${calc.notFirstAdvice.warning}

📊 PUNTUACIONES:
• Pilar 1 (Estrategia y Oferta BMS): ${calc.scores.pilar1} pts
• Pilar 2 (Marca Personal & Autoridad): ${calc.scores.pilar2} pts
• Pilar 3 (Viral Sales Content): ${calc.scores.pilar3} pts
• Pilar 4 (Digital Business Day & IA): ${calc.scores.pilar4} pts

📅 ENLACE PARA RESERVAR SESIÓN DE REPASO 1 A 1:
${bookingUrl}
--------------------------------------------------
Copia de Notificación: ${OFFICIAL_ADMIN_EMAIL}
`.trim();
}
