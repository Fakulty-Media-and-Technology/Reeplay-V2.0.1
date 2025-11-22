import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {AppButton, AppText, AppView, TouchableOpacity} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import colors from '@/configs/colors';
import {
  ApplePay,
  BankUSSD,
  BigClose,
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
import getSymbolFromCurrency from 'currency-symbol-map';
import {formatAmount} from '@/Utils/formatAmount';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {selectUser} from '@/store/slices/userSlice';
import {useAppSelector} from '@/Hooks/reduxHook';

interface Props {
  setStage: React.Dispatch<React.SetStateAction<string>>;
  tab: string;
  currency: string;
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<string | null>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setGoBack: React.Dispatch<React.SetStateAction<string>>;
  text: string;
}

const options = ['500', '1000', '1500', '2500', '3000', '5000'];

const TopUp = ({
  setStage,
  tab,
  currency,
  text,
  setText,
  setSelectedPaymentMethod,
  setGoBack
}: Props) => {
  const user = useAppSelector(selectUser);
  const {goBack} = useNavigation();
  const [showList, setShowList] = useState<boolean>(false);
  const [activeIndex, setActiveindex] = useState<number>(0);
  const isFocused = useIsFocused();
  const [reRun, setReRun] = useState<boolean>(false);
    const [optionsContainerWidth, setOptionsContainerWidth] = useState(110);
  const [paymentMethodList, setPaymentMethodList] = useState<string[]>([
    user.paymentDetails
      ? `.... .... ... ${user.paymentDetails.last4}`
      : 'VISA | MASTERCARD | VERVE',
    'USSD | BANK TRANSFER',
  ]);
  const [paymentMethod, setPaymentMethod] = useState<string>(
    paymentMethodList[user.paymentDetails ? 1 : 0],
  );
  const {width} = useWindowDimensions()

  function handleText(value: string) {
    setText(value.replaceAll(',',''));

    options.forEach((option, i) => {
      console.log(value.replace(',', ''), option, i);
      if (value.replace(',', '') === option) {
        setActiveindex(i);
      } else setActiveindex(-1);
    });
  }

  useLayoutEffect(() => {
    setSelectedPaymentMethod(paymentMethod);

    user.paymentDetails &&
      setPaymentMethodList(prev => ['USE A NEW CARD', ...prev]);
      if(tab === 'donate') setPaymentMethodList(prev => [...prev, 'REEPLAY  WALLET'])
  }, []);

  useEffect(() => {
    setText(options[0]);
    if (isFocused) setReRun(true);
  }, []);

  return (
    <AppView className="relative h-full">
      <AppView className="ml-auto mt-1 mb-6">
        <Pressable onPress={goBack}>
          <BigClose />
        </Pressable>
      </AppView>
      <AppText className="font-LEXEND_700 text-2xl text-white my-10 mb-7">
        Enter Amount
      </AppText>

      <AppView className="mt-5">
        <AppView
          style={styles.inputContainer}
          className="flex-row items-center">
          <AppText className="font-MANROPE_400 text-base text-[#171A1F]">
            {getSymbolFromCurrency(currency)}
          </AppText>
          <TextInput
            value={formatAmount(text)}
            onChangeText={handleText}
            placeholder="500"
            placeholderTextColor="#171A1F"
            style={styles.input}
            keyboardType="number-pad"
          />
        </AppView>

{/* OPTION PART */}
        <AppView 
        onLayout={(event) => {
          setOptionsContainerWidth(event.nativeEvent.layout.width);
        }}
        className="mt-7 flex-row justify-evenly gap-x-2 flex-wrap w-full">
          {options.map((option, i) => {
            const showClicked = activeIndex === i;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => [setActiveindex(i), setText(option)]}
                style={[{
                  backgroundColor: showClicked ? colors.RED : 'white',
                  width:tab === 'donate' ? optionsContainerWidth ? optionsContainerWidth / 3 - 10 : 'auto' : Size.getWidth() / 3 - 28,
                  minWidth:110,
                }, tab === 'donate' && {height:55}]}
                className="py-[14px] mb-3 rounded-lg items-center justify-center">
                <AppText
                  style={{color: showClicked ? 'white' : 'black'}}
                  className="font-MANROPE_400 text-lg">
                  {getSymbolFromCurrency(currency)}{formatAmount(option)}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </AppView>
      </AppView>

      <AppView className="mt-5">
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 400}}>
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
          </ScrollView>
        )}
      </AppView>

      {!showList && (
        <AppView className="absolute bottom-5 w-full">
          <AppButton
            bgColor={colors.RED}
            title="Continue"
            onPress={() => [setStage('paymentSummary'), setGoBack(tab)]}
            style={{width: '100%', borderRadius: 8}}
          />
        </AppView>
      )}
    </AppView>
  );
};

export default TopUp;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: Size.calcHeight(18),
    // paddingVertical: Platform.OS === 'android' ? 2 : Size.calcHeight(14),
    height:50
  },
  input: {
    flex: 1,
    fontFamily: fonts.MANROPE_400,
    fontSize: 16,
    color: '#171A1F',
  },
});
