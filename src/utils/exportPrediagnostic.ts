import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  PrediagnosticResult,
  COMMERCIAL_MODELS_LABELS,
  PAYING_CLIENTS_LABELS
} from './prediagnosticLogic';

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
 * Genera y descarga el resultado completo en formato Markdown (.md)
 * Incluye el 100% de las 8 secciones y hallazgos mostrados en la pantalla de resultados.
 */
export function downloadPrediagnosticMarkdown(calc: PrediagnosticResult): void {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const firstName = name.split(' ')[0] || 'Emprendedor/a';
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

## 📋 TITULAR DEL REPORTE & BIENVENIDA
> **¡Hola, ${firstName}! Aquí tienes tu Diagnóstico Estratégico**  
> Hemos procesado tus respuestas y tu situación profesional como **${calc.lead.profession || 'Profesional'}** para diseñar tu ruta más rentable y directa al crecimiento.

- **Titular del Reporte:** ${name}
- **Teléfono / WhatsApp:** ${calc.lead.whatsapp}
- **Correo Electrónico:** ${calc.lead.email}
- **Empresa / Proyecto:** ${calc.lead.company || 'No especificada'}
- **Fecha de Evaluación:** ${dateStr}

---

## 🎯 1. CONTEXTO COMERCIAL VERIFICADO DE ${firstName.toUpperCase()}
| Variable de Negocio | Situación Real Diagnosticada |
| :--- | :--- |
| **Profesión / Área:** | ${calc.lead.profession || 'No especificada'} |
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
  ${calc.statedPillar.name}

- **El paso que hoy te dará mayor rentabilidad a ti, ${firstName}:**  
  **${calc.recommendedPillar.name}**

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

## ⛔ 6. LO QUE NO DEBES HACER EN ESTA ETAPA (ADVERTENCIA)
> **${calc.notFirstAdvice.warning}**

*Justificación Estratégica:*  
${calc.notFirstAdvice.recommendation}

---

## 📌 7. CLAVES IDENTIFICADAS EN LAS RESPUESTAS DE ${firstName.toUpperCase()}
*Factores que confirman por qué este es el momento idóneo para que ${firstName} concentre su energía en este pilar:*

${calc.evidences.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

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

  const fileName = `Prediagnostico_${safeFileName(name)}_${new Date().toISOString().slice(0, 10)}.md`;
  downloadBlob(mdContent, fileName, 'text/markdown;charset=utf-8');
}

/**
 * Genera y descarga el PDF capturando el diseño visual exacto de la página de resultados
 * (con los mismos colores, tarjetas, tipografía y badges que ve en pantalla).
 */
export async function downloadPrediagnosticPdf(calc: PrediagnosticResult): Promise<void> {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const fileName = `Prediagnostico_${safeFileName(name)}_${new Date().toISOString().slice(0, 10)}.pdf`;

  const exportElement = document.getElementById('prediagnostic-results-export');

  if (exportElement) {
    try {
      // Ocultar temporalmente elementos de administración o agendamiento para el PDF
      const ignoreElements = exportElement.querySelectorAll('[data-pdf-ignore="true"]');
      ignoreElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });

      const canvas = await html2canvas(exportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8f9fa',
        windowWidth: 1200
      });

      // Restaurar visibilidad
      ignoreElements.forEach((el) => {
        (el as HTMLElement).style.display = '';
      });

      const imgWidth = 210; // A4 ancho en mm
      const pageHeight = 297; // A4 alto en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output('blob');
      downloadBlobFromBlob(pdfBlob, fileName);
      return;
    } catch (err) {
      console.warn('html2canvas capture failed, fallback to structured vector PDF:', err);
    }
  }

  // Si no encuentra el elemento en el DOM o falla html2canvas, genera el PDF estructurado vectorial
  generateStructuredVectorPdf(calc, fileName);
}

/**
 * Generador de PDF vectorial estructurado de respaldo (garantiza que siempre funcione)
 */
