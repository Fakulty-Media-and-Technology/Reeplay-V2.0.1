import {getData, storeData} from '@/Utils/useAsyncStorage';
import {IGeneric} from '@/types/api/auth.types';
import {IProfileResponse, Notification} from '@/types/api/profile.types';
import {BASE_URL} from '@env';
import {ApiResponse, create} from 'apisauce';
import {refreshToken, validateToken} from './auth.api';

export const getAuthToken = async (): Promise<string | null> => {
  try {
    let validToken = null;
    const token = await getData('AUTH_TOKEN');
    const ref_token = await getData('REFRESH_TOKEN');

    const res = await validateToken(token ? token : '');
    if (res.ok && res.data?.data.valid) {
      validToken = token;
    } else {
      const refresh = await refreshToken(ref_token ? ref_token : '');
      if (refresh.ok && refresh.data) {
        validToken = refresh.data.data.accessToken;
        await storeData('AUTH_TOKEN', validToken);
      }
    }

    return validToken ?? null;
  } catch (error) {
    console.error('Failed to fetch AUTH_TOKEN from AsyncStorage', error);
    return null;
  }
};

const createProfileApi = async () => {
  const token = await getAuthToken();
  console.log(token);
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

export const getProfileDetails = async () =>
  await apiCall<IProfileResponse>(profileApi =>
    profileApi.get<IProfileResponse>('/customers/profile/fetch'),
  );

export const updateProfileDetails = async (data: any) =>
  await apiCall<IGeneric>(profileApi =>
    profileApi.put<IGeneric>('/customers/profile/edit', data),
  );

export const addinterests = async (data: {interest: string[]}) =>
  await apiCall<IGeneric>(profileApi =>
    profileApi.post('/customers/settings/interest/add', data),
  );

export const setNotifications = async (data: Notification) =>
  await apiCall<IGeneric>(profileApi =>
    profileApi.put('/customers/settings/notification-vidquality', data),
  );

export const uploadProfile = async (data: FormData) =>
  await apiCall<IGeneric>(profileApi =>
    profileApi.post('/customers/media/upload-photo', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
