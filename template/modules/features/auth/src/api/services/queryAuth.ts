import { httpClient } from '@modules/core';
import type { ApiRequest } from '@modules/core';
import type {
  LoginBody,
  LoginResponse,
  LogoutResponse,
} from '@modules/features-auth';

const queryAuth = {
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  login: (request: ApiRequest<LoginBody>): Promise<LoginResponse> =>
    httpClient
      .post<LoginResponse>('/login', request.body)
      .then(response => response.data)
      .catch(error =>
        Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        ),
      ),
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  logout: () =>
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
