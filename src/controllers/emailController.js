const EmailService = require('../services/emailService');

class EmailController {
  constructor() {
    this.service = new EmailService();
  }

  async getAll(req, res) {
    res.json(await this.service.getSentEmails());
  }

  async send(req, res) {
    res.json(await this.service.send(req.body));
  }
}

module.exports = EmailController;
