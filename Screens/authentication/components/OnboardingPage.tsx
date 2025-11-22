import {StyleSheet, Text, View} from 'react-native';
import React, {Fragment} from 'react';
import FastImage, {FastImageProps, Source} from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {AppButton, AppText, AppView} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import colors from '@/configs/colors';
import {RightArrow} from '@/assets/icons';
import fonts from '@/configs/fonts';

interface OnboardingOptions {
  index: number;
  mainText: string;
  mainText2: string;
  source: Source;
  subText: string;
  btnText: string;
  iconLeft?: JSX.Element;
  handleBtn: () => void;
  Indicator: React.JSX.Element;
  subImage?: React.JSX.Element;
}

const OnboardingPage = ({
  index,
  mainText,
  mainText2,
  source,
  subText,
  btnText,
  handleBtn,
  Indicator,
  iconLeft,
  subImage,
}: OnboardingOptions) => {
  return (
    <Fragment>
      <FastImage source={source} style={styles.imageContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,1)']}
          style={styles.gradientStyles}
        />
        <AppView style={{zIndex: 99}}>
          {subImage}
          <AppText className="text-white text-center font-LEXEND_700 text-2xl">
            {mainText}
          </AppText>
          <AppText className="text-white text-center font-LEXEND_700 text-2xl">
            {mainText2}
          </AppText>

          <AppText
            style={{
              paddingTop: Size.calcHeight(42),
              alignSelf: 'center',
            }}
            className="text-lg text-white font-MANROPE_400 text-center">
            {subText}{' '}
          </AppText>
        </AppView>

        <AppView style={{zIndex: 99}} className="absolute bottom-7">
          <AppButton
            title={btnText}
            bgColor={colors.RED}
            iconLeft={iconLeft}
            style={{borderRadius: 8}}
            labelStyle={{
              fontFamily: fonts.MANROPE_800,
              fontSize: 13,
              color: '#fff',
            }}
            onPress={() => handleBtn()}
          />
          {Indicator}
        </AppView>
      </FastImage>
    </Fragment>
  );
};

export default OnboardingPage;

const styles = StyleSheet.create({
  imageContainer: {
    width: '103%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientStyles: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    position: 'absolute',
  },
});
