// API endpoint paths

const API_ENDPOINTS = {
  CONTACTS: {
    LIST: '/contacts',
    GET: (id) => `/contacts/${id}`,
    CREATE: '/contacts',
    UPDATE: (id) => `/contacts/${id}`,
    DELETE: (id) => `/contacts/${id}`
  },
  TEMPLATES: {
    LIST: '/templates',
    GET: (key) => `/templates/${key}`
  },
  EMAIL: {
    SEND: '/email/send'
  }
};

module.exports = API_ENDPOINTS;
