import { device, element, by, expect } from 'detox';

describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    // Wait for login screen
    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('should display username and password fields', async () => {
    await expect(element(by.id('username-input'))).toBeVisible();
    await expect(element(by.id('password-input'))).toBeVisible();
  });

  it('should display login button', async () => {
    await expect(element(by.id('login-button'))).toBeVisible();
  });

  it('should navigate to home screen after successful login', async () => {
    await element(by.id('username-input')).typeText('testuser');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    // Wait for home screen to appear
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
