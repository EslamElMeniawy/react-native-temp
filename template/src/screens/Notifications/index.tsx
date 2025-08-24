import * as React from 'react';
import { Screen } from '@modules/components';
import { Header, NotificationsList } from './components';

export default React.memo(() => (
  <Screen>
    <Header />
    <NotificationsList />
  </Screen>
));
