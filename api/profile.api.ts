import {getData} from '@/Utils/useAsyncStorage';
import {IGeneric} from '@/types/api/auth.types';
import {IProfileResponse} from '@/types/api/profile.types';
import {BASE_URL} from '@env';
import {ApiResponse, create} from 'apisauce';

const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await getData('AUTH_TOKEN');
    return token ?? null;
  } catch (error) {
    console.error('Failed to fetch AUTH_TOKEN from AsyncStorage', error);
    return null;
  }
};

const createProfileApi = async () => {
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
    profileApi: ReturnType<typeof create>,
  ) => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> => {
  const profileApi = await createProfileApi();
  return apiFunction(profileApi);
};

export const getProfileDetails = async (token: string) =>
  await apiCall<IProfileResponse>(profileApi =>
    profileApi.get<IProfileResponse>(
      '/customers/profile/fetch',
      {},
      {
        headers: {
          'customer-auth': token,
        },
      },
    ),
  );

export const addinterests = async (data: {interest: string[]}) =>
  await apiCall<IGeneric>(profileApi =>
    profileApi.post('/customers/settings/interest/add', data),
  );

export const uploadProfile = async (data: FormData) =>
  await apiCall<IGeneric>(profileApi =>
    profileApi.post('/customers/media/upload-photo', data),
  );
