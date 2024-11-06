import {IGeneric} from './auth.types';

export interface IProfileResponse extends IGeneric {
  data: IProfile;
}

export interface IProfile {
  profile: {
    _id: string;
    last_name: string;
    first_name: string;
    email: string;
    mobile: string;
    country_code: string;
    role: string;
    createdAt: string;
    pin?: string;
    settings_info: {
      _id: string;
      user_id: string;
      interest: string[];
      watchlist: [];
      video_quality: string;
      allow_notifications: boolean;
      new_services: boolean;
      upcoming_events: boolean;
      new_arrivals: boolean;
      live_channels: boolean;
    };
    paymentDetails: {
      authorization_code: string;
      brand: string;
      createdAt: string;
      exp_month: string;
      exp_year: string;
      last4: string;
      updatedAt: string;
    } | null;
  };
  photo_url: string;
}

export interface Notification {
  video_quality: string;
  allow_notifications: boolean;
  new_services: boolean;
  upcoming_events: boolean;
  new_arrivals: boolean;
  live_channels: boolean;
}
