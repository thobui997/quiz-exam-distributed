import { MutationConfig } from '@app/lib/react-query';
import {
  getGiaoVienDangKyListApi,
  createGiaoVienDangKyBatchApi,
  updateGiaoVienDangKyBatchApi,
  deleteGiaoVienDangKyBatchApi
} from '@app/shared/api/giao-vien-dang-ky.api';
import { GiaoVienDangKy, GiaoVienDangKyBatchRequest } from '@app/shared/types/giao-vien-dang-ky.type';
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getGiaoVienDangKyListQueryOptions = (maCS: string) => {
  return queryOptions({
    queryKey: ['giao-vien-dang-ky', maCS],
    queryFn: () => getGiaoVienDangKyListApi(maCS),
    enabled: !!maCS
  });
};

export const useGiaoVienDangKyList = (maCS: string) => {
  return useQuery(getGiaoVienDangKyListQueryOptions(maCS));
};

type CreateGiaoVienDangKyPayload = {
  maCS: string;
  data: GiaoVienDangKy;
};

export const useCreateGiaoVienDangKy = (
  mutationConfig?: MutationConfig<(payload: CreateGiaoVienDangKyPayload) => Promise<any>>
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: CreateGiaoVienDangKyPayload) => {
      const payload: GiaoVienDangKyBatchRequest = {
        macs: maCS,
        listGiaovienDangky: [data]
      };
      return createGiaoVienDangKyBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['giao-vien-dang-ky', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

type UpdateGiaoVienDangKyPayload = {
  maCS: string;
  data: GiaoVienDangKy;
};

export const useUpdateGiaoVienDangKy = (
  mutationConfig?: MutationConfig<(payload: UpdateGiaoVienDangKyPayload) => Promise<any>>
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: UpdateGiaoVienDangKyPayload) => {
      const payload: GiaoVienDangKyBatchRequest = {
        macs: maCS,
        listGiaovienDangky: [data]
      };
      return updateGiaoVienDangKyBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['giao-vien-dang-ky', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

type DeleteGiaoVienDangKyPayload = {
  maCS: string;
  giaoVienDangKy: GiaoVienDangKy;
};

export const useDeleteGiaoVienDangKy = (
  mutationConfig?: MutationConfig<(payload: DeleteGiaoVienDangKyPayload) => Promise<any>>
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, giaoVienDangKy }: DeleteGiaoVienDangKyPayload) => {
      const payload: GiaoVienDangKyBatchRequest = {
        macs: maCS,
        listGiaovienDangky: [giaoVienDangKy]
      };
      return deleteGiaoVienDangKyBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['giao-vien-dang-ky', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};
