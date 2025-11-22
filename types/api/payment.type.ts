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
    NGNBalance: number;
  USDBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface IWalletResponse extends IGeneric {
  data: WalletDetails;
}

export interface InitPayment extends IGeneric {
  data: {
      authorization_url: string;
      access_code: string;
      reference: string;
      paymentId:string
  };
}

export interface IPaymentData{
  amount:number;
  currency:string;
  useCase:string;
  method: 'wallet'|'paystack'
  liveId?:string;
  videoId?:string;
  contestantId?:string;
  voteInfoId?:string;
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

export interface IPaymentCardDetailsResponse extends IGeneric{
  data: IPaymentCardDetails[]
}

export interface IPaymentCardDetails{
  paymentId:string;
  authorization_code: string;
  last4: string;
  brand: string;
  reusable:boolean
}

export interface ITransactionHistoryResponse extends IGeneric{
  data: ITransactionHistory[]
}

export interface ITransactionHistory{
  _id: string;
  liveId: string;
  currency: string;
  amount: number;
  fullName: string;
  email: string;
  status: string;
  method: string;
  useCase: string;
  storeDetails: boolean;
  createdAt: string;
  updatedAt: string;
  liveDetails?: LiveDetails;
  videoDetails?: VideoDetails;
  votePaymentDetails?: VotePaymentDetails;
  message?:string
}

interface VotePaymentDetails {
  _id: string;
  liveId: string;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  contestantName: string;
}

interface VideoDetails {
  _id: string;
  title: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface LiveDetails {
  _id: string;
  title: string;
  location: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  voteInfo?: VoteInfo;
}

interface VoteInfo {
  _id: string;
  price: number;
  currency: string;
}
