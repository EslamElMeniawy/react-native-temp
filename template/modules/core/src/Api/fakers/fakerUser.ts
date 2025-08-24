import { randomIntFromInterval } from '@modules/utils';
import type { User, ApiRequest } from '@modules/core';
import { user } from './data';

const getLogMessage = (message: string) => `## fakers::fakerUser:: ${message}`;

const fakerUser = {
  getUserDetails: (): Promise<User> => {
    console.info(getLogMessage('getUserDetails'));

    return new Promise(res =>
      setTimeout(
        () => {
          res(user);
        },
        randomIntFromInterval(100, 1000),
      ),
    );
  },
  updateUserProfile: (request: ApiRequest<FormData, number>): Promise<User> => {
    console.info(getLogMessage('updateUserProfile'), request);

    return new Promise(res =>
      setTimeout(
        () => {
          res(user);
        },
        randomIntFromInterval(100, 1000),
      ),
    );
  },
};

export default fakerUser;
