import {
  Alert,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  AppButton,
  AppText,
  AppVideo,
  AppView,
  TouchableOpacity,
} from '@/components';
import VideoRef from 'react-native-video';
import {BiometricsIcon, MuteIcon, UnmuteIcon} from '@/assets/icons';
import useToggle from '@/Hooks/useToggle';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import LinearGradient from 'react-native-linear-gradient';
import {useAppSelector} from '@/Hooks/reduxHook';
import {selectUser} from '@/store/slices/userSlice';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {AuthMainNavigation, GetStartedScreenProps} from '@/types/typings';
import routes from '@/navigation/routes';
import {getData, storeData} from '@/Utils/useAsyncStorage';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {handleLoginAPI} from '@/api/auth.api';
import {getProfileDetails} from '@/api/profile.api';

const hasUserDetails = 'user';
export const HAS_SET_NEWPIN = 'new_pin';
const HAS_LOCK_APP = 'HAS_LOCK_APP';

const GetStartedScreen = () => {
  const {replace, navigate} = useNavigation<GetStartedScreenProps>();
  const navigation = useNavigation<AuthMainNavigation>();
  const videoRef = useRef<VideoRef>(null);
  const [toogle, setToogle] = useToggle(false);
  const user = useAppSelector(selectUser);
  const [isPause, setIsPause] = useState(false);
  const [lock, setLock] = useState(false);
  const [biometricsIsSupport, setBiometricsIsSupport] = useState(true);
  const [login, setLogin] = useState(false);
  const isFocused = useIsFocused();
  const rnBiometrics = new ReactNativeBiometrics();

  async function handleLogin() {
    console.log(lock);
    if (lock) {
      const hasPin = await getData(HAS_SET_NEWPIN);
      if (hasPin) {
        navigate(routes.APP_PIN);
      } else {
        replace(routes.SET_PIN);
      }
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: routes.TAB_MAIN,
          },
        ],
      });
    }
  }

  async function getLockState() {
    const lockState = await getData(HAS_LOCK_APP);
    if (lockState) {
      setLock(JSON.parse(lockState));
    }
  }

  function handleLockPress() {
    if (!lock)
      Alert.alert('Turn on the Lock App feature in settings to use biometrics');
    if (!biometricsIsSupport)
      Alert.alert('Sorry, your device has no biometrics settings active.');
    if (lock && biometricsIsSupport) {
      rnBiometrics
        .simplePrompt({promptMessage: 'Confirm biometrics'})
        .then(resultObject => {
          const {success} = resultObject;

          if (success) {
            console.log('successful biometrics provided');
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: routes.TAB_MAIN,
                },
              ],
            });
          } else {
            console.log('user cancelled biometric prompt');
          }
        })
        .catch(() => {
          console.log('biometrics failed');
        });
    }
  }

  async function backgroundLogin() {
    const user = await getData(hasUserDetails);
    const credentials = await getData('LOGINS');
    if (!user || !credentials) return;
    try {
      const email = JSON.parse(user).profile.email;
      const password = JSON.parse(credentials);
      const res = await handleLoginAPI({
        email,
        password,
      });
      console.log(res);
      if (res.ok && res.data) {
        //dispatch to redux
        await storeData('AUTH_TOKEN', res.data.data.token);
        const profileRes = await getProfileDetails();
        console.log(profileRes);
        if (profileRes.ok && profileRes.data) {
          await storeData(hasUserDetails, JSON.stringify(profileRes.data.data));
          await storeData('LOGINS', JSON.stringify(password));
        }
      } else {
        setLogin(true);
      }
    } catch (error) {}
  }

  async function checkBiometrics() {
    rnBiometrics.isSensorAvailable().then(resultObject => {
      const {available, biometryType} = resultObject;

      if (
        !available &&
        (biometryType !== BiometryTypes.TouchID ||
          biometryType !== BiometryTypes.FaceID ||
          biometryType === BiometryTypes.Biometrics)
      ) {
        console.log('TouchID is not supported');
        setBiometricsIsSupport(false);
      } else {
        setBiometricsIsSupport(true);
      }
    });
  }

  useLayoutEffect(() => {
    backgroundLogin();
    getLockState();
    checkBiometrics();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setIsPause(false);
    } else {
      setIsPause(true);
    }
  }, [isFocused]);

  return (
    <AppView className="relative">
      <StatusBar hidden />
      <AppVideo
        source={require('@/assets/videos/getStartedVideo.mp4')}
        videoRef={videoRef}
        style={{width: '100%', height: '100%'}}
        resizeMode="cover"
        muted={toogle}
        repeat
        paused={isPause}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,1)']}
        style={styles.gradientStyles}
      />

      <AppView className="absolute top-5 left-5 z-[99px]">
        <TouchableOpacity onPress={setToogle}>
          {toogle ? (
            <MuteIcon
              style={{
                marginTop: Platform.OS === 'ios' ? 29 : 18,
                marginBottom: 20,
                marginLeft: 3,
              }}
            />
          ) : (
            <UnmuteIcon style={{marginTop: Platform.OS === 'ios' ? 0 : -10}} />
          )}
        </TouchableOpacity>
        {user._id !== '' && (
          <>
            <AppText className="-mt-1 text-[24px] text-white font-LEXEND_700">
              Welcome back
            </AppText>
            <AppText
              style={Platform.OS === 'ios' && {marginTop: -3}}
              className="capitalize text-[24px] -mt-[8px] text-white font-LEXEND_700">
              {user.first_name}
            </AppText>
            <AppText className="text-base -mt-[2px] text-white font-MANROPE_400">
              Login to continue
            </AppText>
          </>
        )}
      </AppView>

      <AppView className="absolute bottom-8 z-[99px] items-center w-full">
        {user._id !== '' ? (
          <AppView className="flex-row items-center justify-center gap-x-1">
            <AppButton
              title="Continue to Login"
              bgColor={colors.RED}
              onPress={() =>
                login ? replace(routes.LOGIN_SCREEN) : handleLogin()
              }
              style={{
                borderRadius: 0,
                width: Size.getWidth() * 0.5,
                height: 51,
                paddingVertical: Size.calcHeight(14),
              }}
              labelStyle={styles.labelStyle}
            />
            <TouchableOpacity
              onPress={handleLockPress}
              activeOpacity={0.7}
              style={{
                backgroundColor: !biometricsIsSupport
                  ? colors.GREY_BIOMETRICS
                  : !lock
                  ? colors.GREY_BIOMETRICS
                  : colors.RED,
              }}
              className="px-6 py-[6px]">
              <BiometricsIcon />
            </TouchableOpacity>
          </AppView>
        ) : (
          <>
            <AppButton
              title="Login"
              bgColor="transparent"
              onPress={() => replace(routes.LOGIN_SCREEN)}
              style={styles.loginBtn}
              labelStyle={styles.labelStyle}
            />

            <AppButton
              title="Create a New Account"
              bgColor={colors.RED}
              onPress={() => replace(routes.SIGNUP_SCREEN)}
              style={{marginTop: Size.calcHeight(20)}}
              labelStyle={styles.labelStyle}
            />
          </>
        )}

        <AppView className="mt-5 flex-row items-center justify-center gap-x-1">
          <AppText style={styles.privacyText}>Read the</AppText>
          <Pressable onPress={() => navigation.navigate(routes.TERMS_SCREEN)}>
            <AppText style={[styles.privacyText, styles.underline]}>
              Terms
            </AppText>
          </Pressable>
          <AppText style={styles.privacyText}>of Use and</AppText>
          <Pressable onPress={() => navigation.navigate(routes.PRIVACY_SCREEN)}>
            <AppText style={[styles.privacyText, styles.underline]}>
              Privacy Policy
            </AppText>
          </Pressable>
        </AppView>
      </AppView>
    </AppView>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  loginBtn: {
    borderColor: 'white',
    borderWidth: 2,
  },
  privacyText: {
    fontFamily: fonts.ROBOTO_400,
    fontSize: Size.calcHeight(14),
    color: colors.GREY_100,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: colors.GREY_100,
  },
  gradientStyles: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    position: 'absolute',
  },
  labelStyle: {
    fontSize: 13,
    fontFamily: fonts.MANROPE_700,
    color: '#E5E5E5',
  },
});
