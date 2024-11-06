import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {AppHeader, AppImage, AppScreen, AppText, AppView} from '@/components';
import colors from '@/configs/colors';

const suggestive_Lan = ['English (US)'];

const LanguageScreen = () => {
  const [activeIndx, setActiveIndx] = useState<number | null>(null);
  const [activeSuggestiveIndx, setActiveSuggestiveIndx] = useState<
    number | null
  >(0);
  return (
    <AppScreen containerStyle={{paddingTop: 10, position: 'relative'}}>
      <AppHeader />
      <AppView className="absolute -z-[10px] -top-[70px] w-full items-center">
        <AppImage source={require('@/assets/images/Logo_L.png')} className="" />
      </AppView>
      <AppText className="font-LEXEND_700 text-white text-lg mt-9 mb-4">
        Language
      </AppText>
      <AppText className="font-MANROPE_500 text-yellow text-base mt-1 mb-5">
        Suggested
      </AppText>
      {/* Suggestive list */}
      <AppView className="mb-6">
        {suggestive_Lan.map((x, i) => {
          const show = activeSuggestiveIndx === i;
          return (
            <AppView key={i} style={styles.center} className="mb-4">
              <AppText className="font-MANROPE_400 text-base text-white">
                {x}
              </AppText>
              <Pressable
                style={styles.elipses}
                onPress={() => [
                  setActiveSuggestiveIndx(i),
                  setActiveIndx(null),
                ]}>
                {show && (
                  <AppView className="bg-red w-[9px] h-[9px] rounded-full" />
                )}
              </Pressable>
            </AppView>
          );
        })}
      </AppView>
      <FlatList
        data={[]}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => {
          const show = activeIndx === index;
          return (
            <AppView style={styles.center} className="mb-4">
              <AppText className="font-MANROPE_400 text-base text-white">
                Arabic
              </AppText>
              <Pressable
                style={styles.elipses}
                onPress={() => [
                  setActiveSuggestiveIndx(null),
                  setActiveIndx(index),
                ]}>
                {show && (
                  <AppView className="bg-red w-[9px] h-[9px] rounded-full" />
                )}
              </Pressable>
            </AppView>
          );
        }}
      />
    </AppScreen>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  elipses: {
    width: 15.5,
    height: 15.5,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: colors.RED,
    // backgroundColor: colors.RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
