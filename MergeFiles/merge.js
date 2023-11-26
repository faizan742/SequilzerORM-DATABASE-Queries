const { PDFDocument, PDFName } = require('pdf-lib');
const fs = require('fs').promises;

const mergePDFs = async (filePaths) => {
  try {
    const pdfDoc = await PDFDocument.create();

    for (const filePath of filePaths) {
      const pdfBytes = await fs.readFile(filePath);
      const pdf = await PDFDocument.load(pdfBytes);

      const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }

    const mergedPdfBytes = await pdfDoc.save();
    await fs.writeFile('merged.pdf', mergedPdfBytes);

    console.log('PDFs merged successfully into merged.pdf');
  } catch (error) {
    console.error('Error merging PDFs:', error);
  }
};

const pdfFiles = ['Flutter Cheat Sheet.pdf', 'Flutter Cheat Sheet.pdf'];

mergePDFs(pdfFiles);
