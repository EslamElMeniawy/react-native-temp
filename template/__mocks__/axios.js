module.exports = {
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    defaults: { timeoutErrorMessage: 'Network Timeout' },
  })),
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      defaults: { timeoutErrorMessage: 'Network Timeout' },
    })),
  },
  isAxiosError: jest.fn(error => error && error.response !== undefined),
};
