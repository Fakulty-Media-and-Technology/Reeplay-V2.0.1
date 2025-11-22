import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { PlayButton } from './controls/PlayButton';
import { VideoPlayerProps } from 'react-native-video-player';
import { AnimatedWrapper, AnimationRef } from './controls/AnimatedWrapper';
import { Text, TouchableOpacity, View } from 'react-native';
import { DurationText, ProgressingDuration } from './controls/Durations';
import { MotiView } from 'moti';
import { Mute } from './controls/Mute';
import { Fullscreen } from './controls/Fullscreen';
import { Seekbar, SeekbarProps } from './controls/Seekbar';
import Animated, { Easing } from 'react-native-reanimated';
import Casting from './controls/Casting';
import CTAButton from './controls/ctaButton';
import { fullVideoType } from '@/navigation/AppNavigator';
import EpisodeNext from './controls/EpisodeNext';
import Subtitle from './controls/Subtitle';
import LinearGradient from 'react-native-linear-gradient';
import { BigClose, BrightnessIcon, PreviewCloseIcon, SeekBackIcon, SeekForwardIcon } from '@/assets/icons';
import { useNavigation } from '@react-navigation/native';
import BrightnessBar from '@/Screens/VideoScreen/components/BrightnessBar';
import AppImage from '../AppImage';
import { IContentData } from './DynamicVideoComponent';
import EyesIcon from '@/assets/icons/eyes.svg'
import { useSocket } from '../../Hooks/useSocket';
import { formatAmount } from '@/Utils/formatAmount';

const AnimatedLinear = Animated.createAnimatedComponent(LinearGradient);

interface ControlsProps
  extends Omit<SeekbarProps, 'customStyles' | 'onSeeking'> { 
  customStyles: VideoPlayerProps['customStyles'];
  showDuration: VideoPlayerProps['showDuration'];
  disableFullscreen: VideoPlayerProps['disableFullscreen'];
  animationDuration: number;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
  onPlayPress: () => void;
  onMutePress: () => void;
  onToggleFullScreen: () => void;
  handleVideoCastingFunc?: () => void;
  handleCTAFunc?: () => void;
  handleNEXT?: () => void;
  handleSUBTITLE?: () => void;
  type?: string;
ctaType?:'vote'|'donate'
  isControlsVisible: boolean;
  isFullscreeen: boolean;
  isLoading: boolean
  contentData:IContentData
  isTime: boolean
  handleGoBackFunc?:() => void
}

export interface ProgressRef {
  onProgress: (progress: number) => void;
}

