import {IGeneric} from './auth.types';

export interface LiveEvents {
  _id: string;
  title: string;
  sub_title: string;
  vid_class: string;
  pg: string;
  description: string;
  location: string;
  type: string;
  photo_url: string;
  active: boolean;
  start: number;
  expiry: number;
  expired: boolean;
  preview_video: {
    bucket: string;
    key: string;
  };
}

export interface LiveEventsResponse extends IGeneric {
  data: LiveEvents[];
}

export interface Contestants {
  _id: string;
  live_id: string;
  names: string;
  occupation: string;
  bio: string;
  contact: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
  photo_url: string;
}

export interface VoteContestantsResponse extends IGeneric {
  data: Contestants[];
}

export interface VoteInfo {
  _id: string;
  live_id: string;
  client_id: string;
  price: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VoteResponse extends IGeneric {
  data: VoteInfo;
}

export interface VODStream {
  bucket: string;
  key: string;
}

export interface VODStreamResponse extends IGeneric {
  data: {
    video_content: string;
  };
}

export interface LiveStreamWatch extends IGeneric {
  data: {
    url: string;
  };
}
