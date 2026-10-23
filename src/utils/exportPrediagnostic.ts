import { jsPDF } from 'jspdf';
import {
  PrediagnosticResult,
  COMMERCIAL_MODELS_LABELS,
  PAYING_CLIENTS_LABELS
} from './prediagnosticLogic';

/**
 * Limpia y normaliza texto para nombres seguros de archivo
 */
function safeFileName(str: string): string {
  return (str || 'cliente')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Limpia y desinfecta texto para la codificación nativa WinAnsi / Latin-1 de jsPDF.
 * Elimina emojis, pares sustitutos y secuencias que provocan caracteres corruptos (ej: Ø=Ü¡, Ø<ß1, Ø=Þ€, '(!’).
 * Conserva intactos todos los caracteres del idioma español: á, é, í, ó, ú, ñ, Á, É, Í, Ó, Ú, Ñ, ü, Ü, ¿, ¡.
 */
function cleanPdfText(text: string): string {
  if (!text) return '';
  return text
    // Normalizar a forma canónica compuesta
    .normalize('NFC')
    // Flechas tipográficas -> texto ASCII claro
    .replace(/[\u2192\u2794\u279C\u21D2]/g, '->')
    .replace(/[\u2190\u21D0]/g, '<-')
    // Viñetas y puntos decorativos
    .replace(/[\u2022\u25CF\u25AA\u25C6\u2219]/g, '-')
    // Comillas inglesas o tipográficas -> comillas estándar
    .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    // Guiones largos y medios
    .replace(/[\u2013\u2014\u2015]/g, '-')
    // Elipsis tipográfica
    .replace(/\u2026/g, '...')
    // Checkmarks y cruces
    .replace(/[\u2713\u2714\u2611]/g, '[OK]')
    .replace(/[\u2717\u2718\u2715]/g, '[X]')
    // Limpieza explícita de emojis conocidos y sus etiquetas
    .replace(/[\u{1F4A1}\u{1F331}\u{1F680}\u{2728}\u{1F3AF}\u{1F3C6}\u{1F4CA}\u{1F4CB}\u{1F4CC}\u{26D4}\u{26A0}\u{1F514}\u{1F4C5}\u{1F464}\u{1F50D}\u{1F4AC}]/gu, '')
    // Eliminar cualquier par sustituto Unicode (rango completo de emojis suplementarios)
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
    // Eliminar selectores de variación (ej. \uFE0F)
    .replace(/[\uFE00-\uFE0F]/g, '')
    // Limpiar secuencias corruptas residuales conocidas
    .replace(/Ø=Ü¡|Ø<ß1|Ø=Þ€|'\(!’/g, '')
    // Permitir estrictamente caracteres ASCII imprimibles y suplemento Latin-1 (tildes, eñes y signos españoles)
    .replace(/[^\x20-\x7E\xA1-\xFF\n\r\t]/g, '')
    // Colapsar espacios múltiples residuales
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Descarga cualquier contenido Blob en el navegador
 */
function downloadBlobFromBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}

/**
 * Descarga cualquier contenido de texto en el navegador
 */
function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  downloadBlobFromBlob(blob, filename);
}

/**
 * Genera el resultado completo en formato Markdown (.md)
 */
export function generatePrediagnosticMarkdown(calc: PrediagnosticResult): string {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const firstName = name.split(' ')[0] || 'Emprendedor/a';
  const model = COMMERCIAL_MODELS_LABELS[calc.lead.commercializationModel] || calc.lead.commercializationModel;
  const clients = PAYING_CLIENTS_LABELS[calc.lead.payingClientsStatus] || calc.lead.payingClientsStatus;
  const dateStr = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `# METODOLOGÍA CREA Y MONETIZA® · Patricia Loaiza
# Prediagnóstico Consultoría Requerida · [• ${name}]

> **${firstName}**, llevas años construyendo experiencia... pero algo no cierra. ¿Es visibilidad? ¿Automatización? ¿O tu oferta aún tiene cuellos de botella invisibles? Nuestro motor de auditoría de evidencias te revela la verdad exacta — y te protege de invertir en lo que no toca.

**[✓ Diagnóstico Completado para ${name} · 100% de Evaluación Estratégica Realizada]**  
*Investigación, estrategia y consultoría por Patricia Loaiza · Fecha: ${dateStr}*

---

## 📋 TITULAR DEL REPORTE & BIENVENIDA PERSONALIZADA
> **INFORME PERSONALIZADO PARA TI**  
> **¡Hola, ${firstName}! Aquí tienes tu Diagnóstico Estratégico**  
> Hemos procesado tus respuestas y tu situación profesional como **${calc.lead.profession || 'Profesional'}** para diseñar tu ruta más rentable y directa al crecimiento.

- **Titular del Reporte:** ${name}
- **Teléfono / WhatsApp:** ${calc.lead.whatsapp}
- **Correo Electrónico:** ${calc.lead.email}
- **Empresa / Proyecto:** ${calc.lead.company || 'No especificada'}
- **Cargo / Rol:** ${calc.lead.role || 'Fundador / Consultor'}

---

## 🎯 1. CONTEXTO COMERCIAL VERIFICADO DE ${firstName.toUpperCase()}
*${calc.lead.company ? `${calc.lead.company} · ` : ''}${calc.lead.email}*

| Variable de Negocio | Situación Real Diagnosticada |
| :--- | :--- |
| **Profesión / Área:** | **${calc.lead.profession || 'No especificada'}** |
| **Actividad Actual:** | ${calc.lead.currentActivity || 'No especificada'} |
| **Modelo Comercial:** | ${model} |
| **Clientes de Pago:** | ${clients} |

---

## 👤 2. PERFIL DE MADUREZ PROFESIONAL DE ${firstName.toUpperCase()}
### **${calc.profile.title}**
> *"${calc.profile.subtitle}"*

${calc.profile.description}

- **Obstáculo Central de ${firstName}:**  
  ${calc.profile.corePain}

- **Paso Inmediato para ${firstName}:**  
  ${calc.profile.priorityNeed}

---

## 🎯 3. ANÁLISIS DE ENFOQUE PARA ${firstName.toUpperCase()}: TU RUTA MÁS RÁPIDA AL CRECIMIENTO
### **${calc.contradictionAnalysis ? `${firstName}: ${calc.contradictionAnalysis.title}` : `Enfoque Estratégico de ${firstName} 100% Alineado`}**

- **Tu idea o preferencia inicial (${firstName}):**  
  \`${calc.statedPillar.name}\`

- **El paso que hoy te dará mayor rentabilidad a ti, ${firstName}:**  
  **\`${calc.recommendedPillar.name}\`**

${calc.contradictionAnalysis ? `
**Lectura del Diagnóstico:**  
${calc.contradictionAnalysis.explanation}

> **¿Por qué este es el camino más inteligente y seguro para ti, ${firstName}?**  
> ${calc.contradictionAnalysis.riskOfSkipping}
` : `
Tu objetivo manifestado coincide con el cimiento que tu negocio requiere consolidar.
`}

---

${calc.gatingAnalysis.isPilar4Blocked && calc.statedPillar.id === 'pilar4' ? `## 💡 CONSEJO ESTRATÉGICO PARA ${firstName.toUpperCase()}
### ${firstName}, por qué te conviene consolidar una Oferta Irresistible antes de Sistematizar
Notamos que tu gran meta es la sistematización, activos digitales y agentes de IA. ¡Es un objetivo extraordinario! Sin embargo, la experiencia nos demuestra que automatizar un servicio que aún no se vende con fluidez manual suele generar gastos y desgaste innecesario. Para cuidar tu inversión y asegurar resultados reales, te proponemos construir primero tu cimiento comercial en el **Pilar 1 (Estrategia Comercial & Oferta BMS)**. Una vez que tengas clientes satisfechos comprándote con regularidad, sistematizar será un paso rápido, fluido y verdaderamente rentable.

---
` : ''}

## 🔍 4. CLAVES DE CRECIMIENTO PARA ${firstName.toUpperCase()}: ${calc.detectedIncoherences.length} OPORTUNIDAD(ES) IDENTIFICADA(S)
### Hallazgos Clave para Acelerar los Resultados de ${firstName}
*Al analizar tus respuestas en conjunto, ${firstName}, identificamos puntos ciegos comunes que suelen frenar a profesionales talentosos en tu especialidad (${calc.lead.profession}). Conocerlos a tiempo te ahorra meses de esfuerzo y te permite enfocar tu energía donde realmente verás ingresos:*

${calc.detectedIncoherences.map((inc, index) => `
### ${index + 1}. ${inc.title} · [${inc.severity === 'critica' ? 'OPORTUNIDAD CLAVE' : 'AJUSTE RECOMENDADO'}]

- **Tu perspectiva inicial (${firstName} · ${inc.statementA.questionCategory}):**  
  *"${inc.statementA.answerText}"*

- **La realidad actual de tu negocio (${firstName} · ${inc.statementB.questionCategory}):**  
  *"${inc.statementB.answerText}"*

> 💡 **Lectura Estratégica para ${firstName}:**  
> ${inc.verdict}
>
> 🌱 **El Secreto para Crecer con Seguridad:**  
> ${inc.revealedTruth}
>
> 🚀 **Próximo Paso Recomendado para ${firstName}:**  
> ${inc.actionRequired}
`).join('\n---\n')}

---

## 🏆 5. SOLUCIÓN ESTRATÉGICA RECOMENDADA PARA ${firstName.toUpperCase()}
### **${calc.recommendedPillar.name}**
*${calc.recommendedPillar.serviceTitle}*  
*(Cimiento: ${calc.recommendedPillar.categoryTag})*

- **Modalidad y Duración:** ${calc.recommendedPillar.duration}
- **Alcance del Servicio:** ${calc.recommendedPillar.lessonsCount || `${calc.recommendedPillar.phases.length} Fases de Acompañamiento Estratégico`}

**Descripción del Programa:**  
${calc.recommendedPillar.description}

> ✨ **Transformación diseñada para ${firstName}:**  
> ${calc.recommendedPillar.transformation}

---

## 📌 6. CLAVES IDENTIFICADAS EN LAS RESPUESTAS DE ${firstName.toUpperCase()}
*Factores que confirman por qué este es el momento idóneo para que ${firstName} concentre su energía en este pilar:*

${calc.evidences.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

---

## ⛔ 7. LO QUE NO DEBES HACER EN ESTA ETAPA (ADVERTENCIA)
> **${calc.notFirstAdvice.warning}**

*Justificación Estratégica:*  
${calc.notFirstAdvice.recommendation}

---

## 📊 8. RADIOGRAFÍA DE PUNTUACIONES POR PILAR (100 PUNTOS MÁXIMO)
- **Pilar 1 (Estrategia Comercial & Validación de Oferta BMS):** ${calc.scores.pilar1} pts
- **Pilar 2 (Marca Personal, Posicionamiento & Autoridad):** ${calc.scores.pilar2} pts
- **Pilar 3 (Contenidos de Venta & Funnels Orgánicos):** ${calc.scores.pilar3} pts
- **Pilar 4 (Digital Business Day, Automatización & IA):** ${calc.scores.pilar4} pts

---

## 📅 PRÓXIMO PASO RECOMENDADO
Sesión de Diagnóstico 1 a 1 de 30 minutos con Patricia Loaiza para analizar estos hallazgos a fondo y trazar tu hoja de ruta personalizada de implementación.

---
© ${new Date().getFullYear()} CREA Y MONETIZA® · Metodología de Consultoría Estratégica por Patricia Loaiza.  
*Investigación, estrategia y consultoría.*
`;
}

/**
 * Descarga el archivo Markdown en el navegador
 */
export function downloadPrediagnosticMarkdown(calc: PrediagnosticResult): void {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const mdContent = generatePrediagnosticMarkdown(calc);
  const fileName = `Prediagnostico_${safeFileName(name)}_${new Date().toISOString().slice(0, 10)}.md`;
  downloadBlob(mdContent, fileName, 'text/markdown;charset=utf-8');
}

/**
 * Genera y descarga el PDF del Prediagnóstico Estratégico en formato dossier ejecutivo de alta fidelidad.
 * Garantiza:
 * 1. Cero caracteres corruptos (elimina incompatibilidades de emojis en fuentes PDF nativas).
 * 2. Cero superposición de textos (medición matemática y empaquetado dinámico de líneas).
 * 3. Diseño idéntico a la app (Header negro corporativo, insignias rojas, tarjetas en alto contraste).
 */
export async function downloadPrediagnosticPdf(calc: PrediagnosticResult): Promise<void> {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const fileName = `Prediagnostico_${safeFileName(name)}_${new Date().toISOString().slice(0, 10)}.pdf`;

  generateExecutiveDossierPdf(calc, fileName);
}

/**
 * Generador principal del Dossier Ejecutivo en PDF
 */
function generateExecutiveDossierPdf(calc: PrediagnosticResult, fileName: string): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const rawName = calc.lead.name.trim() || 'Emprendedor/a';
  const name = cleanPdfText(rawName);
  const firstName = cleanPdfText(name.split(' ')[0] || 'Emprendedor/a');
  const model = cleanPdfText(COMMERCIAL_MODELS_LABELS[calc.lead.commercializationModel] || calc.lead.commercializationModel);
  const clients = cleanPdfText(PAYING_CLIENTS_LABELS[calc.lead.payingClientsStatus] || calc.lead.payingClientsStatus);
  const profession = cleanPdfText(calc.lead.profession || 'Profesional / Consultor');
  const activity = cleanPdfText(calc.lead.currentActivity || 'Servicios profesionales');
  const email = cleanPdfText(calc.lead.email || 'No especificado');
  const whatsapp = cleanPdfText(calc.lead.whatsapp || 'No especificado');
  const company = cleanPdfText(calc.lead.company || '');

  const drawHeaderBar = (pageNumber: number, totalPages: number) => {
    doc.setFillColor(17, 17, 17);
    doc.rect(margin, 8, contentWidth, 9, 'F');
    doc.setFillColor(215, 25, 43);
    doc.rect(margin, 17, contentWidth, 1.2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.text(`CREA Y MONETIZA (R) · AUDITORIA ESTRATEGICA · ${name.toUpperCase()}`, margin + 4, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(200, 200, 200);
    doc.text(`Pagina ${pageNumber} de ${totalPages}`, margin + contentWidth - 22, 14);
  };

  const drawFooterBar = (pageNumber: number, totalPages: number) => {
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, pageHeight - 10, margin + contentWidth, pageHeight - 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(156, 163, 175);
    doc.text('CREA Y MONETIZA (R) · Metodología de Consultoría por Patricia Loaiza · Confidencial', margin, pageHeight - 6);
    doc.text(`Página ${pageNumber} de ${totalPages}`, margin + contentWidth - 20, pageHeight - 6);
  };

  // ============================================================
  // PÁGINA 1: RADIOGRAFÍA DE MADUREZ & ANÁLISIS DE ENFOQUE
  // ============================================================

  // 1. GRAN ENCABEZADO NEGRO CORPORATIVO (IDÉNTICO AL PANTALLAZO 1)
  doc.setFillColor(8, 8, 8); // #080808
  doc.setDrawColor(38, 38, 38);
  doc.roundedRect(margin, y, contentWidth, 49, 3, 3, 'FD');

  // Badge rojo superior: Metodología
  doc.setFillColor(215, 25, 43);
  doc.roundedRect(margin + 5, y + 4.5, 60, 5, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.text('METODOLOGÍA CREA Y MONETIZA (R)', margin + 7, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(156, 163, 175);
  doc.text('Patricia Loaiza · Auditoría de Cimientos', margin + 69, y + 8);

  // Título blanco grande
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Prediagnóstico Consultoría Requerida', margin + 5, y + 17.5);

  // Badge rojo con el nombre del cliente (a la derecha, garantizando separación sin colisión)
  const badgeNameText = `- ${name}`;
  const badgeWidth = Math.min(doc.getTextWidth(badgeNameText) + 8, 65);
  doc.setFillColor(215, 25, 43);
  doc.roundedRect(margin + contentWidth - badgeWidth - 5, y + 12.5, badgeWidth, 6, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(badgeNameText, margin + contentWidth - badgeWidth - 1, y + 16.8);

  // Cita de introducción empática
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(209, 213, 219);
  const intro = cleanPdfText(`${firstName}, llevas años construyendo experiencia... pero algo no cierra. ¿Es visibilidad? ¿Automatización? ¿O tu oferta aún tiene cuellos de botella invisibles? Nuestro motor de auditoría de evidencias te revela la verdad exacta — y te protege de invertir en lo que no toca.`);
  const introLines = doc.splitTextToSize(intro, contentWidth - 12);
  doc.text(introLines.slice(0, 2), margin + 5, y + 26);

  // Barra de progreso y estado
  doc.setDrawColor(55, 65, 81);
  doc.line(margin + 5, y + 36, margin + contentWidth - 5, y + 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(156, 163, 175);
  doc.text(`Diagnóstico Completado para ${name}`, margin + 5, y + 41);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('100% de Auditoría Realizada', margin + contentWidth - 42, y + 41);

  // Línea roja de 100%
  doc.setFillColor(215, 25, 43);
  doc.rect(margin + 5, y + 43.5, contentWidth - 10, 2, 'F');

  y += 55;

  // 2. BIENVENIDA Y CONTEXTO COMERCIAL VERIFICADO
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentWidth, 43, 2, 2, 'FD');

  // Badge rojo bienvenida
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin + 4, y + 3.5, 44, 4.5, 1, 1, 'FD');
  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.text('INFORME PERSONALIZADO PARA TI', margin + 6, y + 6.8);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(10.5);
  doc.text(`¡Hola, ${firstName}! Aquí tienes tu Diagnóstico Estratégico`, margin + 4, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(75, 85, 99);
  const subGreet = cleanPdfText(`Hemos procesado tus respuestas y tu situación profesional como ${profession} para diseñar tu ruta más rentable.`);
  const subGreetLines = doc.splitTextToSize(subGreet, contentWidth - 58);
  doc.text(subGreetLines.slice(0, 2), margin + 4, y + 17.5);

  // Caja Titular en la esquina derecha
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + contentWidth - 52, y + 3.5, 48, 17, 1, 1, 'FD');
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(5.5);
  doc.text('TITULAR DEL REPORTE', margin + contentWidth - 49, y + 7.5);
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  const fitName = doc.splitTextToSize(name, 44);
  doc.text(fitName[0] || name, margin + contentWidth - 49, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(107, 114, 128);
  doc.text(whatsapp.slice(0, 20), margin + contentWidth - 49, y + 16.5);

  // Sub-encabezado Contexto Comercial
  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text(`- CONTEXTO COMERCIAL VERIFICADO DE ${firstName.toUpperCase()} ${company ? `(${company})` : ''}`, margin + 4, y + 25);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(6.2);
  doc.text(email.slice(0, 36), margin + contentWidth - doc.getTextWidth(email.slice(0, 36)) - 4, y + 25);

  // 4 Columnas de Contexto Comercial
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y + 27.5, contentWidth - 8, 12.5, 1, 1, 'FD');

  const colW = (contentWidth - 8) / 4;
  doc.setFontSize(5.2);
  doc.setTextColor(107, 114, 128);
  doc.text('PROFESIÓN / ÁREA:', margin + 6, y + 31.5);
  doc.text('ACTIVIDAD ACTUAL:', margin + 6 + colW, y + 31.5);
  doc.text('MODELO COMERCIAL:', margin + 6 + colW * 2, y + 31.5);
  doc.text('CLIENTES DE PAGO:', margin + 6 + colW * 3, y + 31.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(17, 24, 39);
  const wrapCol = (txt: string) => doc.splitTextToSize(txt, colW - 3)[0] || txt;
  doc.text(wrapCol(profession), margin + 6, y + 36);
  doc.text(wrapCol(activity), margin + 6 + colW, y + 36);
  doc.text(wrapCol(model), margin + 6 + colW * 2, y + 36);
  doc.text(wrapCol(clients), margin + 6 + colW * 3, y + 36);

  y += 49;

  // 3. PERFIL DE MADUREZ PROFESIONAL
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'FD');

  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text(`PERFIL DE MADUREZ PROFESIONAL DE ${firstName.toUpperCase()}`, margin + 4, y + 5.5);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(11.5);
  doc.text(cleanPdfText(calc.profile.title), margin + 4, y + 11.5);

  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  const subTitleText = cleanPdfText(calc.profile.subtitle);
  const subTitleLines = doc.splitTextToSize(`"${subTitleText}"`, contentWidth - 68);
  doc.text(subTitleLines[0] || '', margin + 4, y + 16.5);

  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const profileDesc = cleanPdfText(calc.profile.description);
  const pLines = doc.splitTextToSize(profileDesc, contentWidth - 68);
  doc.text(pLines.slice(0, 3), margin + 4, y + 21.5);

  // Caja derecha: Obstáculo y Paso Inmediato
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + contentWidth - 60, y + 3.5, 56, 29, 1, 1, 'FD');

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.text(`Obstáculo Central de ${firstName}:`, margin + contentWidth - 58, y + 7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(6.2);
  const painLines = doc.splitTextToSize(cleanPdfText(calc.profile.corePain), 52);
  doc.text(painLines.slice(0, 2), margin + contentWidth - 58, y + 11.5);

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.text(`Paso Inmediato para ${firstName}:`, margin + contentWidth - 58, y + 19.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(6.2);
  const stepLines = doc.splitTextToSize(cleanPdfText(calc.profile.priorityNeed), 52);
  doc.text(stepLines.slice(0, 2), margin + contentWidth - 58, y + 23.5);

  y += 42;

  // 4. ANÁLISIS DE ENFOQUE (PANTALLAZO 2)
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(252, 211, 77); // amber-300
  doc.roundedRect(margin, y, contentWidth, 45, 2, 2, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(`- ANÁLISIS DE ENFOQUE PARA ${firstName.toUpperCase()}: TU RUTA MÁS RÁPIDA AL CRECIMIENTO`, margin + 4, y + 5.5);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(9);
  const contTitle = calc.contradictionAnalysis
    ? cleanPdfText(`${firstName}: ${calc.contradictionAnalysis.title}`)
    : cleanPdfText(`Enfoque Estratégico de ${firstName} Alineado`);
  const cTitleLines = doc.splitTextToSize(contTitle, contentWidth - 8);
  doc.text(cTitleLines[0] || contTitle, margin + 4, y + 11);

  // Dos Cajas Comparativas
  const boxW = (contentWidth - 11) / 2;

  // Izquierda: Idea inicial
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y + 14, boxW, 11.5, 1, 1, 'FD');
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(5.2);
  doc.text(`TU IDEA O PREFERENCIA INICIAL (${firstName.toUpperCase()}):`, margin + 6, y + 17.5);
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(7.2);
  const stText = cleanPdfText(calc.statedPillar.name);
  doc.text(doc.splitTextToSize(stText, boxW - 4)[0] || stText, margin + 6, y + 22);

  // Derecha con borde rojo: El paso rentable
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(215, 25, 43);
  doc.roundedRect(margin + 4 + boxW + 3, y + 14, boxW, 11.5, 1.2, 1.2, 'FD');
  doc.setTextColor(215, 25, 43);
  doc.setFontSize(5.2);
  doc.text(`EL PASO QUE HOY TE DARÁ MAYOR RENTABILIDAD A TI, ${firstName.toUpperCase()}:`, margin + 6 + boxW + 3, y + 17.5);
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(7.2);
  const recText = cleanPdfText(calc.recommendedPillar.name);
  doc.text(doc.splitTextToSize(recText, boxW - 4)[0] || recText, margin + 6 + boxW + 3, y + 22);

  // Explicación y Justificación
  if (calc.contradictionAnalysis) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(55, 65, 81);
    const expText = cleanPdfText(calc.contradictionAnalysis.explanation);
    const expLines = doc.splitTextToSize(expText, contentWidth - 8);
    doc.text(expLines.slice(0, 2), margin + 4, y + 29.5);

    doc.setTextColor(180, 83, 9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(`¿Por qué este es el camino más inteligente y seguro para ti, ${firstName}?`, margin + 4, y + 37);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(6.5);
    const riskText = cleanPdfText(calc.contradictionAnalysis.riskOfSkipping);
    const riskLines = doc.splitTextToSize(riskText, contentWidth - 8);
    doc.text(riskLines.slice(0, 1), margin + 4, y + 41);
  }

  drawFooterBar(1, 3);

  // ============================================================
  // PÁGINA 2: CLAVES DE CRECIMIENTO & HALLAZGOS ESTRATÉGICOS
  // ============================================================
  doc.addPage();
  drawHeaderBar(2, 3);
  y = 23;

  const incoherences = calc.detectedIncoherences || [];
  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.text(`- CLAVES DE CRECIMIENTO PARA ${firstName.toUpperCase()}: ${incoherences.length} OPORTUNIDAD(ES) IDENTIFICADA(S)`, margin, y);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(11.5);
  doc.text(`Hallazgos Clave para Acelerar los Resultados de ${firstName}`, margin, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(75, 85, 99);
  const incIntro = cleanPdfText(`Al analizar tus respuestas en conjunto, identificamos puntos ciegos comunes que suelen frenar a profesionales talentosos en tu especialidad (${profession}). Conocerlos a tiempo te ahorra meses de esfuerzo y te permite enfocar tu energía donde realmente verás ingresos:`);
  const incIntroLines = doc.splitTextToSize(incIntro, contentWidth);
  doc.text(incIntroLines.slice(0, 2), margin, y + 11.5);

  y += 18;

  // Renderizar las Oportunidades con cálculo dinámico de altura (CERO COLISIONES)
  const itemsToRender = incoherences.slice(0, 3);
  itemsToRender.forEach((inc, index) => {
    // 1. Preparar y medir líneas de cada sección de la caja negra
    const vLines = doc.splitTextToSize(cleanPdfText(inc.verdict), contentWidth - 14).slice(0, 2);
    const rLines = doc.splitTextToSize(cleanPdfText(inc.revealedTruth), contentWidth - 14).slice(0, 2);
    const aClean = cleanPdfText(`Próximo Paso Recomendado para ${firstName}: ${inc.actionRequired}`);
    const aLines = doc.splitTextToSize(aClean, contentWidth - 14).slice(0, 2);

    // Altura calculada de la caja oscura interior
    const darkBoxH = 6 + (vLines.length * 3.3 + 3.8) + (rLines.length * 3.3 + 3.8) + (aLines.length * 3.3 + 3.8);
    // Altura total de la tarjeta contenedora
    const cardHeight = 24 + darkBoxH + 3;

    // Tarjeta contenedora
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(252, 211, 77);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'FD');

    // Barra superior amarilla
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(margin, y, contentWidth, 7, 2, 2, 'F');
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const titleClean = `${index + 1}. ${cleanPdfText(inc.title)}`;
    doc.text(doc.splitTextToSize(titleClean, contentWidth - 46)[0] || titleClean, margin + 4, y + 5);

    // Badge OPORTUNIDAD CLAVE / AJUSTE RECOMENDADO
    const isCritica = inc.severity === 'critica';
    doc.setFillColor(isCritica ? 215 : 217, isCritica ? 25 : 119, isCritica ? 43 : 6);
    doc.roundedRect(margin + contentWidth - 44, y + 1.2, 40, 4.5, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5.5);
    doc.text(isCritica ? 'OPORTUNIDAD CLAVE' : 'AJUSTE RECOMENDADO', margin + contentWidth - 42, y + 4.3);

    // Dos Cajas Comparativas (Perspectiva vs Realidad)
    const subBoxW = (contentWidth - 11) / 2;

    // Izquierda: Perspectiva
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(margin + 3, y + 9, subBoxW, 13, 1, 1, 'FD');
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(5);
    doc.text(`TU PERSPECTIVA INICIAL (${firstName.toUpperCase()} - ${cleanPdfText(inc.statementA.questionCategory).toUpperCase()}):`, margin + 5, y + 12.5);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(6.2);
    const textALines = doc.splitTextToSize(`"${cleanPdfText(inc.statementA.answerText)}"`, subBoxW - 4);
    doc.text(textALines.slice(0, 2), margin + 5, y + 16.5);

    // Derecha: Realidad
    doc.setFillColor(254, 252, 232);
    doc.setDrawColor(252, 211, 77);
    doc.roundedRect(margin + 3 + subBoxW + 3, y + 9, subBoxW, 13, 1, 1, 'FD');
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(5);
    doc.text(`LA REALIDAD ACTUAL DE TU NEGOCIO (${firstName.toUpperCase()} - ${cleanPdfText(inc.statementB.questionCategory).toUpperCase()}):`, margin + 5 + subBoxW + 3, y + 12.5);
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(6.2);
    const textBLines = doc.splitTextToSize(`"${cleanPdfText(inc.statementB.answerText)}"`, subBoxW - 4);
    doc.text(textBLines.slice(0, 2), margin + 5 + subBoxW + 3, y + 16.5);

    // Caja Negra Ejecutiva (Sin colisiones, con espaciado matemático exacto)
    const darkBoxTop = y + 24;
    doc.setFillColor(17, 17, 17);
    doc.roundedRect(margin + 3, darkBoxTop, contentWidth - 6, darkBoxH, 1.5, 1.5, 'F');

    let innerY = darkBoxTop + 4;

    // 1. Lectura Estratégica
    doc.setTextColor(251, 191, 36); // amber-400
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.text(`- LECTURA ESTRATÉGICA PARA ${firstName.toUpperCase()}:`, margin + 6, innerY);
    innerY += 3.8;

    doc.setTextColor(229, 231, 235);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.text(vLines, margin + 6, innerY);
    innerY += vLines.length * 3.3 + 2;

    // 2. El Secreto para Crecer
    doc.setTextColor(52, 211, 153); // emerald-400
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.text('- EL SECRETO PARA CRECER CON SEGURIDAD:', margin + 6, innerY);
    innerY += 3.8;

    doc.setTextColor(209, 213, 219);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.text(rLines, margin + 6, innerY);
    innerY += rLines.length * 3.3 + 2;

    // 3. Próximo Paso
    doc.setTextColor(253, 224, 71); // yellow-300
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.text(`- PRÓXIMO PASO RECOMENDADO PARA ${firstName.toUpperCase()}:`, margin + 6, innerY);
    innerY += 3.8;

    doc.setTextColor(254, 240, 138); // yellow-200
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.text(aLines, margin + 6, innerY);

    y += cardHeight + 4;
  });

  drawFooterBar(2, 3);

  // ============================================================
  // PÁGINA 3: SOLUCIÓN RECOMENDADA, EVIDENCIAS & PUNTUACIONES
  // ============================================================
  doc.addPage();
  drawHeaderBar(3, 3);
  y = 23;

  // 1. SOLUCIÓN ESTRATÉGICA RECOMENDADA (PANTALLAZO 7 - GRAN TARJETA NEGRA)
  const pDesc = cleanPdfText(calc.recommendedPillar.description);
  const pDescLines = doc.splitTextToSize(pDesc, contentWidth - 10).slice(0, 2);

  const transClean = cleanPdfText(`Transformación Diseñada para ${firstName}: ${calc.recommendedPillar.transformation}`);
  const transLines = doc.splitTextToSize(transClean, contentWidth - 14).slice(0, 2);
  const transH = 4 + transLines.length * 3.5;

  const solCardH = 44 + transH;

  doc.setFillColor(17, 17, 17);
  doc.setDrawColor(215, 25, 43);
  doc.roundedRect(margin, y, contentWidth, solCardH, 2.5, 2.5, 'FD');

  // Badge rojo superior
  doc.setFillColor(215, 25, 43);
  doc.roundedRect(margin + 5, y + 4.5, 66, 5, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.text(`SOLUCIÓN ESTRATÉGICA RECOMENDADA PARA ${firstName.toUpperCase()}`, margin + 7, y + 8);

  doc.setTextColor(156, 163, 175);
  doc.setFontSize(6.2);
  doc.text(cleanPdfText(calc.recommendedPillar.categoryTag || 'Cimiento Comercial'), margin + contentWidth - 52, y + 8);

  // Título blanco grande
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12.5);
  doc.text(cleanPdfText(calc.recommendedPillar.name), margin + 5, y + 17);

  doc.setTextColor(209, 213, 219);
  doc.setFontSize(8);
  doc.text(cleanPdfText(calc.recommendedPillar.serviceTitle), margin + 5, y + 21.5);

  // Cajas negras de Modalidad y Alcance
  const solBoxW = (contentWidth - 14) / 2;
  doc.setFillColor(0, 0, 0);
  doc.setDrawColor(45, 45, 45);
  doc.roundedRect(margin + 5, y + 24.5, solBoxW, 9, 1, 1, 'FD');
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(5);
  doc.text('MODALIDAD Y DURACIÓN', margin + 7, y + 28);
  doc.setTextColor(52, 211, 153);
  doc.setFontSize(6.8);
  doc.text(cleanPdfText(calc.recommendedPillar.duration), margin + 7, y + 31.8);

  doc.setFillColor(0, 0, 0);
  doc.setDrawColor(45, 45, 45);
  doc.roundedRect(margin + 5 + solBoxW + 4, y + 24.5, solBoxW, 9, 1, 1, 'FD');
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(5);
  doc.text('ALCANCE DEL SERVICIO', margin + 7 + solBoxW + 4, y + 28);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.8);
  doc.text(cleanPdfText(calc.recommendedPillar.lessonsCount || '6 Fases de Acompañamiento Estratégico'), margin + 7 + solBoxW + 4, y + 31.8);

  // Descripción del programa
  doc.setTextColor(209, 213, 219);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.text(pDescLines, margin + 5, y + 37.5);

  // Transformación Diseñada (recuadro interior oscuro con texto amarillo dorado)
  const transBoxTop = y + 38 + pDescLines.length * 3.3;
  doc.setFillColor(28, 28, 28);
  doc.roundedRect(margin + 5, transBoxTop, contentWidth - 10, transH, 1, 1, 'F');
  doc.setTextColor(253, 224, 71); // amber-300
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.4);
  doc.text(transLines, margin + 7, transBoxTop + 4.2);

  y += solCardH + 5;

  // 2. ADVERTENCIA CLAVE (LO QUE NO DEBE HACER)
  const warnText = cleanPdfText(calc.notFirstAdvice.warning);
  const warnLines = doc.splitTextToSize(warnText, contentWidth - 8).slice(0, 2);
  const adviceRecText = cleanPdfText(calc.notFirstAdvice.recommendation);
  const recLines = doc.splitTextToSize(adviceRecText, contentWidth - 8).slice(0, 2);

  const warnCardH = 10 + warnLines.length * 3.3 + recLines.length * 3.3;

  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, y, contentWidth, warnCardH, 2, 2, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text(`[ATENCIÓN]: LO QUE NO DEBES HACER EN ESTA ETAPA (${firstName.toUpperCase()}):`, margin + 4, y + 5);

  let warnY = y + 8.8;
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text(warnLines, margin + 4, warnY);
  warnY += warnLines.length * 3.3 + 1;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(6.4);
  doc.text(recLines, margin + 4, warnY);

  y += warnCardH + 5;

  // 3. CLAVES IDENTIFICADAS EN LAS RESPUESTAS (PANTALLAZO 8)
  const evidences = calc.evidences || [];
  const evCount = Math.min(evidences.length, 5);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentWidth, 43, 2, 2, 'FD');

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.text(`Claves Identificadas en las Respuestas de ${firstName}`, margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.4);
  doc.setTextColor(107, 114, 128);
  doc.text(`Factores que confirman por qué este es el momento idóneo para que ${firstName} concentre su energía en este pilar:`, margin + 4, y + 9.8);

  let evY = y + 14.5;
  for (let idx = 0; idx < evCount; idx++) {
    const evClean = cleanPdfText(evidences[idx]);
    const evLines = doc.splitTextToSize(evClean, contentWidth - 18).slice(0, 1);

    // Círculo rojo dibujado con vector
    doc.setFillColor(215, 25, 43);
    doc.circle(margin + 6, evY, 1.8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text(`${idx + 1}`, margin + 5.1, evY + 1.1);

    // Texto de la evidencia
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.6);
    doc.setTextColor(31, 41, 55);
    doc.text(evLines[0] || evClean, margin + 11, evY + 1.1);

    evY += 5.2;
  }

  y += 48;

  // 4. PUNTUACIONES DE MADUREZ POR PILAR
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'F');

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text('RADIOGRAFÍA DE MADUREZ POR PILAR (100 PUNTOS MÁXIMO):', margin + 4, y + 4.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(55, 65, 81);
  const p1 = `Pilar 1 (Estrategia BMS): ${calc.scores.pilar1} pts`;
  const p2 = `Pilar 2 (Marca Personal): ${calc.scores.pilar2} pts`;
  const p3 = `Pilar 3 (Contenidos): ${calc.scores.pilar3} pts`;
  const p4 = `Pilar 4 (Digital & IA): ${calc.scores.pilar4} pts`;
  doc.text(`${p1}   |   ${p2}   |   ${p3}   |   ${p4}`, margin + 4, y + 9);

  y += 17;

  // 5. CAJA DE PRÓXIMO PASO Y LLAMADO
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(215, 25, 43);
  doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text(`PRÓXIMO PASO PARA ${firstName.toUpperCase()}: SESIÓN DE DIAGNÓSTICO 1 A 1 (30 MIN)`, margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.6);
  doc.setTextColor(75, 85, 99);
  doc.text(`Sesión estratégica oficial con Patricia Loaiza para trazar tu hoja de ruta personalizada de implementación.`, margin + 4, y + 10);

  drawFooterBar(3, 3);

  const pdfBlob = doc.output('blob');
  downloadBlobFromBlob(pdfBlob, fileName);
}
