const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoicePDF = (payment) => {
  return new Promise((resolve, reject) => {
    const invoicesDir = path.join(__dirname, "../invoices");

    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const filePath = path.join(
      invoicesDir,
      `invoice-${payment._id}.pdf`
    );

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(20).text("Hotel Booking Invoice", {
      align: "center",
    });

    doc.moveDown();
    doc.text(`Order Number: ${payment._id}`);
    doc.text(`Customer Name: ${payment.name}`);
    doc.text(`Email: ${payment.email}`);
    doc.text(`Hotel Name: ${payment.hotelName}`);
    doc.text(`Amount Paid: ₹${payment.amount}`);
    doc.text(`Status: ${payment.status}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

module.exports = generateInvoicePDF;