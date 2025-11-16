import { MutationConfig } from '@app/lib/react-query';
import {
  getSinhVienListApi,
  createSinhVienBatchApi,
  updateSinhVienBatchApi,
  deleteSinhVienBatchApi
} from '@app/shared/api/sinh-vien.api';
import { SinhVien, SinhVienBatchRequest } from '@app/shared/types/sinh-vien.type';

import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getSinhVienListQueryOptions = (maLop: string) => {
  return queryOptions({
    queryKey: ['sinh-vien', maLop],
    queryFn: () => getSinhVienListApi(maLop),
    enabled: !!maLop
  });
};

export const useSinhVienList = (maLop: string) => {
  return useQuery(getSinhVienListQueryOptions(maLop));
};

type CreateSinhVienPayload = {
  maCS: string;
  data: SinhVien;
};

type UpdateSinhVienPayload = {
  maCS: string;
  data: SinhVien;
};

type DeleteSinhVienPayload = {
  maCS: string;
  sinhVien: SinhVien;
};

export const useCreateSinhVien = (
  mutationConfig?: MutationConfig<(payload: CreateSinhVienPayload) => Promise<any>>
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: CreateSinhVienPayload) => {
      const payload: SinhVienBatchRequest = {
        macs: maCS,
        listSinhVien: [data]
      };
      return createSinhVienBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['sinh-vien', variables.data.malop]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

export const useUpdateSinhVien = (
  mutationConfig?: MutationConfig<(payload: UpdateSinhVienPayload) => Promise<any>>
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: UpdateSinhVienPayload) => {
      const payload: SinhVienBatchRequest = {
        macs: maCS,
        listSinhVien: [data]
      };
      return updateSinhVienBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      // Invalidate query của lớp vừa được cập nhật
      queryClient.invalidateQueries({
        queryKey: ['sinh-vien', variables.data.malop]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

export const useDeleteSinhVien = (
  mutationConfig?: MutationConfig<(payload: DeleteSinhVienPayload) => Promise<any>>
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, sinhVien }: DeleteSinhVienPayload) => {
      const payload: SinhVienBatchRequest = {
        macs: maCS,
        listSinhVien: [sinhVien]
      };
      return deleteSinhVienBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['sinh-vien', variables.sinhVien.malop]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};
