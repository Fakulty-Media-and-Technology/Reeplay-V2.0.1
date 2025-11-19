import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppButton, AppScreen, AppText, AppView} from '@/components';
import colors from '@/configs/colors';
import AppModal from '@/components/AppModal';
import VerificationModal from '@/Screens/authentication/components/VerificationModal';
import {useNavigation} from '@react-navigation/native';
import {SubscriptionNavProps, VoteScreenNavProps} from '@/types/typings';
import routes from '@/navigation/routes';
import LottieView from 'lottie-react-native';
import Orientation from 'react-native-orientation-locker';
import {PayWithFlutterwave} from 'flutterwave-react-native';
import {FLUTTERWAVE_PUBLIC_KEY} from '@env';
import {selectUser, setCredentials} from '@/store/slices/userSlice';
import {useAppDispatch, useAppSelector} from '@/Hooks/reduxHook';
import {
  handleAuthorizedPayment,
  handleCreatePayment,
  initPayment,
  votePayments,
} from '@/api/payment.api';
import {getAuthToken, getProfileDetails} from '@/api/profile.api';

interface Props {
  setStage: React.Dispatch<React.SetStateAction<string>>;
  selectedPaymentMethod: string | null;
  tab: string;
  amount: number;
  contestant_id: string;
  live_id: string;
}

const PayStackView = ({
  setStage,
  selectedPaymentMethod,
  contestant_id,
  live_id,
  amount,
  tab,
}: Props) => {
  const {email} = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [paySuccessful, setPaySuccessful] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const {goBack} = useNavigation();
  const [save_card, setSaveCard] = useState<boolean>(false);
  // Removed Paystack ref as paystackProps no longer available
  const [ref, setRef] = useState<string | null>(null);

  async function userProfile() {
    const res = await getProfileDetails();
    if (res.ok && res.data) {
      dispatch(setCredentials(res.data.data));
    }
  }

  async function handleAuthPayment() {
    console.log('first.......');
    const token = await getAuthToken();
    if (!token) return;
    // try {
    setLoading(true);
    const response = await handleAuthorizedPayment({amount_charge: 100}, token);
    const res = await response.json();

    console.log(res.data);
    console.log(res);
    console.log('herrrrre');
    if (res.ok && res.data && res.data.data.status === 'success') {
      // setPaySuccessful(true);
      const data = res.data.data;
      const voteRes = await votePayments({
        contestant_id,
        live_id,
        pay_ref: data.reference,
        payment_id: data._id,
      });

      if (voteRes.ok && voteRes.data) {
        await userProfile();

        setPaySuccessful(true);
        // setIsSuccess(true);
        setIsShowModal(true);
        goBack();
        setStage('preview');
        setLoading(false);
      } else {
        Alert.alert('Unable to update vote');
        setLoading(false);
      }
    } else {
      setLoading(false);
      Alert.alert('Payment request failed!');
      setStage('preview');
    }
    // } catch (error) {
    // console.log(error);
    // } finally {
    // }
  }

  async function initPaymentApi() {
    if (!selectedPaymentMethod?.includes('....')) {
      const res = await initPayment({
        email,
        amount,
      });
      if (res.ok && res.data) {
        setRef(res.data.data.data.reference);
      }
    } else {
      handleAuthPayment();
    }
  }

  async function createPayment(reference: string, card?: boolean) {
    if (!selectedPaymentMethod) return;
    try {
      setLoading(true);

      const res = await handleCreatePayment({
        reference,
        save_card: card ? card : save_card,
      });

      console.log(res, reference);
      if (res.ok && res.data) {
        const voteRes = await votePayments({
          contestant_id,
          live_id,
          pay_ref: reference,
          payment_id: res.data.data._id,
        });

        console.log(voteRes);

        if (voteRes.ok && voteRes.data) {
          await userProfile();

          setPaySuccessful(true);
          // setIsSuccess(true);
          setIsShowModal(true);
          goBack();
          setStage('preview');
        } else {
          Alert.alert('Unable to update vote');
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setIsShowModal(false);
    setPaySuccessful(false);
    if (tab === 'vote') {
      goBack();
      Orientation.lockToLandscapeLeft();
    } else {
      setStage('preview');
    }
    // goBack();
  }

  useEffect(() => {
    initPaymentApi();
  }, []);

  console.log(FLUTTERWAVE_PUBLIC_KEY, 'ref.........', ref, paySuccessful);

  return (
    <AppScreen containerStyle={{position: 'relative'}}>
      <AppText className="mt-[80%] font-MANROPE_600 text-[40px] text-white text-center">
        FLUTTERWAVE
      </AppText>
      {/* <AppText className="font-MANROPE_700 text-[20px] text-center text-grey_200">
        or selected payment processor
      </AppText> */}
      <View style={{flex: 1}}>
        {ref && (
          <PayWithFlutterwave
            options={{
              authorization: FLUTTERWAVE_PUBLIC_KEY,
              tx_ref: ref || '',
              amount: 100,
              currency: 'NGN',
              payment_options:
                selectedPaymentMethod?.includes('VISA') ||
                selectedPaymentMethod?.includes('USE A NEW')
                  ? 'card'
                  : selectedPaymentMethod?.includes('USSD')
                  ? 'ussd,bank'
                  : 'bank',
              customer: {
                email,
              },
              customizations: {
                title: 'Reeplay Payment',
                description: 'Payment for service',
              },
            }}
            onRedirect={async (data) => {
              if (data.status === 'successful') {
                const tnxRef = data.tx_ref;
                if (
                  selectedPaymentMethod?.includes('VISA') ||
                  selectedPaymentMethod?.includes('USE A NEW')
                ) {
                  Alert.alert('', 'Allow Reeplay save card for future payments', [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        setSaveCard(false);
                        createPayment(tnxRef, false);
                      },
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        setSaveCard(true);
                        createPayment(tnxRef, true);
                      },
                    },
                  ]);
                } else {
                  createPayment(tnxRef);
                }
              } else {
                Alert.alert('Payment cancelled or failed');
              }
            }}
            onWillInitialize={() => console.log('Flutterwave will initialize')}
            onDidInitialize={() => console.log('Flutterwave did initialize')}
            onInitializeError={error => {
              console.error('Flutterwave initialization error:', error);
            }}
          />
        )}
      </View>

      {(!paySuccessful || !loading) && (
        <AppView className="absolute bottom-3 w-full">
          <AppButton
            bgColor={colors.RED}
            title="Pay"
            onPress={initPaymentApi}
            style={{width: '100%', borderRadius: 8}}
          />
        </AppView>
      )}

      <AppModal
        isModalVisible={isShowModal || loading}
        hideLoge
        hideCloseBtn={!paySuccessful}
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
                  width: 500,
                  height: 500,
                }}
                autoPlay
                loop
              />
            )}
            {paySuccessful && (
              <VerificationModal isPayment tab={tab} amount={amount} />
            )}
          </>
        }
        handleClose={reset}
      />
    </AppScreen>
  );
};

export default PayStackView;
