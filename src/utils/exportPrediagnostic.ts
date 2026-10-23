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
 * Incluye exactamente el encabezado corporativo del pantallazo y el 100% de los análisis.
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

  const mdContent = `# METODOLOGÍA CREA Y MONETIZA® · Patricia Loaiza
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

  const fileName = `Prediagnostico_${safeFileName(name)}_${new Date().toISOString().slice(0, 10)}.md`;
  downloadBlob(mdContent, fileName, 'text/markdown;charset=utf-8');
}

/**
 * Genera y descarga el PDF capturando el diseño visual exacto de la aplicación
 * (incluyendo el gran encabezado negro con el tag rojo del nombre, tarjetas comparativas y todos los análisis).
 */
export async function downloadPrediagnosticPdf(calc: PrediagnosticResult): Promise<void> {
  const name = calc.lead.name.trim() || 'Emprendedor/a';
  const fileName = `Prediagnostico_${safeFileName(name)}_${new Date().toISOString().slice(0, 10)}.pdf`;

  const exportElement = document.getElementById('prediagnostic-results-export');

  if (exportElement) {
    try {
      // Ocultar temporalmente elementos interactivos o que no deben salir en el informe impreso
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
      console.warn('html2canvas capture failed, fallback to structured high-fidelity vector PDF:', err);
    }
  }

  // Si no encuentra el elemento en el DOM o falla html2canvas, genera el PDF de alta fidelidad idéntico
  generateStructuredVectorPdf(calc, fileName);
}

/**
 * Generador de PDF vectorial de alta fidelidad que replica exactamente el diseño
 * de la página de resultados (Encabezado negro, insignias rojas, tarjetas comparativas y bloques de lectura).
 */
function generateStructuredVectorPdf(calc: PrediagnosticResult, fileName: string): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
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
      drawMiniHeader();
    }
  };

  const drawMiniHeader = () => {
    doc.setFillColor(17, 17, 17);
    doc.rect(margin, y, contentWidth, 10, 'F');
    doc.setFillColor(215, 25, 43);
    doc.rect(margin, y + 10, contentWidth, 1, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`CREA Y MONETIZA® · PREDIAGNÓSTICO ESTRATÉGICO · ${name.toUpperCase()}`, margin + 4, y + 6);
    y += 16;
  };

  // 1. GRAN ENCABEZADO CORPORATIVO (IDÉNTICO AL PANTALLAZO DEL USUARIO)
  doc.setFillColor(8, 8, 8); // #080808
  doc.setDrawColor(38, 38, 38);
  doc.roundedRect(margin, y, contentWidth, 48, 3, 3, 'FD');

  // Badge superior rojo
  doc.setFillColor(215, 25, 43);
  doc.roundedRect(margin + 4, y + 4, 56, 5, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('METODOLOGÍA CREA Y MONETIZA ®', margin + 6, y + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(156, 163, 175);
  doc.text('Patricia Loaiza', margin + 64, y + 7.5);

  // Título grande blanco
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Prediagnóstico Consultoría Requerida', margin + 4, y + 16);

  // Badge rojo con el nombre del cliente
  const nameWidth = doc.getTextWidth(name) + 10;
  doc.setFillColor(215, 25, 43);
  doc.roundedRect(margin + 4 + doc.getTextWidth('Prediagnóstico Consultoría Requerida ') + 2, y + 11.5, Math.min(nameWidth, 50), 6, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(`• ${name}`, margin + 6 + doc.getTextWidth('Prediagnóstico Consultoría Requerida ') + 2, y + 15.5);

  // Texto empático de introducción con badge amarillo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(209, 213, 219);
  const introText = `${firstName}, llevas años construyendo experiencia... pero algo no cierra. ¿Es visibilidad? ¿Automatización? ¿O tu oferta aún tiene cuellos de botella invisibles? Nuestro motor de auditoría de evidencias te revela la verdad exacta — y te protege de invertir en lo que no toca.`;
  const introLines = doc.splitTextToSize(introText, contentWidth - 8);
  doc.text(introLines.slice(0, 3), margin + 4, y + 24);

  // Barra de progreso roja
  doc.setDrawColor(55, 65, 81);
  doc.line(margin + 4, y + 36, margin + contentWidth - 4, y + 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  doc.text(`Diagnóstico Completado para ${name}`, margin + 4, y + 41);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('100%', margin + contentWidth - 14, y + 41);

  // Línea roja 100% de progreso
  doc.setFillColor(215, 25, 43);
  doc.rect(margin + 4, y + 43, contentWidth - 8, 1.5, 'F');

  y += 54;

  // 2. BIENVENIDA Y CONTEXTO COMERCIAL VERIFICADO (PANTALLAZO 1)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

  // Badge rojo bienvenida
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin + 4, y + 3, 40, 4, 1, 1, 'FD');
  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text('INFORME PERSONALIZADO PARA TI', margin + 6, y + 6);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(10);
  doc.text(`¡Hola, ${firstName}! Aquí tienes tu Diagnóstico Estratégico`, margin + 4, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(75, 85, 99);
  doc.text(`Hemos procesado tu situación profesional como ${calc.lead.profession} para diseñar tu ruta más rentable.`, margin + 4, y + 16);

  // Titular Box
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + contentWidth - 48, y + 3, 44, 15, 1, 1, 'FD');
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(5.5);
  doc.text('TITULAR DEL REPORTE', margin + contentWidth - 45, y + 7);
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(name.slice(0, 20), margin + contentWidth - 45, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(107, 114, 128);
  doc.text(calc.lead.whatsapp, margin + contentWidth - 45, y + 15);

  // Subtítulo Contexto Comercial
  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(`• CONTEXTO COMERCIAL VERIFICADO DE ${firstName.toUpperCase()}`, margin + 4, y + 22);

  // 4 Columnas de Contexto Comercial
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y + 24, contentWidth - 8, 11, 1, 1, 'FD');

  const colW = (contentWidth - 8) / 4;
  doc.setFontSize(5.5);
  doc.setTextColor(107, 114, 128);
  doc.text('PROFESIÓN / ÁREA:', margin + 6, y + 28);
  doc.text('ACTIVIDAD ACTUAL:', margin + 6 + colW, y + 28);
  doc.text('MODELO COMERCIAL:', margin + 6 + colW * 2, y + 28);
  doc.text('CLIENTES DE PAGO:', margin + 6 + colW * 3, y + 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(17, 24, 39);
  doc.text((calc.lead.profession || 'Consultor').slice(0, 22), margin + 6, y + 32);
  doc.text((calc.lead.currentActivity || 'Servicios').slice(0, 22), margin + 6 + colW, y + 32);
  doc.text(model.slice(0, 22), margin + 6 + colW * 2, y + 32);
  doc.text(clients.slice(0, 22), margin + 6 + colW * 3, y + 32);

  y += 44;

  // 3. PERFIL DE MADUREZ PROFESIONAL (PANTALLAZO 1 - INFERIOR)
  checkPageBreak(30);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'FD');

  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text(`PERFIL DE MADUREZ PROFESIONAL DE ${firstName.toUpperCase()}`, margin + 4, y + 5);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(11);
  doc.text(calc.profile.title, margin + 4, y + 11);

  doc.setTextColor(215, 25, 43);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.text(`"${calc.profile.subtitle}"`, margin + 4, y + 16);

  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const pDesc = doc.splitTextToSize(calc.profile.description, contentWidth - 62);
  doc.text(pDesc.slice(0, 2), margin + 4, y + 21);

  // Caja derecha: Obstáculo y Paso Inmediato
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + contentWidth - 55, y + 3, 51, 22, 1, 1, 'FD');

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text(`Obstáculo Central de ${firstName}:`, margin + contentWidth - 53, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const painText = doc.splitTextToSize(calc.profile.corePain, 47);
  doc.text(painText.slice(0, 2), margin + contentWidth - 53, y + 10.5);

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text(`Paso Inmediato para ${firstName}:`, margin + contentWidth - 53, y + 16.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const stepText = doc.splitTextToSize(calc.profile.priorityNeed, 47);
  doc.text(stepText.slice(0, 2), margin + contentWidth - 53, y + 20);

  y += 34;

  // 4. ANÁLISIS DE ENFOQUE (PANTALLAZO 2)
  checkPageBreak(38);
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(252, 211, 77); // amber-300
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(`ANÁLISIS DE ENFOQUE PARA ${firstName.toUpperCase()}: TU RUTA MÁS RÁPIDA AL CRECIMIENTO`, margin + 4, y + 5);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(9);
  const contTitle = calc.contradictionAnalysis ? `${firstName}: ${calc.contradictionAnalysis.title}` : `Enfoque de ${firstName} Alineado`;
  doc.text(contTitle.slice(0, 75), margin + 4, y + 10);

  // Dos Cajas Comparativas (Pantallazo 2)
  const boxW = (contentWidth - 11) / 2;
  // Caja izquierda: Tu idea inicial
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y + 13, boxW, 11, 1, 1, 'FD');
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(5.5);
  doc.text(`TU IDEA O PREFERENCIA INICIAL (${firstName.toUpperCase()}):`, margin + 6, y + 17);
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(7);
  doc.text(calc.statedPillar.name.slice(0, 36), margin + 6, y + 21);

  // Caja derecha con borde rojo: El paso rentable
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(215, 25, 43);
  doc.roundedRect(margin + 4 + boxW + 3, y + 13, boxW, 11, 1, 1, 'FD');
  doc.setTextColor(215, 25, 43);
  doc.setFontSize(5.5);
  doc.text(`EL PASO QUE HOY TE DARÁ MAYOR RENTABILIDAD A TI, ${firstName.toUpperCase()}:`, margin + 6 + boxW + 3, y + 17);
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(7);
  doc.text(calc.recommendedPillar.name.slice(0, 36), margin + 6 + boxW + 3, y + 21);

  // Explicación
  if (calc.contradictionAnalysis) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(75, 85, 99);
    const expLines = doc.splitTextToSize(calc.contradictionAnalysis.explanation, contentWidth - 8);
    doc.text(expLines.slice(0, 1), margin + 4, y + 28);

    doc.setTextColor(180, 83, 9);
    doc.setFont('helvetica', 'bold');
    doc.text(`¿Por qué este es el camino más inteligente y seguro para ti, ${firstName}?`, margin + 4, y + 31.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    const riskLines = doc.splitTextToSize(calc.contradictionAnalysis.riskOfSkipping, contentWidth - 8);
    doc.text(riskLines.slice(0, 1), margin + 4, y + 34.5);
  }

  y += 42;

  // 5. CLAVES DE CRECIMIENTO: TODAS LAS OPORTUNIDADES IDENTIFICADAS (PANTALLAZOS 3, 4, 5 Y 6)
  if (calc.detectedIncoherences && calc.detectedIncoherences.length > 0) {
    checkPageBreak(15);
    doc.setTextColor(215, 25, 43);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(`CLAVES DE CRECIMIENTO PARA ${firstName.toUpperCase()}: ${calc.detectedIncoherences.length} OPORTUNIDAD(ES) IDENTIFICADA(S)`, margin, y + 3);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(10);
    doc.text(`Hallazgos Clave para Acelerar los Resultados de ${firstName}`, margin, y + 8);
    y += 12;

    calc.detectedIncoherences.forEach((inc, index) => {
      checkPageBreak(44);

      // Tarjeta contenedora
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(252, 211, 77);
      doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'FD');

      // Barra superior amarilla
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(margin, y, contentWidth, 6, 2, 2, 'F');
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(`${index + 1}. ${inc.title}`, margin + 4, y + 4.2);

      // Badge OPORTUNIDAD CLAVE / AJUSTE RECOMENDADO
      doc.setFillColor(inc.severity === 'critica' ? 215 : 217, inc.severity === 'critica' ? 25 : 119, inc.severity === 'critica' ? 43 : 6);
      doc.roundedRect(margin + contentWidth - 36, y + 1.2, 32, 3.8, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(5);
      doc.text(inc.severity === 'critica' ? 'OPORTUNIDAD CLAVE' : 'AJUSTE RECOMENDADO', margin + contentWidth - 34, y + 3.8);

      // Dos Cajas Comparativas (Perspectiva vs Realidad)
      const subBoxW = (contentWidth - 11) / 2;
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(margin + 3, y + 8, subBoxW, 11, 1, 1, 'FD');
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(5);
      doc.text(`TU PERSPECTIVA INICIAL (${firstName.toUpperCase()} · ${inc.statementA.questionCategory.toUpperCase()}):`, margin + 5, y + 11.5);
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(6);
      doc.text(`"${inc.statementA.answerText.slice(0, 50)}..."`, margin + 5, y + 16);

      doc.setFillColor(254, 252, 232);
      doc.setDrawColor(252, 211, 77);
      doc.roundedRect(margin + 3 + subBoxW + 3, y + 8, subBoxW, 11, 1, 1, 'FD');
      doc.setTextColor(180, 83, 9);
      doc.setFontSize(5);
      doc.text(`LA REALIDAD ACTUAL DE TU NEGOCIO (${firstName.toUpperCase()} · ${inc.statementB.questionCategory.toUpperCase()}):`, margin + 5 + subBoxW + 3, y + 11.5);
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(6);
      doc.text(`"${inc.statementB.answerText.slice(0, 50)}..."`, margin + 5 + subBoxW + 3, y + 16);

      // Caja Negra de Lectura Estratégica (Idéntica a pantallazos 3, 4, 5 y 6)
      doc.setFillColor(17, 17, 17);
      doc.roundedRect(margin + 3, y + 21, contentWidth - 6, 19, 1.5, 1.5, 'F');

      doc.setTextColor(251, 191, 36); // amber-400
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.text(`💡 LECTURA ESTRATÉGICA PARA ${firstName.toUpperCase()}:`, margin + 5, y + 24.5);
      doc.setTextColor(229, 231, 235);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      const vText = doc.splitTextToSize(inc.verdict, contentWidth - 14);
      doc.text(vText.slice(0, 1), margin + 5, y + 27.5);

      doc.setTextColor(52, 211, 153); // emerald-400
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.text('🌱 EL SECRETO PARA CRECER CON SEGURIDAD:', margin + 5, y + 31.5);
      doc.setTextColor(209, 213, 219);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      const rText = doc.splitTextToSize(inc.revealedTruth, contentWidth - 14);
      doc.text(rText.slice(0, 1), margin + 5, y + 34.5);

      doc.setTextColor(253, 224, 71);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.text(`🚀 Próximo Paso Recomendado para ${firstName}: ${inc.actionRequired.slice(0, 75)}...`, margin + 5, y + 38.5);

      y += 45;
    });
  }

  // 6. SOLUCIÓN ESTRATÉGICA RECOMENDADA (PANTALLAZO 7 - GRAN TARJETA NEGRA)
  checkPageBreak(40);
  doc.setFillColor(17, 17, 17);
  doc.setDrawColor(215, 25, 43);
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'FD');

  // Badge rojo
  doc.setFillColor(215, 25, 43);
  doc.roundedRect(margin + 4, y + 3.5, 52, 4.5, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text(`SOLUCIÓN ESTRATÉGICA RECOMENDADA PARA ${firstName.toUpperCase()}`, margin + 6, y + 6.8);

  doc.setTextColor(156, 163, 175);
  doc.setFontSize(6);
  doc.text(calc.recommendedPillar.categoryTag || 'Cimiento Comercial', margin + contentWidth - 45, y + 6.8);

  // Título blanco grande
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(calc.recommendedPillar.name, margin + 4, y + 13.5);

  doc.setTextColor(209, 213, 219);
  doc.setFontSize(7.5);
  doc.text(calc.recommendedPillar.serviceTitle, margin + 4, y + 17.5);

  // Cajas negras de Modalidad y Alcance
  doc.setFillColor(0, 0, 0);
  doc.roundedRect(margin + 4, y + 19.5, 50, 7.5, 1, 1, 'F');
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(5);
  doc.text('MODALIDAD Y DURACIÓN', margin + 6, y + 22.5);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.5);
  doc.text(calc.recommendedPillar.duration.slice(0, 28), margin + 6, y + 25.5);

  doc.setFillColor(0, 0, 0);
  doc.roundedRect(margin + 58, y + 19.5, 50, 7.5, 1, 1, 'F');
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(5);
  doc.text('ALCANCE DEL SERVICIO', margin + 60, y + 22.5);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.5);
  doc.text(calc.recommendedPillar.lessonsCount || '6 Fases de Acompañamiento', margin + 60, y + 25.5);

  // Transformación
  doc.setFillColor(30, 30, 30);
  doc.roundedRect(margin + 4, y + 28.5, contentWidth - 8, 6, 1, 1, 'F');
  doc.setTextColor(253, 224, 71);
  doc.setFontSize(5.5);
  doc.text(`✨ Transformación para ${firstName}: ${calc.recommendedPillar.transformation.slice(0, 95)}...`, margin + 6, y + 32.5);

  y += 40;

  // 7. CLAVES IDENTIFICADAS EN LAS RESPUESTAS (PANTALLAZO 8)
  checkPageBreak(30);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'FD');

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Claves Identificadas en las Respuestas de ${firstName}`, margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(107, 114, 128);
  doc.text(`Factores que confirman por qué este es el momento idóneo para que ${firstName} concentre su energía en este pilar:`, margin + 4, y + 8.5);

  calc.evidences.slice(0, 5).forEach((ev, idx) => {
    // Insignia circular roja
    doc.setFillColor(215, 25, 43);
    doc.circle(margin + 6, y + 12 + idx * 3.3, 1.4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.5);
    doc.text(`${idx + 1}`, margin + 5.2, y + 12.6 + idx * 3.3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(31, 41, 55);
    doc.text(ev.slice(0, 110), margin + 9, y + 12.6 + idx * 3.3);
  });

  y += 32;

  // 8. PUNTUACIONES POR PILAR
  checkPageBreak(12);
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, y, contentWidth, 8, 1, 1, 'F');
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text(`PUNTUACIONES DE MADUREZ:  P1 (BMS): ${calc.scores.pilar1} pts  |  P2 (Marca): ${calc.scores.pilar2} pts  |  P3 (Contenidos): ${calc.scores.pilar3} pts  |  P4 (IA & Digital): ${calc.scores.pilar4} pts`, margin + 4, y + 5.2);
  y += 11;

  // Pie institucional
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(156, 163, 175);
  doc.text('CREA Y MONETIZA® · Metodología de Consultoría por Patricia Loaiza · Todos los derechos reservados', margin, pageHeight - 6);

  const pdfBlob = doc.output('blob');
  downloadBlobFromBlob(pdfBlob, fileName);
}
