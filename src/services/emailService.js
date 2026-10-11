const ContactService = require('./contactService');
const MailService = require('./mailService');
const EmailRepository = require('../db/emailRepository');
const CONFIG = require('../constants/config');
const HttpError = require('../errors/httpError');

class EmailService {
  constructor() {
    this.contactService = new ContactService();
    this.mailService = new MailService();
    this.repository = new EmailRepository();
  }

  async send({ subject, body, recipientIds }) {
    this.validate(subject, body, recipientIds);

    const recipients = await this.contactService.getContactsByIds(recipientIds);
    const results = await this.mailService.sendToMultiple(recipients, subject, body);
    const summary = this.summarize(results);

    await this.save(subject, body, recipients, summary);
    return summary;
  }

  async getSentEmails() {
    return await this.repository.findAllNewestFirst();
  }

  async save(subject, body, recipients, { sent, failed, results }) {
    const deliveries = results.map((result, i) => ({
      contactId: recipients[i]._id,
      ...result
    }));
    await this.repository.saveEmail(subject, body, deliveries, sent, failed);
  }

  validate(subject, body, recipientIds) {
    if (!Array.isArray(recipientIds) || recipientIds.length < CONFIG.VALIDATION.MIN_RECIPIENTS) {
      throw HttpError.badRequest(CONFIG.ERRORS.NO_RECIPIENTS);
    }
    if (!subject) {
      throw HttpError.badRequest(CONFIG.ERRORS.NO_SUBJECT);
    }
    if (!body) {
      throw HttpError.badRequest(CONFIG.ERRORS.NO_BODY);
    }
  }

  summarize(results) {
    return {
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }
}

module.exports = EmailService;
