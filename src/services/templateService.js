const TemplateRepository = require('../db/templateRepository');
const CONFIG = require('../constants/config');
const fs = require('fs');
const path = require('path');

class TemplateService {
  constructor() {
    this.repository = new TemplateRepository();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    const count = await this.repository.getCollection().countDocuments();
    if (count === 0) {
      await this.loadDefaultTemplates();
    }

    this.initialized = true;
  }

  async loadDefaultTemplates() {
    const defaultTemplatesPath = path.join(__dirname, '../templates/default.json');
    const templates = JSON.parse(fs.readFileSync(defaultTemplatesPath, 'utf-8'));

    for (const template of templates) {
      const existing = await this.repository.findByKey(template.key);
      if (!existing) {
        await this.repository.createTemplate(template.key, template.subject, template.body);
      }
    }
  }

  async getAllTemplates() {
    await this.initialize();
    return await this.repository.findAllSorted();
  }

  async getTemplateByKey(key) {
    const template = await this.repository.findByKey(key);
    if (!template) {
      throw new Error(CONFIG.ERRORS.TEMPLATE_NOT_FOUND);
    }
    return template;
  }
}

module.exports = TemplateService;
