import {ApiResponse, create} from 'apisauce';
import {getAuthToken} from './profile.api';
import {BASE_URL} from '@env';
import {
  IAuthPaymentResponse,
  ICreatePaymentResponse,
  IWalletResponse,
  InitPayment,
  VotePayments,
} from '@/types/api/payment.type';
import {IGeneric} from '@/types/api/auth.types';

const createPaymentApi = async () => {
  const token = await getAuthToken();
  return create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'customer-auth': token,
    },
  });
};

// Helper function to handle API calls with dynamic token
const apiCall = async <T>(
  apiFunction: (
    paymentApi: ReturnType<typeof create>,
  ) => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> => {
  const paymentApi = await createPaymentApi();
  return apiFunction(paymentApi);
};

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
  data: {amount_charge: number},
  token: string,
) =>
  await fetch(`${BASE_URL}/customers/payment/paystack/authorize-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'customer-auth': token,
    },
    body: JSON.stringify(data),
  });
// apiCall<IAuthPaymentResponse>(paymentApi =>
//   paymentApi.post<IAuthPaymentResponse>(
//     '/customers/payment/paystack/authorize-payment',
//     data,
//   ),
// );

export const walletBalance = async () =>
  await apiCall<IWalletResponse>(paymentApi =>
    paymentApi.get<IWalletResponse>('/customers/wallet/fetch'),
  );

export const votePayments = async (data: VotePayments) =>
  await apiCall<IGeneric>(baseApi =>
    baseApi.post('/customers/livestream/vote/create-vote', data),
  );

export const initPayment = async (data: {email: string; amount: number}) =>
  await apiCall<InitPayment>(baseApi =>
    baseApi.post<InitPayment>('customers/payment/paystack/start-payment', data),
  );
