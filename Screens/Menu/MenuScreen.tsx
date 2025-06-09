import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  AppButton,
  AppImage,
  AppScreen,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import {
  AccountIcon,
  BigClose,
  CreateADIcon,
  DownloadIcon,
  GiftCardIcon,
  NotificationIcon,
  SettingsIcon,
  SuggestionIcon,
  Watchlists,
} from '@/assets/icons';
import Size from '@/Utils/useResponsiveSize';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import {
  AppStackNavigation,
  AuthMainNavigation,
  DashboardNavProps,
} from '@/types/typings';
import routes from '@/navigation/routes';
import colors from '@/configs/colors';
import fonts from '@/configs/fonts';
import AppModal from '@/components/AppModal';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigatorProps } from '@/navigation/AppStack';
import { AuthStackParamList } from '@/navigation/AuthNavigation';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { getData, removeData } from '@/Utils/useAsyncStorage';
import { HAS_SKIPPED } from '../authentication/components/AuthFormComponent';
import { SignUpNavigationProps } from '../authentication/SignUpScreen';
import { hasUserDetails } from '../Splashscreen/Splashscreen';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import {
  logout,
  selectUser,
  selectUserProfilePic,
} from '@/store/slices/userSlice';
import FastImage from 'react-native-fast-image';
import { checkImageUrlValidity } from '@/Utils/ValidateImageUrl';

const tabs = [
  'Account',
  'Downloads',
  'Watchlist',
  'Create AD',
  'Notifications',
  'Suggestions',
  'Giftcards',
  'Settings',
];

const skippedTab = ['Log In', 'Suggestions'];

export type MenuNavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, 'MainNavigation'>,
  NativeStackNavigationProp<AuthStackParamList>
>;

const MenuScreen = () => {
  const user = useAppSelector(selectUser);
  const { goBack, navigate } = useNavigation<DashboardNavProps>();
  const navigation = useNavigation<AppStackNavigation>();
  const nav = useNavigation<MenuNavigationProps>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [ads, setAds] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const profilePic = useAppSelector(selectUserProfilePic);
  const [isValidImg, setVallid] = useState<boolean>(false)

  async function getSkippedState() {
    const hasSkipped = await getData(HAS_SKIPPED);
    if (hasSkipped) {
      setIsSkipped(true);
    }
  }

  async function handleValidImg() {
    const valid = await checkImageUrlValidity(profilePic)
    setVallid(valid)
  }

  function handleNavigation(selectedTab: string) {
    if (selectedTab === 'Account') navigate(routes.ACCOUNT_SCREEN);
    if (selectedTab === 'Log In')
      navigation.navigate(routes.AUTH, { screen: routes.LOGIN_SCREEN });
    if (selectedTab === 'Watchlist') navigate(routes.WATCHLIST_SCREEN);
    if (selectedTab === 'Create AD') setAds(true);
    if (selectedTab === 'Notifications') navigate(routes.NOTIFICATION_SCREEN);
    if (selectedTab === 'Suggestions') navigate(routes.SUGGESTION_SCREEN);
    if (selectedTab === 'Giftcards') navigate(routes.GIFT_CARD_SCREEN);
    if (selectedTab === 'Settings') navigation.navigate(routes.SETTINGS_SCREEN);
    if (selectedTab === 'Downloads')
      navigation.navigate(routes.DOWNLOAD_SCREEN);
  }

  async function handleLogout() {
    await removeData(hasUserDetails);
    dispatch(logout({}));
    setShowModal(false);
    nav.reset({
      index: 0,
      routes: [{ name: routes.AUTH }],
    });
  }

  useEffect(() => {
    getSkippedState();
    handleValidImg();
  }, []);

  return (
    <>
      <AppScreen containerStyle={{ paddingTop: Size.calcHeight(20) }}>
        <AppView className="flex-row items-center justify-between">
          {!isSkipped && (
            <AppView className="flex-row items-center gap-x-3">
              {!isValidImg ? (
                <AppImage
                  source={require('@/assets/images/bbn.png')}
                  className="w-[64px] h-[64px] rounded-full"
                />
              ) : (
                <FastImage
                  source={{
                    uri: profilePic,
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.web,
                  }}
                  style={{
                    width: 65,
                    height: 65,
                    borderRadius: 99,
                  }}
                />
              )}
              <AppText className="font-MANROPE_700 capitalize text-base text-white">
                {user.first_name} {user.last_name}
              </AppText>
            </AppView>
          )}
          <TouchableOpacity className="ml-auto" onPress={goBack}>
            <BigClose />
          </TouchableOpacity>
        </AppView>

        <AppView className="mt-10 pl-5 space-y-10">
          {(isSkipped ? skippedTab : tabs).map((tab, i) => {
            return (
              <TouchableOpacity
                onPress={() => handleNavigation(tab)}
                key={i}
                className="flex-row items-center gap-x-4">
                {(tab === 'Account' || tab === 'Log In') && <AccountIcon />}
                {tab === 'Downloads' && <DownloadIcon />}
                {tab === 'Watchlist' && <Watchlists />}
                {tab === 'Create AD' && <CreateADIcon />}
                {tab === 'Notifications' && <NotificationIcon />}
                {tab === 'Suggestions' && <SuggestionIcon />}
                {tab === 'Giftcards' && <GiftCardIcon />}
                {tab === 'Settings' && <SettingsIcon />}
                <AppText className="font-MANROPE_400 text-[14.5px] text-white">
                  {tab}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </AppView>

        <AppView className="mt-auto pl-5 mb-10">
          <Pressable
            onPress={() =>
              isSkipped
                ? navigation.navigate(routes.AUTH, {
                  screen: routes.SIGNUP_SCREEN,
                })
                : setShowModal(true)
            }>
            <AppText className="font-MANROPE_400 text-sm text-red">
              {isSkipped ? 'Sign Up' : 'Log out'}
            </AppText>
          </Pressable>
          <AppText className="mt-3 font-MANROPE_400 text-sm text-light_blue">
            Reeplay Version 2.0.1
          </AppText>
        </AppView>
      </AppScreen>

      <AppModal
        isModalVisible={showModal}
        hideCloseBtn
        replaceDefaultContent={
          <AppView className="">
            <AppText className="mt-4 font-ROBOTO_400 text-sm text-black text-center leading-5">
              Are you sure you want to {'\n'}Logout?
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
              onPress={async () => await handleLogout()}
              style={styles.btn}
              labelStyle={styles.btnLabel}
            />
            <AppView className="mb-3" />
          </AppView>
        }
        handleClose={() => setShowModal(false)}
      />

      <AppModal
        isModalVisible={ads}
        redCloseBtn
        LogoStyle={{ marginBottom: -30, marginTop: -15 }}
        style={{ height: 383 }}
        replaceDefaultContent={
          <AppView className="mb-3 mt-5 items-center">
            <AppText className="mt-5 leading-5 font-ROBOTO_500 text-[14px] text-black text-center">
              Sorry, you are not authorized {'\n'}to create Ads.
            </AppText>
            <AppText className="mt-5 leading-5 font-ROBOTO_400 text-[14px] text-black text-center">
              Kindly go through a {'\n'} licensed agent, who already has a
              relationship with Reeplay.
            </AppText>
          </AppView>
        }
        handleClose={() => setAds(false)}
      />
    </>
  );
};

export default MenuScreen;

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
});
