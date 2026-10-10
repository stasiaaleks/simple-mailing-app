class ApiClient {
  async request(method, endpoint, data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(endpoint, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  async getContacts() {
    return await this.request('GET', API_ENDPOINTS.CONTACTS.LIST);
  }

  async getContact(id) {
    return await this.request('GET', API_ENDPOINTS.CONTACTS.GET(id));
  }

  async createContact(surname, firstName, patronymic, email) {
    return await this.request('POST', API_ENDPOINTS.CONTACTS.CREATE, {
      surname,
      firstName,
      patronymic,
      email
    });
  }

  async updateContact(id, surname, firstName, patronymic, email) {
    return await this.request('PUT', API_ENDPOINTS.CONTACTS.UPDATE(id), {
      surname,
      firstName,
      patronymic,
      email
    });
  }

  async deleteContact(id) {
    return await this.request('DELETE', API_ENDPOINTS.CONTACTS.DELETE(id));
  }

  async getTemplates() {
    return await this.request('GET', API_ENDPOINTS.TEMPLATES.LIST);
  }

  async sendEmail(subject, body, recipientIds) {
    return await this.request('POST', API_ENDPOINTS.EMAIL.SEND, {
      subject,
      body,
      recipientIds
    });
  }
}

const api = new ApiClient();
