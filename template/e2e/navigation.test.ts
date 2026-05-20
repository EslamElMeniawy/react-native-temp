import { device, element, by, expect } from 'detox';

describe('Navigation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    // Wait for login screen and perform login
    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id('username-input')).typeText('testuser');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('should navigate to notifications screen', async () => {
    await element(by.id('notifications-button')).tap();
    await waitFor(element(by.id('notifications-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should navigate back to home screen', async () => {
    await device.pressBack();
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should handle app backgrounding and foregrounding', async () => {
    await device.sendToHome();
    await device.launchApp({ newInstance: false });
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
