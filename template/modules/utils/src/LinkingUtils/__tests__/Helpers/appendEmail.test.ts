import { describe, test, expect } from '@jest/globals';
import { appendEmail } from '@modules/utils/src/LinkingUtils/Helpers';

describe('appendEmail HAPPY PATH', () => {
  test('should append email to mailto link when email is provided', () => {
    const result = appendEmail('mailto:', 'test@example.com');
    expect(result).toBe('mailto:test@example.com');
  });

  test('should return the original email link when no email is provided', () => {
    const result = appendEmail('mailto:');
    expect(result).toBe('mailto:');
  });

  test('should handle special characters in email address correctly', () => {
    const result = appendEmail('mailto:', 'test@example.com!@#$%^&*()');
    expect(result).toBe('mailto:test@example.com!@#$%^&*()');
  });
});

describe('appendEmail EDGE CASES', () => {
  test('should return just the base link when no email is provided', () => {
    const result = appendEmail('');
    expect(result).toBe('');
  });

  test('should append email to empty string link when email is provided', () => {
    const result = appendEmail('', 'test@example.com');
    expect(result).toBe('test@example.com');
  });

  test('should return the base email link when empty email is provided', () => {
    const result = appendEmail('mailto:test@example.com', '');
    expect(result).toBe('mailto:test@example.com');
  });

  test('should return the base email link when null email is provided', () => {
    const result = appendEmail('mailto:', null);
    expect(result).toBe('mailto:');
  });

  test('should return the base email link when undefined email is provided', () => {
    const result = appendEmail('mailto:');
    expect(result).toBe('mailto:');
  });
});
