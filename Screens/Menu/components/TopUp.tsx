import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
  MasterCardIcon,
  PayPal,
  Purple_Sub_card,
  RightArrow,
  Sub_VisaIcon,
} from '@/assets/icons';
import {paymentMethods} from '@/configs/data';
import {formatAmount} from '@/Utils/formatAmount';
import {useIsFocused, useNavigation} from '@react-navigation/native';

interface Props {
  setStage: React.Dispatch<React.SetStateAction<string>>;
  tab: string;
}

const options = ['500', '1000', '1500', '2500', '3000', '5000'];

const TopUp = ({setStage, tab}: Props) => {
  const {goBack} = useNavigation();
  const [paymentMethod, setPaymentMethod] = useState<string>(paymentMethods[0]);
  const [showList, setShowList] = useState<boolean>(false);
  const [activeIndex, setActiveindex] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const isFocused = useIsFocused();
  const [reRun, setReRun] = useState<boolean>(false);

  useEffect(() => {
    if (isFocused) setReRun(true);
  }, []);

  return (
    <AppView className="relative h-full">
      <AppView className="ml-auto mt-1 mb-6">
        <Pressable onPress={goBack}>
          <BigClose />
        </Pressable>
      </AppView>
      <AppText className="font-LEXEND_700 text-2xl text-white">
        How much do you want to {tab === 'donate' ? 'donate' : 'topup'}?
      </AppText>

      <AppView className="mt-5">
        <AppView
          style={styles.inputContainer}
          className="flex-row items-center">
          <AppText className="font-MANROPE_400 text-base text-[#171A1F]">
            ₦
          </AppText>
          <TextInput
            value={formatAmount(text)}
            onChangeText={setText}
            placeholder="500"
            placeholderTextColor="#171A1F"
            style={styles.input}
            keyboardType="number-pad"
          />
        </AppView>

        <AppView className="mt-7 flex-row justify-evenly gap-x-2 flex-wrap w-full">
          {options.map((option, i) => {
            const showClicked = activeIndex === i;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => [setActiveindex(i), setText(option)]}
                style={{
                  backgroundColor: showClicked ? colors.RED : 'white',
                  width: Size.getWidth() / 3 - 28,
                }}
                className="py-[14px] mb-3 rounded-lg items-center justify-center">
                <AppText
                  style={{color: showClicked ? 'white' : 'black'}}
                  className="font-MANROPE_400 text-lg">
                  ₦{option}
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
              {paymentMethods.map((pay, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => [setPaymentMethod(pay), setShowList(false)]}
                    className="flex-row items-center justify-between px-6 py-5 bg-[#92919614]">
                    {pay.includes('VISA') && (
                      <AppText className="flex-row items-center">
                        <MasterCardIcon />
                        {'  '} <Sub_VisaIcon />
                      </AppText>
                    )}
                    {pay.includes('APPLE') && <ApplePay />}
                    {pay.includes('PAYPAL') && <PayPal />}
                    {pay.includes('USSD') && <BankUSSD />}
                    {pay.includes('CRYPTO') && <Bitcoin />}
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
            onPress={() => setStage('payStack')}
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
    paddingVertical: Platform.OS === 'android' ? 2 : Size.calcHeight(14),
  },
  input: {
    flex: 1,
    fontFamily: fonts.MANROPE_400,
    fontSize: 16,
    color: '#171A1F',
  },
});