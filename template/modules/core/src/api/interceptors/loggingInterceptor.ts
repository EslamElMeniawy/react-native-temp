import ConsoleColors from '@modules/core/src/api/ConsoleColors';

import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const getLogMessage = (message: string) => `## HttpClient:: ${message}`;

const getLogMethodColor = (method?: string) => {
  let methodColor: string | undefined;

  switch (method) {
    case 'GET':
      methodColor = ConsoleColors.get;
      break;
    case 'HEAD':
      methodColor = ConsoleColors.head;
      break;

    case 'POST':
      methodColor = ConsoleColors.post;
      break;

    case 'PUT':
      methodColor = ConsoleColors.put;
      break;

    case 'PATCH':
      methodColor = ConsoleColors.patch;
      break;

    case 'DELETE':
      methodColor = ConsoleColors.delete;
      break;

    case 'OPTIONS':
      methodColor = ConsoleColors.options;
      break;

    default:
      methodColor = undefined;
      break;
  }

  return methodColor;
};

/**
 * Logs outgoing request details (method, URL) with color coding.
 */
export const logRequest = (config: InternalAxiosRequestConfig<any>) => {
  const method = config.method?.toUpperCase();
  const methodColor = getLogMethodColor(method);

  console.info(
    getLogMessage(`🚀 Sending %c${method}%c Request to %c${config.url}`),
    `color: ${methodColor}`,
    'color: undefined',
    `color: ${ConsoleColors.url}`,
    config,
  );
};

/**
 * Logs request errors.
 */
export const logRequestError = (error: any) => {
  console.error(
    getLogMessage(
      `🚫 Error Sending Request to %c${error.response?.config?.url}`,
    ),
    `color: ${ConsoleColors.url}`,
    error,
  );
};

/**
 * Logs successful response details.
 */
export const logResponse = (response: AxiosResponse<any, any>) => {
  console.info(
    getLogMessage(`✅ Got Response from %c${response.config.url}`),
    `color: ${ConsoleColors.url}`,
    response,
  );
};

/**
 * Logs response errors.
 */
export const logResponseError = (error: any) => {
  console.error(
    getLogMessage(`❌ Got Error from %c${error.response?.config?.url}`),
    `color: ${ConsoleColors.url}`,
    error,
  );
};
