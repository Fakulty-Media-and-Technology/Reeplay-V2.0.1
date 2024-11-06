import {IGeneric} from './auth.types';

export interface ICreatePaymentResponse extends IGeneric {
  data: ICreatePayment;
}
export interface IAuthPaymentResponse extends IGeneric {
  data: {
    data: {
      _id: string;
      amount: number;
      createdAt: string;
      email: string;
      full_name: string;
      is_used: false;
      reference: string;
      status: string;
      updatedAt: string;
      user_id: string;
    };
    message: string;
    status: number;
  };
}

export interface ICreatePayment {
  user_id: string;
  full_name: string;
  email: string;
  amount: number;
  reference: string;
  status: string;
  is_used: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletDetails {
  _id: string;
  user_id: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface IWalletResponse extends IGeneric {
  data: WalletDetails[];
}

export interface InitPayment extends IGeneric {
  data: {
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  };
}

export interface IPaystackUserResponse extends IGeneric {
  data: IPaystackUser;
}

export interface IPaystackUser {
  authorizations: IPaystackUserAuthorizations[];
}

export interface IPaystackUserAuthorizations {
  authorization_code: string;
  last4: string;
  brand: string;
}

export interface IPaystackTxnResponse extends IGeneric {
  data: IPaystackTxn;
}

export interface IPaystackTxn {
  id: number;
  amount: number;
  authorizations: IPaystackUserAuthorizations;
}

export interface IPaystackRecurrent {
  email: string;
  amount: string;
  authorization_code: string;
}

export interface IPaystackRecurrentResponse extends IGeneric {
  data: IPaystackTxn;
}

export interface VotePayments {
  live_id: string;
  contestant_id: string;
  payment_id: string;
  pay_ref: string;
}
