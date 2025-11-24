import { MutationConfig } from '@app/lib/react-query';
import { getBoDeThiApi, luuDiemThiApi } from '@app/shared/api/thi-trac-nghiem.api';
import { BoDeThiRequest, LuuDiemRequest } from '@app/shared/types/thi-trac-nghiem.type';
import { useMutation } from '@tanstack/react-query';

export const useGetBoDeThi = (mutationConfig?: MutationConfig<typeof getBoDeThiApi>) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (payload: BoDeThiRequest) => getBoDeThiApi(payload),
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig
  });
};

export const useLuuDiemThi = (mutationConfig?: MutationConfig<typeof luuDiemThiApi>) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (payload: LuuDiemRequest) => luuDiemThiApi(payload),
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig
  });
};
