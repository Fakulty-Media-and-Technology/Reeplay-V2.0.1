import { IGeneric } from './auth.types';
import { ILiveContent, IVODContent } from './content.types';

export interface IUpcomingEventsResponse extends IGeneric {
  data: {
    vods: IVODContent[];
    lives: ILiveContent[]
  };
}
export interface IReminderStatusResponse extends IGeneric {
  data: {
    user_subscribed: boolean;
  };
}

export interface IUpcomingEvents {
  _id: string;
  title: string;
  type: string;
  details: string;
  reminder: [];
  release_date: string;
  portrait_photo: string;
  landscape_photo: string;
  active: true;
  createdAt: string;
  updatedAt: string;
  trailer: {
    _id: string;
    key: string;
    bucket: string;
  };
}
