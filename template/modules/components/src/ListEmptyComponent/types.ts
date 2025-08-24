import type { ServerError } from '@modules/core';

export interface Props {
  error?: ServerError | null;
  isLoadingError?: boolean;
  data: string;
}
