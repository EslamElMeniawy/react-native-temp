import {open, appendEmail, appendEmailSubjectBody} from './Helpers';

const getLogMessage = (message: string) => `## LinkingUtils:: ${message}`;

/**
 * Opens a URL using the Linking module, with an optional error message key.
 *
 * @param url The URL to open.
 * @param errorMessageKey Optional key for error message translation.
 */
export const openUrl = (url?: string, errorMessageKey?: string) => {
  console.info(getLogMessage('openUrl'), url);

  if (url?.length) {
    open(url, errorMessageKey ?? 'error_open_url');
  }
};

/**
 * Opens the default email client with the provided email, subject, and body.
 * If any of the email, subject, or body is provided, constructs a mailto link with the given parameters
 * and attempts to open it using the Linking API. If opening the link fails, shows an error message.
 *
 * @param email The email address to populate in the email client.
 * @param subject The subject of the email.
 * @param body The body of the email.
 * @param errorMessageKey The key to use for fetching the error message in case of failure.
 */
export const openEmail = (
  email?: string | null,
  subject?: string | null,
  body?: string | null,
  errorMessageKey?: string,
) => {
  console.info(getLogMessage('openEmail'), email, subject, body);

  if (email?.length || subject?.length || body?.length) {
    let emailLink = 'mailto:';
    emailLink = appendEmail(emailLink, email);
    emailLink = appendEmailSubjectBody(emailLink, subject, body);
    console.info(getLogMessage('emailLink'), emailLink);
    open(emailLink, errorMessageKey ?? 'error_open_mail');
  }
};

/**
 * Opens the phone app with the provided phone number.
 *
 * @param phone The phone number to open in the phone app.
 * @param errorMessageKey Optional key for error message translation.
 */
export const openPhone = (phone?: string | null, errorMessageKey?: string) => {
  console.info(getLogMessage('openPhone'), phone);

  if (phone?.length) {
    open(`tel:${phone}`, errorMessageKey ?? 'error_open_phone');
  }
};

/**
 * Opens WhatsApp with the provided phone number.
 *
 * @param number The phone number to open WhatsApp with.
 * @param errorMessageKey The key for error message in case of failure.
 */
export const openWhatsApp = (
  number?: string | null,
  errorMessageKey?: string,
) => {
  console.info(getLogMessage('openWhatsApp'), number);

  if (number?.length) {
    open(
      `whatsapp://send?phone=${number}`,
      errorMessageKey ?? 'error_open_whats_app',
    );
  }
};