function generateStructuredVectorPdf(calc: PrediagnosticResult, fileName: string): void {
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

  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const firstName = name.split(' ')[0] || 'Emprendedor/a';
  const model = COMMERCIAL_MODELS_LABELS[calc.lead.commercializationModel] || calc.lead.commercializationModel;
  const clients = PAYING_CLIENTS_LABELS[calc.lead.payingClientsStatus] || calc.lead.payingClientsStatus;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawHeader();
    }
  };

  const drawHeader = () => {
    doc.setFillColor(17, 17, 17);
    doc.rect(margin, y, contentWidth, 16, 'F');
    doc.setFillColor(215, 25, 43);
    doc.rect(margin, y + 16, contentWidth, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('CREA Y MONETIZA® · INFORME DE PREDIAGNÓSTICO ESTRATÉGICO', margin + 5, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(200, 200, 200);
    doc.text('Investigación, estrategia y consultoría · Patricia Loaiza', margin + 5, y + 12);
    y += 22;
  };

  drawHeader();

  // Bienvenida y Datos
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');
  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('INFORME PERSONALIZADO DE CONSULTORÍA', margin + 4, y + 5);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(11);
  doc.text(`¡Hola, ${firstName}! Aquí tienes tu Diagnóstico Estratégico`, margin + 4, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(75, 85, 99);
  doc.text(`Titular: ${name} · WhatsApp: ${calc.lead.whatsapp} · Email: ${calc.lead.email}`, margin + 4, y + 17);
  doc.text(`Profesión: ${calc.lead.profession} · Modelo: ${model}`, margin + 4, y + 22);
  y += 30;

  // Perfil de Madurez
  checkPageBreak(30);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`PERFIL DE MADUREZ PROFESIONAL DE ${firstName.toUpperCase()}`, margin + 4, y + 5);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(12);
  doc.text(calc.profile.title, margin + 4, y + 11);

  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text(`"${calc.profile.subtitle}"`, margin + 4, y + 16);

  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const descLines = doc.splitTextToSize(calc.profile.description, contentWidth - 8);
  doc.text(descLines.slice(0, 2), margin + 4, y + 21);
  y += 30;

  // Análisis de Enfoque
  checkPageBreak(32);
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(252, 211, 77);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`ANÁLISIS DE ENFOQUE PARA ${firstName.toUpperCase()}: TU RUTA MÁS RÁPIDA AL CRECIMIENTO`, margin + 4, y + 5);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(8.5);
  doc.text(`Preferencia Inicial: ${calc.statedPillar.name}`, margin + 4, y + 11);

  doc.setTextColor(215, 25, 43);
  doc.text(`Paso de Mayor Rentabilidad: ${calc.recommendedPillar.name}`, margin + 4, y + 16);

  if (calc.contradictionAnalysis) {
    doc.setTextColor(75, 85, 99);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const expl = doc.splitTextToSize(calc.contradictionAnalysis.explanation, contentWidth - 8);
    doc.text(expl.slice(0, 2), margin + 4, y + 21);
  }
  y += 32;

  // Hallazgos Clave e Incoherencias
  if (calc.detectedIncoherences && calc.detectedIncoherences.length > 0) {
    checkPageBreak(18);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`CLAVES DE CRECIMIENTO: ${calc.detectedIncoherences.length} OPORTUNIDAD(ES) IDENTIFICADA(S)`, margin, y + 4);
    y += 8;

    calc.detectedIncoherences.forEach((inc, index) => {
      checkPageBreak(36);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(245, 158, 11);
      doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'FD');

      doc.setTextColor(180, 83, 9);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`${index + 1}. ${inc.title}`, margin + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(75, 85, 99);
      doc.text(`• Tu perspectiva (${inc.statementA.questionCategory}): "${inc.statementA.answerText.slice(0, 75)}..."`, margin + 4, y + 10);
      doc.text(`• Realidad actual (${inc.statementB.questionCategory}): "${inc.statementB.answerText.slice(0, 75)}..."`, margin + 4, y + 15);

      doc.setFillColor(17, 17, 17);
      doc.roundedRect(margin + 2, y + 18, contentWidth - 4, 12, 1, 1, 'F');
      doc.setTextColor(253, 224, 71);
      doc.text(`💡 Lectura: ${inc.verdict.slice(0, 95)}...`, margin + 4, y + 23);
      doc.setTextColor(52, 211, 153);
      doc.text(`🚀 Próximo paso: ${inc.actionRequired.slice(0, 95)}...`, margin + 4, y + 27);

      y += 35;
    });
  }

  // Solución Estratégica Recomendada
  checkPageBreak(36);
  doc.setFillColor(17, 17, 17);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'F');

  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`SOLUCIÓN ESTRATÉGICA RECOMENDADA PARA ${firstName.toUpperCase()}`, margin + 4, y + 6);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(calc.recommendedPillar.name, margin + 4, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(220, 220, 220);
  doc.text(`Programa: ${calc.recommendedPillar.serviceTitle} · Duración: ${calc.recommendedPillar.duration}`, margin + 4, y + 18);

  doc.setTextColor(253, 224, 71);
  const transLines = doc.splitTextToSize(`Transformación: ${calc.recommendedPillar.transformation}`, contentWidth - 8);
  doc.text(transLines.slice(0, 2), margin + 4, y + 24);
  y += 36;

  // Claves y Evidencias
  checkPageBreak(30);
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`CLAVES IDENTIFICADAS EN LAS RESPUESTAS DE ${firstName.toUpperCase()}:`, margin, y + 4);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(75, 85, 99);
  calc.evidences.slice(0, 5).forEach((ev, idx) => {
    checkPageBreak(8);
    const evLine = doc.splitTextToSize(`${idx + 1}. ${ev}`, contentWidth - 4);
    doc.text(evLine, margin + 2, y);
    y += evLine.length * 4 + 1.5;
  });

  // Puntuaciones
  checkPageBreak(16);
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'F');
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`PUNTUACIONES: P1: ${calc.scores.pilar1} pts | P2: ${calc.scores.pilar2} pts | P3: ${calc.scores.pilar3} pts | P4: ${calc.scores.pilar4} pts`, margin + 4, y + 8);
  y += 18;

  // Pie
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  doc.text('CREA Y MONETIZA® · Metodología de Consultoría por Patricia Loaiza · Todos los derechos reservados', margin, pageHeight - 8);

  const pdfBlob = doc.output('blob');
  downloadBlobFromBlob(pdfBlob, fileName);
}
