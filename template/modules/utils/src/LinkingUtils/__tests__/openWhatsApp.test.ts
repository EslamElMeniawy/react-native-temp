import { describe, jest, afterEach, test, expect } from '@jest/globals';
import { openWhatsApp } from '@modules/utils/src/LinkingUtils';
import * as Helpers from '@modules/utils/src/LinkingUtils/Helpers';

describe('openWhatsApp HAPPY PATH', () => {
  const mockedOpen = jest
    .spyOn(Helpers, 'open')
    .mockImplementation(() => Promise.resolve());

  afterEach(() => {
    mockedOpen?.mockReset();
  });

  const phoneNumber = '1234567890';

  test('should open WhatsApp with a valid phone number', async () => {
    openWhatsApp(phoneNumber);

    expect(mockedOpen).toHaveBeenCalledWith(
      `whatsapp://send?phone=${phoneNumber}`,
      'errorOpenWhatsApp',
    );
  });

  test('should log the attempt to open WhatsApp', () => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
    openWhatsApp(phoneNumber);

    expect(console.info).toHaveBeenCalledWith(
      '## LinkingUtils:: openWhatsApp',
      phoneNumber,
    );
  });
});

describe('openWhatsApp EDGE CASES', () => {
  const mockedOpen = jest
    .spyOn(Helpers, 'open')
    .mockImplementation(() => Promise.resolve());

  afterEach(() => {
    mockedOpen?.mockReset();
  });

  test('should handle undefined phone number gracefully', async () => {
    openWhatsApp();
    expect(mockedOpen).not.toHaveBeenCalled();
  });

  test('should handle empty phone number string gracefully', () => {
    openWhatsApp('');
    expect(mockedOpen).not.toHaveBeenCalled();
  });

  test('should not open WhatsApp when phone number is null', () => {
    openWhatsApp(null);
    expect(mockedOpen).not.toHaveBeenCalled();
  });
});
