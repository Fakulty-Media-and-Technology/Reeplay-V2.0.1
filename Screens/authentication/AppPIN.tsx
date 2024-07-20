import {Platform, Pressable, StyleSheet} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {AppHeader, AppScreen, AppText, AppView, OTPInput} from '@/components';
import {useNavigation} from '@react-navigation/native';
import {AppPINScreenProps, AuthMainNavigation} from '@/types/typings';
import routes from '@/navigation/routes';
import {useAppSelector} from '@/Hooks/reduxHook';
import {selectUser} from '@/store/slices/userSlice';
import fonts from '@/configs/fonts';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import {getData} from '@/Utils/useAsyncStorage';
import {HAS_SET_NEWPIN} from './GetStartedScreen';

const AppPIN = () => {
  const {reset} = useNavigation<AuthMainNavigation>();
  const {replace} = useNavigation<AppPINScreenProps>();
  const [appPin, setAppPin] = useState('');
  const [error, setError] = useState<boolean>(false);
  const user = useAppSelector(selectUser);

  const handlePin = (pin: string) => {
    if (pin.length === 4) {
      if (pin.length !== 4 || appPin !== pin) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      } else {
        reset({
          index: 0,
          routes: [
            {
              name: routes.TAB_MAIN,
            },
          ],
        });
      }
    }
  };

  async function getPinState() {
    const hasPin = await getData(HAS_SET_NEWPIN);
    if (hasPin) {
      setAppPin(hasPin);
    }
  }

  useLayoutEffect(() => {
    getPinState();
  }, []);

  return (
    <AppScreen containerStyle={{paddingTop: 15, position: 'relative'}}>
      <AppHeader />

      <AppText className="text-2xl text-white font-LEXEND_700 mt-8">
        Welcome back
      </AppText>
      <AppText className="text-2xl text-white font-LEXEND_700 -mt-[5px]">
        {user.first_name}
      </AppText>
      <AppText className="-mt-[2px] text-sm text-white font-MANROPE_400">
        Use pin to continue
      </AppText>

      <AppView className="mt-8">
        <OTPInput pinCount={4} handleCode={code => handlePin(code)} />
        {error && (
          <AppText
            style={{alignSelf: 'center'}}
            className="max-w-[120px] text-red text-[16px] text-center font-MANROPE_500 mt-3">
            Invalid PIN. Please try again
          </AppText>
        )}
      </AppView>

      <Pressable
        style={{position: 'absolute', bottom: 10, alignSelf: 'center'}}>
        <AppText style={styles.forgotText}>Forgot PIN?</AppText>
      </Pressable>
    </AppScreen>
  );
};

export default AppPIN;

const styles = StyleSheet.create({
  forgotText: {
    fontFamily: fonts.MANROPE_400,
    fontSize: Size.calcHeight(18),
    color: colors.YELLOW_500,
    textAlign: 'center',
  },
});
