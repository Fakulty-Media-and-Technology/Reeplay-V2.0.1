import {ApiResponse, create} from 'apisauce';
import {getAuthToken} from './profile.api';
import {BASE_URL} from '@env';
import {IGeneric} from '@/types/api/auth.types';

const createExtraApi = async () => {
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

// Helper function to handle API calls with dynamic token
const apiCall = async <T>(
  apiFunction: (
    extraxApi: ReturnType<typeof create>,
  ) => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> => {
  const extraxApi = await createExtraApi();
  return apiFunction(extraxApi);
};

export const suggestionApi = async (data: {message: string}) =>
  await apiCall<IGeneric>(extraApi =>
    extraApi.post<IGeneric>('/customers/suggestion/create', data),
  );
