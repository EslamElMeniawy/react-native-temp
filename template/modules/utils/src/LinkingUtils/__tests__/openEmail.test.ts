import { describe, jest, afterEach, test, expect } from '@jest/globals';
import { openEmail } from '@modules/utils/src/LinkingUtils';
import * as Helpers from '@modules/utils/src/LinkingUtils/Helpers';

describe('openEmail HAPPY PATH', () => {
  const mockedOpen = jest
    .spyOn(Helpers, 'open')
    .mockImplementation(() => Promise.resolve());

  afterEach(() => {
    mockedOpen?.mockReset();
  });

  const email = 'test@example.com';
  const subject = 'Test Subject';
  const body = 'Test Body';

  test('should open email client with valid email, subject, and body', async () => {
    const errorMessageKey = 'error_open_mail';
    openEmail(email, subject, body, errorMessageKey);

    expect(mockedOpen).toHaveBeenCalledWith(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      errorMessageKey,
    );
  });

  test('should open email client with only email provided', () => {
    openEmail(email);

    expect(mockedOpen).toHaveBeenCalledWith(
      `mailto:${email}`,
      'errorOpenMail',
    );
  });

  test('should open email client with only subject provided', () => {
    openEmail(undefined, subject);

    expect(mockedOpen).toHaveBeenCalledWith(
      `mailto:?subject=${encodeURIComponent(subject)}`,
      'errorOpenMail',
    );
  });

  test('should open email client with only body provided', () => {
    openEmail(undefined, undefined, body);

    expect(mockedOpen).toHaveBeenCalledWith(
      `mailto:?body=${encodeURIComponent(body)}`,
      'errorOpenMail',
    );
  });
});

describe('openEmail EDGE CASES', () => {
  const mockedOpen = jest
    .spyOn(Helpers, 'open')
    .mockImplementation(() => Promise.resolve());

  afterEach(() => {
    mockedOpen?.mockReset();
  });

  test('should handle empty email, subject, and body gracefully', async () => {
    openEmail();
    expect(mockedOpen).not.toHaveBeenCalled();
  });

  test('should handle null email, subject, and body gracefully', () => {
    openEmail(null, null, null);
    expect(mockedOpen).not.toHaveBeenCalled();
  });

  test('should handle special characters in email, subject, and body', () => {
    const email = 'test@example.com';
    const subject = 'Test Subject with special characters: !@#$%^&*()_+';
    const body = 'Test Body with special characters: ~`{}[]|\\';
    const errorMessageKey = 'error_open_mail';

    openEmail(email, subject, body, errorMessageKey);

    expect(mockedOpen).toHaveBeenCalledWith(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      errorMessageKey,
    );
  });
});
