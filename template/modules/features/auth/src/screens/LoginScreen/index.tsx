import { Screen, ScrollContainer } from '@modules/components';
import * as React from 'react';
import Form from './Form';
import Header from './Header';
import styles from './styles';

export default React.memo(() => (
  <Screen>
    <ScrollContainer
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
    >
      <Header />
      <Form />
    </ScrollContainer>
  </Screen>
));
