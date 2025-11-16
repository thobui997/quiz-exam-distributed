import { MutationConfig } from '@app/lib/react-query';
import { getBoDeListApi, createBoDeApi, updateBoDeApi, deleteBoDeApi } from '@app/shared/api/bo-de.api';
import { CreateBoDeRequest, UpdateBoDeRequest, BoDe } from '@app/shared/types/bo-de.type';
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getBoDeListQueryOptions = (maCS: string) => {
  return queryOptions({
    queryKey: ['bo-de', maCS],
    queryFn: () => getBoDeListApi(maCS),
    enabled: !!maCS
  });
};

export const useBoDeList = (maCS: string) => {
  return useQuery(getBoDeListQueryOptions(maCS));
};

type CreateBoDePayload = {
  maCS: string;
  data: CreateBoDeRequest;
};

export const useCreateBoDe = (mutationConfig?: MutationConfig<(payload: CreateBoDePayload) => Promise<any>>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: CreateBoDePayload) => createBoDeApi(maCS, data),
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['bo-de', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

type UpdateBoDePayload = {
  maCS: string;
  data: UpdateBoDeRequest;
};

export const useUpdateBoDe = (mutationConfig?: MutationConfig<(payload: UpdateBoDePayload) => Promise<any>>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: UpdateBoDePayload) => updateBoDeApi(maCS, data),
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['bo-de', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

type DeleteBoDePayload = {
  maCS: string;
  boDe: BoDe;
};

export const useDeleteBoDe = (mutationConfig?: MutationConfig<(payload: DeleteBoDePayload) => Promise<any>>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, boDe }: DeleteBoDePayload) => deleteBoDeApi(maCS, boDe),
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['bo-de', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};
