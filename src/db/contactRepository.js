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

  async createContact(surname, firstName, email) {
    return await this.create({
      surname,
      firstName,
      email
    });
  }

  async updateContact(id, surname, firstName, email) {
    return await this.update(id, {
      surname,
      firstName,
      email
    });
  }
}

module.exports = ContactRepository;
