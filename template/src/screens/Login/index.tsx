import * as React from 'react';
import { Screen, ScrollContainer } from '@modules/components';
import { Header, Form } from './components';
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
