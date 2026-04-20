 const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (to, filePath) => {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  if (!user || !pass) {
    throw new Error("MAIL_USER or MAIL_PASS is not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: user,
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