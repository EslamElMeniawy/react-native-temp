import { randomIntFromInterval } from '@modules/utils';
import type {
  ApiRequest,
  LoginBody,
  LoginResponse,
  LogoutResponse,
} from '@modules/core';
import { user } from './data';

const getLogMessage = (message: string) => `## fakers::fakerAuth:: ${message}`;

const fakerAuth = {
  login: (request: ApiRequest<LoginBody>): Promise<LoginResponse> => {
    console.info(getLogMessage('login'), request);

    return new Promise(res =>
      setTimeout(
        () => {
          res({ user, token: 'token' });
        },
        randomIntFromInterval(100, 1000),
      ),
    );
  },
  logout: (): Promise<LogoutResponse> => {
    console.info(getLogMessage('logout'));

    return new Promise(res =>
      setTimeout(
        () => {
          res({ message: 'Logout successfully' });
        },
        randomIntFromInterval(100, 1000),
      ),
    );
  },
};

export default fakerAuth;
