import {apiCall} from './profile.api';
import {
  LiveEventsResponse,
  LiveStreamWatch,
  VODStream,
  VODStreamResponse,
  VoteContestantsResponse,
  VoteResponse,
} from '@/types/api/live.types';

export const getAllLiveEvents = async () =>
  await apiCall<LiveEventsResponse>(liveApi =>
    liveApi.get<LiveEventsResponse>('/customers/live/events/fetch/all'),
  );

export const getVoteContestants = async (id: string) =>
  await apiCall<VoteContestantsResponse>(liveApi =>
    liveApi.get<VoteContestantsResponse>(
      `/customers/livestream/vote/fetch-contestants?live_id=${id}`,
    ),
  );

export const getVoteInfo = async (id: string) =>
  await apiCall<VoteResponse>(liveApi =>
    liveApi.get<VoteResponse>(
      `/customers/livestream/vote/fetch-info?live_id=${id}`,
    ),
  );

export const getSponsoredLiveEvents = async () =>
  await apiCall<LiveEventsResponse>(liveApi =>
    liveApi.get<LiveEventsResponse>(`/customers/live/events/fetch/sponsored`),
  );

export const getVOD_Stream = async (data: VODStream) =>
  await apiCall<VODStreamResponse>(baseApi =>
    baseApi.post<VODStreamResponse>('/customers/media/vod-streaming', data),
  );

export const getLivestreamWatch = async (id: string) =>
  await apiCall<LiveStreamWatch>(baseApi =>
    baseApi.get<LiveStreamWatch>(`/customers/live/event/stream/${id}`),
  );

export const getChannelsPop = async () =>
  await apiCall<LiveEventsResponse>(baseApi =>
    baseApi.get<LiveEventsResponse>(
      `/customers/live/events/fetch/pop/channels`,
    ),
  );

export const getChannels = async () =>
  await apiCall<LiveEventsResponse>(baseApi =>
    baseApi.get<LiveEventsResponse>(`/customers/live/events/fetch/channels`),
  );

export const getEventsPop = async () =>
  await apiCall<LiveEventsResponse>(baseApi =>
    baseApi.get<LiveEventsResponse>(`/customers/live/events/fetch/pop/events`),
  );

export const getLiveEvents = async () =>
  await apiCall<LiveEventsResponse>(baseApi =>
    baseApi.get<LiveEventsResponse>(`/customers/live/events/fetch/events`),
  );

export const getTVShowsPop = async () =>
  await apiCall<LiveEventsResponse>(baseApi =>
    baseApi.get<LiveEventsResponse>(`/customers/live/events/fetch/pop/tvshows`),
  );

export const getTVShowsEvents = async () =>
  await apiCall<LiveEventsResponse>(baseApi =>
    baseApi.get<LiveEventsResponse>(`/customers/live/events/fetch/tvshows`),
  );

export const getSportPop = async () =>
  await apiCall<LiveEventsResponse>(baseApi =>
    baseApi.get<LiveEventsResponse>(`/customers/live/events/fetch/pop/sports`),
  );

export const getSportEvents = async () =>
  await apiCall<LiveEventsResponse>(baseApi =>
    baseApi.get<LiveEventsResponse>(`/customers/live/events/fetch/sports`),
  );

export const getPodcastPop = async () =>
  await apiCall<LiveEventsResponse>(baseApi =>
    baseApi.get<LiveEventsResponse>(
      `/customers/live/events/fetch/pop/podcasts`,
    ),
  );

export const getPodcastEvents = async () =>
  await apiCall<LiveEventsResponse>(baseApi =>
    baseApi.get<LiveEventsResponse>(`/customers/live/events/fetch/podcasts`),
  );
