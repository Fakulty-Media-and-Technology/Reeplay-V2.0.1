import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppHeader, AppScreen, AppText, AppView} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import colors from '@/configs/colors';
import AppModal from '@/components/AppModal';
import VerificationModal from '@/Screens/authentication/components/VerificationModal';
import {useNavigation} from '@react-navigation/native';
import { giftCardRedeem, walletBalance } from '@/api/payment.api';
import ToastNotification from '@/components/ToastNotifications';
import { setWalletInfo } from '@/store/slices/userSlice';
import { useAppDispatch } from '@/Hooks/reduxHook';

const GiftCardRedeemScreen = () => {
  const [giftCard, setGiftCard] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {goBack} = useNavigation();
  const dispatch = useAppDispatch()

   async function getWallet() {
      const res = await walletBalance();
      if (res.ok && res.data) {
        dispatch(setWalletInfo(res.data.data));
      }
    }

  async function handleRedeem() {
    try {
      setLoading(true)
      const res = await giftCardRedeem(giftCard.trim());
      if(res.ok && res.data){
        getWallet();
        ToastNotification('success', res.data.message);
         setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setGiftCard('');
        goBack();
      }, 3000);
      }else{
        ToastNotification('error', `${res.data?.message}`)
      }
    } catch (error) {
      ToastNotification('error', `${error}`)
    }finally{
      setLoading(false);
    }
  }

  return (
    <AppScreen containerStyle={{paddingTop: 10, position: 'relative'}}>
      <AppHeader />
      <AppText className="font-LEXEND_700 text-2xl text-white mt-[70%]">
        Redeem Giftcard
      </AppText>
      <TextInput
        value={giftCard}
        onChangeText={setGiftCard}
        placeholder="Enter Giftcard Code"
        placeholderTextColor="#171A1F"
        style={styles.input}
      />

      <AppView className="absolute bottom-4 w-full">
        <AppButton
          bgColor={colors.RED}
          title="Redeem"
          isLoading={loading}
          onPress={handleRedeem}
          isDisable={giftCard === ''}
          style={{borderRadius: 8, width: '100%'}}
        />
      </AppView>

      <AppModal
        isModalVisible={isSuccess}
        hideLoge
        hideCloseBtn
        replaceDefaultContent={
          <VerificationModal
            message={`Giftcard redeemed ${'\n'}successfully`}
          />
        }
        handleClose={() => setIsSuccess(false)}
      />
    </AppScreen>
  );
};

export default GiftCardRedeemScreen;

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: Size.calcHeight(18),
    paddingVertical: Size.calcHeight(15),
    fontFamily: fonts.MANROPE_400,
    fontSize: 16,
    color: '#171A1F',
    textAlign: 'center',
    marginTop: 13,
  },
});
