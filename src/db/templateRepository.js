const Repository = require('./repository');
const CONFIG = require('../constants/config');

class TemplateRepository extends Repository {
  constructor() {
    super(CONFIG.COLLECTIONS.TEMPLATES);
  }

  async findByKey(key) {
    return await this.findOne({ key });
  }

  async createTemplate(key, subject, body) {
    return await this.create({
      key,
      subject,
      body
    });
  }

  async findAllSorted() {
    return await this.findAll({ key: 1 });
  }
}

module.exports = TemplateRepository;
