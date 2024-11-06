import {ApiResponse, create} from 'apisauce';
import {getAuthToken} from './profile.api';
import {BASE_URL} from '@env';
import {
  ICreateSubscription,
  ISubscriptionResponse,
  IUserSubscriptionResponse,
} from '@/types/api/subscription.types';
import {IGeneric} from '@/types/api/auth.types';

const createSubscriptionApi = async () => {
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
    subscriptionApi: ReturnType<typeof create>,
  ) => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> => {
  const subscriptionApi = await createSubscriptionApi();
  return apiFunction(subscriptionApi);
};

export const getSubscription = async () =>
  await apiCall<ISubscriptionResponse>(subscriptionApi =>
    subscriptionApi.get<ISubscriptionResponse>(
      '/customers/subscription/fetch-plans',
    ),
  );

export const createSubscription = async (data: ICreateSubscription) =>
  await apiCall<IGeneric>(subscriptionApi =>
    subscriptionApi.post<IGeneric>('/customers/subscription/create', data),
  );

export const userSubscriptionStatus = async () =>
  await apiCall<IUserSubscriptionResponse>(subscriptionApi =>
    subscriptionApi.get<IUserSubscriptionResponse>(
      '/customers/subscription/status',
    ),
  );

export const giftCardRedeem = async (code: string) =>
  await apiCall<IGeneric>(subscriptionApi =>
    subscriptionApi.get<IGeneric>(
      `/customers/giftcard/reedeem?gift_code=${code}`,
    ),
  );
