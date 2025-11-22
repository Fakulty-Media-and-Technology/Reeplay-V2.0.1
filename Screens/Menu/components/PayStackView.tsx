import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppButton, AppScreen, AppText, AppView} from '@/components';
import colors from '@/configs/colors';
import AppModal from '@/components/AppModal';
import VerificationModal from '@/Screens/authentication/components/VerificationModal';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SubscriptionNavProps, SubscriptionRouteProps} from '@/types/typings';
import routes from '@/navigation/routes';
import LottieView from 'lottie-react-native';
import {useAppDispatch, useAppSelector} from '@/Hooks/reduxHook';
import {selectUser, setCredentials, setWalletInfo} from '@/store/slices/userSlice';
import {ISubscription} from '@/types/api/subscription.types';
import {PAYSTACK_PK} from '@env';
import {createSubscription} from '@/api/subscription.api';
import {
  handleAuthorizedPayment,
  handleCreatePayment,
  initPayment,
  shouldStore,
  walletBalance,
} from '@/api/payment.api';
import {getProfileDetails} from '@/api/profile.api';
import { Paystack } from 'react-native-paystack-webview';
import ToastNotification from '@/components/ToastNotifications';
import Size from '@/Utils/useResponsiveSize';
import { MenuNavigatorParams } from '@/navigation/AppStack';
import { IPaymentData } from '@/types/api/payment.type';


interface Props {
  setStage: React.Dispatch<React.SetStateAction<string>>;
  tab: string;
  selectedPaymentMethod: string | null;
  topUpAmount: string;
  currency: string;
  saveCard: boolean
  voteInfo?:{
    contestantId: string,
    voteInfoId: string,
  }
}

const PayStackView = ({
  setStage,
  tab,
  selectedPaymentMethod,
  topUpAmount,
  currency,
  saveCard,
  voteInfo
}: Props) => {
    const route = useRoute<SubscriptionRouteProps>();
    const liveId = route.params.metadata?.liveId
    const videoId = route.params.metadata?.videoId
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [paySuccessful, setPaySuccessful] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const {goBack} = useNavigation();
  const {email} = useAppSelector(selectUser);
  const [ref, setRef] = useState<string | null>(null);
  const {setParams} = useNavigation<MenuNavigatorParams>()

   async function getWallet() {
      const res = await walletBalance();
      if (res.ok && res.data) {
        dispatch(setWalletInfo(res.data.data));
      }
    }


  async function initPaymentApi() {
    try {
      setLoading(true);
      const query:IPaymentData = {
        amount: Number(topUpAmount),
        method: (selectedPaymentMethod && selectedPaymentMethod.includes('WALLET')) ? 'wallet' : 'paystack',
        currency,
        useCase:tab,
        ...(liveId && {liveId}),
        ...(videoId && {videoId}),
        ...(voteInfo && voteInfo)
      }
      const res = await initPayment(query);
      if(res.ok && res.data){
        const data = res.data.data;
        if(selectedPaymentMethod && selectedPaymentMethod.includes('WALLET') && res.data.message.toLowerCase().includes('successfully')){
          setIsShowModal(true);
          setPaySuccessful(true); 
          return;
        }
        if(!topUpAmount.includes('watch')) setRef(data.reference);
        if(selectedPaymentMethod && selectedPaymentMethod?.includes('VISA'))
        await shouldStore({paymentId:data.paymentId, shouldStore:saveCard})
      }else{
        ToastNotification('error', `${res.data?.message}`);
        if(res.data?.message.includes('insufficient')){
          setIsShowModal(true);
        }else{
          setStage('paymentSummary');
        }
      }
    } catch (error) {
      ToastNotification('error', `${error}`)
      setStage('paymentSummary');
    }finally{
      setLoading(false);
      getWallet();
    }
  }

  function reset() {
    goBack();
    setIsShowModal(false);
    setPaySuccessful(false);
    setStage(tab === 'vote' ? 'preview' :'plan');
  }

  useEffect(() => {
       if(selectedPaymentMethod && selectedPaymentMethod.includes('....')){
      handleAuthorizedPayment({
        amount:Number(topUpAmount),
        paymentDetailsId:''
      })
    }else{ 
      initPaymentApi();
    }
  }, []);


  return (
    <AppScreen containerStyle={{position: 'relative'}}>

      <View style={{flex: 1}}>
        {ref && (
          <Paystack
            paystackKey={PAYSTACK_PK}
            billingEmail={email}
            amount={topUpAmount}
            currency="NGN"
            channels={
             ( selectedPaymentMethod?.includes('VISA') ||
              selectedPaymentMethod?.includes('USE A NEW'))
                ? ['card']
                : selectedPaymentMethod?.includes('USSD')
                ? ['ussd', 'bank']
                : ['bank']
            }
            onCancel={e => {
              // handle response here
              console.log(e, 'cancelled payments');
              setStage('plan');
            }}
            onSuccess={res => {
              setIsShowModal(true);
              setPaySuccessful(true); 
            }}
            autoStart={!selectedPaymentMethod?.includes('....')}
            refNumber={ref}
          />
        )}
      </View>

      {/* {!paySuccessful && !loading && (
        <AppView className="absolute bottom-3 w-full">
          <AppButton
            bgColor={colors.RED}
            title="Pay"
            onPress={initPaymentApi}
            style={{width: '100%', borderRadius: 8}}
          />
        </AppView>
      )} */}

      <AppModal
        isModalVisible={isShowModal || loading}
        hideLoge={paySuccessful || loading}
        hideCloseBtn={loading}
        style={{
          height: paySuccessful ? 390 : 368,
          backgroundColor: loading && !paySuccessful ? 'transparent' : 'white',
        }}
        replaceDefaultContent={
          <>
            {loading && !paySuccessful && (
              <LottieView
                source={require('@/assets/icons/RPlay.json')}
                style={{
                  width: 240,
                  height: 240,
                }}
                autoPlay
                loop
              />
            )}
            {paySuccessful ? (
              <VerificationModal
                isPayment
                tab={tab}
                amount={Number(topUpAmount)}
              />
            ):
            <>
           {!loading && <View className='flex-1 w-full'>
              <Text className='mt-2.5 text-center font-MANROPE_700 text-base text-dark_grey'>Your payment was not successful due to low wallet balance. Please to continue topup your ReePlay wallet.</Text>

              <View className='mt-auto items-center'>
                <AppButton 
                  title='Top Up'
                  bgColor={colors.RED}
                  onPress={() => [setParams({tab:'topup', currency, metadata:undefined}), setStage('plan')]}
                  style={{
                  width: Size.calcHeight(152),
                  borderRadius: 5,
                  paddingVertical: 12,
                }}
                />
              </View>
            </View>}
            </>
            }
          </>
        }
        handleClose={() => loading ? console.log('loading') : reset()}
      />
    </AppScreen>
  );
};

export default PayStackView;
