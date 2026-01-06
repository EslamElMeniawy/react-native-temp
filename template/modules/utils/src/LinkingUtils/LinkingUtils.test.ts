import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('@modules/localization', () => ({
  translate: jest.fn((key: string) => key),
}));

jest.mock('./Helpers', () => ({
  open: jest.fn(),
  appendEmail: jest.fn((link: string, email?: string | null) =>
    email ? `${link}${email}` : link,
  ),
  appendEmailSubjectBody: jest.fn(
    (link: string, subject?: string | null, body?: string | null) => {
      let result = link;
      if (subject) result += `?subject=${encodeURIComponent(subject)}`;
      if (body) {
        const separator = subject ? '&' : '?';
        result += `${separator}body=${encodeURIComponent(body)}`;
      }
      return result;
    },
  ),
}));

import * as Helpers from './Helpers';
import { openUrl, openEmail, openPhone, openWhatsApp } from './index';

const mockOpen = Helpers.open as jest.Mock;

describe('LinkingUtils.openUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens URL when provided', () => {
    const url = 'https://example.com';
    openUrl(url);

    expect(mockOpen).toHaveBeenCalledWith(url, 'errorOpenUrl');
  });

  it('uses custom error message when provided', () => {
    const url = 'https://example.com';
    const errorMsg = 'Custom error';
    openUrl(url, errorMsg);

    expect(mockOpen).toHaveBeenCalledWith(url, errorMsg);
  });

  it('does not open when URL is empty or undefined', () => {
    openUrl('');
    openUrl(undefined);

    expect(mockOpen).not.toHaveBeenCalled();
  });
});

describe('LinkingUtils.openEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens email with address only', () => {
    openEmail('test@example.com');

    expect(mockOpen).toHaveBeenCalledWith(
      'mailto:test@example.com',
      'errorOpenMail',
    );
  });

  it('opens email with subject and body', () => {
    openEmail('test@example.com', 'Subject', 'Body text');

    expect(mockOpen).toHaveBeenCalled();
    const call = mockOpen.mock.calls[0];
    expect(call[0]).toContain('mailto:');
    expect(call[0]).toContain('test@example.com');
    expect(call[1]).toBe('errorOpenMail');
  });

  it('does not open when all parameters are empty', () => {
    openEmail('', null, null);

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('uses custom error message', () => {
    openEmail('test@example.com', 'Subj', 'Body', 'Custom mail error');

    expect(mockOpen).toHaveBeenCalledWith(
      expect.any(String),
      'Custom mail error',
    );
  });
});

describe('LinkingUtils.openPhone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens phone app with number', () => {
    openPhone('+1234567890');

    expect(mockOpen).toHaveBeenCalledWith('tel:+1234567890', 'errorOpenPhone');
  });

  it('does not open when phone is empty or null', () => {
    openPhone('');
    openPhone(null);

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('uses custom error message', () => {
    openPhone('1234567890', 'Phone call failed');

    expect(mockOpen).toHaveBeenCalledWith(
      'tel:1234567890',
      'Phone call failed',
    );
  });
});

describe('LinkingUtils.openWhatsApp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens WhatsApp with phone number', () => {
    openWhatsApp('+1234567890');

    expect(mockOpen).toHaveBeenCalledWith(
      'whatsapp://send?phone=+1234567890',
      'errorOpenWhatsApp',
    );
  });

  it('does not open when phone is empty or null', () => {
    openWhatsApp('');
    openWhatsApp(null);

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('uses custom error message', () => {
    openWhatsApp('1234567890', 'WhatsApp failed');

    expect(mockOpen).toHaveBeenCalledWith(
      'whatsapp://send?phone=1234567890',
      'WhatsApp failed',
    );
  });
});
