import {
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Header from '@/Screens/Home/Header';
import colors from '@/configs/colors';
import Slider from '@/Screens/Home/components/SliderContainer';
import {LiveSliderData} from '@/configs/data';
import {AppText, AppView} from '@/components';
import SwiperContainer from '@/Screens/Home/components/SwiperContainer';
import DynamicViewContainer from './DynamicViewContainer';
import Size from '@/Utils/useResponsiveSize';
import BlurView from 'react-native-blur-effect';
import {BlurView as Blur} from '@react-native-community/blur';
import Orientation, {PORTRAIT} from 'react-native-orientation-locker';
import {useAppSelector} from '@/Hooks/reduxHook';
import {selectSponsoredEvents} from '@/store/slices/liveEvents/sponsoredSlice';

const LiveScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollY2 = useRef(new Animated.Value(0)).current;
  const [isScrolled, setIsScrolled] = useState(0);
  const [orientation, setOrientation] = useState<string | null>(null);

  const getItemCount = () => 1; // One group of items (Slider + DynamicViewContainer)

  const getItem = (_data: any, index: number) => index;

  const renderItem = () => {
    return (
      <>
        <Slider data={LiveSliderData} live />
        <DynamicViewContainer scrollY={scrollY2} />
      </>
    );
  };

  useEffect(() => {
    const listernerID = scrollY.addListener(({value}) => {
      setIsScrolled(value);
      scrollY2.setValue(value);
    });

    return () => {
      scrollY.removeListener(listernerID);
    };
  }, [scrollY]);

  function checkOrientation() {
    Orientation.getOrientation(orient => {
      if (orient !== PORTRAIT) {
        Orientation.lockToPortrait();
        checkOrientation();
      } else {
        setOrientation(orient);
      }
      // dispatch(set(orientation))
    });
  }

  useLayoutEffect(() => {
    checkOrientation();
  }, []);
  return (
    <>
      <AppView
        style={{
          minHeight: Size.calcHeight(90),
          backgroundColor: 'rgba(0, 0, 0, 0.59)',
        }}
        className="absolute bottom-0 w-full z-20">
        {Platform.OS === 'ios' ? (
          <Blur
            blurType="dark"
            blurAmount={120}
            style={{
              minHeight: Size.calcHeight(90),
              width: '100%',
            }}
          />
        ) : (
          <BlurView backgroundColor="rgba(0, 0, 0, 0.4)" blurRadius={120} />
        )}
      </AppView>
      {orientation === 'PORTRAIT' ? (
        <>
          <Header scroll={isScrolled} />
          <StatusBar
            translucent
            barStyle="light-content"
            backgroundColor="transparent"
          />

          <VirtualizedList
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: false},
            )}
            scrollEventThrottle={16}
            decelerationRate="normal"
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: colors.DEEP_BLACK,
              position: 'relative',
            }}
            getItemCount={getItemCount}
            getItem={getItem}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      ) : (
        <AppView className="w-full h-full bg-black" />
      )}
    </>
  );
};

export default LiveScreen;

const styles = StyleSheet.create({});
