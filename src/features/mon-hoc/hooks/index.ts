import { MutationConfig } from '@app/lib/react-query';
import { createMonHocApi, deleteMonHocApi, getMonHocListApi, updateMonHocApi } from '@app/shared/api/monhoc.api';
import { CreateMonHocRequest } from '@app/shared/types';
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getMonHocListQueryOptions = () => {
  return queryOptions({
    queryKey: ['mon-hoc'],
    queryFn: () => getMonHocListApi()
  });
};

export const useMonHocList = () => {
  return useQuery(getMonHocListQueryOptions());
};

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

export const useUpdateMonHoc = (mutationConfig?: MutationConfig<(payload: CreateMonHocRequest) => Promise<any>>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (mh: CreateMonHocRequest) => updateMonHocApi([mh]),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['mon-hoc']
      });
      onSuccess?.(...args);
    },
    ...restConfig
  });
};

export const useDeleteMonHoc = (mutationConfig?: MutationConfig<(payload: CreateMonHocRequest) => Promise<any>>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (mh: CreateMonHocRequest) => deleteMonHocApi([mh]),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['mon-hoc']
      });
      onSuccess?.(...args);
    },
    ...restConfig
  });
};
