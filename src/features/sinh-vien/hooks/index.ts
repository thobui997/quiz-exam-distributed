import { MutationConfig } from '@app/lib/react-query';
import {
  getSinhVienListApi,
  createSinhVienBatchApi,
  updateSinhVienBatchApi,
  deleteSinhVienBatchApi
} from '@app/shared/api/sinh-vien.api';
import { SinhVienBatchRequest } from '@app/shared/types/sinh-vien.type';

import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query hook
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

// Mutation hooks
export const useCreateSinhVienBatch = (mutationConfig?: MutationConfig<typeof createSinhVienBatchApi>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (payload: SinhVienBatchRequest) => createSinhVienBatchApi(payload),
    onSuccess: (data, variables, ...args) => {
      // Get unique malop from listSinhVien
      const uniqueMaLop = [...new Set(variables.listSinhVien.map((sv) => sv.malop))];
      uniqueMaLop.forEach((malop) => {
        queryClient.invalidateQueries({
          queryKey: ['sinh-vien', malop]
        });
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

export const useUpdateSinhVienBatch = (mutationConfig?: MutationConfig<typeof updateSinhVienBatchApi>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (payload: SinhVienBatchRequest) => updateSinhVienBatchApi(payload),
    onSuccess: (data, variables, ...args) => {
      const uniqueMaLop = [...new Set(variables.listSinhVien.map((sv) => sv.malop))];
      uniqueMaLop.forEach((malop) => {
        queryClient.invalidateQueries({
          queryKey: ['sinh-vien', malop]
        });
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

export const useDeleteSinhVienBatch = (mutationConfig?: MutationConfig<typeof deleteSinhVienBatchApi>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (payload: SinhVienBatchRequest) => deleteSinhVienBatchApi(payload),
    onSuccess: (data, variables, ...args) => {
      const uniqueMaLop = [...new Set(variables.listSinhVien.map((sv) => sv.malop))];
      uniqueMaLop.forEach((malop) => {
        queryClient.invalidateQueries({
          queryKey: ['sinh-vien', malop]
        });
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};
