import type { User, ApiRequest } from '@modules/core';
import { httpClient } from '@modules/core';

const queryUser = {
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  getUserDetails: () =>
    httpClient.get<User>('/user').then(response => response.data),
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  updateUserProfile: (request: ApiRequest<FormData, number>) =>
    httpClient
      .putForm<User>(`/user/${request.pathVar}`, request.body)
      .then(response => response.data),
};

export default queryUser;
