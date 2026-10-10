const nodemailer = require('nodemailer');
const CONFIG = require('../constants/config');

class MailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  initialize() {
    this.transporter = nodemailer.createTransport({
      host: CONFIG.SMTP.HOST,
      port: CONFIG.SMTP.PORT,
      secure: CONFIG.SMTP.SECURE,
      auth: {
        user: CONFIG.SMTP.USER,
        pass: CONFIG.SMTP.PASS
      }
    });
  }

  async sendEmail(to, subject, body) {
    try {
      const mailOptions = {
        from: CONFIG.SMTP.FROM,
        to,
        subject,
        html: body
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async sendToMultiple(recipients, subject, body) {
    const results = [];

    for (const recipient of recipients) {
      const result = await this.sendEmail(recipient.email, subject, body);
      results.push({
        email: recipient.email,
        ...result
      });
    }

    return results;
  }
}

module.exports = MailService;
