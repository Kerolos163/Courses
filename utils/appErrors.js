class AppError extends Error {
  constructor(message, statusCode = 500, statusText = "Internal Server Error") {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

module.exports = AppError;
