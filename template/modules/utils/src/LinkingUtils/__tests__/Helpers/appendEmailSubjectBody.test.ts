import { describe, test, expect } from '@jest/globals';
import { appendEmailSubjectBody } from '@modules/utils/src/LinkingUtils/Helpers';

describe('appendEmailSubjectBody HAPPY PATH', () => {
  const emailLink = 'mailto:test@email.com';
  const subject = 'Test Subject';
  const body = 'Test body';
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  test('should append subject correctly when only subject is provided', () => {
    const result = appendEmailSubjectBody(emailLink, subject);
    expect(result).toBe(`${emailLink}?subject=${encodedSubject}`);
  });

  test('should append body correctly when only body is provided', () => {
    const result = appendEmailSubjectBody(emailLink, undefined, body);
    expect(result).toBe(`${emailLink}?body=${encodedBody}`);
  });

  test('should append both subject and body correctly when both are provided', () => {
    const result = appendEmailSubjectBody(emailLink, subject, body);

    expect(result).toBe(
      `${emailLink}?subject=${encodedSubject}&body=${encodedBody}`,
    );
  });

  test('should return the original email link when neither subject nor body is provided', () => {
    const result = appendEmailSubjectBody(emailLink);
    expect(result).toBe(emailLink);
  });
});

describe('appendEmailSubjectBody EDGE CASES', () => {
  const emailLink = 'mailto:test@email.com';

  test('should handle empty strings for subject and body correctly', () => {
    const subject = '';
    const body = '';
    const result = appendEmailSubjectBody(emailLink, subject, body);
    expect(result).toBe(emailLink);
  });

  test('should append parameters correctly when subject or body contain special characters', () => {
    const subject = 'Special Subject !@#$%^&*()_+';
    const body = 'Special Body !@#$%^&*()_+';
    const result = appendEmailSubjectBody(emailLink, subject, body);

    expect(result).toBe(
      `${emailLink}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  });

  test('should handle null values for subject and body without throwing errors', () => {
    const result = appendEmailSubjectBody(emailLink, null, null);
    expect(result).toBe(emailLink);
  });
});
