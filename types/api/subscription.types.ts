import {IGeneric} from './auth.types';

export interface ISubscriptionResponse extends IGeneric {
  data: ISubscription[];
}

export interface ISubscription {
  _id: string;
  admin_id: string;
  months_duration: number;
  price: number;
  details: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserSubscriptionResponse extends IGeneric {
  data: IUserSubscription;
}

export interface IUserSubscription {
  _id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  expiry_date: string;
  payment_method: string;
  amount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateSubscription {
  source: string;
  plan_id: string;
  reference?: string;
}