export const Controls = forwardRef<ProgressRef, ControlsProps>(
  (
    {
      customStyles,
      onPlayPress,
      isPlaying,
      showDuration,
      onToggleFullScreen,
      duration,
      disableFullscreen,
      onMutePress,
      isMuted,
      animationDuration,
      controlsTimeoutId,
      isControlsVisible,
      type,
      ctaType,
      handleCTAFunc,
      handleNEXT,
      handleSUBTITLE,
      handleVideoCastingFunc,
      isFullscreeen,
      onSeek,
      isLoading,
      contentData,
      handleGoBackFunc,
      isTime,
      ...seekbarProps
    },
    ref
  ) => {
    const {_id,logo,title} = contentData
    const durationRef = useRef<ProgressRef>(null);
    const seekbarRef = useRef<ProgressRef>(null);
    const animationRef = useRef<AnimationRef>(null);
    const {goBack} = useNavigation();
    const SEEK_TIME = 10;
    const progressRef = useRef<number>(0);
      const [brightLevel, setLevel] = useState<number|null>(null);
      const [viewsCount, setViewsCount] = useState<number>(contentData.viewsCount);
      const {socket} = useSocket();
      
      function handleSocket(){
        socket.on('joinedRoom', () =>{
          setViewsCount(prev => prev+1)
        });
      }

useEffect(() =>{
  handleSocket();
}, [])

const handleSeekForward = useCallback(() => {
  const currentTimeInSeconds = progressRef.current * duration;
  const newPositionInSeconds = currentTimeInSeconds + SEEK_TIME;
  onSeek(Math.min(newPositionInSeconds, duration));
}, [duration, onSeek]);

const handleSeekBackward = useCallback(() => {
  const currentTimeInSeconds = progressRef.current * duration;
  const newPositionInSeconds = currentTimeInSeconds - SEEK_TIME;
  onSeek(Math.max(newPositionInSeconds, 0));
}, [duration, onSeek]);

    useImperativeHandle(ref, () => ({
      onProgress: (progress) => {
        durationRef.current?.onProgress(progress);
        seekbarRef.current?.onProgress(progress);
        progressRef.current = progress
      },
      runControlsAnimation: (toValue: number, callback?: () => void) => {
        console.log(toValue, isPlaying, isControlsVisible)
        if (!isPlaying && isControlsVisible){
            animationRef.current?.runControlsAnimation(0, callback);
            return;
        } 
        animationRef.current?.runControlsAnimation(toValue, callback);
      },
    }));

    if (!isControlsVisible && !isLoading && type !== 'live') {
      return (
        <View className='mt-auto mb-1'>
            <Seekbar
              fullWidth={true}
              ref={seekbarRef}
              {...seekbarProps}
              onSeek={onSeek}
              onSeeking={(progress) => durationRef.current?.onProgress(progress)}
              isPlaying={isPlaying}
              controlsTimeoutId={controlsTimeoutId}
              duration={duration}
              seekBarBackgroundCustomStyles={customStyles?.seekBarBackground}
              seekBarCustomStyles={customStyles?.seekBar}
              seekBarFullWidthCustomStyles={customStyles?.seekBarFullWidth}
              seekBarKnobCustomStyles={customStyles?.seekBarKnob}
              seekBarKnobSeekingCustomStyles={customStyles?.seekBarKnobSeeking}
              seekBarProgressCustomStyles={customStyles?.seekBarProgress}
              isFullscreeen={isFullscreeen}
            />
        </View>
      );
    }

    return (
      <AnimatedWrapper
        ref={animationRef}
        animationDuration={animationDuration}
      >
        {/* LINEAR GRADINETS */}
        <>
        {/* TOP */}
        {isFullscreeen && <AnimatedLinear
            colors={['rgba(0, 0, 0, 0.6)', 'transparent']}
            style={{
                position: 'absolute',
                top: 0,
                height: 70,
                width: '100%',
                zIndex: -20,
            }}
        />}

        {/* BOTTOM */}
       {!isFullscreeen ? <AnimatedLinear
            colors={['transparent', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 1)']}
            style={{
                position: 'absolute',
                bottom: 0,
                    height: 40,
                    width: '100%',
                    zIndex: -20,
                }}
                />:  <AnimatedLinear
                        colors={['transparent', 'rgb(0, 0, 0)']}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            height: 81,
                            width: '100%',
                            zIndex: -20,
                        }}
                    />}

        </>
<View style={[isFullscreeen && {width:'90%', marginHorizontal:'auto'}]} className='flex-1 mb-2.5'>
        {/* TOP PART */}
        <View className='m-2 mr-4'>
           {!isFullscreeen ? <View className='flex-row items-center gap-x-6 ml-auto'>
              <Casting 
                handleCastingFunc={handleVideoCastingFunc}
            />

            
            <TouchableOpacity onPress={goBack}>
              <PreviewCloseIcon />
            </TouchableOpacity>
          </View>: <View className='flex-row items-center justify-between'>
            <View className="ml-7 flex-row items-center">
              {logo && (
                <AppImage
                  source={(typeof logo === 'string' && logo !== '') ? {uri:logo} : require('@/assets/images/user.png')}
                  style={{width:28, height:28, borderRadius:99, marginRight:8}}
                />
              )}
            
                <Text className="font-ROBOTO_500 text-white text-[11px]">
                  {title}
                </Text>
              </View>
              <TouchableOpacity onPress={() => [isPlaying && onPlayPress(), handleGoBackFunc ? handleGoBackFunc() : onToggleFullScreen()]}>
                <BigClose />
              </TouchableOpacity>
            </View>}
        </View>

{!isLoading && <>
        {/* CENTER PART */}
        <View className='flex-1 items-center justify-center'>
             {isFullscreeen && <Animated.View
                                style={{
                                  position: 'absolute',
                                  width: '6%',
                                  height: '78%',
                                  zIndex: 999,
                                  top: 40,
                                  left:-18,
                                  justifyContent: 'center',
                                }}>
                                <View style={{ alignSelf: 'center' }} className="ml-[5px]">
                                  <BrightnessIcon />
                                </View>
                                <View className="relative mt-3 overflow-hidden h-[180px] w-[60%]">
                                  <View className="h-[180px] w-[6px] absolute right-0 items-center bg-[#535353] rounded-[5px]" />
                                  <BrightnessBar brightLevel={brightLevel} setLevel={setLevel} />
                                </View>
                              </Animated.View>}


            <View className='flex-row gap-x-20 items-center justify-center'>
                {isFullscreeen && (type !== 'live' && isTime) && <TouchableOpacity
                    onPress={handleSeekBackward}
                      >
                      <SeekBackIcon />
                    </TouchableOpacity>}
                <PlayButton
                isPlaying={isPlaying}
                onPlayPress={onPlayPress}
                isFullscreen={isFullscreeen}
                />
                {isFullscreeen && (type !== 'live' && isTime) && <TouchableOpacity
                                      style={{
                                        marginLeft: -8,
                                      }}
                    onPress={handleSeekForward}
                                      >
                                      <SeekForwardIcon />
                                    </TouchableOpacity>}
            </View>
        </View>

{/* BOTTOM PART */}
        <View className=''>
           {!isFullscreeen && <View className='ml-auto mr-3'>
                <Mute
                isMuted={isMuted}
                onMutePress={onMutePress}
                />
            </View>}

            {/* SEEK BAR AND DURATION */}
            {!(type === 'live' && isTime) && <View style={{marginBottom: !isFullscreeen? -3:8}} className='flex-row items-center gap-x-3'>
                 {isFullscreeen && showDuration && (
                <DurationText
                    ref={durationRef}
                    duration={duration}
                />
                )}

                <Seekbar
                    fullWidth={!isControlsVisible}
                    ref={seekbarRef}
                    {...seekbarProps}
                    onSeek={onSeek}
                    onSeeking={(progress) => durationRef.current?.onProgress(progress)}
                    isPlaying={isPlaying}
                    controlsTimeoutId={controlsTimeoutId}
                    duration={duration}
                    seekBarBackgroundCustomStyles={customStyles?.seekBarBackground}
                    seekBarCustomStyles={isFullscreeen ? {marginBottom:0}: customStyles?.seekBar}
                    seekBarFullWidthCustomStyles={customStyles?.seekBarFullWidth}
                    seekBarKnobCustomStyles={customStyles?.seekBarKnob}
                    seekBarKnobSeekingCustomStyles={customStyles?.seekBarKnobSeeking}
                    seekBarProgressCustomStyles={customStyles?.seekBarProgress}
                    isFullscreeen={isFullscreeen}
                />
                {isFullscreeen && showDuration &&  <ProgressingDuration
                    ref={durationRef}
                    duration={duration}
                />}
            </View>}

            {/* BOTTOM BUTTONS */}
           {isFullscreeen && <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center'>
                    {/* LIVE COMPONENT */}
                    <View
                        // style={{ width: isTime ? 65 : 50 }}
                        style={{ width: 65 }}
                        className=" justify-center flex-row items-center gap-x-2">
                        {type === 'live' && isTime && (
                          <>
                            <MotiView
                              from={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                type: 'timing',
                                duration: 1000,
                                easing: Easing.out(Easing.ease),
                                loop: true,
                              }}>
                              <View className="w-[9px] h-[9px] rounded-full bg-red" />
                            </MotiView>
                            <Text className="font-ROBOTO_500 text-[11px] text-white">
                              LIVE
                            </Text>
                          </>
                        )}
                      </View>

                <Mute
                    isMuted={isMuted}
                    onMutePress={onMutePress}
                />

                {type === 'live' && isTime && <View className='flex-row items-center gap-x-2 ml-5'>
                  <EyesIcon />
                  <Text className='font-ROBOTO_400 text-white text-[13px]'>{formatAmount(viewsCount.toString())}</Text>
                </View>}
                </View>

                <View className='flex-row items-center gap-x-4'>
                    {/* NEXT BUTTON */}
                    {type && type.includes('series') && <EpisodeNext />}

                    {/* SUBTITLE */}
                  {type !== 'live' && 
                    <Subtitle />
                  }

                    {/* CTA BUTTONS */}
                    {(ctaType && handleCTAFunc) && <CTAButton handleCTAFunc={handleCTAFunc} ctaType={ctaType} />}

                    {/* VIDEO CASTING */}
                    <Casting 
                        handleCastingFunc={handleVideoCastingFunc}
                    />


                {!disableFullscreen && !isFullscreeen && (
                <Fullscreen
                    onToggleFullScreen={onToggleFullScreen}
                />
                )}
                </View>

            </View>}
        </View>
</>}
</View>

      </AnimatedWrapper>
    );
  }
);
