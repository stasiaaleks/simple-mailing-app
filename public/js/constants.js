const API_ENDPOINTS = {
  CONTACTS: {
    LIST: '/api/contacts',
    GET: (id) => `/api/contacts/${id}`,
    CREATE: '/api/contacts',
    UPDATE: (id) => `/api/contacts/${id}`,
    DELETE: (id) => `/api/contacts/${id}`
  },
  TEMPLATES: {
    LIST: '/api/templates'
  },
  EMAIL: {
    SEND: '/api/email/send'
  }
};

const UI_MESSAGES = {
  SUCCESS: {
    CONTACT_ADDED: 'Contact added',
    CONTACT_UPDATED: 'Contact updated',
    CONTACT_DELETED: 'Contact deleted',
    EMAIL_SENT: (count) => `Email sent to ${count} recipients`
  },
  WARNING: {
    EMAIL_PARTIAL: (sent, failed) => `Sent: ${sent}, failed: ${failed}. Check the server log for details.`
  },
  ERROR: {
    NO_RECIPIENTS: 'Please select at least one recipient',
    NO_SUBJECT: 'Please enter a subject',
    NO_MESSAGE: 'Please select a template or enter a message',
    LOAD_CONTACTS: 'Failed to load contacts',
    LOAD_TEMPLATES: 'Failed to load templates',
    DEFAULT: 'An error occurred'
  }
};

const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};
