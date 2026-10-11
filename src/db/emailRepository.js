const Repository = require('./repository');
const CONFIG = require('../constants/config');

class EmailRepository extends Repository {
  constructor() {
    super(CONFIG.COLLECTIONS.EMAILS);
  }

  async saveEmail(subject, body, recipients, sent, failed) {
    return await this.create({
      subject,
      body,
      recipients,
      sent,
      failed
    });
  }

  async findAllNewestFirst() {
    return await this.findAll({ createdAt: -1 });
  }
}

module.exports = EmailRepository;
