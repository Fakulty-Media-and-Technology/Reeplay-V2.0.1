import {IGeneric} from './auth.types';

export interface IUpcomingEventsResponse extends IGeneric {
  data: IUpcomingEvents[];
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
  portrait_photo: {
    Bucket: string;
    Key: string;
    ContentType: string;
  };
  landscape_photo: {
    Bucket: string;
    Key: string;
    ContentType: string;
  };
  active: true;
  createdAt: string;
  updatedAt: string;
}
