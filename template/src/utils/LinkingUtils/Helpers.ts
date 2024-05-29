import {Linking} from 'react-native';
import {Toast} from 'react-native-toast-notifications';
import {translate} from '@src/core';

const getLogMessage = (message: string) =>
  `## LinkingUtils::Helpers:: ${message}`;

/**
 * Appends an email address to a base email link.
 *
 * @param emailLink - The base email link to append the email address to.
 * @param email - Optional. The email address to append to the email link.
 * @returns The updated email link with the appended email address.
 */
export const appendEmail = (emailLink: string, email?: string) => {
  let appendedLink = `${emailLink}`;

  if (email?.length) {
    appendedLink += email;
  }

  return appendedLink;
};

/**
 * Constructs a new email link with optional subject and body parameters.
 *
 * @param emailLink - The base email link to append the subject and body to.
 * @param subject - Optional. The subject to append to the email link.
 * @param body - Optional. The body to append to the email link.
 * @returns The updated email link with appended subject and body parameters.
 */
export const appendEmailSubjectBody = (
  emailLink: string,
  subject?: string,
  body?: string,
) => {
  let appendedLink = `${emailLink}`;

  if (subject?.length || body?.length) {
    appendedLink += '?';

    if (subject?.length) {
      appendedLink += `subject=${subject}`;
    }

    if (body?.length) {
      if (subject?.length) {
        appendedLink += '&';
      }

      appendedLink += `body=${body}`;
    }
  }

  return appendedLink;
};

/**
 * Opens a given URL using Linking.openURL and handles any errors that occur during the process.
 *
 * @param url - The URL to be opened.
 * @param errorMessageKey - An optional key to retrieve an error message for displaying in case of failure.
 * @returns void
 */
export const open = async (url: string, errorMessageKey?: string) => {
  console.info(getLogMessage('open'), url);

  try {
    await Linking.openURL(url);
  } catch (error) {
    console.warn(getLogMessage(`Failed to open: ${url}`), error);

    Toast.show(translate(errorMessageKey ?? 'error_processing_request'), {
      type: 'danger',
    });
  }
};
