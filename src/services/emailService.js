const ContactService = require('./contactService');
const MailService = require('./mailService');
const CONFIG = require('../constants/config');

class EmailService {
  constructor() {
    this.contactService = new ContactService();
    this.mailService = new MailService();
  }

  async send({ subject, body, recipientIds }) {
    this.validate(subject, body, recipientIds);

    const recipients = await this.contactService.getContactsByIds(recipientIds);
    const results = await this.mailService.sendToMultiple(recipients, subject, body);

    return this.summarize(results);
  }

  validate(subject, body, recipientIds) {
    if (!Array.isArray(recipientIds) || recipientIds.length < CONFIG.VALIDATION.MIN_RECIPIENTS) {
      throw this.badRequest(CONFIG.ERRORS.NO_RECIPIENTS);
    }
    if (!subject) {
      throw this.badRequest(CONFIG.ERRORS.NO_SUBJECT);
    }
    if (!body) {
      throw this.badRequest(CONFIG.ERRORS.NO_BODY);
    }
  }

  summarize(results) {
    return {
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  badRequest(message) {
    const error = new Error(message);
    error.statusCode = CONFIG.HTTP_STATUS.BAD_REQUEST;
    return error;
  }
}

module.exports = EmailService;
