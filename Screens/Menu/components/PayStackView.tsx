import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppButton, AppScreen, AppText, AppView} from '@/components';
import colors from '@/configs/colors';
import AppModal from '@/components/AppModal';
import VerificationModal from '@/Screens/authentication/components/VerificationModal';
import {useNavigation} from '@react-navigation/native';
import {SubscriptionNavProps} from '@/types/typings';
import routes from '@/navigation/routes';
import LottieView from 'lottie-react-native';
import {Paystack, paystackProps} from 'react-native-paystack-webview';
import {useAppDispatch, useAppSelector} from '@/Hooks/reduxHook';
import {selectUser, setCredentials} from '@/store/slices/userSlice';
import {ISubscription} from '@/types/api/subscription.types';
import {PAYSTACK_PUBLIC_KEY} from '@env';
import {createSubscription} from '@/api/subscription.api';
import {
  handleAuthorizedPayment,
  handleCreatePayment,
  initPayment,
} from '@/api/payment.api';
import {getProfileDetails} from '@/api/profile.api';

interface Props {
  setStage: React.Dispatch<React.SetStateAction<string>>;
  tab: string;
  selectedPlan: ISubscription | null;
  setSelectedPlan: React.Dispatch<React.SetStateAction<ISubscription | null>>;
  selectedPaymentMethod: string | null;
  topUpAmount: string;
}

const PayStackView = ({
  setStage,
  tab,
  selectedPlan,
  setSelectedPlan,
  selectedPaymentMethod,
  topUpAmount,
}: Props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [paySuccessful, setPaySuccessful] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const {goBack} = useNavigation();
  const {email} = useAppSelector(selectUser);
  const [save_card, setSaveCard] = useState(false);
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
  const [ref, setRef] = useState<string | null>(null);

  async function userProfile() {
    const res = await getProfileDetails();
    if (res.ok && res.data) {
      dispatch(setCredentials(res.data.data));
    }
  }

  async function handleAuthPayment() {
    if (!selectedPaymentMethod) return;

    try {
      setLoading(true);
      const res = await handleAuthorizedPayment({
        amount_charge: selectedPlan ? selectedPlan.price : Number(topUpAmount),
      });
      console.log(res);
      if (res.ok && res.data && res.data.data.data.status === 'success') {
        // setPaySuccessful(true);
        const data = res.data.data.data;
        const reference = data.reference;

        const resX = selectedPlan
          ? await createSubscription({
              plan_id: selectedPlan._id,
              source: selectedPaymentMethod.includes('WALLET')
                ? 'wallet'
                : 'payment',
              reference,
            })
          : await handleCreatePayment({reference, save_card});

        if (resX.ok && resX.data) {
          await userProfile();

          setPaySuccessful(true);
          setIsShowModal(true);
          setSelectedPlan(null);
          goBack();
          setStage('plan');
        } else {
          Alert.alert('Unable to update vote');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function initPaymentApi() {
    if (!selectedPaymentMethod?.includes('....')) {
      const res = await initPayment({
        email,
        amount: selectedPlan ? selectedPlan.price : Number(topUpAmount),
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

      const res = selectedPlan
        ? await createSubscription({
            plan_id: selectedPlan._id,
            source: selectedPaymentMethod.includes('WALLET')
              ? 'wallet'
              : 'payment',
            reference,
          })
        : await handleCreatePayment({reference, save_card});

      if (res.ok && res.data) {
        await userProfile();

        setPaySuccessful(true);
        setIsShowModal(true);
        setSelectedPlan(null);
        goBack();
        setStage('plan');
      } else {
        Alert.alert('Unable to complete payment request!');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setIsShowModal(false);
    setPaySuccessful(false);
    setStage('plan');
    goBack();
  }

  useEffect(() => {
    initPaymentApi();
  }, []);

  return (
    <AppScreen containerStyle={{position: 'relative'}}>
      <AppText className="mt-[50%] font-MANROPE_600 text-[40px] text-white text-center">
        PAYSTACK
      </AppText>
      {/* <AppText className="font-MANROPE_700 text-[20px] text-center text-grey_200">
        or selected payment processor
      </AppText> */}

      <View style={{flex: 1}}>
        {ref && (
          <Paystack
            //@ts-ignore
            ref={paystackWebViewRef}
            paystackKey={PAYSTACK_PUBLIC_KEY}
            billingEmail={email}
            amount={selectedPlan?.price ?? topUpAmount}
            currency="NGN"
            channels={
              selectedPaymentMethod?.includes('VISA') ||
              selectedPaymentMethod?.includes('USE A NEW')
                ? ['card']
                : selectedPaymentMethod?.includes('USSD')
                ? ['ussd', 'bank']
                : ['bank']
            }
            onCancel={e => {
              // handle response here
              console.log(e, 'cancelled payments');
              setStage(selectedPlan ? 'paymentSummary' : 'plan');
            }}
            onSuccess={res => {
              // handle response here
              const tnxRef = res.data.transactionRef.reference;
              if (
                selectedPaymentMethod?.includes('VISA') ||
                selectedPaymentMethod?.includes('USE A NEW')
              ) {
                Alert.alert('', 'Allow Reeplay save card for future payments', [
                  {
                    text: 'Cancel',
                    onPress: () => [
                      setSaveCard(false),
                      createPayment(tnxRef, false),
                    ],
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => [
                      setSaveCard(true),
                      createPayment(tnxRef, true),
                    ],
                  },
                ]);
              } else {
                createPayment(tnxRef);
              }
            }}
            autoStart={!selectedPaymentMethod?.includes('....')}
            refNumber={ref}
          />
        )}
      </View>

      {!paySuccessful && !loading && (
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
                  width: 300,
                  height: 300,
                }}
                autoPlay
                loop
              />
            )}
            {paySuccessful && (
              <VerificationModal
                isPayment
                tab={tab}
                amount={selectedPlan?.price ?? Number(topUpAmount)}
              />
            )}
          </>
        }
        handleClose={reset}
      />
    </AppScreen>
  );
};

export default PayStackView;
