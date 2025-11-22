import { Platform, Pressable, StyleSheet } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { AppHeader, AppScreen, AppText, AppView, OTPInput } from '@/components';
import { useNavigation } from '@react-navigation/native';
import routes from '@/navigation/routes';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { selectUser } from '@/store/slices/userSlice';
import fonts from '@/configs/fonts';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import { getData } from '@/Utils/useAsyncStorage';
import { HAS_SET_NEWPIN } from './GetStartedScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bannerApi, fetchEnums } from '@/api/content.api';
import { setBannerContent, setCategories, setGenres } from '@/store/slices/bannerSlice.slice';
import { useAppPersistStore } from '@/store/zustand.store';
import { RootNav } from '@/navigation/AppNavigator';
import { isAndroid } from '@/configs/constant';

const AppPIN = ({handleFunc}:{handleFunc?: () => void}) => {
  const { reset } = useNavigation<RootNav>();
  const { isLock, setIsLock } = useAppPersistStore();
  const [appPin, setAppPin] = useState('');
  const [error, setError] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const { top, bottom } = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const handlePin = async (pin: string) => {
    if (pin.length === 4) {
      if (pin.length !== 4 || appPin !== pin) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      } else {
        const banner = await bannerApi();
        const categories = await fetchEnums('categories');
        const genres = await fetchEnums('genres');

        if (banner.ok && banner.data) dispatch(setBannerContent(banner.data.data))
        if (categories.ok && categories.data) dispatch(setCategories(categories.data.data))
        if (genres.ok && genres.data) dispatch(setGenres(genres.data.data))
          console.log(isLock)
          if(isLock) setIsLock(false)
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
    <AppView
      className="bg-black w-full h-full px-6"
      style={{
        paddingTop: top + (isAndroid ? Size.hp(5) :0),
        position: 'relative',
      }}>
      <AppHeader handleFunc={handleFunc} />

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
            style={{ alignSelf: 'center' }}
            className="max-w-[120px] text-red text-[16px] text-center font-MANROPE_500 mt-3">
            Invalid PIN. Please try again
          </AppText>
        )}
      </AppView>

      <Pressable
        style={{ position: 'absolute', bottom: bottom, alignSelf: 'center' }}>
        <AppText style={styles.forgotText}>Forgot PIN?</AppText>
      </Pressable>
    </AppView>
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
