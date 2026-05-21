import AppError from './AppError';

/**
 * Type guard to check if an error is an operational AppError.
 */
export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError;

/**
 * Type guard to check if an error is operational (expected, recoverable).
 */
export const isOperationalError = (error: unknown): boolean =>
  isAppError(error) && error.isOperational;

/**
 * Extracts a user-friendly message from any error.
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAppError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
