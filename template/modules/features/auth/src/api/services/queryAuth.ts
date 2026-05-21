import type { ApiRequest } from '@modules/core';
import type {
  LoginBody,
  LoginResponse,
  LogoutResponse,
} from '@modules/features-auth';
import type { AxiosInstance } from 'axios';

const queryAuth = {
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  login: (
    httpClient: AxiosInstance,
    request: ApiRequest<LoginBody>,
  ): Promise<LoginResponse> =>
    httpClient
      .post<LoginResponse>('/login', request.body)
      .then(response => response.data)
      .catch(error =>
        Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        ),
      ),
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  logout: (httpClient: AxiosInstance) =>
    httpClient
      .post<LogoutResponse>('/logout')
      .then(response => response.data)
      .catch(error =>
        Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        ),
      ),
};

export default queryAuth;
