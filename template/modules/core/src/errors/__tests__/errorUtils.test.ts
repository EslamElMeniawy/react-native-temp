import { describe, expect, it } from '@jest/globals';
import AppError from '@modules/core/src/errors/AppError';
import {
  getErrorMessage,
  isAppError,
  isOperationalError,
} from '@modules/core/src/errors/errorUtils';

describe('errorUtils', () => {
  describe('isAppError', () => {
    it('returns true for AppError instances', () => {
      expect(isAppError(new AppError('test', 'CODE'))).toBe(true);
    });

    it('returns false for plain Error', () => {
      expect(isAppError(new Error('test'))).toBe(false);
    });

    it('returns false for non-error values', () => {
      expect(isAppError('string')).toBe(false);
      expect(isAppError(null)).toBe(false);
      expect(isAppError(undefined)).toBe(false);
    });
  });

  describe('isOperationalError', () => {
    it('returns true for operational AppError', () => {
      expect(isOperationalError(new AppError('op', 'OP', true))).toBe(true);
    });

    it('returns false for non-operational AppError', () => {
      expect(isOperationalError(new AppError('bug', 'BUG', false))).toBe(false);
    });

    it('returns false for plain Error', () => {
      expect(isOperationalError(new Error('plain'))).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('extracts message from AppError', () => {
      const error = new AppError('App failure', 'CODE');

      expect(getErrorMessage(error, 'fallback')).toBe('App failure');
    });

    it('extracts message from plain Error', () => {
      expect(getErrorMessage(new Error('plain'), 'fallback')).toBe('plain');
    });

    it('returns fallback for non-error values', () => {
      expect(getErrorMessage('string', 'fallback')).toBe('fallback');
      expect(getErrorMessage(null, 'fallback')).toBe('fallback');
    });
  });
});
