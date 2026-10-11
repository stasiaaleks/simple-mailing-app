const TemplateRepository = require('../db/templateRepository');
const CONFIG = require('../constants/config');
const HttpError = require('../errors/httpError');
const fs = require('fs');
const path = require('path');

class TemplateService {
  constructor() {
    this.repository = new TemplateRepository();
  }

  // default.json is the source of truth
  async loadDefaultTemplates() {
    const defaultTemplatesPath = path.join(__dirname, '../templates/default.json');
    const templates = JSON.parse(fs.readFileSync(defaultTemplatesPath, 'utf-8'));

    await this.repository.deleteMany({});
    for (const template of templates) {
      await this.repository.createTemplate(template.key, template.subject, template.body);
    }

    return templates.length;
  }

  async getAllTemplates() {
    return await this.repository.findAllSorted();
  }

  async getTemplateByKey(key) {
    const template = await this.repository.findByKey(key);
    if (!template) {
      throw HttpError.notFound(CONFIG.ERRORS.TEMPLATE_NOT_FOUND);
    }
    return template;
  }
}

module.exports = TemplateService;
