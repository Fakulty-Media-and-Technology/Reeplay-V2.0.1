import {apiCall} from './profile.api';
import {BASE_URL} from '@env';
import {
  IAuthPaymentResponse,
  ICreatePaymentResponse,
  IPaymentCardDetailsResponse,
  IPaymentData,
  ITransactionHistoryResponse,
  IWalletResponse,
  InitPayment,
  VotePayments,
} from '@/types/api/payment.type';
import {IGeneric, IPagination} from '@/types/api/auth.types';

export const handleCreatePayment = async (data: {
  reference: string;
  save_card: boolean;
}) =>
  await apiCall<ICreatePaymentResponse>(paymentApi =>
    paymentApi.post<ICreatePaymentResponse>(
      '/customers/payment/paystack/create-payment',
      data,
    ),
  );

export const handleAuthorizedPayment = async (
  data: {amount: number, paymentDetailsId:string},
) =>
await apiCall<IAuthPaymentResponse>(paymentApi =>
  paymentApi.post<IAuthPaymentResponse>(
    '/customers/shared/authorize-payment',
    data,
  ),
);

export const walletBalance = async () =>
  await apiCall<IWalletResponse>(paymentApi =>
    paymentApi.get<IWalletResponse>('/customers/shared/wallet'),
  );

export const shouldStore = async ({paymentId, shouldStore}:{paymentId:string, shouldStore:boolean}) =>
  await apiCall<IWalletResponse>(paymentApi =>
    paymentApi.get<IWalletResponse>(`/customers/shared/should-store/${paymentId}?shouldStore=${shouldStore}`),
  );

export const votePayments = async (data: VotePayments) =>
  await apiCall<IGeneric>(baseApi =>
    baseApi.post('/customers/livestream/vote/create-vote', data),
  );

export const initPayment = async (data: IPaymentData) =>
  await apiCall<InitPayment>(baseApi =>
    baseApi.post<InitPayment>('/customers/shared/initiate-payment', data),
  );

export const fetchStoredPaymentDetails = async () =>
  await apiCall<IPaymentCardDetailsResponse>(baseApi =>
    baseApi.get<IPaymentCardDetailsResponse>('/customers/shared/payment-details'),
  );

export const giftCardRedeem = async (code:string) =>
  await apiCall<IGeneric>(baseApi =>
    baseApi.get<IGeneric>(`/customers/giftcard/redeem?gift_code=${code}`),
  );

export const transactionHistory = async ({page,limit}:IPagination) =>
  await apiCall<ITransactionHistoryResponse>(baseApi =>
    baseApi.get<ITransactionHistoryResponse>(`/customers/shared/payment-history?page=${page}&limit=${limit}`),
  );
