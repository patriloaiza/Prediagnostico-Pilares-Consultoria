import { jsPDF } from 'jspdf';
import { PrediagnosticResult, COMMERCIAL_MODELS_LABELS, PAYING_CLIENTS_LABELS } from './prediagnosticLogic';

/**
 * Limpia y normaliza texto para descargas y nombres de archivo
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
 * Descarga cualquier contenido de texto en el navegador
 */
function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * Genera y descarga el resultado completo en formato Markdown (.md)
 */
export function downloadPrediagnosticMarkdown(calc: PrediagnosticResult): void {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const model = COMMERCIAL_MODELS_LABELS[calc.lead.commercializationModel] || calc.lead.commercializationModel;
  const clients = PAYING_CLIENTS_LABELS[calc.lead.payingClientsStatus] || calc.lead.payingClientsStatus;
  const dateStr = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mdContent = `# INFORME DE PREDIAGNÓSTICO ESTRATÉGICO
**Metodología CREA Y MONETIZA® · Patricia Loaiza**
*Investigación, estrategia y consultoría.*

---

## 👤 DATOS DEL PROSPECTO
- **Nombre Completo:** ${name}
- **Correo Electrónico:** ${calc.lead.email}
- **WhatsApp:** ${calc.lead.whatsapp}
- **Profesión / Área de Especialidad:** ${calc.lead.profession}
- **Actividad Actual:** ${calc.lead.currentActivity}
- **Modelo de Comercialización:** ${model}
- **Situación con Clientes de Pago:** ${clients}
- **Fecha de Evaluación:** ${dateStr}

---

## 🎯 PERFIL EVOLUTIVO DETECTADO
### ${calc.profile.title}
> *"${calc.profile.subtitle}"*

${calc.profile.description}

---

## 🏆 SERVICIO PRIORITARIO RECOMENDADO
### ${calc.recommendedPillar.name}
- **Programa Oficial:** ${calc.recommendedPillar.serviceTitle}
- **Duración Estimada:** ${calc.recommendedPillar.duration}
- **Alcance:** ${calc.recommendedPillar.lessonsCount || `${calc.recommendedPillar.phases.length} Fases`}

**Transformación Diseñada:**
> ${calc.recommendedPillar.transformation}

**Descripción del Acompañamiento:**
${calc.recommendedPillar.description}

---

${
  calc.hasContradiction && calc.contradictionAnalysis
    ? `## ⚠️ ANÁLISIS DE DISCREPANCIA ESTRATÉGICA
- **Servicio que el prospecto buscaba:** ${calc.statedPillar.name}
- **Diagnóstico del Consultor:** ${calc.contradictionAnalysis.explanation}
- **Riesgo de saltarse este cimiento:** ${calc.contradictionAnalysis.riskOfSkipping}

---
`
    : ''
}

## ⛔ LO QUE NO DEBES HACER EN ESTA ETAPA
> **${calc.notFirstAdvice.warning}**

*Justificación Estratégica:*
${calc.notFirstAdvice.recommendation}

---

## 📊 RADIOGRAFÍA DE PUNTUACIONES POR PILAR
- **Pilar 1 (Estrategia Comercial & Validación de Oferta BMS):** ${calc.scores.pilar1} pts
- **Pilar 2 (Marca Personal, Posicionamiento & Autoridad):** ${calc.scores.pilar2} pts
- **Pilar 3 (Contenidos de Venta & Funnels Orgánicos):** ${calc.scores.pilar3} pts
- **Pilar 4 (Digital Business Day, Automatización & IA):** ${calc.scores.pilar4} pts

---

## 🔍 CLAVES Y FACTORES IDENTIFICADOS
${calc.evidences.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

---

## 📅 PRÓXIMO PASO RECOMENDADO
Sesión Estratégica 1 a 1 de 30 minutos con Patricia Loaiza para trazar la hoja de ruta personalizada de implementación.

© ${new Date().getFullYear()} CREA Y MONETIZA® · Todos los derechos reservados.
*Investigación, estrategia y consultoría por Patricia Loaiza.*
`;

  const fileName = `Prediagnostico_${safeFileName(name)}_${new Date().toISOString().slice(0, 10)}.md`;
  downloadBlob(mdContent, fileName, 'text/markdown;charset=utf-8');
}

/**
 * Genera y descarga el resultado completo en formato PDF (.pdf)
 */
