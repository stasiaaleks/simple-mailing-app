const EmailService = require('../services/emailService');

class EmailController {
  constructor() {
    this.service = new EmailService();
  }

  async send(req, res) {
    res.json(await this.service.send(req.body));
  }
}

module.exports = EmailController;
