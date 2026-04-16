 const nodemailer = require("nodemailer");

const sendEmail = async (to, filePath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "your-app-password",
    },
  });

  await transporter.sendMail({
    from: "yourgmail@gmail.com",
    to,
    subject: "Your Hotel Booking Invoice",
    text: "Attached is your invoice PDF.",
    attachments: [
      {
        filename: "invoice.pdf",
        path: filePath,
      },
    ],
  });
};

module.exports = sendEmail;