export function downloadPrediagnosticPdf(calc: PrediagnosticResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const model = COMMERCIAL_MODELS_LABELS[calc.lead.commercializationModel] || calc.lead.commercializationModel;
  const clients = PAYING_CLIENTS_LABELS[calc.lead.payingClientsStatus] || calc.lead.payingClientsStatus;

  // Función auxiliar para salto de página automático si falta espacio
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawPageBorder();
    }
  };

  const drawPageBorder = () => {
    // Encabezado decorativo superior
    doc.setFillColor(17, 17, 17); // #111111
    doc.rect(margin, y, contentWidth, 18, 'F');

    doc.setFillColor(215, 25, 43); // #D7192B rojo
    doc.rect(margin, y + 18, contentWidth, 1.8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CREA Y MONETIZA® · INFORME DE PREDIAGNÓSTICO ESTRATÉGICO', margin + 6, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text('Investigación, estrategia y consultoría · Patricia Loaiza', margin + 6, y + 14);

    y += 24;
  };

  drawPageBorder();

  // Bloque: Datos del Prospecto
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(220, 224, 230);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'FD');

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DATOS DEL PROSPECTO EVALUADO', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Nombre: ${name}`, margin + 4, y + 12);
  doc.text(`Email: ${calc.lead.email}`, margin + 4, y + 17);
  doc.text(`WhatsApp: ${calc.lead.whatsapp}`, margin + 4, y + 22);
  doc.text(`Especialidad: ${calc.lead.profession || 'No especificada'}`, margin + 4, y + 27);

  const col2X = margin + contentWidth / 2 + 2;
  doc.text(`Modelo: ${model}`, col2X, y + 12);
  doc.text(`Clientes: ${clients}`, col2X, y + 17);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, col2X, y + 22);

  y += 35;

  // Bloque: Perfil Evolutivo Detectado
  checkPageBreak(30);
  doc.setFillColor(254, 242, 242); // red-50
  doc.setDrawColor(215, 25, 43); // red-600
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PERFIL EVOLUTIVO DETECTADO', margin + 4, y + 6);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(11);
  doc.text(calc.profile.title, margin + 4, y + 12);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`"${calc.profile.subtitle}"`, margin + 4, y + 17);

  y += 28;

  // Bloque: Servicio Prioritario Recomendado
  checkPageBreak(38);
  doc.setFillColor(17, 17, 17);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'F');

  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PRIORIDAD #1 A RESOLVER · SERVICIO RECOMENDADO', margin + 4, y + 6);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(calc.recommendedPillar.name, margin + 4, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(220, 220, 220);
  doc.text(`Programa Oficial: ${calc.recommendedPillar.serviceTitle}`, margin + 4, y + 19);
  doc.text(`Duración: ${calc.recommendedPillar.duration}`, margin + 4, y + 24);

  const transLines = doc.splitTextToSize(`Transformación: ${calc.recommendedPillar.transformation}`, contentWidth - 8);
  doc.setTextColor(253, 224, 71); // amber
  doc.text(transLines, margin + 4, y + 29);

  y += 38;

  // Bloque: Advertencia Estratégica (Lo que no debe hacer)
  checkPageBreak(28);
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('LO QUE NO DEBE HACER EN ESTA ETAPA (ADVERTENCIA):', margin + 4, y + 6);

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const warnLines = doc.splitTextToSize(calc.notFirstAdvice.warning, contentWidth - 8);
  doc.text(warnLines, margin + 4, y + 12);

  y += 26;

  // Bloque: Puntuaciones por Pilares
  checkPageBreak(25);
  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PUNTUACIONES DE CIMIENTOS POR PILAR (100 PUNTOS MÁXIMO):', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const p1 = `Pilar 1 (Estrategia BMS): ${calc.scores.pilar1} pts`;
  const p2 = `Pilar 2 (Marca Personal): ${calc.scores.pilar2} pts`;
  const p3 = `Pilar 3 (Contenidos Venta): ${calc.scores.pilar3} pts`;
  const p4 = `Pilar 4 (Digital & IA): ${calc.scores.pilar4} pts`;

  doc.text(`${p1}   |   ${p2}`, margin + 4, y + 12);
  doc.text(`${p3}   |   ${p4}`, margin + 4, y + 16);

  y += 24;

  // Bloque: Claves y Evidencias
  checkPageBreak(35);
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CLAVES Y FACTORES DETECTADOS EN LA EVALUACIÓN:', margin, y + 4);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(55, 65, 81);

  calc.evidences.slice(0, 5).forEach((evidence, idx) => {
    checkPageBreak(12);
    const itemLines = doc.splitTextToSize(`${idx + 1}. ${evidence}`, contentWidth - 4);
    doc.text(itemLines, margin + 2, y);
    y += itemLines.length * 4.5 + 2;
  });

  // Pie de página institucional
  y = Math.max(y + 4, pageHeight - 16);
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  doc.text(
    'CREA Y MONETIZA® · Investigación, estrategia y consultoría por Patricia Loaiza · Todos los derechos reservados',
    margin,
    pageHeight - 8
  );

  const fileName = `Prediagnostico_${safeFileName(name)}_${new Date().toISOString().slice(0, 10)}.pdf`;
  try {
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_self';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2500);
  } catch (err) {
    console.warn('Direct blob failed, falling back to doc.save:', err);
    doc.save(fileName);
  }
}
