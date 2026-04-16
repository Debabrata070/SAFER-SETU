 const transporter = require("./congfig/mail");

async function testMail() {
  try {
    const info = await transporter.sendMail({
      from: "biswajitsahookalia@gmail.com",
      to: "biswajitsahookalia@gmail.com",
      subject: "SMTP Test",
      text: "Testing Gmail SMTP"
    });

    console.log("SUCCESS:", info.response);

  } catch (error) {
    console.log("ERROR:", error);
  }
}

testMail();