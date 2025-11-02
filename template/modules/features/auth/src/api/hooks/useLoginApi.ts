import { useMutation } from '@tanstack/react-query';
import { default as Config } from 'react-native-config';
import type { ServerError, ApiRequest } from '@modules/core';
import type { LoginResponse, LoginBody } from '@modules/features-auth';
import { fakerAuth, queryAuth } from '@modules/features-auth';
import type { UseMutationOptions } from '@tanstack/react-query';

const useLoginApi = (
  options?: Omit<
    UseMutationOptions<LoginResponse, ServerError, ApiRequest<LoginBody>>,
    'mutationFn'
  >,
) =>
  useMutation<LoginResponse, ServerError, ApiRequest<LoginBody>>({
    mutationFn: request =>
      Config.USE_FAKE_API === 'true'
        ? fakerAuth.login(request)
        : queryAuth.login(request),
    ...(options ?? {}),
  });

export default useLoginApi;
