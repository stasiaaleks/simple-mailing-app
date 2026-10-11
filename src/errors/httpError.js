const CONFIG = require('../constants/config');

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }

  static badRequest(message) {
    return new HttpError(CONFIG.HTTP_STATUS.BAD_REQUEST, message);
  }

  static notFound(message) {
    return new HttpError(CONFIG.HTTP_STATUS.NOT_FOUND, message);
  }
}

module.exports = HttpError;
