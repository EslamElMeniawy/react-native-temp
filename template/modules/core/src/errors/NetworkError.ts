import AppError from './AppError';

export enum NetworkErrorCode {
  TIMEOUT = 'NETWORK_TIMEOUT',
  NO_CONNECTION = 'NETWORK_NO_CONNECTION',
  SERVER_UNREACHABLE = 'NETWORK_SERVER_UNREACHABLE',
  REQUEST_FAILED = 'NETWORK_REQUEST_FAILED',
}

/**
 * Represents network-level failures (connectivity, timeouts, unreachable server).
 */
export default class NetworkError extends AppError {
  readonly statusCode?: number;

  constructor(
    message: string,
    code: NetworkErrorCode = NetworkErrorCode.REQUEST_FAILED,
    statusCode?: number,
    cause?: Error,
  ) {
    super(message, code, true, cause);
    this.statusCode = statusCode;
  }
}
