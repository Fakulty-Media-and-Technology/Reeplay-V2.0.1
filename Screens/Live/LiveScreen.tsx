import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  VirtualizedList,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Header from '@/Screens/Home/Header';
import colors from '@/configs/colors';
import Slider from '@/Screens/Home/components/SliderContainer';
import { AppView } from '@/components';
import DynamicViewContainer from './DynamicViewContainer';
import Size from '@/Utils/useResponsiveSize';
import BlurView from 'react-native-blur-effect';
import { BlurView as Blur } from '@react-native-community/blur';
import Orientation, { PORTRAIT } from 'react-native-orientation-locker';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { selectBannerContent } from '@/store/slices/bannerSlice.slice';
import { resetFullVideo, resetLiveVideo, selectFullVideoProps, selectLiveModalContent } from '@/store/slices/fullScreenVideo.slice';
import FullscreenModalPlayer from './FullscreenModalPlayer';
import { OrientationInjectedProps } from '@/components/OrientationWrapper';
import AppModal from '@/components/AppModal';
import LiveInfoModal from './components/LiveInfoModal';
import { setHideTabBar } from '@/store/slices/userSlice';
import { ILiveContent, IVODContent } from '@/types/api/content.types';
import { useIsFocused } from '@react-navigation/native';

const LiveScreen = ({isFullscreen,makeFullscreen,makePortrait}:OrientationInjectedProps) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollY2 = useRef(new Animated.Value(0)).current;
  const [isScrolled, setIsScrolled] = useState(0);
  const live = useAppSelector(selectBannerContent).lives
  const isFullscreenContent = useAppSelector(selectFullVideoProps);
  const isLiveModalContent = useAppSelector(selectLiveModalContent);
  const [currentContentState, setContentState] = useState<IVODContent|ILiveContent|null>(isFullscreenContent)
  const dispatch = useAppDispatch();
      const isFocused = useIsFocused();

  // function makeFullscreen(){
  //   runFullscreen()
  // }

  const getItemCount = () => 1;

  const getItem = (_data: any, index: number) => index;

  const renderItem = () => {
    return (
      <>
        <Slider data={live} live makeFullscreen={makeFullscreen}  />
        <DynamicViewContainer scrollY={scrollY2} makeFullscreen={makeFullscreen} />
      </>
    );
  };

  useEffect(() => {
    const listernerID = scrollY.addListener(({ value }) => {
      setIsScrolled(value);
      scrollY2.setValue(value);
    });

    return () => {
      scrollY.removeListener(listernerID);
    };
  }, [scrollY]);

  function checkOrientation() {
   if(!isFullscreen) Orientation.lockToPortrait();
  }

  useEffect(() => {
    checkOrientation();
    if(!isFullscreen && isFullscreenContent){
      dispatch(setHideTabBar(true))
    }else{
      dispatch(setHideTabBar(isFullscreen))
    }
  }, [isFullscreen]);

  useEffect(() =>{
    if(!currentContentState) setContentState(isFullscreenContent)
  }, [isFullscreenContent])

   useEffect(() =>{
    if(!isFullscreenContent) return;
    if(isFocused && !currentContentState) {
      setContentState(isFullscreenContent)
      makeFullscreen();
      dispatch(setHideTabBar(true))
    } 
  }, [isFocused]);


  return (
    <>
      {!isFullscreen &&<AppView
        style={[{
          minHeight: 55,
          backgroundColor: 'rgba(0, 0, 0, 0.59)',
        }]}
        className="absolute bottom-0 w-full z-20">
        {Platform.OS === 'ios' ? (
          <Blur
            blurType="dark"
            blurAmount={120}
            style={{
              minHeight: 55,
              width: '100%',
            }}
          />
        ) : (
          <BlurView backgroundColor="rgba(0, 0, 0, 1)" blurRadius={120} />
        )}
      </AppView>}
          <StatusBar
            hidden={isFullscreen || isFullscreenContent !== null}
            translucent
            barStyle="light-content"
            backgroundColor="transparent"
          />
      {(!isFullscreen && !(isFullscreenContent && !currentContentState)) &&  <>
          <Header scroll={isScrolled} />

          <VirtualizedList
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false },
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

 <AppModal
        isModalVisible={isLiveModalContent !== null}
        handleClose={() => dispatch(resetLiveVideo())}
        style={{padding:0, margin:0, marginLeft:0, height:Size.hp(50)}}
        hideCloseBtn
        hideLoge
        replaceDefaultContent={
          <>
           {isLiveModalContent && <LiveInfoModal 
              item={isLiveModalContent}
              handleClose={() => dispatch(resetLiveVideo())}
              makeFullscreen={makeFullscreen}
              isBanner
            />}
          </>
        }
      />
        </>}
     

      {(isFullscreenContent && isFullscreen) && <FullscreenModalPlayer 
        currentContentState={currentContentState}
        setContentState={setContentState}
        isFullscreen={isFullscreen}
        content={isFullscreenContent}
        setFullscreen={() => isFullscreen ? [makePortrait()] : makeFullscreen()} 
      />}     
    </>
  );
};

export default LiveScreen;