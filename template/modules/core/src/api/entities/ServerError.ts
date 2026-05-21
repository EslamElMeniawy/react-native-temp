import type { ServerErrorResponse } from '@modules/core';
import { ApiError } from '@modules/core/src/errors';

/**
 * Represents a server error returned from the HTTP client.
 * Extends ApiError to integrate with the structured error hierarchy
 * while preserving backward-compatible fields used by consumers.
 */
class ServerError extends ApiError {
  readonly date: Date;
  readonly data?: ServerErrorResponse;
  readonly errorMessage: string;

  /**
   * Backward-compatible alias for `statusCode`.
   */
  get status(): number {
    return this.statusCode;
  }

  constructor(
    message: string,
    statusCode: number,
    options?: {
      date?: Date;
      data?: ServerErrorResponse;
      errorMessage?: string;
      errors?: string[];
      cause?: Error;
    },
  ) {
    super(message, statusCode, {
      errors: options?.errors,
      cause: options?.cause,
    });
    this.date = options?.date ?? new Date();
    this.data = options?.data;
    this.errorMessage = options?.errorMessage ?? message;
  }
}

export default ServerError;
