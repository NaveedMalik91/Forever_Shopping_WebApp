// server/helpers/email.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // convert to boolean
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// this function matches your import { sendResetEmail }
const sendResetEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent successfully to ${to}`);
};

// must export with the same name
module.exports = { sendResetEmail };
