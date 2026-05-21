import { describe, expect, it } from '@jest/globals';
import ApiError, { ApiErrorCode } from '@modules/core/src/errors/ApiError';
import AppError from '@modules/core/src/errors/AppError';

describe('ApiError', () => {
  it('creates a 401 error with UNAUTHORIZED code', () => {
    const error = new ApiError('Unauthorized', 401);

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
  });

  it('creates a 403 error with FORBIDDEN code', () => {
    const error = new ApiError('Forbidden', 403);

    expect(error.code).toBe(ApiErrorCode.FORBIDDEN);
  });

  it('creates a 404 error with NOT_FOUND code', () => {
    const error = new ApiError('Not found', 404);

    expect(error.code).toBe(ApiErrorCode.NOT_FOUND);
  });

  it('creates a 422 error with VALIDATION code', () => {
    const error = new ApiError('Invalid', 422);

    expect(error.code).toBe(ApiErrorCode.VALIDATION);
  });

  it('maps 5xx to SERVER_ERROR', () => {
    const error = new ApiError('Internal', 500);

    expect(error.code).toBe(ApiErrorCode.SERVER_ERROR);
  });

  it('maps unknown 4xx to UNKNOWN', () => {
    const error = new ApiError('Conflict', 409);

    expect(error.code).toBe(ApiErrorCode.UNKNOWN);
  });

  it('accepts explicit code override', () => {
    const error = new ApiError('Custom', 400, {
      code: ApiErrorCode.VALIDATION,
    });

    expect(error.code).toBe(ApiErrorCode.VALIDATION);
  });

  it('stores validation errors array', () => {
    const errors = ['field1 is required', 'field2 is invalid'];
    const error = new ApiError('Validation failed', 422, { errors });

    expect(error.errors).toEqual(errors);
  });
});
