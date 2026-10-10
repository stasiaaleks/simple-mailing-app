const EmailService = require('../services/emailService');

class EmailController {
  constructor() {
    this.service = new EmailService();
  }

  async send(req, res, next) {
    try {
      const result = await this.service.send(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmailController;
