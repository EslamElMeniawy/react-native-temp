import { Screen } from '@modules/components';
import * as React from 'react';
import Header from './Header';
import NotificationsList from './NotificationsList';

export default React.memo(() => (
  <Screen>
    <Header />
    <NotificationsList />
  </Screen>
));
