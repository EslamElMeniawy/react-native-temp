import { useHttpClient } from '@modules/core';
import { useQuery } from '@tanstack/react-query';
import { default as Config } from 'react-native-config';
import type { User, ServerError } from '@modules/core';
import { fakerUser, queryUser } from '@modules/domain-user';
import type { UseQueryOptions } from '@tanstack/react-query';

const useGetUserDetailsApi = (
  options?: Omit<UseQueryOptions<User, ServerError>, 'queryFn' | 'queryKey'>,
) => {
  const httpClient = useHttpClient();

  return useQuery<User, ServerError>({
    queryFn: () =>
      Config.USE_FAKE_API === 'true'
        ? fakerUser.getUserDetails()
        : queryUser.getUserDetails(httpClient),
    queryKey: ['user', httpClient],
    ...(options ?? {}),
  });
};

export default useGetUserDetailsApi;
