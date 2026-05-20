import { describe, expect, it } from '@jest/globals';
import AppError from '@modules/core/src/errors/AppError';
import NetworkError, {
  NetworkErrorCode,
} from '@modules/core/src/errors/NetworkError';

describe('NetworkError', () => {
  it('creates a timeout error', () => {
    const error = new NetworkError(
      'Request timed out',
      NetworkErrorCode.TIMEOUT,
    );

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(NetworkError);
    expect(error.code).toBe(NetworkErrorCode.TIMEOUT);
    expect(error.isOperational).toBe(true);
  });

  it('creates a no-connection error', () => {
    const error = new NetworkError(
      'No internet',
      NetworkErrorCode.NO_CONNECTION,
    );

    expect(error.code).toBe(NetworkErrorCode.NO_CONNECTION);
  });

  it('stores optional status code', () => {
    const error = new NetworkError(
      'Gateway timeout',
      NetworkErrorCode.SERVER_UNREACHABLE,
      504,
    );

    expect(error.statusCode).toBe(504);
  });

  it('defaults to REQUEST_FAILED code', () => {
    const error = new NetworkError('Failed');

    expect(error.code).toBe(NetworkErrorCode.REQUEST_FAILED);
  });
});
