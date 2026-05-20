import { describe, expect, it } from '@jest/globals';
import AppError from '@modules/core/src/errors/AppError';
import StorageError, {
  StorageErrorCode,
} from '@modules/core/src/errors/StorageError';

describe('StorageError', () => {
  it('creates a read failure with key', () => {
    const error = new StorageError(
      'Failed to read',
      StorageErrorCode.READ_FAILED,
      'user_prefs',
    );

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(StorageError);
    expect(error.code).toBe(StorageErrorCode.READ_FAILED);
    expect(error.key).toBe('user_prefs');
  });

  it('creates a write failure', () => {
    const error = new StorageError(
      'Write failed',
      StorageErrorCode.WRITE_FAILED,
    );

    expect(error.code).toBe(StorageErrorCode.WRITE_FAILED);
    expect(error.key).toBeUndefined();
  });

  it('preserves cause', () => {
    const cause = new Error('MMKV internal');
    const error = new StorageError(
      'Corrupted',
      StorageErrorCode.CORRUPTED_DATA,
      'cache_key',
      cause,
    );

    expect(error.cause).toBe(cause);
  });
});
