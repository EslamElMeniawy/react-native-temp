import { faker } from '@faker-js/faker';
import { randomIntFromInterval } from '@modules/utils';
import type { User, ApiRequest } from '@modules/core';

const getLogMessage = (message: string) => `## fakers::fakerUser:: ${message}`;

const user: User = {
  id: faker.number.int(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number({ style: 'international' }),
};

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
