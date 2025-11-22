import {apiCall} from './profile.api';
import {
  ICreateSubscription,
  ISubscriptionResponse,
  IUserSubscriptionResponse,
} from '@/types/api/subscription.types';
import {IGeneric} from '@/types/api/auth.types';


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
