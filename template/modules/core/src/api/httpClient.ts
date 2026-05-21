import axios from 'axios';
import { default as Config } from 'react-native-config';
import {
  authInterceptor,
  errorInterceptor,
  logRequest,
  logRequestError,
  logResponse,
  logResponseError,
} from './interceptors';

import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const requestFulfilledInterceptor = (
  config: InternalAxiosRequestConfig<any>,
) => {
  authInterceptor(config);
  logRequest(config);
  return config;
};

const requestRejectedInterceptor = (error: any) => {
  logRequestError(error);
  return Promise.reject(error as Error);
};

const responseFulfilledInterceptor = (response: AxiosResponse<any, any>) => {
  logResponse(response);
  return response;
};

const responseRejectedInterceptor = (error: any) => {
  logResponseError(error);
  return errorInterceptor(error);
};

const httpClient = axios.create({
  baseURL: Config.API_URL,
  timeout: 60 * 1 * 1000,
  timeoutErrorMessage: 'Network Error',
});

httpClient.interceptors.request.use(
  requestFulfilledInterceptor,
  requestRejectedInterceptor,
);

httpClient.interceptors.response.use(
  responseFulfilledInterceptor,
  responseRejectedInterceptor,
);

export default httpClient;
