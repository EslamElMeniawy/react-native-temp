import { getHttpClientDependencies } from '@modules/core/src/api/httpClientDependencies';

import type { InternalAxiosRequestConfig } from 'axios';

/**
 * Adds authentication and locale headers to outgoing requests.
 * Depends on HttpClientDependencies for token and locale access.
 */
const authInterceptor = (config: InternalAxiosRequestConfig<any>) => {
  const deps = getHttpClientDependencies();
  config.headers.Accept = 'application/json';
  config.headers['Content-Type'] = 'application/json';
  config.headers['Accept-Language'] = deps.getCurrentLocale();
  config.headers['cache-control'] = 'no-cache';
  const token = deps.getApiToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
};

export default authInterceptor;
