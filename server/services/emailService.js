const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const SimulationEvent = require("../models/SimulationEvent");

async function sendPhishingEmail(email) {

  const token = uuidv4();

  const phishingLink = `http://localhost:5000/track/${token}`;

  /* ---------------- CREATE DATABASE ENTRY ---------------- */

  await SimulationEvent.create({

    email: email,
    token: token,
    sentAt: new Date(),
    clicked: false,
    credentialsEntered: false

  });

  /* ---------------- EMAIL CONTENT ---------------- */

  const message = {

    from: '"Security Team" <security@company.com>',
    to: email,
    subject: "Security Alert: Verify Your Account",

    html: `
      <h2>Security Alert</h2>

      <p>Your company account requires verification.</p>

      <p>Please click below:</p>

      <a href="${phishingLink}">
        Verify Account
      </a>
    `
  };

  /* ---------------- GMAIL TRANSPORTER ---------------- */

  const gmailTransporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }

  });

  /* ---------------- MAILTRAP TRANSPORTER ---------------- */

  const mailtrapTransporter = nodemailer.createTransport({

    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,

    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }

  });

  /* ---------------- SEND EMAIL ---------------- */

  await gmailTransporter.sendMail(message);

  await mailtrapTransporter.sendMail(message);

  return token;
}

module.exports = sendPhishingEmail;