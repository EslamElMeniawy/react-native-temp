import {useQueryClient, useMutation} from '@tanstack/react-query';
import {default as Config} from 'react-native-config';
import {fakerUser, queryUser} from '@src/core';
import type {User, ServerError, ApiRequest} from '@src/core';
import type {UseMutationOptions} from '@tanstack/react-query';

const useUpdateUserProfileApi = (
  options?: UseMutationOptions<User, ServerError, ApiRequest<FormData, number>>,
) => {
  const queryClient = useQueryClient();
  const {mutationFn, onSuccess, ...restOptions} = options ?? {};

  return useMutation<User, ServerError, ApiRequest<FormData, number>>({
    mutationFn: mutationFn
      ? mutationFn
      : request =>
          Config.USE_FAKE_API === 'true'
            ? fakerUser.updateUserProfile(request)
            : queryUser.updateUserProfile(request),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({queryKey: ['user']});
      onSuccess?.(data, variables, context);
    },
    ...restOptions,
  });
};

export default useUpdateUserProfileApi;
