import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {AppButton, AppHeader, AppScreen, AppText, AppView} from '@/components';
import colors from '@/configs/colors';
import {useNavigation} from '@react-navigation/native';

const DeleteScreen = () => {
  const {goBack} = useNavigation();
  return (
    <AppScreen
      containerStyle={{
        paddingTop: 10,
        position: 'relative',
      }}>
      <AppView className="mt-2">
        <AppHeader />
      </AppView>
      <AppText
        style={{alignSelf: 'center'}}
        className="absolute top-0 font-LEXEND_600 text-[20px] text-white">
        Delete Account
      </AppText>

      <ScrollView style={{marginTop: 34}}>
        <AppText className="font-LEXEND_400 text-xl text-white mb-5">
          Are you sure you want to delete your account?
        </AppText>

        <AppText className="font-MANROPE_400 text-base text-white">
          Once you delete your account, it cannot be undone. All your data will
          be permanently erased from this app includes your profile information,
          preferences, saved content, and any activity history.
        </AppText>
        <AppText className="font-MANROPE_400 text-base text-white mt-8">
          We're sad to see you go, but we understand that sometimes it's
          necessary. Please take a moment to consider the consequences before
          proceeding.
        </AppText>
      </ScrollView>

      <AppView className="absolute bottom-3 w-full">
        <AppButton
          title="Delete account"
          bgColor={colors.RED}
          onPress={() => console.log('deleteAccount')}
          style={{width: '100%', borderRadius: 8, marginBottom: 15}}
        />
        <AppButton
          title="Go back"
          bgColor={colors.GREY_600}
          onPress={goBack}
          style={{width: '100%', borderRadius: 8}}
        />
      </AppView>
    </AppScreen>
  );
};

export default DeleteScreen;
