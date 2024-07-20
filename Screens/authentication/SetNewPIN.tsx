import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  AppButton,
  AppHeader,
  AppScreen,
  AppText,
  AppView,
  OTPInput,
} from '@/components';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  AuthMainNavigation,
  SetNEWPINRouteProps,
  SetNewPINScreenProps,
} from '@/types/typings';
import {getData, storeData} from '@/Utils/useAsyncStorage';
import routes from '@/navigation/routes';
import AppModal from '@/components/AppModal';
import VerificationModal from './components/VerificationModal';
import {handleCreatePIN} from '@/api/auth.api';
import {useAppSelector} from '@/Hooks/reduxHook';
import {selectUser} from '@/store/slices/userSlice';

const HAS_SET_NEWPIN = 'new_pin';

const SetNewPIN = () => {
  const {replace, reset} = useNavigation<AuthMainNavigation>();
  const user = useAppSelector(selectUser);
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');
  const route = useRoute<SetNEWPINRouteProps>();
  const pin = route.params.pin;

  const handlePin = async () => {
    const token = await getData('AUTH_TOKEN');
    if (!token) return;
    if (code.length !== 4 || pin !== code) {
      setError(true);
      setMsg('Invalid PIN. Please try again');
      setTimeout(() => {
        setError(false);
      }, 5000);
      return;
    } else {
      try {
        setLoading(true);
        //Stored to local storage
        const res = await handleCreatePIN(
          {
            pin,
            cpin: code,
            email: user.email,
          },
          token,
        );
        if (res.ok && res.data) {
          await storeData(HAS_SET_NEWPIN, pin);
          setIsShowModal(true);
          setTimeout(() => {
            setIsShowModal(false);
            replace(routes.INTEREST_SCREEN, {isSettings: false});
            setLoading(false);
          }, 3000);
        } else {
          setError(true);
          res.data && setMsg(res.data.message.split(':')[1]);
          setTimeout(() => {
            setError(false);
          }, 5000);
        }
      } catch (error) {
        setError(true);
        setMsg('Failed to set PIN. Please try again');
        setTimeout(() => {
          setError(false);
        }, 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AppScreen containerStyle={{paddingTop: 10, position: 'relative'}}>
      <AppHeader />

      <AppText className="text-2xl text-white font-LEXEND_700 mt-12">
        Confirm your new
      </AppText>
      <AppText className="text-2xl text-white font-LEXEND_700 mb-2">
        App pin
      </AppText>

      <AppView className="mt-8">
        <OTPInput pinCount={4} handleCode={code => setCode(code)} />
        {error && (
          <AppText
            style={{alignSelf: 'center'}}
            className="max-w-[120px] text-red text-[16px] text-center font-MANROPE_500 mt-3">
            {msg}
          </AppText>
        )}
      </AppView>

      <AppView className="w-full items-center absolute bottom-10">
        <AppButton
          isLoading={loading}
          bgColor={colors.RED}
          title="Create Pin"
          onPress={() => handlePin()}
          style={{borderRadius: 8, width: Size.getWidth() * 0.9}}
        />
      </AppView>

      <AppModal
        isModalVisible={isShowModal}
        hideLoge
        hideCloseBtn
        replaceDefaultContent={
          <VerificationModal
            message="App pin created successfully"
            messageStyle={{maxWidth: 200, lineHeight: 18, marginTop: -9}}
          />
        }
        handleClose={() => setIsShowModal(false)}
      />
    </AppScreen>
  );
};

export default SetNewPIN;

const styles = StyleSheet.create({});
