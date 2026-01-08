import { describe, expect, it, jest } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
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
  it('renders without crashing', () => {
    const view = render(
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>,
    );
    expect(view.toJSON()).toBeTruthy();
  });

  it('renders correctly with all screens', () => {
    const view = render(
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>,
    );
    expect(view.toJSON()).toBeTruthy();
  });
});
