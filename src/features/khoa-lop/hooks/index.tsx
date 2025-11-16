// Trong file hooks (giả định là @app/features/khoa-lop/hooks/index.ts)

import { MutationConfig } from '@app/lib/react-query';
import { createKhoaLopBatchApi, updateKhoaLopBatchApi, deleteKhoaLopBatchApi } from '@app/shared/api/khoa-lop.api';
import { KhoaLopRequest } from '@app/shared/types/khoa-lop.type';
import { Khoa } from '@app/shared/types/khoa.type';
import { Lop } from '@app/shared/types/lop.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type KhoaPayload = {
  maCS: string;
  data: Khoa;
};

// CREATE KHOA
export const useCreateKhoa = (mutationConfig?: MutationConfig<(payload: KhoaPayload) => Promise<any>>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: KhoaPayload) => {
      const payload: KhoaLopRequest = {
        macs: maCS,
        listKhoa: [data],
        listLop: []
      };
      return createKhoaLopBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['khoa', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

// UPDATE KHOA
export const useUpdateKhoa = (mutationConfig?: MutationConfig<(payload: KhoaPayload) => Promise<any>>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: KhoaPayload) => {
      const payload: KhoaLopRequest = {
        macs: maCS,
        listKhoa: [data],
        listLop: []
      };
      return updateKhoaLopBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['khoa', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

// DELETE KHOA
export const useDeleteKhoa = (mutationConfig?: MutationConfig<(payload: KhoaPayload) => Promise<any>>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: KhoaPayload) => {
      const payload: KhoaLopRequest = {
        macs: maCS,
        listKhoa: [data],
        listLop: []
      };
      return deleteKhoaLopBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['khoa', variables.maCS]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

type LopPayload = {
  maCS: string;
  data: Lop;
};

// CREATE LOP
export const useCreateLop = (mutationConfig?: MutationConfig<(payload: LopPayload) => Promise<any>>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: LopPayload) => {
      const payload: KhoaLopRequest = {
        macs: maCS,
        listKhoa: [],
        listLop: [data]
      };
      return createKhoaLopBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['lop', variables.data.makh]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

export const useUpdateLop = (mutationConfig?: MutationConfig<(payload: LopPayload) => Promise<any>>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: LopPayload) => {
      const payload: KhoaLopRequest = {
        macs: maCS,
        listKhoa: [],
        listLop: [data]
      };
      return updateKhoaLopBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['lop', variables.data.makh]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};

// DELETE LOP
export const useDeleteLop = (mutationConfig?: MutationConfig<(payload: LopPayload) => Promise<any>>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ maCS, data }: LopPayload) => {
      const payload: KhoaLopRequest = {
        macs: maCS,
        listKhoa: [],
        listLop: [data]
      };
      return deleteKhoaLopBatchApi(payload);
    },
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['lop', variables.data.makh]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig
  });
};
