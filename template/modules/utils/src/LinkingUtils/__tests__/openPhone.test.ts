import { describe, jest, afterEach, test, expect } from '@jest/globals';
import { openPhone } from '@modules/utils/src/LinkingUtils';
import * as Helpers from '@modules/utils/src/LinkingUtils/Helpers';

describe('openPhone HAPPY PATH', () => {
  const mockedOpen = jest
    .spyOn(Helpers, 'open')
    .mockImplementation(() => Promise.resolve());

  afterEach(() => {
    mockedOpen?.mockReset();
  });

  const phone = '1234567890';
  const errorMessageKey = 'error_open_phone';

  test('should open phone app with valid phone number', async () => {
    openPhone(phone, errorMessageKey);
    expect(mockedOpen).toHaveBeenCalledWith(`tel:${phone}`, errorMessageKey);
  });

  test('should log the attempt to open the phone app', () => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
    openPhone(phone, errorMessageKey);

    expect(console.info).toHaveBeenCalledWith(
      '## LinkingUtils:: openPhone',
      phone,
    );
  });

  test('should use default error message key when none provided', () => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
    openPhone(phone);

    expect(console.info).toHaveBeenCalledWith(
      '## LinkingUtils:: openPhone',
      phone,
    );

    expect(mockedOpen).toHaveBeenCalledWith(`tel:${phone}`, 'errorOpenPhone');
  });
});

describe('openPhone EDGE CASES', () => {
  const mockedOpen = jest
    .spyOn(Helpers, 'open')
    .mockImplementation(() => Promise.resolve());

  afterEach(() => {
    mockedOpen?.mockReset();
  });

  const errorMessageKey = 'error_open_phone';

  test('should not open phone app when phone number is undefined', async () => {
    const phone = undefined;
    openPhone(phone, errorMessageKey);

    expect(console.info).toHaveBeenCalledWith(
      '## LinkingUtils:: openPhone',
      phone,
    );

    expect(mockedOpen).not.toHaveBeenCalled();
  });

  test('should not open phone app when phone number is an empty string', () => {
    const phone = '';
    jest.spyOn(console, 'info').mockImplementation(() => {});
    openPhone(phone, errorMessageKey);

    expect(console.info).toHaveBeenCalledWith(
      '## LinkingUtils:: openPhone',
      phone,
    );

    expect(mockedOpen).not.toHaveBeenCalled();
  });

  test('should not open phone app when phone number is null', () => {
    const phone = null;
    jest.spyOn(console, 'info').mockImplementation(() => {});
    openPhone(phone, errorMessageKey);

    expect(console.info).toHaveBeenCalledWith(
      '## LinkingUtils:: openPhone',
      phone,
    );

    expect(mockedOpen).not.toHaveBeenCalled();
  });
});
