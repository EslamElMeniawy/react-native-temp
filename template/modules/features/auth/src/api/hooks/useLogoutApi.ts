import { useHttpClient } from '@modules/core';
import { useMutation } from '@tanstack/react-query';
import { default as Config } from 'react-native-config';
import type { ServerError } from '@modules/core';
import type { LogoutResponse } from '@modules/features-auth';
import { fakerAuth, queryAuth } from '@modules/features-auth';
import type { UseMutationOptions } from '@tanstack/react-query';

const useLogoutApi = (
  options?: Omit<UseMutationOptions<LogoutResponse, ServerError>, 'mutationFn'>,
) => {
  const httpClient = useHttpClient();

  return useMutation<LogoutResponse, ServerError>({
    mutationFn: () =>
      Config.USE_FAKE_API === 'true'
        ? fakerAuth.logout()
        : queryAuth.logout(httpClient),
    ...(options ?? {}),
  });
};

export default useLogoutApi;
