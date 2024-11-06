import {
  ICreatePIN,
  IGeneric,
  ILoginData,
  ILoginDataResponse,
  IResetPasswordData,
  ISignUpData,
  ISignUpDataResponse,
  IValideTokenResponse,
  IVerifyAcc,
} from '@/types/api/auth.types';
import {BASE_URL} from '@env';
import {ApiResponse, create} from 'apisauce';
import {getAuthToken} from './profile.api';

const createAuthApi = async () => {
  const token = await getAuthToken();
  return create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'customer-auth': token,
    },
  });
};

const apiCall = async <T>(
  apiFunction: (authApi: ReturnType<typeof create>) => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> => {
  const authApi = await createAuthApi();
  return apiFunction(authApi);
};

const baseApi = create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
  timeoutErrorMessage: 'Request Timed Out',
});

export const handleSignUpAPI = async (data: ISignUpData) =>
  await baseApi.post<ISignUpDataResponse>(`/customers/signup`, data);

export const handleLoginAPI = async (data: ILoginData) =>
  await baseApi.post<ILoginDataResponse>(`/customers/general-signin`, data);

export const verifyAccount = async (data: IVerifyAcc) =>
  await baseApi.post<ILoginDataResponse>(
    `/customers/signup/verifyaccount`,
    data,
  );

export const resendToken = async (data: {email: string}) =>
  await baseApi.post<IGeneric>(`/customers/pass-reset/get-token`, data);

export const resendVerificationToken = async (data: {
  email: string;
  token: string;
}) =>
  await baseApi.get<IGeneric>(
    `/customers/verification/get-token?email=${data.email}`,
    data,
  );

export const resetPassword = async (data: IResetPasswordData) =>
  await baseApi.post<IGeneric>(`/customers/pass-reset/change-pass`, data);

export const handleCreatePIN = async (data: ICreatePIN) =>
  await apiCall<IGeneric>(authApi =>
    authApi.post<IGeneric>(`/customers/signup/createpin`, data),
  );

export const validateToken = async (token: string) =>
  await baseApi.get<IValideTokenResponse>(
    `/customers/general/validate-token?token=${token}`,
  );

export const validateReefreshToken = async (token: string) =>
  await baseApi.get<IValideTokenResponse>(
    `/customers/general/validate-reftoken?token=${token}`,
  );

export const refreshToken = async (token: string) =>
  await baseApi.get<IValideTokenResponse>(
    `/customers/general/renew-accesstoken?ref_token=${token}`,
  );
