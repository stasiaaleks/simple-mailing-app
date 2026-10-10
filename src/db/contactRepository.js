const Repository = require('./repository');
const CONFIG = require('../constants/config');

class ContactRepository extends Repository {
  constructor() {
    super(CONFIG.COLLECTIONS.CONTACTS);
  }

  async findAllSorted() {
    return await this.findAll({ surname: 1, firstName: 1 });
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }

  async createContact(surname, firstName, patronymic, email) {
    return await this.create({
      surname,
      firstName,
      patronymic,
      email
    });
  }

  async updateContact(id, surname, firstName, patronymic, email) {
    return await this.update(id, {
      surname,
      firstName,
      patronymic,
      email
    });
  }
}

module.exports = ContactRepository;
