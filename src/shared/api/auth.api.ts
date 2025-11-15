import { httpClient } from '@app/lib/http-client';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@app/shared/types/auth.type';

export const loginApi = async (payload: LoginRequest): Promise<LoginResponse> => {
  return httpClient.post('/api/v1/login', payload);
};

export const registerApi = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  return httpClient.post('/api/v1/register', payload);
};
