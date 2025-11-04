const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendEmail(to, subject, htmlContent) {
  try {
    if (!transporter) {
      console.log('Email service not configured. Email not sent:', subject);
      return { success: false, message: 'Email service not configured' };
    }

    const info = await transporter.sendMail({
      from: `"Hisab-Kitab" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendEmail };