 const transporter = require("../congfig/mail");
const dotenv = require("dotenv");
dotenv.config();

const sendInvoiceEmail = async (toEmail, pdfPath) => {
  const fromEmail = process.env.MAIL_USER;
  if (!fromEmail || !process.env.MAIL_PASS) {
    return;
  }

  await transporter.sendMail({
    from: fromEmail,
    to: toEmail,
    subject: "Your Hotel Booking Invoice",
    text: "Thank you for your booking. Please find attached invoice.",
    attachments: [
      {
        filename: "invoice.pdf",
        path: pdfPath,
      },
    ],
  });
};

module.exports = sendInvoiceEmail;
