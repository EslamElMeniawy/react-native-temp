import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Config from 'react-native-config';

import {RootState} from '../../store';
import {getCurrentLocale} from '../../core';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: Config.API_URL,
    prepareHeaders: (headers, {getState}) => {
      const token = (getState() as RootState).user.user?.apiToken;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json; charset=UTF-8');
      headers.set('Accept-Language', getCurrentLocale());
      return headers;
    },
  }),
  endpoints: () => ({}),
  reducerPath: 'api',
  //   tagTypes: ['Users'],
});
