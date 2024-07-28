import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  AppButton,
  AppImage,
  AppScreen,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import {useNavigation} from '@react-navigation/native';
import {
  AccountDashboard,
  ArrowRight,
  CardDots,
  EditIcon,
  Green_SubscripeIcon,
  PasswordDashboard,
  PhoneDashboard,
  PinDashboard,
  SubscribeIcon,
  VisaCard,
} from '@/assets/icons';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import {AccountdNavProps} from '@/types/typings';
import routes from '@/navigation/routes';
import {
  Asset,
  CameraOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import AppModal from '@/components/AppModal';
import fonts from '@/configs/fonts';
import {MenuNavigationProps} from './MenuScreen';
import {useAppDispatch, useAppSelector} from '@/Hooks/reduxHook';
import {
  selectUser,
  selectUserProfilePic,
  setCredentials,
} from '@/store/slices/userSlice';
import {pickSingleImage} from '@/Utils/MediaPicker';
import {getProfileDetails, uploadProfile} from '@/api/profile.api';
import {formatDate} from '@/Utils/formatTime';

const AccountScreen = () => {
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation<AccountdNavProps>();
  const user = useAppSelector(selectUser);
  const profilePic = useAppSelector(selectUserProfilePic);
  const nav = useNavigation<MenuNavigationProps>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const billingService = false;

  const openGallery = async () => {
    setLoading(true);
    const result = await pickSingleImage();
    if (result && result.uri && result.fileName && result.type) {
      let data = new FormData();
      data.append('fileHandle', 'photo');
      data.append('photo', {
        uri: result.uri,
        name: result.fileName,
        type: result.type,
      });

      const res = await uploadProfile(data);
      console.log(res);
      if (res.ok && res.data) {
        const profileRes = await getProfileDetails();
        if (profileRes.ok && profileRes.data) {
          dispatch(setCredentials(profileRes.data.data));
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  };

  function handleLogout() {
    nav.navigate(routes.AUTH);
    setShowModal(false);
  }

  console.log(profilePic, 'pic', user);

  return (
    <>
      <AppScreen scrollable containerStyle={{paddingTop: 20}}>
        <TouchableOpacity onPress={() => navigate(routes.MENU_SCREEN)}>
          <AppText className="font-ROBOTO_400 text-white text-[15px]">
            Back
          </AppText>
        </TouchableOpacity>

        <AppView className="flex-row items-center justify-between mt-3">
          <AppView className="flex-row items-center gap-x-[14px]">
            <AppView className="relative items-center justify-center">
              {profilePic === 'no profile picture' ? (
                <AppImage
                  source={require('@/assets/images/bbn.png')}
                  className="w-[64px] h-[64px] rounded-full"
                />
              ) : (
                <AppImage
                  source={{uri: profilePic}}
                  className="w-[64px] h-[64px] rounded-full"
                />
              )}

              {loading && (
                <ActivityIndicator
                  size={16}
                  color={colors.WHITE}
                  style={{position: 'absolute'}}
                />
              )}
            </AppView>

            <AppView>
              <AppText className="font-MANROPE_700 capitalize text-white text-lg">
                {user.first_name} {user.last_name}
              </AppText>
              <AppText className="font-MANROPE_400 text-grey_100 text-[14px]">
                Joined {formatDate(user.createdAt)}
              </AppText>
            </AppView>
          </AppView>

          <TouchableOpacity onPress={openGallery}>
            <EditIcon />
          </TouchableOpacity>
        </AppView>

        {/* Body */}
        <AppView className="mt-11">
          <AppText className="font-MANROPE_500 text-[16px] text-white uppercase">
            ACCOUNT
          </AppText>
          <AppView className="mt-3 pt-5 pb-7 pl-4 pr-5 space-y-9 border border-[#C4C4C445] rounded-md bg-[#1A1A1AD9]">
            <TouchableOpacity
              onPress={() => navigate(routes.CHANGE_EMAIL)}
              className="flex-row items-center justify-between">
              <AppView className="flex-row items-center">
                <AccountDashboard />
                <AppText className="ml-2 font-MANROPE_400 text-base text-white">
                  {user.email}
                </AppText>
              </AppView>
              {/* Arroa */}
              <ArrowRight />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate(routes.CHANGE_PASSWORD)}
              className="flex-row items-center justify-between">
              <AppView className="flex-row items-center">
                <PasswordDashboard />
                <AppText className="ml-2 font-MANROPE_400 text-base text-white">
                  Change Password
                </AppText>
              </AppView>
              {/* Arroa */}
              <ArrowRight />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate(routes.CHANGE_PIN)}
              className="flex-row items-center justify-between">
              <AppView className="flex-row items-center">
                <PinDashboard />
                <AppText className="ml-2 font-MANROPE_400 text-base text-white">
                  Change Pin
                </AppText>
              </AppView>
              {/* Arroa */}
              <ArrowRight />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate(routes.CHANGE_PHONE)}
              className="flex-row items-center justify-between">
              <AppView className="flex-row items-center">
                <PhoneDashboard />
                <AppText className="ml-2 font-MANROPE_400 text-base text-white">
                  {user.mobile}
                </AppText>
              </AppView>
              {/* Arroa */}
              <ArrowRight />
            </TouchableOpacity>
          </AppView>
        </AppView>

        <AppView className="mt-10">
          <AppText className=" font-MANROPE_500 text-[16px] text-white uppercase">
            BILLING
          </AppText>
          <AppView className="mt-3 pt-5 pb-7 pl-4 pr-5 border border-[#C4C4C445] rounded-md bg-[#1A1A1AD9]">
            {billingService ? (
              <AppView className="flex-row items-center justify-between mb-9">
                <AppView className="flex-row items-center">
                  <VisaCard />
                  <AppView className="flex-row items-center ml-3">
                    <CardDots />
                    <AppText className="font-MANROPE_500 text-[15px] text-white ml-1.5">
                      5071
                    </AppText>
                  </AppView>
                </AppView>

                <TouchableOpacity className="flex-row items-center mr-1.5">
                  <Green_SubscripeIcon />
                  <AppText className="font-MANROPE_400 text-[13px] text-green ml-1">
                    Active Plan
                  </AppText>
                </TouchableOpacity>
              </AppView>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  navigate(routes.SUBSCRIPTION_SCREEN, {tab: 'getSubscription'})
                }
                className="flex-row items-center gap-x-2 mb-7">
                <SubscribeIcon />
                <AppText className=" font-MANROPE_400 text-yellow text-base">
                  Get Subscription
                </AppText>
              </TouchableOpacity>
            )}

            <TouchableOpacity className="flex-row items-center justify-between ml-1 mb-8">
              <AppText className=" font-MANROPE_400 text-[16px] text-white">
                {billingService
                  ? 'Your next billing date is Jan 14, 2024'
                  : 'Your next billing date is not available'}
              </AppText>
              <ArrowRight />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate(routes.ADD_PAYMENT_METHOD)}
              className="flex-row items-center justify-between">
              <AppText className="ml-2 font-MANROPE_400 text-[16px] text-white">
                {billingService
                  ? 'Change Payment Method '
                  : 'Add Payment Method / Billing Details'}
              </AppText>
              {/* Arroa */}
              <ArrowRight />
            </TouchableOpacity>

            <AppView className="mt-10">
              {billingService ? (
                <AppView className="flex-row items-center justify-between px-5">
                  <AppView className="ml-2">
                    <AppText className=" font-ROBOTO_700 text-base text-red">
                      ₦300.00
                    </AppText>
                    <AppText className=" font-MANROPE_400 text-white text-[14px] text-center">
                      Balance
                    </AppText>
                  </AppView>

                  <AppButton
                    bgColor={colors.RED}
                    title="Top up"
                    onPress={() =>
                      navigate(routes.SUBSCRIPTION_SCREEN, {
                        tab: 'topup',
                      })
                    }
                    style={{
                      width: '37%',
                      borderRadius: 5,
                      paddingVertical: Size.calcHeight(13),
                    }}
                  />
                </AppView>
              ) : (
                <AppButton
                  bgColor={colors.RED}
                  title="Top up"
                  onPress={() =>
                    navigate(routes.SUBSCRIPTION_SCREEN, {tab: 'topup'})
                  }
                  style={{
                    width: '100%',
                    borderRadius: 5,
                    paddingVertical: Size.calcHeight(15),
                  }}
                />
              )}
            </AppView>
          </AppView>
        </AppView>

        <AppView className="mt-6 ml-6 mb-10">
          <Pressable
            onPress={() =>
              billingService
                ? navigate(routes.CANCEL_SUBSCRIPTION_SCREEN)
                : setShowModal(true)
            }>
            <AppText className=" font-MANROPE_400 text-sm text-[#DE3B40]">
              {billingService ? 'Cancel Subscription' : 'Log out'}
            </AppText>
          </Pressable>
          <Pressable onPress={() => navigate(routes.DELETE_ACCOUNT_SCREEN)}>
            <AppText className="mt-3 font-MANROPE_400 text-sm text-light_blue">
              Delete account
            </AppText>
          </Pressable>
        </AppView>
      </AppScreen>

      <AppModal
        isModalVisible={showModal}
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
              onPress={() => handleLogout()}
              style={styles.btn}
              labelStyle={styles.btnLabel}
            />
          </AppView>
        }
        handleClose={() => setShowModal(false)}
      />
    </>
  );
};

export default AccountScreen;

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
