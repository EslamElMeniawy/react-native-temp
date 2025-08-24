import { describe, test, jest, expect, afterEach } from '@jest/globals';
import { Linking } from 'react-native';
import { open } from '@modules/utils/src/LinkingUtils/Helpers';

describe('open HAPPY PATH', () => {
  test('should successfully open a valid URL', async () => {
    const url = 'https://www.example.com';
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    await open(url);
    expect(openURL).toHaveBeenCalledWith(url);
  });

  test('should log informational message with URL when opening', () => {
    const consoleInfoSpy = jest
      .spyOn(console, 'info')
      .mockImplementation(() => {});

    const url = 'https://www.example.com';
    open(url);

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      '## LinkingUtils::Helpers:: open',
      url,
    );
  });
});

describe('open EDGE CASES', () => {
  const consoleWarnSpy = jest
    .spyOn(console, 'warn')
    .mockImplementation(() => {});

  afterEach(() => {
    consoleWarnSpy?.mockReset();
  });

  test('should fail to open an invalid URL', async () => {
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockRejectedValue(new Error('Invalid URL'));

    const url = 'invalid-url';

    await expect(async () => {
      await open(url, 'error_invalid_url');
    }).rejects.toThrow(`Failed to open: ${url}`);

    expect(openURL).toHaveBeenCalledWith(url);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Failed to open: ${url}`),
      expect.any(Error),
    );
  });

  test('should handle empty URL string', async () => {
    const url = '';

    await expect(async () => {
      await open(url);
    }).rejects.toThrow(`Failed to open: ${url}`);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Failed to open: ${url}`),
      expect.any(Error),
    );
  });
});
