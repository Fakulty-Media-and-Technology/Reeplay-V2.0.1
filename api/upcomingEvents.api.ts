import {getData} from '@/Utils/useAsyncStorage';
import {IGeneric} from '@/types/api/auth.types';
import {
  IReminderStatusResponse,
  IUpcomingEventsResponse,
} from '@/types/api/upcomingEvents.types';
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

const upcomingEventAPI = async () => {
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
    upcomingEventApi: ReturnType<typeof create>,
  ) => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> => {
  const upcomingEventApi = await upcomingEventAPI();
  return apiFunction(upcomingEventApi);
};

export const getUpcomingEvents = async () =>
  await apiCall<IUpcomingEventsResponse>(upcomingEvent =>
    upcomingEvent.get<IUpcomingEventsResponse>(
      'customers/upcoming/events/fetch',
    ),
  );

export const getReminderStatus = async (eventID: string) =>
  await apiCall<IReminderStatusResponse>(upcomingEvent =>
    upcomingEvent.get<IReminderStatusResponse>(
      `customers/upcoming/events/is-subscribed/${eventID}`,
    ),
  );

export const subscribeReminderStatus = async (eventID: string) =>
  await apiCall<IGeneric>(upcomingEvent =>
    upcomingEvent.put<IGeneric>(
      `customers/upcoming/events/subscribe/${eventID}`,
    ),
  );

export const unsubscribeReminderStatus = async (eventID: string) =>
  await apiCall<IGeneric>(upcomingEvent =>
    upcomingEvent.put<IGeneric>(
      `customers/upcoming/events/unsubscribe/${eventID}`,
    ),
  );
