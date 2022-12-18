export class BaseError extends Error {
  constructor(name: string, message: string) {
    super();
    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.name = name;
  }
}

/**
 * Ошибка аутентификации
 */
export class AuthenticationError extends BaseError {
  constructor(message: string) {
    super("AuthenticationError", message);
  }
}

export class EmailExistError extends BaseError {
  constructor(message: string) {
    super("EmailExistError", message);
  }
}

/**
 * Ошибка авторизации
 */
export class AuthorizationError extends BaseError {
  constructor(message: string) {
    super("AuthorizationError", message);
  }
}

/**
 * Запрошенный объект не найден
 */
export class NotFoundError extends BaseError {
  constructor(message: string) {
    super("NotFoundError", message);
  }
}

/**
 * Некорректный запрос
 */
export class InvalidArgError extends BaseError {
  constructor(message: string) {
    super("InvalidArgError", message);
  }
}

/**
 * Error Validate form
 */
export class ValidateError extends BaseError {
  constructor(message: string) {
    super("Validate", message);
  }
}
export class JWTLifeError extends BaseError {
  constructor(message: string) {
    super("JWTLife", message);
  }
}
