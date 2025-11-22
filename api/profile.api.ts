import {getData, storeData} from '@/Utils/useAsyncStorage';
import {IGeneric} from '@/types/api/auth.types';
import {IProfileResponse, Notification} from '@/types/api/profile.types';
import {BASE_URL} from '@env';
import {ApiResponse, create} from 'apisauce';
import {refreshToken, validateToken} from './auth.api';

export const getAuthToken = async (isCheckValidity = false): Promise<string | null> => {
  try {
    let validToken = null;
    const token = await getData('AUTH_TOKEN');
    const ref_token = await getData('REFRESH_TOKEN');

    if(isCheckValidity){
        const refresh = await refreshToken(ref_token ? ref_token : '');
        if (refresh.ok && refresh.data) {
          validToken = refresh.data.data.accessToken;
          await storeData('AUTH_TOKEN', validToken);
        }
    }else{
      if (token) validToken = token;
    }


    return validToken ?? null;
  } catch (error) {
    console.error('Failed to fetch AUTH_TOKEN from AsyncStorage', error);
    return null;
  }
};

const createApiInstance = (token: string | null, baseURL?: string) => {
  return create({
    baseURL: baseURL ?? undefined,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'customer-auth': token,
    },
    timeout: 1200000,
  });
};

let retryCount = 0;

// Helper function to handle API calls with dynamic token
export const apiCall = async <T>(
  apiFunction: (
    instanceApi: ReturnType<typeof create>,
  ) => Promise<ApiResponse<T>>,
  baseURL?: string,
): Promise<ApiResponse<T>> => {
  let token = await getAuthToken();
  let instanceApi = createApiInstance(token, baseURL ?? BASE_URL);
  let response = await apiFunction(instanceApi);

  while (response.status === 401 && retryCount < 3) {
    retryCount++;
    const newToken = await getAuthToken(true);
    const newApi = createApiInstance(newToken);
    response = await apiFunction(newApi);
  }

  return response;
};

export const getProfileDetails = async () =>
  await apiCall<IProfileResponse>(profileApi =>
    profileApi.get<IProfileResponse>('/customers/profile/fetch'),
  );

export const updateProfileDetails = async (data: FormData, _id:string) =>
  await apiCall<IGeneric>(profileApi =>
    profileApi.put<IGeneric>(`/customers/shared/user-profile/update/${_id}`, data, {headers:{
      'Content-Type': 'multipart/form-data'
    }}),
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
