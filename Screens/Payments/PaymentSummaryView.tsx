import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  AppButton,
  AppScreen,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import {paymentMethods} from '@/configs/data';
import {
  ApplePay,
  ArrowRight,
  BankUSSD,
  Bitcoin,
  Black_Arrow_right,
  MasterCardIcon,
  PayPal,
  Purple_Sub_card,
  RightArrow,
  Sub_VisaIcon,
} from '@/assets/icons';
import colors from '@/configs/colors';
import LottieView from 'lottie-react-native';
import VerificationModal from '../authentication/components/VerificationModal';
import AppModal from '@/components/AppModal';
import {useNavigation} from '@react-navigation/native';

const PaymentSummaryView = () => {
  const {goBack} = useNavigation();
  const [paymentMethod, setPaymentMethod] = useState<string>(paymentMethods[0]);
  const [showList, setShowList] = useState<boolean>(false);
  const [step, setStep] = useState<string>('summary');

  const [loading, setLoading] = useState(false);
  const [paySuccessful, setPaySuccessful] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  function handlePayment() {
    setLoading(true);
    setIsShowModal(true);

    setTimeout(() => {
      setLoading(false);
      setPaySuccessful(true);
    }, 5500);
  }

  function reset() {
    setIsShowModal(false);
    setPaySuccessful(false);
    setStep('summary');
    goBack();
    // navigate(routes.ACCOUNT_SCREEN);
  }

  switch (step) {
    case 'summary':
      return (
        <AppView className="bg-black px-5 relative  h-full">
          <AppText className="mt-24 font-MANROPE_400 text-[20px] text-center text-white">
            Review Summary
          </AppText>

          <AppView className="mt-10 px-4">
            <AppView className="flex-row items-center justify-between">
              <AppText className="font-MANROPE_400 text-white text-sm">
                Amount
              </AppText>
              <AppText className="font-LEXEND_400 text-white text-sm">
                ₦2,640.00
              </AppText>
            </AppView>
            <AppView className="flex-row items-center justify-between mt-6">
              <AppText className="font-MANROPE_400 text-white text-sm">
                Fee
              </AppText>
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
                ₦2,640.00
              </AppText>
            </AppView>
          </AppView>

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
              <>
                {Platform.OS === 'android' ? (
                  <AppView className="space-y-2 mt-4">
                    {paymentMethods.map((pay, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => [
                            setPaymentMethod(pay),
                            setShowList(false),
                          ]}
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
                ) : (
                  <ScrollView
                    style={{height: 500}}
                    showsVerticalScrollIndicator={false}>
                    <AppView className="space-y-2 mt-4">
                      {paymentMethods.map((pay, i) => {
                        return (
                          <TouchableOpacity
                            key={i}
                            onPress={() => [
                              setPaymentMethod(pay),
                              setShowList(false),
                            ]}
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
                    <AppView className="w-full h-[210px]" />
                  </ScrollView>
                )}
              </>
            )}
          </AppView>

          {!showList && (
            <AppView
              style={{alignSelf: 'center'}}
              className="absolute bottom-10 w-full">
              <AppButton
                bgColor={colors.RED}
                title="Continue"
                onPress={() => setStep('payStack')}
                style={{width: '100%', borderRadius: 8}}
              />
            </AppView>
          )}
        </AppView>
      );

    case 'payStack':
      return (
        <AppScreen containerStyle={{position: 'relative'}}>
          <AppText className="mt-[50%] font-MANROPE_600 text-[40px] text-white text-center">
            PAYSTACK
          </AppText>
          <AppText className="font-MANROPE_700 text-[20px] text-center text-grey_200">
            or selected payment processor
          </AppText>

          <AppView className="absolute bottom-3 w-full">
            <AppButton
              bgColor={colors.RED}
              title="Pay"
              onPress={() => handlePayment()}
              style={{width: '100%', borderRadius: 8}}
            />
          </AppView>

          <AppModal
            isModalVisible={isShowModal}
            hideLoge
            hideCloseBtn={!paySuccessful}
            style={{
              height: paySuccessful ? 390 : 368,
              backgroundColor: loading ? 'transparent' : 'white',
            }}
            replaceDefaultContent={
              <>
                {loading && (
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
                  <VerificationModal message="Payment was successful" />
                )}
              </>
            }
            handleClose={reset}
          />
        </AppScreen>
      );

    default:
      return null;
  }
};

export default PaymentSummaryView;
