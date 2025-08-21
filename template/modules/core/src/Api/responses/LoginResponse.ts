import type { User } from '@modules/core';

// TODO: Construct login response based on API.
interface LoginResponse {
  user?: User;
  token?: string;
}

export default LoginResponse;
