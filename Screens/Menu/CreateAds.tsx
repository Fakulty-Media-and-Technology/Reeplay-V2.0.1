import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {AppScreen, AppText, AppView} from '@/components';
import AppModal from '@/components/AppModal';
import {useNavigation} from '@react-navigation/native';

const CreateAds = () => {
  const {goBack} = useNavigation();
  return (
    <AppScreen containerStyle={{paddingTop: 0}}>
      <AppModal
        isModalVisible={true}
        redCloseBtn
        LogoStyle={{marginBottom: -30, marginTop: -15}}
        style={{height: 383}}
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
        handleClose={goBack}
      />
    </AppScreen>
  );
};

export default CreateAds;

const styles = StyleSheet.create({});
