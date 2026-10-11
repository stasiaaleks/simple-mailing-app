const ContactService = require('../services/contactService');
const CONFIG = require('../constants/config');

class ContactController {
  constructor() {
    this.service = new ContactService();
  }

  async getAll(req, res) {
    res.json(await this.service.getAllContacts());
  }

  async getById(req, res) {
    res.json(await this.service.getContactById(req.params.id));
  }

  async create(req, res) {
    const { surname, firstName, patronymic, email } = req.body;
    const contact = await this.service.addContact(surname, firstName, patronymic, email);
    res.status(CONFIG.HTTP_STATUS.CREATED).json(contact);
  }

  async update(req, res) {
    const { surname, firstName, patronymic, email } = req.body;
    const contact = await this.service.updateContact(req.params.id, surname, firstName, patronymic, email);
    res.json(contact);
  }

  async delete(req, res) {
    const deleted = await this.service.deleteContact(req.params.id);
    res.json({ deleted });
  }
}

module.exports = ContactController;
