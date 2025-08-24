import { translate } from '@modules/localization';
import { open, appendEmail, appendEmailSubjectBody } from './Helpers';

const getLogMessage = (message: string) => `## LinkingUtils:: ${message}`;

/**
 * Opens a URL using the Linking module, with an optional error message key.
 *
 * @param url The URL to open.
 * @param errorMessage The error message to display in case of failure.
 */
export const openUrl = (url?: string, errorMessage?: string) => {
  console.info(getLogMessage('openUrl'), url);

  if (url?.length) {
    open(url, errorMessage ?? translate('errorOpenUrl'));
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
 * @param errorMessage The error message to display in case of failure.
 */
export const openEmail = (
  email?: string | null,
  subject?: string | null,
  body?: string | null,
  errorMessage?: string,
) => {
  console.info(getLogMessage('openEmail'), email, subject, body);

  if (email?.length || subject?.length || body?.length) {
    let emailLink = 'mailto:';
    emailLink = appendEmail(emailLink, email);
    emailLink = appendEmailSubjectBody(emailLink, subject, body);
    console.info(getLogMessage('emailLink'), emailLink);
    open(emailLink, errorMessage ?? translate('errorOpenMail'));
  }
};

/**
 * Opens the phone app with the provided phone number.
 *
 * @param phone The phone number to open in the phone app.
 * @param errorMessage The error message to display in case of failure.
 */
export const openPhone = (phone?: string | null, errorMessage?: string) => {
  console.info(getLogMessage('openPhone'), phone);

  if (phone?.length) {
    open(`tel:${phone}`, errorMessage ?? translate('errorOpenPhone'));
  }
};

/**
 * Opens WhatsApp with the provided phone number.
 *
 * @param number The phone number to open WhatsApp with.
 * @param errorMessage The error message to display in case of failure.
 */
export const openWhatsApp = (number?: string | null, errorMessage?: string) => {
  console.info(getLogMessage('openWhatsApp'), number);

  if (number?.length) {
    open(
      `whatsapp://send?phone=${number}`,
      errorMessage ?? translate('errorOpenWhatsApp'),
    );
  }
};
