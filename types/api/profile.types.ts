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
  };
  photo_url: string;
}
