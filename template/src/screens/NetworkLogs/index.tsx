import * as React from 'react';
import NetworkLogger from 'react-native-network-logger';
import {Screen} from '@src/components';
import {useAppTheme} from '@src/utils';
import {Header} from './components';

export default React.memo(() => {
  const theme = useAppTheme();

  return (
    <Screen>
      <Header />
      <NetworkLogger
        theme={{
          colors: {
            background: theme.colors.background,
            link: theme.colors.primary,
            card: theme.colors.surfaceVariant,
            text: theme.colors.onBackground,
            statusBad: theme.colors.error,
            secondary: theme.colors.secondary,
            onSecondary: theme.colors.onSecondary,
            muted: theme.colors.outline,
          },
        }}
      />
    </Screen>
  );
});
