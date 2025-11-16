import { MutationConfig } from '@app/lib/react-query';
import {
  getGiaoVienListApi,
  createGiaoVienApi,
  updateGiaoVienApi,
  deleteGiaoVienApi
} from '@app/shared/api/giao-vien.api';
import { CreateGiaoVienRequest, UpdateGiaoVienRequest, GiaoVien } from '@app/shared/types/giao-vien.type';
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query hook
export const getGiaoVienListQueryOptions = (maCS: string) => {
  return queryOptions({
    queryKey: ['giao-vien', maCS],
    queryFn: () => getGiaoVienListApi(maCS),
    enabled: !!maCS
  });
};

export const useGiaoVienList = (maCS: string) => {
  return useQuery(getGiaoVienListQueryOptions(maCS));
};

// Create mutation
type CreateGiaoVienPayload = {
  maCS: string;
  data: CreateGiaoVienRequest;
};

export const useCreateGiaoVien = (
  mutationConfig?: MutationConfig<(payload: CreateGiaoVienPayload) => Promise<any>>
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: CreateGiaoVienPayload) => createGiaoVienApi(maCS, data),
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['giao-vien', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

// Update mutation
type UpdateGiaoVienPayload = {
  maCS: string;
  data: UpdateGiaoVienRequest;
};

export const useUpdateGiaoVien = (
  mutationConfig?: MutationConfig<(payload: UpdateGiaoVienPayload) => Promise<any>>
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: UpdateGiaoVienPayload) => updateGiaoVienApi(maCS, data),
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['giao-vien', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

// Delete mutation
type DeleteGiaoVienPayload = {
  maCS: string;
  giaoVien: GiaoVien;
};

export const useDeleteGiaoVien = (
  mutationConfig?: MutationConfig<(payload: DeleteGiaoVienPayload) => Promise<any>>
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, giaoVien }: DeleteGiaoVienPayload) => deleteGiaoVienApi(maCS, giaoVien),
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['giao-vien', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};
