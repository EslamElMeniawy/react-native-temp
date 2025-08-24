import type {
  ApiRequest,
  LoginBody,
  LoginResponse,
  LogoutResponse,
} from '@modules/core';
import { httpClient } from '@modules/core';

const queryAuth = {
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  login: (request: ApiRequest<LoginBody>): Promise<LoginResponse> =>
    httpClient
      .post<LoginResponse>('/login', request.body)
      .then(response => response.data),
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  logout: () =>
    httpClient.post<LogoutResponse>('/logout').then(response => response.data),
};

export default queryAuth;
