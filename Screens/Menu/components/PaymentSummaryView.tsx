import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {AppButton, AppHeader, AppText, AppView, TouchableOpacity} from '@/components';
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
import {useAppSelector} from '@/Hooks/reduxHook';
import {selectUser} from '@/store/slices/userSlice';
import getSymbolFromCurrency from 'currency-symbol-map';
import { useNavigation } from '@react-navigation/native';
import CheckIcon from '@/assets/icons/Check.svg'
import { fetchStoredPaymentDetails } from '@/api/payment.api';

interface Props {
  setStage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<string | null>>;
  topUpAmount:string
  currency:string
  tab:string
  saveCard: boolean
  setSaveCard: React.Dispatch<React.SetStateAction<boolean>>
  selectedPaymentMethod: string | null
}

const AnimatedView = Animated.createAnimatedComponent(AppView);
const AnimatedText = Animated.createAnimatedComponent(AppText);

const PaymentSummaryView = ({
  setStage,
  setSelectedPaymentMethod,
  topUpAmount,
  currency,
  tab,
  selectedPaymentMethod,
  saveCard,
  setSaveCard,
}: Props) => {
  const {goBack} = useNavigation()
  const user = useAppSelector(selectUser);
  const [showList, setShowList] = useState<boolean>(false);
  const [paymentMethodList, setPaymentMethodList] = useState<string[]>([
    'VISA | MASTERCARD | VERVE',
    'USSD | BANK TRANSFER',
    ((tab !== 'topup' && tab !== 'donate' && tab !== 'vote') ? 'REEPLAY  WALLET' : ''),
  ]);
  const [paymentMethod, setPaymentMethod] = useState<string>(
    selectedPaymentMethod ? selectedPaymentMethod : paymentMethodList[0],
  );
  const fees = currency === 'NGN' ?'10' : '3'

  async function handlePaymentDetails(){
    const res = await fetchStoredPaymentDetails();
    if(res.ok && res.data && res.data.data.length > 0){
      const data = res.data.data
      const formated = data.map(x => `.... .... ... ${x.last4}`);
      setPaymentMethod(formated[0]);
      setPaymentMethodList(prev =>{
        prev.filter(x => !x.includes('VISA'));

        return ['USE A NEW CARD', ...formated, ...prev]
      })
    }
  }

  useEffect(() => {
    if(tab.includes('watch')){
      setSelectedPaymentMethod('REEPLAY  WALLET');
      setPaymentMethod('REEPLAY  WALLET');
      setPaymentMethodList(['REEPLAY  WALLET'])
    }else{
      setSelectedPaymentMethod(paymentMethod);
      handlePaymentDetails()
    }

    // setTopUpAmount(`${Number(topUpAmount) + Number(fees)}`)
  }, []);

  return (
    <AppView style={[tab === 'vote' && {paddingHorizontal:20}]} className="relative h-full pt-5">
      <AnimatedText
        entering={FadeInDown.springify()}
        className="mt-[100px] mb-3 font-MANROPE_400 text-[20px] text-center text-white">
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
            {getSymbolFromCurrency(currency)}{formatAmount(topUpAmount ?? '')}.00
          </AppText>
        </AppView>
        <AppView className="flex-row items-center justify-between mt-6">
          <AppText className="font-MANROPE_400 text-white text-sm">Fee</AppText>
          <AppText className="font-MANROPE_400 text-white text-sm">
            {getSymbolFromCurrency(currency)}{fees}.00
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
            {getSymbolFromCurrency(currency)}{formatAmount(`${Number(topUpAmount) + Number(fees)}`)}.00
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

          {showList ? (
            <AppView className="space-y-2 mt-4">
              {paymentMethodList.filter(x => x !== '').map((pay, i) => {
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
          ): <>
          {(paymentMethod && (paymentMethod.includes('VISA')|| paymentMethod.includes('CARD'))) && <AppView className='flex-row items-center justify-center gap-x-3 mt-10'>
            
            <TouchableOpacity 
            activeOpacity={.8}
            onPress={() => setSaveCard(!saveCard)}
            style={{backgroundColor: !saveCard ? '#d9d9d9' : colors.DEEP_BLACK}}
            className='w-[21px] h-[21px] rounded-full items-center justify-center'>
              {saveCard && <CheckIcon />}
            </TouchableOpacity>
            <Text className='font-MANROPE_400 text-base text-[#bcc1ca] mb-1'>save card</Text>

            </AppView>}
          </>}
        </AppView>
      </AnimatedView>

      {/* PAYSTACK BUTTON HERE */}

      {!showList && (
        <AppView style={[tab === 'vote' && {left:20}]} className="absolute items-center bottom-10 w-full">
          <AppButton
            bgColor={colors.RED}
            title="Continue"
            onPress={() => setStage('payStack')}
            style={{width: '100%', borderRadius: 8}}
          />
        </AppView>
      )}
    </AppView>
  );
};

export default PaymentSummaryView;
