import { MutationConfig } from '@app/lib/react-query';
import { createMonHocApi } from '@app/shared/api/monhoc.api';
import { CreateMonHocRequest } from '@app/shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateMonHoc = (mutationConfig?: MutationConfig<typeof createMonHocApi>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (payload: CreateMonHocRequest[]) => createMonHocApi(payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['mon-hoc']
      });
      onSuccess?.(...args);
    },
    ...restConfig
  });
};
