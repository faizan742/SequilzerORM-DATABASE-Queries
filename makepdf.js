const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateInvoice(invoiceData) {
    invoiceData=JSON.stringify(invoiceData[0]);
    invoiceData=JSON.parse(invoiceData);
    //console.log(invoiceData.customer.payments );
    const doc = new PDFDocument();
  
    doc.pipe(fs.createWriteStream('output.pdf'));
  
    doc.font('Helvetica-Bold').fontSize(20).text('Invoice', { align: 'center' });
  
    // Invoice details
    doc.moveDown();
    doc.font('Helvetica').fontSize(12).text(`Invoice Number: ${invoiceData.orderNumber}`);
    doc.font('Helvetica').fontSize(12).text(`Shipped Date: ${invoiceData.shippedDate}`);
    doc.font('Helvetica').fontSize(12).text(`Status: ${invoiceData.status}`);
    doc.font('Helvetica').fontSize(12).text(`Customer: ${invoiceData.customer.customerName}`);
    doc.font('Helvetica').fontSize(12).text(`Employee Name: ${invoiceData.customer.employee.firstName} ${invoiceData.customer.employee.lastName}`);
    // Invoice items
    var finaltoatl=0.0;
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(14).text('Items', { underline: true });
    invoiceData.orderdetails.forEach((item, index) => {
       
      doc.font('Helvetica').fontSize(12).text(`${item.product.productCode}. ${item.product.productName}: $${item.product.MSRP}`);
         finaltoatl=finaltoatl+parseInt(item.product.MSRP);
    });
   
   
    var total = invoiceData.customer.payments.reduce((acc, item) => acc + parseInt(item.amount), 0);
    
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(16).text(`Total: $${Math.round(finaltoatl)}`, { align: 'right' });
  
    // Finalize PDF
     doc.end();
  }


 module.exports=generateInvoice; 