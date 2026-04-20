 const transporter = require("./congfig/mail");
require("dotenv").config();

async function testMail() {
  try {
    const sender = process.env.MAIL_USER;
    if (!sender) {
      throw new Error("MAIL_USER is not configured");
    }

    const info = await transporter.sendMail({
      from: sender,
      to: sender,
      subject: "SMTP Test",
      text: "Testing Gmail SMTP"
    });

    console.log("SUCCESS:", info.response);

  } catch (error) {
    console.log("ERROR:", error);
  }
}

testMail();