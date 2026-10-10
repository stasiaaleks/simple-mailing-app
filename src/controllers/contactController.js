const ContactService = require('../services/contactService');

class ContactController {
  constructor() {
    this.service = new ContactService();
  }

  async getAll(req, res, next) {
    try {
      const contacts = await this.service.getAllContacts();
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const contact = await this.service.getContactById(req.params.id);
      res.json(contact);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { surname, firstName, patronymic, email } = req.body;
      const contact = await this.service.addContact(surname, firstName, patronymic, email);
      res.status(201).json(contact);
    } catch (error) {
      const err = new Error(error.message);
      err.statusCode = 400;
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { surname, firstName, patronymic, email } = req.body;
      const contact = await this.service.updateContact(
        req.params.id,
        surname,
        firstName,
        patronymic,
        email
      );
      res.json(contact);
    } catch (error) {
      const err = new Error(error.message);
      err.statusCode = 400;
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await this.service.deleteContact(req.params.id);
      res.json({ deleted });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ContactController;
