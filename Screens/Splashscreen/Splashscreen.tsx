import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import React, {useEffect} from 'react';
import colors from '@/configs/colors';
import {getData, storeData} from '@/Utils/useAsyncStorage';
import {useNavigation} from '@react-navigation/native';
import {SplashScreenProps} from '@/types/typings';
import routes from '@/navigation/routes';
import {useAppDispatch} from '@/Hooks/reduxHook';
import {setCredentials} from '@/store/slices/userSlice';
import { HAS_SET_NEWPIN } from '../authentication/GetStartedScreen';
import LottieView from 'lottie-react-native';
import Size from '@/Utils/useResponsiveSize';

export const HAS_ONBOARD = 'isOnboard';
export const hasUserDetails = 'user';
const HAS_LOCK_APP = 'HAS_LOCK_APP';

const Splashscreen = () => {
  const navigation = useNavigation<SplashScreenProps>();
  const dispatch = useAppDispatch();


  async function handleNav() {
    const hasOnboard = await getData(HAS_ONBOARD);
    if (hasOnboard) {
      navigation.replace(routes.AUTH);
    } else {
      await storeData(HAS_ONBOARD, 'true');
      navigation.replace(routes.ONBOARDING_SCREEN);
    }
  }

  async function setDefaultLockState() {
    const lockState = await getData(HAS_LOCK_APP);
    if (!lockState) {
      await storeData(HAS_LOCK_APP, 'true');
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const user = await getData(hasUserDetails);
      if (user) {
        const userDetails = JSON.parse(user);
        dispatch(setCredentials(userDetails));
        if(userDetails.profile.pin){
          await storeData(HAS_SET_NEWPIN,userDetails.profile.pin);
        }
      }
    };

    getUser();
    setDefaultLockState();
  }, []);

  return (
    <SafeAreaView style={[styles.center, styles.container]}>
      <StatusBar hidden />
        <LottieView
              source={require('@/assets/lottie/RPsplash.json')}
              autoPlay
              loop={false}
              speed={50}
              style={{
                width: Size.calcAverage(800),
                height: Size.calcAverage(800),
              }}
              onAnimationFinish={handleNav}
            />
    </SafeAreaView>
  );
};

export default Splashscreen;

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.DEEP_BLACK,
    position: 'relative',
  },
});
