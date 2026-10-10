const ContactRepository = require('../db/contactRepository');
const CONFIG = require('../constants/config');

class ContactService {
  constructor() {
    this.repository = new ContactRepository();
  }

  validate(surname, firstName, patronymic, email) {
    if (!surname || !firstName || !email) {
      throw new Error(CONFIG.ERRORS.REQUIRED_FIELDS);
    }

    if (!CONFIG.VALIDATION.EMAIL_REGEX.test(email)) {
      throw new Error(CONFIG.ERRORS.INVALID_EMAIL);
    }

    return true;
  }

  async getAllContacts() {
    return await this.repository.findAllSorted();
  }

  async getContactById(id) {
    const contact = await this.repository.findById(id);
    if (!contact) {
      throw new Error(CONFIG.ERRORS.CONTACT_NOT_FOUND);
    }
    return contact;
  }

  async addContact(surname, firstName, patronymic, email) {
    this.validate(surname, firstName, patronymic, email);

    const existing = await this.repository.findByEmail(email);
    if (existing) {
      throw new Error(CONFIG.ERRORS.EMAIL_EXISTS);
    }

    return await this.repository.createContact(surname, firstName, patronymic, email);
  }

  async updateContact(id, surname, firstName, patronymic, email) {
    this.validate(surname, firstName, patronymic, email);

    const contact = await this.getContactById(id);

    if (email !== contact.email) {
      const existing = await this.repository.findByEmail(email);
      if (existing) {
        throw new Error(CONFIG.ERRORS.EMAIL_EXISTS);
      }
    }

    return await this.repository.updateContact(id, surname, firstName, patronymic, email);
  }

  async deleteContact(id) {
    await this.getContactById(id);
    return await this.repository.delete(id);
  }

  async getContactsByIds(ids) {
    const { ObjectId } = require('mongodb');
    const collection = this.repository.getCollection();
    return await collection
      .find({ _id: { $in: ids.map(id => new ObjectId(id)) } })
      .toArray();
  }
}

module.exports = ContactService;
