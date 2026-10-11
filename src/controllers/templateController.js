const TemplateService = require('../services/templateService');

class TemplateController {
  constructor() {
    this.service = new TemplateService();
  }

  async getAll(req, res) {
    res.json(await this.service.getAllTemplates());
  }
}

module.exports = TemplateController;
