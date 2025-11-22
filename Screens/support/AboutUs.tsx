import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppButton, AppHeader, AppScreen, AppText, AppView} from '@/components';
import colors from '@/configs/colors';
import {useNavigation} from '@react-navigation/native';
import {AboutScreenRouteProps} from '@/types/typings';
import routes from '@/navigation/routes';

const AboutUs = () => {
  const {navigate} = useNavigation<AboutScreenRouteProps>();
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
        About Reeplay
      </AppText>

      <ScrollView style={{marginTop: 34}}>
        <AppText className="font-LEXEND_400 text-xl text-white mb-5">
          A new wave of entertainment with video on demand.
        </AppText>

        <AppText className="font-MANROPE_400 text-base text-white">
          Reeplay streaming app for original African contents, meant to be the
          reliable source for watching unpolished, in-depth and unrefined
          contents of Africa.
        </AppText>
        <AppText className="font-MANROPE_400 text-base text-white mt-8">
          The Replay Mobile app is a Multi-purpose Video on Demand (VoD)
          Streaming platform for Movies, Tv Series, Live Tv shows & Events.
          Anime and More.
        </AppText>
        <AppText className="font-MANROPE_400 text-base text-white mt-8">
          Replay app delivers content over the internet to consumers, giving
          users the options of choosing a film, show or watch Live show, Live
          events of their choice from a library of contents, anytime they want.
        </AppText>
      </ScrollView>

      <AppView className="absolute bottom-3 w-full">
        <AppButton
          title="Terms & Conditions"
          bgColor={colors.RED}
          onPress={() => navigate(routes.TERMS_SCREEN)}
          style={{width: '100%', borderRadius: 8, marginBottom: 15}}
        />
        <AppButton
          title="Privacy Policy"
          bgColor={colors.GREY_600}
          onPress={() => navigate(routes.PRIVACY_SCREEN)}
          style={{width: '100%', borderRadius: 8}}
        />
      </AppView>
    </AppScreen>
  );
};

export default AboutUs;
