import { useHttpClient } from '@modules/core';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { default as Config } from 'react-native-config';
import type { User, ServerError, ApiRequest } from '@modules/core';
import { fakerUser, queryUser } from '@modules/domain-user';
import type { UseMutationOptions } from '@tanstack/react-query';

const useUpdateUserProfileApi = (
  options?: Omit<
    UseMutationOptions<User, ServerError, ApiRequest<FormData, number>>,
    'mutationFn'
  >,
) => {
  const httpClient = useHttpClient();
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<User, ServerError, ApiRequest<FormData, number>>({
    mutationFn: request =>
      Config.USE_FAKE_API === 'true'
        ? fakerUser.updateUserProfile(request)
        : queryUser.updateUserProfile(httpClient, request),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};

export default useUpdateUserProfileApi;
