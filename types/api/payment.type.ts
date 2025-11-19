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

// Removed Paystack specific types as migrating to Flutterwave

export interface FlutterwaveRedirectData {
  tx_ref: string;
  status: 'successful' | 'failed' | string;
  transaction_id?: string;
  flw_ref?: string;
  amount?: number;
  currency?: string;
  customer?: {
    email?: string;
    phone_number?: string;
    name?: string;
  };
  [key: string]: any;
}

export interface VotePayments {
  live_id: string;
  contestant_id: string;
  payment_id: string;
  pay_ref: string;
}
