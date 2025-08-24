import { describe, jest, afterEach, test, expect } from '@jest/globals';
import { openUrl } from '@modules/utils/src/LinkingUtils';
import * as Helpers from '@modules/utils/src/LinkingUtils/Helpers';

describe('openUrl HAPPY PATH', () => {
  const mockedOpen = jest
    .spyOn(Helpers, 'open')
    .mockImplementation(() => Promise.resolve());

  afterEach(() => {
    mockedOpen?.mockReset();
  });

  test('should open a valid URL with default error message key', () => {
    openUrl('https://www.google.com');

    expect(mockedOpen).toHaveBeenCalledWith(
      'https://www.google.com',
      'errorOpenUrl',
    );
  });

  test('should open a valid URL with a custom error message key', () => {
    openUrl('https://www.google.com', 'custom_error');

    expect(mockedOpen).toHaveBeenCalledWith(
      'https://www.google.com',
      'custom_error',
    );
  });

  test('should log the URL being opened', () => {
    const consoleSpy = jest.spyOn(console, 'info');
    openUrl('https://www.google.com');

    expect(consoleSpy).toHaveBeenCalledWith(
      '## LinkingUtils:: openUrl',
      'https://www.google.com',
    );

    consoleSpy?.mockRestore();
  });
});

describe('openUrl EDGE CASES', () => {
  const mockedOpen = jest
    .spyOn(Helpers, 'open')
    .mockImplementation(() => Promise.resolve());

  afterEach(() => {
    mockedOpen?.mockReset();
  });

  test('should not open when URL is undefined', () => {
    openUrl();
    expect(mockedOpen).not.toHaveBeenCalled();
  });

  test('should not open when URL is an empty string', () => {
    openUrl('');
    expect(mockedOpen).not.toHaveBeenCalled();
  });
});
