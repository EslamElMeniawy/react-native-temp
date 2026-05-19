import axios from 'axios';
import type { ServerError, ServerErrorResponse } from '@modules/core';
import { getHttpClientDependencies } from '@modules/core/src/api/httpClientDependencies';
import skip401Urls from '@modules/core/src/api/skip401Urls';

import type { AxiosError } from 'axios';

const getLogMessage = (message: string) => `## HttpClient:: ${message}`;

const shouldSkip401 = (error: AxiosError<ServerErrorResponse>) => {
  console.info(getLogMessage('shouldSkip401'), error);
  const responseUrl = error.request?.responseURL;
  console.info(getLogMessage('responseUrl'), responseUrl);

  const isSkip401Url: boolean =
    responseUrl &&
    typeof responseUrl === 'string' &&
    skip401Urls.some(url => responseUrl.indexOf(url) > -1);

  console.info(getLogMessage('isSkip401Url'), isSkip401Url);
  return isSkip401Url;
};

/**
 * Handles 401 Unauthorized responses by triggering session expiration
 * unless the URL is in the skip list.
 */
export const handle401Error = (error: AxiosError<ServerErrorResponse>) => {
  console.info(getLogMessage('handle401Error'), error);
  const status = error.response?.status;
  console.info(getLogMessage('status'), status);

  if (status === 401 && !shouldSkip401(error)) {
    const deps = getHttpClientDependencies();
    deps.onSessionExpired(deps.translate('sessionExpired'));
  }
};

/**
 * Extracts a human-readable error message from various server error response formats.
 */
export const getErrorMessage = (
  error: AxiosError<ServerErrorResponse>,
): string => {
  const deps = getHttpClientDependencies();
  // TODO: Construct error message based on "ServerErrorResponse" constructed from API.
  let errorMessage: string = deps.translate('unknownError');

  if (error.response?.data?.error) {
    errorMessage = error.response?.data?.error;
  } else if (
    error.response?.data?.errors &&
    typeof error.response.data.errors === 'string'
  ) {
    errorMessage = error.response?.data?.errors;
  } else if (
    error.response?.data?.errors &&
    typeof error.response.data.errors === 'object' &&
    error.response?.data?.errors?.message?.length
  ) {
    errorMessage = error.response?.data?.errors?.message?.join('\n');
  } else if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message;
  } else if (error.message) {
    errorMessage = error.message;
  }

  return errorMessage;
};

/**
 * Handles axios errors by processing 401s and constructing a ServerError.
 */
export const handleAxiosError = (error: AxiosError<ServerErrorResponse>) => {
  console.info(getLogMessage('handleAxiosError'), error);
  handle401Error(error);

  const severError: ServerError = {
    ...error,
    date: new Date(),
    status: error.response?.status,
    data: error.response?.data,
    errorMessage: getErrorMessage(error),
  };

  return Promise.reject(severError);
};

/**
 * Main error interceptor — dispatches to axios error handler or wraps unknown errors.
 */
const errorInterceptor = (error: any) => {
  if (axios.isAxiosError<ServerErrorResponse>(error)) {
    return handleAxiosError(error);
  }

  const deps = getHttpClientDependencies();

  const severError: ServerError = {
    ...error,
    errorMessage: deps.translate('unknownError'),
  };

  return Promise.reject(severError);
};

export default errorInterceptor;
