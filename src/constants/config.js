// Configuration constants

const CONFIG = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/mailing_app?authSource=admin',
  COLLECTIONS: {
    CONTACTS: 'contacts',
    TEMPLATES: 'templates'
  },

  // SMTP
  SMTP: {
    HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    PORT: process.env.SMTP_PORT || 587,
    SECURE: false,
    USER: process.env.SMTP_USER || 'your-email@gmail.com',
    PASS: process.env.SMTP_KEY || 'your-app-password',
    FROM: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@example.com'
  },

  // Validation
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_RECIPIENTS: 1
  },

  // Error messages
  ERRORS: {
    REQUIRED_FIELDS: 'Surname, first name, and email are required',
    INVALID_EMAIL: 'Invalid email format',
    EMAIL_EXISTS: 'Email already exists',
    CONTACT_NOT_FOUND: 'Contact not found',
    TEMPLATE_NOT_FOUND: 'Template not found',
    NO_RECIPIENTS: 'At least one recipient is required',
    NO_SUBJECT: 'Subject is required',
    NO_BODY: 'Message body is required',
    DB_NOT_INITIALIZED: 'Database not initialized. Call connectDB first.'
  },

  // API response status
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  }
};

module.exports = CONFIG;
