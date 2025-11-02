import { faker } from '@faker-js/faker';
import { type ApiRequest } from '@modules/core';
import { fakerUser } from '@modules/features-profile';
import { randomIntFromInterval } from '@modules/utils';
import type {
  LoginBody,
  LoginResponse,
  LogoutResponse,
} from '@modules/features-auth';

const getLogMessage = (message: string) => `## fakers::fakerAuth:: ${message}`;

const fakerAuth = {
  login: (request: ApiRequest<LoginBody>): Promise<LoginResponse> => {
    console.info(getLogMessage('login'), request);

    return new Promise(async res => {
      const user = await fakerUser.getUserDetails();
      res({ user, token: faker.internet.jwt() });
    });
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
