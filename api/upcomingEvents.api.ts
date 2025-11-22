import { IGeneric, IPagination } from '@/types/api/auth.types';
import {
  IReminderStatusResponse,
  IUpcomingEventsResponse,
} from '@/types/api/upcomingEvents.types';
import { apiCall } from './profile.api';


export const getUpcomingEvents = async (data: IPagination) =>
  await apiCall<IUpcomingEventsResponse>(upcomingEvent =>
    upcomingEvent.get<IUpcomingEventsResponse>(
      `customers/upcoming/events/fetch?page=${data.page}&limit=${data.limit}`,
    ),
  );

export const getReminderStatus = async (eventID: string, type:'vod'|'live') =>
  await apiCall<IReminderStatusResponse>(upcomingEvent =>
    upcomingEvent.get<IReminderStatusResponse>(
      `customers/upcoming/events/is-subscribed/${eventID}/${type}`,
    ),
  );

export const subscribeReminderStatus = async (eventID: string, type:'vod'|'live') =>
  await apiCall<IGeneric>(upcomingEvent =>
    upcomingEvent.put<IGeneric>(
      `customers/upcoming/events/subscribe/${eventID}/${type}`,
    ),
  );

export const unsubscribeReminderStatus = async (eventID: string, type:'vod'|'live') =>
  await apiCall<IGeneric>(upcomingEvent =>
    upcomingEvent.put<IGeneric>(
      `customers/upcoming/events/unsubscribe/${eventID}/${type}`,
    ),
  );
