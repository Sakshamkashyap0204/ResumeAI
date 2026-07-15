import { useCallback } from 'react';
import { jsPDF } from 'jspdf';

export function useDownload() {
  const downloadTxt = useCallback((content, filename = 'muse-content') => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const downloadPdf = useCallback((content, filename = 'muse-content', title = '') => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 60;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    doc.setFont('helvetica', 'normal');

    if (title) {
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text(title, margin, margin);
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text(content, margin, margin + 36, { maxWidth, lineHeightFactor: 1.6 });
    } else {
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text(content, margin, margin, { maxWidth, lineHeightFactor: 1.6 });
    }

    doc.save(`${filename}.pdf`);
  }, []);

  return { downloadTxt, downloadPdf };
}
