import { jsPDF } from 'jspdf';

/**
 * Simple PDF generator using jsPDF
 * Adds title, wraps content lines, handles multi-page breaks, and saves the PDF.
 */
export function downloadAsPdf(title, content, filename = 'document.pdf') {
  if (!content) return;

  const cleanContent = content
    .replace(/#+\s*/g, '')
    .replace(/[*]/g, '')
    .replace(/^[ \t]*-{3,}[ \t]*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const doc = new jsPDF();
  const margin = 15;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxLineWidth = doc.internal.pageSize.getWidth() - margin * 2;
  let y = 20;

  // Title
  if (title) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(title.replace(/#+\s*/g, '').replace(/[*]/g, ''), margin, y);
    y += 10;
  }

  // Content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(cleanContent, maxLineWidth);
  const lineHeight = 6;

  for (let i = 0; i < lines.length; i++) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(lines[i], margin, y);
    y += lineHeight;
  }

  const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(safeName);
}

export function getSafeFilename(text, defaultName = 'document') {
  if (!text || typeof text !== 'string') return defaultName;
  const clean = text
    .trim()
    .slice(0, 30)
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  return clean || defaultName;
}
