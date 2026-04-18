/*  const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoicePDF = (payment, filePath) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  // Logo
  doc.image(path.join(__dirname, "../uploads/logo.png"), 50, 30, {
    width: 100,
  });

  doc.fontSize(20).text("Hotel Booking Invoice", 200, 50);

  doc.moveDown();
  doc.text(`Order Number: ${payment.orderNumber}`);
  doc.text(`Transaction ID: ${payment.razorpayPaymentId}`);
  doc.text(`Customer: ${payment.name}`);
  doc.text(`Hotel: ${payment.hotelName}`);
  doc.text(`Rooms: ${payment.rooms}`);
  doc.text(`Guests: ${payment.guests}`);
  doc.text(`Nights: ${payment.nights}`);
  doc.text(`Amount: ₹${payment.amount}`);

  const gst = Math.round(payment.amount * 0.18);
  doc.text(`GST (18%): ₹${gst}`);
  doc.text(`Total: ₹${payment.amount + gst}`);

  doc.end();
};

module.exports = generateInvoicePDF; */
/* const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoicePDF = (payment) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(
      __dirname,
      `../invoices/invoice-${payment._id}.pdf`
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
    doc.text(`Payment Status: ${payment.status}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

module.exports = generateInvoicePDF; */


const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoicePDF = (payment) => {
  return new Promise((resolve, reject) => {
    const invoicesDir = path.join(__dirname, "../invoices");

    // Create folder automatically if missing
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