import {View, Text, StyleSheet, Linking, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  AppButton,
  AppHeader,
  AppScreen,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import {
  AboutUsIcon,
  ArrowRight,
  ClearWatchlist,
  FingerPrint,
  HelpCenterIcon,
  LanguageIcon,
  LockAppIcon,
  LoveIcon,
  NotificationIcon_S,
  PrivacyPolicyIcon,
  RightArrow,
  VideoQualityIcon,
  WifiIcon,
} from '@/assets/icons';
import ToggleButton from '@/components/ToggleButton';
import {SettingTab} from '@/configs/data';
import Size from '@/Utils/useResponsiveSize';
import AppModal from '@/components/AppModal';
import colors from '@/configs/colors';
import fonts from '@/configs/fonts';
import VideoQualityOption from './components/VideoQualityOption';
import {useNavigation} from '@react-navigation/native';
import routes from '@/navigation/routes';
import {
  AppStackNavigation,
  InterestScreenProps,
  LanguageScreenNav,
  SettingScreenNav,
} from '@/types/typings';
import {RootStackParamList} from '@/navigation/AppNavigator';
import {getData, removeData, storeData} from '@/Utils/useAsyncStorage';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import InAppBrowser from 'react-native-inappbrowser-reborn';

export const HAS_LOCK_APP = 'HAS_LOCK_APP';

const SettingScreen = () => {
  // const {navigate} = useNavigation<LanguageScreenNav>();
  const navigation = useNavigation<SettingScreenNav>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModelType] = useState<string>('');
  const [lock, setLock] = useState<boolean>(false);
  const [biometrics, setBiometrics] = useState<boolean>(false);
  const [biometricsIsSupport, setBiometricsIsSupport] = useState(true);
  const rnBiometrics = new ReactNativeBiometrics();

  const url = 'https://reeplay.app/help';

  const animation = useSharedValue(0);
  const animation2 = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: animation.value}],
    };
  });
  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{translateX: animation2.value}],
    };
  });

  function handleAnimation() {
    if (animation.value === 0) {
      animation.value = withTiming(11.5, {duration: 400});
    } else {
      animation.value = withTiming(0, {duration: 400});
    }
  }
  function handleAnimation2() {
    if (animation.value === 0) {
      animation2.value = withTiming(11.5, {duration: 400});
    } else {
      animation2.value = withTiming(0, {duration: 400});
    }
  }

  const handleLink = async () => {
    await InAppBrowser.open(url);
  };

  async function handleLock() {
    if (lock) {
      await storeData(HAS_LOCK_APP, 'true');
    } else {
      await storeData(HAS_LOCK_APP, 'false');
    }
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

  async function getLockState() {
    const lockState = await getData(HAS_LOCK_APP);
    if (lockState) {
      setLock(JSON.parse(lockState));
      console.log(JSON.parse(lockState));
      if (JSON.parse(lockState))
        animation2.value = withTiming(11.5, {duration: 400});
    }
  }

  function handleClicked(query: string) {
    if (query.includes('clear')) {
      setShowModal(true);
      setModelType('clear');
    }
    if (query.includes('video')) {
      setShowModal(true);
      setModelType('video');
    }
    if (query.includes('help')) handleLink();
    if (query.includes('language')) navigation.navigate(routes.LANGUAGE_SCREEN);
    if (query.includes('privacy')) navigation.navigate(routes.PRIVACY_SCREEN);
    if (query.includes('about')) navigation.navigate(routes.ABOUT_SCREEN);
    if (query.includes('notifications'))
      navigation.navigate(routes.NOTIFICATION_SCREEN_S);
    if (query.includes('interest'))
      navigation.navigate(routes.INTEREST_SCREEN, {isSettings: true});
  }

  useEffect(() => {
    getLockState();
    checkBiometrics();
  }, []);

  useEffect(() => {
    handleLock();
  }, [lock]);

  return (
    <>
      <AppScreen
        containerStyle={{
          paddingTop: 20,
          paddingHorizontal: 0,
          position: 'relative',
          width: Size.getWidth(),
        }}>
        <AppView style={{paddingHorizontal: Size.calcHeight(20)}}>
          <AppView className="mt-2">
            <AppHeader />
          </AppView>
          <AppText
            style={{alignSelf: 'center'}}
            className="absolute top-0 font-LEXEND_600 text-[20px] text-white">
            Settings
          </AppText>
        </AppView>

        <AppView
          style={{paddingHorizontal: Size.calcHeight(20)}}
          className="pr-5 mt-8 -mb-3">
          <AppView className="flex-row items-start mb-6">
            <FingerPrint style={{marginTop: 2}} />
            <AppView className="ml-2 pr-8">
              <AppView className="flex-row w-full items-center justify-between">
                <AppText className="font-MANROPE_500 text-base text-white">
                  Biometrics
                </AppText>
                <TouchableOpacity
                  className={`w-8 h-[19px] rounded-2xl mr-[9px] pt-[1.5px] px-[2px] pb-[2.2px]  items-center flex-row ${
                    biometrics ? 'bg-red' : 'bg-[#bbbbbb]'
                  }`}
                  activeOpacity={1}
                  onPress={() =>
                    biometricsIsSupport
                      ? [setBiometrics(!biometrics), handleAnimation()]
                      : Alert.alert(
                          'Sorry, your device has no biometrics settings active.',
                        )
                  }>
                  <Animated.View style={[animatedStyle, styles.circle]} />
                </TouchableOpacity>
              </AppView>
              <AppText className="mt-1  font-MANROPE_400 text-white text-sm">
                Unlock App and Authorize Reeplay Transactions with your device
                Biometric Security.
              </AppText>
            </AppView>
          </AppView>
        </AppView>
        {SettingTab.map((tabs, i) => {
          const odd = i % 2 !== 0;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleClicked(tabs.toLowerCase())}
              activeOpacity={1}
              style={{
                backgroundColor: !odd ? 'transparent' : '#3E3D3D59',
                paddingHorizontal: Size.calcHeight(25),
              }}
              className="py-4 pb-[18px] flex-row items-center justify-between">
              <AppView className="flex-row items-center gap-x-4">
                {tabs.toLowerCase().includes('clear') && <ClearWatchlist />}
                {tabs.toLowerCase().includes('lock') && <LockAppIcon />}
                {tabs.toLowerCase().includes('language') && <LanguageIcon />}
                {tabs.toLowerCase().includes('video') && <VideoQualityIcon />}
                {tabs.toLowerCase().includes('interest') && <LoveIcon />}
                {tabs.toLowerCase().includes('notifications') && (
                  <NotificationIcon_S />
                )}
                {tabs.toLowerCase().includes('help') && <HelpCenterIcon />}
                {tabs.toLowerCase().includes('privacy') && (
                  <PrivacyPolicyIcon />
                )}
                {tabs.toLowerCase().includes('about') && <AboutUsIcon />}
                <AppText className="font-MANROPE_400 text-sm text-white ">
                  {tabs}
                </AppText>
              </AppView>

              {tabs.toLowerCase().includes('lock') ? (
                <TouchableOpacity
                  className={`w-8 h-[19px] rounded-2xl pt-[1.5px] px-[2px] pb-[2.2px]  items-center flex-row ${
                    lock ? 'bg-red' : 'bg-[#bbbbbb]'
                  }`}
                  activeOpacity={1}
                  onPress={() => [setLock(!lock), handleAnimation2()]}>
                  <Animated.View style={[animatedStyle2, styles.circle]} />
                </TouchableOpacity>
              ) : tabs.toLowerCase().includes('clear') ? (
                <></>
              ) : (
                <RightArrow />
              )}
            </TouchableOpacity>
          );
        })}
      </AppScreen>

      <AppModal
        isModalVisible={showModal}
        hideLoge={modalType === 'clear' ? false : true}
        style={{
          height: 380,
        }}
        hideCloseBtn={true}
        replaceDefaultContent={
          <>
            {modalType === 'video' ? (
              <VideoQualityOption />
            ) : (
              <AppView className="">
                <AppText className="mt-4 font-ROBOTO_400 text-sm text-black text-center leading-5">
                  Are you sure you want to {'\n'}clear watchlist?
                </AppText>

                <AppView className="mt-7" />
                <AppButton
                  bgColor={colors.DARK_GREY}
                  title="No"
                  onPress={() => setShowModal(false)}
                  style={styles.btn}
                  labelStyle={styles.btnLabel}
                />
                <AppButton
                  bgColor={colors.RED}
                  title="Yes"
                  onPress={() => console.log('payment')}
                  style={styles.btn}
                  labelStyle={styles.btnLabel}
                />
                <AppView className="mb-5" />
              </AppView>
            )}
          </>
        }
        handleClose={() => setShowModal(false)}
      />
    </>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  btnLabel: {
    fontFamily: fonts.ROBOTO_700,
    fontSize: 16,
    color: colors.GREY_100,
    marginLeft: 8,
    marginTop: 1,
  },
  btn: {
    width: Size.getWidth() * 0.4,
    paddingTop: Size.calcHeight(9),
    paddingBottom: Size.calcHeight(8),
    borderRadius: 4,
    marginVertical: 5,
  },
  circle: {
    width: 16.5,
    height: 16.5,
    borderRadius: 17 / 2,
    backgroundColor: '#fff',
  },
});
