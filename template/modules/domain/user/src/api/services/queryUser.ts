import type { User, ApiRequest } from '@modules/core';
import type { AxiosInstance } from 'axios';

const queryUser = {
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  getUserDetails: (httpClient: AxiosInstance) =>
    httpClient
      .get<User>('/user')
      .then(response => response.data)
      .catch(error =>
        Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        ),
      ),
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  updateUserProfile: (
    httpClient: AxiosInstance,
    request: ApiRequest<FormData, number>,
  ) =>
    httpClient
      .putForm<User>(`/user/${request.pathVar}`, request.body)
      .then(response => response.data)
      .catch(error =>
        Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        ),
      ),
};

export default queryUser;
