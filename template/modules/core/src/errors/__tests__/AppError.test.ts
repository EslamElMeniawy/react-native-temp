import { describe, expect, it } from '@jest/globals';
import AppError from '@modules/core/src/errors/AppError';

describe('AppError', () => {
  it('creates an error with code and message', () => {
    const error = new AppError('Something failed', 'TEST_ERROR');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Something failed');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.name).toBe('AppError');
    expect(error.isOperational).toBe(true);
  });

  it('preserves the cause chain', () => {
    const cause = new Error('root cause');
    const error = new AppError('Wrapper', 'WRAP', true, cause);

    expect(error.cause).toBe(cause);
  });

  it('supports non-operational (programmer) errors', () => {
    const error = new AppError('Bug', 'BUG', false);

    expect(error.isOperational).toBe(false);
  });

  it('is caught by instanceof checks after prototype fix', () => {
    const error = new AppError('test', 'CODE');

    expect(error instanceof AppError).toBe(true);
    expect(error instanceof Error).toBe(true);
  });
});
