import AppError from './AppError';

export enum StorageErrorCode {
  READ_FAILED = 'STORAGE_READ_FAILED',
  WRITE_FAILED = 'STORAGE_WRITE_FAILED',
  DELETE_FAILED = 'STORAGE_DELETE_FAILED',
  CORRUPTED_DATA = 'STORAGE_CORRUPTED_DATA',
}

/**
 * Represents local storage operation failures.
 */
export default class StorageError extends AppError {
  readonly key?: string;

  constructor(
    message: string,
    code: StorageErrorCode,
    key?: string,
    cause?: Error,
  ) {
    super(message, code, true, cause);
    this.key = key;
  }
}
