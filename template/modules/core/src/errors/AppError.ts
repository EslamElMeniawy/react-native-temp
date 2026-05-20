/**
 * Base application error class.
 * All custom errors in the app should extend this class.
 */
export default class AppError extends Error {
  readonly code: string;
  readonly isOperational: boolean;
  readonly cause?: Error;

  constructor(message: string, code: string, isOperational = true, cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.isOperational = isOperational;
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
