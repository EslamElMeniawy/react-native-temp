import AppError from './AppError';

export enum ApiErrorCode {
  UNAUTHORIZED = 'API_UNAUTHORIZED',
  FORBIDDEN = 'API_FORBIDDEN',
  NOT_FOUND = 'API_NOT_FOUND',
  VALIDATION = 'API_VALIDATION',
  SERVER_ERROR = 'API_SERVER_ERROR',
  UNKNOWN = 'API_UNKNOWN',
}

interface ApiErrorOptions {
  code?: ApiErrorCode;
  errors?: string[];
  cause?: Error;
}

/**
 * Represents API-level errors (4xx/5xx responses with parsed bodies).
 */
export default class ApiError extends AppError {
  readonly statusCode: number;
  readonly errors?: string[];

  constructor(
    message: string,
    statusCode: number,
    options?: ApiErrorOptions,
  ) {
    super(
      message,
      options?.code ?? mapStatusToCode(statusCode),
      true,
      options?.cause,
    );
    this.statusCode = statusCode;
    this.errors = options?.errors;
  }
}

const mapStatusToCode = (statusCode: number): ApiErrorCode => {
  switch (statusCode) {
    case 401:
      return ApiErrorCode.UNAUTHORIZED;
    case 403:
      return ApiErrorCode.FORBIDDEN;
    case 404:
      return ApiErrorCode.NOT_FOUND;
    case 422:
      return ApiErrorCode.VALIDATION;
    default:
      return statusCode >= 500
        ? ApiErrorCode.SERVER_ERROR
        : ApiErrorCode.UNKNOWN;
  }
};
