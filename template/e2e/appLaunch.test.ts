import { device, element, by, expect } from 'detox';

describe('App Launch', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should show splash screen on launch', async () => {
    // The app should start with the splash screen
    await expect(element(by.id('splash-screen'))).toBeVisible();
  });

  it('should navigate to login screen after splash', async () => {
    // Wait for splash to finish and login screen to appear
    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
