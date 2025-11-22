import {StatusBar, StyleSheet, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {AppButton, AppImage, AppText, AppView} from '@/components';
import Onboarding from 'react-native-onboarding-swiper';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import FastImage from 'react-native-fast-image';
import OnboardingPage from './components/OnboardingPage';
import {RedTick, RightArrow} from '@/assets/icons';
import {useNavigation} from '@react-navigation/native';
import {OnboardingScreenProps} from '@/types/typings';
import routes from '@/navigation/routes';

const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenProps>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const onboardingRef = useRef<Onboarding>(null);

  const handleNext = () => {
    onboardingRef.current?.goNext();
    setCurrentIndex(currentIndex + 1);
  };

  const handlePageCallBack = (pageNumber: number) => {
    setCurrentIndex(pageNumber);
  };

  const Indicator = () => {
    return (
      <AppView className="w-full flex-row gap-x-2 items-center justify-center mt-7">
        {[...new Array(3)].map((_, index) => (
          <AppView
            key={index}
            className="w-[50px] h-1 rounded-[10px]"
            style={[
              {
                backgroundColor:
                  index === currentIndex
                    ? colors.RED
                    : 'rgba(255, 19, 19, 0.4)',
              },
            ]}
          />
        ))}
      </AppView>
    );
  };

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <StatusBar hidden />
      <Onboarding
        ref={onboardingRef}
        showPagination={false}
        imageContainerStyles={{paddingBottom: 0}}
        titleStyles={{height: 0, paddingBottom: 0, paddingTop: 0}}
        subTitleStyles={{height: 0}}
        controlStatusBar={false}
        pageIndexCallback={handlePageCallBack}
        pages={[
          {
            title: '',
            subtitle: '',
            backgroundColor: colors.DEEP_BLACK,
            image: (
              <>
                <OnboardingPage
                  index={currentIndex}
                  source={require('@/assets/images/ONBOARDING1.jpg')}
                  mainText="Watch everything"
                  mainText2="in one place"
                  subText={`See your Favorite Content ${'\n'}on REEPLAY.`}
                  btnText="NEXT"
                  handleBtn={handleNext}
                  iconLeft={
                    <RightArrow style={{position: 'absolute', right: 20}} />
                  }
                  Indicator={<Indicator />}
                />
              </>
            ),
          },
          {
            title: '',
            subtitle: '',
            backgroundColor: colors.DEEP_BLACK,
            image: (
              <>
                <OnboardingPage
                  index={currentIndex}
                  source={require('@/assets/images/ONBOARDING2.jpg')}
                  subImage={<ImageView />}
                  mainText="Watch"
                  mainText2="on any device"
                  subText={`Stream on your Phone, ${'\n'}Tablet and Laptop, ${'\n'}without paying more.`}
                  btnText="NEXT"
                  handleBtn={handleNext}
                  iconLeft={
                    <RightArrow style={{position: 'absolute', right: 20}} />
                  }
                  Indicator={<Indicator />}
                />
              </>
            ),
          },
          {
            title: '',
            subtitle: '',
            backgroundColor: colors.DEEP_BLACK,
            image: (
              <>
                <OnboardingPage
                  index={currentIndex}
                  source={require('@/assets/images/ONBOARDING3.jpg')}
                  subImage={<ImageView2 />}
                  mainText="Download Movies"
                  mainText2="with a Tap"
                  subText={`Have something to watch ${'\n'}offline, anytime.`}
                  btnText="CONTINUE"
                  handleBtn={() => navigation.replace(routes.AUTH)}
                  Indicator={<Indicator />}
                />
              </>
            ),
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;

const ImageView = () => {
  return (
    <View
      style={{
        marginBottom: Size.getHeight() * 0.06,
        marginTop: -Size.getHeight() * 0.08,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.PicContainer}>
          <AppImage
            source={require('@/assets/images/MovieThree.png')}
            style={styles.imageActualSize}
            resizeMode="cover"
          />
        </View>
        <View style={[styles.PicContainer, {width: Size.getWidth() * 0.25}]}>
          <AppImage
            source={require('@/assets/images/MovieTwo.png')}
            style={styles.imageActualSize}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={styles.PicWrapper}>
        <AppImage
          source={require('@/assets/images/Movie.png')}
          style={styles.imageActualSize}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const ImageView2 = () => {
  return (
    <View
      style={{
        marginBottom: Size.getHeight() * 0.07,
        marginTop: -Size.getHeight() * 0.09,
      }}>
      <View style={styles.PicWrapper2}>
        <FastImage
          source={require('@/assets/images/Group.png')}
          style={[styles.imageActualSize, styles.center]}
          resizeMode="cover">
          <RedTick />
          <View style={styles.line} />
        </FastImage>
      </View>
      <View style={styles.ProgressBarView}>
        <View style={styles.ProgressInnerBarView}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  PicContainer: {
    height: Size.getHeight() * 0.2,
    width: Size.getWidth() * 0.3,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C4C4C4',
    overflow: 'hidden',
    margin: 5,
  },
  PicWrapper: {
    height: Size.getHeight() * 0.2,
    width: Size.getWidth() * 0.55,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C4C4C4',
    overflow: 'hidden',
    alignSelf: 'center',
    margin: 5,
  },
  PicWrapper2: {
    height: Size.getHeight() * 0.35,
    width: Size.getWidth() * 0.45,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.WHITE,
    overflow: 'hidden',
    alignSelf: 'center',
    margin: 5,
  },
  imageActualSize: {
    height: '100%',
    width: '100%',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    backgroundColor: colors.GREY_100,
    width: '35%',
    height: 5,
    borderRadius: 10,
    position: 'absolute',
    bottom: 7,
  },
  ProgressBarView: {
    height: 7,
    width: Size.getWidth() * 0.3,
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 12,
  },
  ProgressInnerBarView: {
    height: 7,
    width: Size.getWidth() * 0.25,
    backgroundColor: colors.RED,
    borderRadius: 10,
  },
});
