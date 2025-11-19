import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {AppButton, AppText, AppView, TouchableOpacity} from '@/components';
import {paymentMethods} from '@/configs/data';
import {
  ApplePay,
  ArrowRight,
  BankUSSD,
  Bitcoin,
  Black_Arrow_right,
  CardIcon,
  MasterCardIcon,
  NewCardIcon,
  PayPal,
  Purple_Sub_card,
  RightArrow,
  Sub_VisaIcon,
  WalletIcon,
} from '@/assets/icons';
import colors from '@/configs/colors';
import {ISubscription} from '@/types/api/subscription.types';
import {formatAmount} from '@/Utils/formatAmount';
import Animated, {FadeIn, FadeInDown} from 'react-native-reanimated';
import {PayWithFlutterwave} from 'flutterwave-react-native';
import {useAppSelector} from '@/Hooks/reduxHook';
import {selectUser} from '@/store/slices/userSlice';

interface Props {
  setStage: React.Dispatch<React.SetStateAction<string>>;
  selectedPlan: ISubscription | null;
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<string | null>>;
}

const AnimatedView = Animated.createAnimatedComponent(AppView);
const AnimatedText = Animated.createAnimatedComponent(AppText);

const PaymentSummaryView = ({
  setStage,
  selectedPlan,
  setSelectedPaymentMethod,
}: Props) => {
  const user = useAppSelector(selectUser);
  const [showList, setShowList] = useState<boolean>(false);
  const [paymentMethodList, setPaymentMethodList] = useState<string[]>([
    user.paymentDetails
      ? `.... .... ... ${user.paymentDetails.last4}`
      : 'VISA | MASTERCARD | VERVE',
    'USSD | BANK TRANSFER',
    'REEPLAY  WALLET',
  ]);
  const [paymentMethod, setPaymentMethod] = useState<string>(
    paymentMethodList[user.paymentDetails ? 1 : 0],
  );

  useEffect(() => {
    setSelectedPaymentMethod(paymentMethod);

    user.paymentDetails &&
      setPaymentMethodList(prev => ['USE A NEW CARD', ...prev]);
  }, []);

  return (
    <AppView className="relative h-full">
      <AnimatedText
        entering={FadeInDown.springify()}
        className="mt-24 font-MANROPE_400 text-[20px] text-center text-white">
        Review Summary
      </AnimatedText>

      <AnimatedView
        entering={FadeInDown.delay(200).springify()}
        className="mt-10 px-4">
        <AppView className="flex-row items-center justify-between">
          <AppText className="font-MANROPE_400 text-white text-sm">
            Amount
          </AppText>
          <AppText className="font-LEXEND_400 text-white text-sm">
            ₦{formatAmount(selectedPlan?.price.toString() ?? '')}.00
          </AppText>
        </AppView>
        <AppView className="flex-row items-center justify-between mt-6">
          <AppText className="font-MANROPE_400 text-white text-sm">Fee</AppText>
          <AppText className="font-MANROPE_400 text-white text-sm">
            ₦0.00
          </AppText>
        </AppView>
        <AppView
          style={{alignSelf: 'center'}}
          className="border border-white w-[98%] h-[2px] mt-3"
        />
        <AppView className="flex-row items-center justify-between mt-5">
          <AppText className="font-MANROPE_400 text-white text-sm">
            Total
          </AppText>
          <AppText className="font-LEXEND_400 text-white text-sm">
            ₦{formatAmount(selectedPlan?.price.toString() ?? '')}.00
          </AppText>
        </AppView>
      </AnimatedView>

      <AnimatedView entering={FadeIn.duration(1500)}>
        <AppView className="mt-10">
          <AppView className="relative bg-white py-[14px] px-3 rounded-lg flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => setShowList(!showList)}
              className="absolute -right-2 rounded-lg bg-[#BDC1CA] w-[32px] h-[32px] items-center justify-center">
              <Black_Arrow_right />
            </TouchableOpacity>

            <AppView className="flex-row items-center">
              <Purple_Sub_card />
              <AppText className="font-MANROPE_400 text-[#171A1F] text-sm ml-2">
                {paymentMethod}
              </AppText>
            </AppView>
            <TouchableOpacity
              onPress={() => setShowList(!showList)}
              className="mr-[18px]">
              <AppText className="font-MANROPE_600 text-[11.5px] text-red">
                Change
              </AppText>
            </TouchableOpacity>
          </AppView>

          {showList && (
            <AppView className="space-y-2 mt-4">
              {paymentMethodList.map((pay, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => [
                      setPaymentMethod(pay),
                      setSelectedPaymentMethod(pay),
                      setShowList(false),
                    ]}
                    className="flex-row items-center justify-between px-6 py-5 bg-[#92919614]">
                    {pay.includes('VISA') && (
                      <AppText className="flex-row items-center">
                        <MasterCardIcon />
                        {'  '} <Sub_VisaIcon />
                      </AppText>
                    )}
                    {/* {pay.includes('APPLE') && <ApplePay />} */}
                    {/* {pay.includes('PAYPAL') && <PayPal />} */}
                    {pay.includes('USSD') && <BankUSSD />}
                    {pay.includes('WALLET') && <WalletIcon />}
                    {pay.includes('.....') && <CardIcon />}
                    {pay.includes('USE A NEW') && <NewCardIcon />}
                    {/* {pay.includes('CRYPTO') && <Bitcoin />} */}
                    <AppText className="font-MANROPE_400 text-sm text-white">
                      {pay}
                    </AppText>
                    <RightArrow />
                  </TouchableOpacity>
                );
              })}
            </AppView>
          )}
        </AppView>
      </AnimatedView>

      {/* PAYSTACK BUTTON HERE */}

      {!showList && (
        <AppView className="absolute bottom-10 w-full">
          <AppButton
            bgColor={colors.RED}
            title="Continue"
            onPress={() => setStage('flutterwave')}
            style={{width: '100%', borderRadius: 8}}
          />
        </AppView>
      )}
    </AppView>
  );
};

export default PaymentSummaryView;
