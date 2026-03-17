import { api } from './index';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export async function signIn(data: SignInRequest): Promise<SignInResponse> {
  const res = await api.post<SignInResponse>('/api/sign-in', data, {
    withCredentials: true,
  });
  return res.data;
}
