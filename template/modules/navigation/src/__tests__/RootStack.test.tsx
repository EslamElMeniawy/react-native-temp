import { describe, expect, it, jest } from '@jest/globals';
import { renderWithProviders } from '@modules/utils/src/__tests__/TestUtils';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';

import { RootStack } from '@modules/navigation';

jest.mock('@modules/features-auth', () => ({
  ['LoginScreen']: () => null,
}));

jest.mock('@modules/features-debug-menu', () => ({
  ['DebugMenuStack']: () => null,
}));

jest.mock('@modules/features-home', () => ({
  ['HomeScreen']: () => null,
}));

jest.mock('@modules/features-notifications', () => ({
  ['NotificationsScreen']: () => null,
}));

jest.mock('@src/screens', () => ({
  ['Splash']: () => null,
}));

jest.mock('react-native-config', () => ({
  ['ENABLE_LOCAL_LOG']: 'false',
}));

describe('RootStack', () => {
  it('renders without crashing', async () => {
    const view = await renderWithProviders(
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>,
    );
    expect(view.toJSON()).toBeTruthy();
  });

  it('renders correctly with all screens', async () => {
    const view = await renderWithProviders(
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>,
    );
    expect(view.toJSON()).toBeTruthy();
  });
});
