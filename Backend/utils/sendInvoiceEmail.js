 const transporter = require("../congfig/mail");

const sendInvoiceEmail = async (toEmail, pdfPath) => {
    
  await transporter.sendMail({
    from:"biswajitsahookalia@gmail.com" ,
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
