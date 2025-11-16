import { MutationConfig } from '@app/lib/react-query';
import { createKhoaLopBatchApi, updateKhoaLopBatchApi, deleteKhoaLopBatchApi } from '@app/shared/api/khoa-lop.api';
import { KhoaLopRequest } from '@app/shared/types/khoa-lop.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateKhoaLopBatch = (mutationConfig?: MutationConfig<typeof createKhoaLopBatchApi>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (payload: KhoaLopRequest) => createKhoaLopBatchApi(payload),
    onSuccess: (data, variables, ...args) => {
      // Invalidate khoa list của cơ sở
      queryClient.invalidateQueries({
        queryKey: ['khoa', variables.macs]
      });
      // Invalidate tất cả lop queries của các khoa trong batch
      variables.listKhoa.forEach((khoa) => {
        queryClient.invalidateQueries({
          queryKey: ['lop', khoa.makh]
        });
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

export const useUpdateKhoaLopBatch = (mutationConfig?: MutationConfig<typeof updateKhoaLopBatchApi>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (payload: KhoaLopRequest) => updateKhoaLopBatchApi(payload),
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['khoa', variables.macs]
      });
      variables.listKhoa.forEach((khoa) => {
        queryClient.invalidateQueries({
          queryKey: ['lop', khoa.makh]
        });
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

export const useDeleteKhoaLopBatch = (mutationConfig?: MutationConfig<typeof deleteKhoaLopBatchApi>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (payload: KhoaLopRequest) => deleteKhoaLopBatchApi(payload),
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['khoa', variables.macs]
      });
      variables.listKhoa.forEach((khoa) => {
        queryClient.invalidateQueries({
          queryKey: ['lop', khoa.makh]
        });
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};
