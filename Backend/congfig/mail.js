 const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const host = process.env.MAIL_HOST || "smtp.gmail.com";
const port = Number(process.env.MAIL_PORT || 465);
const secure = String(process.env.MAIL_SECURE || "true").toLowerCase() === "true";
const user = process.env.MAIL_USER || "";
const pass = process.env.MAIL_PASS || "";

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: user && pass ? { user, pass } : undefined,
});

module.exports = transporter;