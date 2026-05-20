import {
  registerHttpClientDependencies,
  getHttpClientDependencies,
} from '@modules/core/src/api/httpClientDependencies';

describe('httpClientDependencies', () => {
  describe('getHttpClientDependencies', () => {
    it('throws when dependencies are not registered', () => {
      // Reset the module to get a fresh state without dependencies
      jest.resetModules();
      const {
        getHttpClientDependencies: freshGet,
      } = require('@modules/core/src/api/httpClientDependencies');

      expect(() => freshGet()).toThrow(
        'HttpClient dependencies not registered',
      );
    });

    it('returns dependencies after registration', () => {
      const mockDeps = {
        getApiToken: jest.fn().mockReturnValue('token'),
        getCurrentLocale: jest.fn().mockReturnValue('en'),
        translate: jest.fn().mockReturnValue('translated'),
        onSessionExpired: jest.fn(),
      };

      registerHttpClientDependencies(mockDeps);
      const deps = getHttpClientDependencies();
      expect(deps).toBe(mockDeps);
      expect(deps.getApiToken()).toBe('token');
      expect(deps.getCurrentLocale()).toBe('en');
    });
  });
});
