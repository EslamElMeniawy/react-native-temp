import axios from 'axios';
import type { ServerErrorResponse } from '@modules/core';
import ServerError from '@modules/core/src/api/entities/ServerError';
import { getHttpClientDependencies } from '@modules/core/src/api/httpClientDependencies';
import skip401Urls from '@modules/core/src/api/skip401Urls';
import { NetworkError, NetworkErrorCode } from '@modules/core/src/errors';

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
 * Determines the appropriate NetworkErrorCode from an AxiosError.
 */
const getNetworkErrorCode = (
  error: AxiosError<ServerErrorResponse>,
): NetworkErrorCode => {
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return NetworkErrorCode.TIMEOUT;
  }

  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return NetworkErrorCode.NO_CONNECTION;
  }

  return NetworkErrorCode.REQUEST_FAILED;
};

/**
 * Handles axios errors by processing 401s and constructing a structured error.
 */
export const handleAxiosError = (error: AxiosError<ServerErrorResponse>) => {
  console.info(getLogMessage('handleAxiosError'), error);
  handle401Error(error);

  // Network-level failure (no response received from server)
  if (!error.response) {
    const networkError = new NetworkError(
      getErrorMessage(error),
      getNetworkErrorCode(error),
      undefined,
      error,
    );

    return Promise.reject(networkError);
  }

  // Server responded with an error status
  const serverError = new ServerError(
    getErrorMessage(error),
    error.response.status,
    {
      date: new Date(),
      data: error.response.data,
      errorMessage: getErrorMessage(error),
      cause: error,
    },
  );

  return Promise.reject(serverError);
};

/**
 * Main error interceptor — dispatches to axios error handler or wraps unknown errors.
 */
const errorInterceptor = (error: any) => {
  if (axios.isAxiosError<ServerErrorResponse>(error)) {
    return handleAxiosError(error);
  }

  const deps = getHttpClientDependencies();

  const serverError = new ServerError(deps.translate('unknownError'), 0, {
    date: new Date(),
    errorMessage: deps.translate('unknownError'),
    cause: error instanceof Error ? error : undefined,
  });

  return Promise.reject(serverError);
};

export default errorInterceptor;
