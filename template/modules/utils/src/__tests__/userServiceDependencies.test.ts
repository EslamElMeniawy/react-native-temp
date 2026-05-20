describe('userServiceDependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('throws when dependencies are not registered', () => {
    const {
      getUserServiceDependencies,
    } = require('@modules/utils/src/userServiceDependencies');

    expect(() => getUserServiceDependencies()).toThrow(
      'UserService dependencies not registered',
    );
  });

  it('returns dependencies after registration', () => {
    const {
      registerUserServiceDependencies,
      getUserServiceDependencies,
    } = require('@modules/utils/src/userServiceDependencies');

    const mockDeps = {
      setUser: jest.fn(),
      removeUser: jest.fn(),
      setApiToken: jest.fn(),
      removeApiToken: jest.fn(),
      removeUnreadNotificationsCount: jest.fn(),
      removeFcmToken: jest.fn(),
      dispatchSetUser: jest.fn(),
      dispatchSetApiToken: jest.fn(),
      dispatchRemoveUser: jest.fn(),
      dispatchRemoveApiToken: jest.fn(),
      dispatchRemoveUnreadNotificationsCount: jest.fn(),
      resetNavigation: jest.fn(),
      deleteMessagingToken: jest.fn().mockResolvedValue(undefined),
      cancelQueries: jest.fn().mockResolvedValue(undefined),
      clearQueryCache: jest.fn(),
    };

    registerUserServiceDependencies(mockDeps);
    const deps = getUserServiceDependencies();
    expect(deps).toBe(mockDeps);
  });
});
