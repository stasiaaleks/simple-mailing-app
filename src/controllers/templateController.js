const TemplateService = require('../services/templateService');

class TemplateController {
  constructor() {
    this.service = new TemplateService();
  }

  async getAll(req, res, next) {
    try {
      const templates = await this.service.getAllTemplates();
      res.json(templates);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TemplateController;
