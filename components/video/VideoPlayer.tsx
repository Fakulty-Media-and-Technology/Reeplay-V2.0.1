import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Video, {
  OnBufferData,
  OnLoadStartData,
  type OnLoadData,
  type OnPlaybackStateChangedData,
  type OnProgressData,
  type VideoRef,
} from 'react-native-video';
import { GestureResponderEvent, ImageSourcePropType, PanResponder, PanResponderGestureState, PanResponderInstance, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { VideoPlayerProps } from 'react-native-video-player';
import { AnimationRef } from './controls/AnimatedWrapper';
import { Controls, ProgressRef } from './Controls';
import LottieView from 'lottie-react-native';
import { MediaInfo, useCastSession, useRemoteMediaClient } from 'react-native-google-cast';
import { IContentData } from './DynamicVideoComponent';
import Animated from 'react-native-reanimated';
import { deleteContinueWatchingById, registerContinueWatching } from '@/api/content.api';
import { throttle } from 'lodash';
import { IRegisteredContinueWatching } from '@/types/api/content.types';

export interface VideoInternalRef extends VideoRef {
  onStart: () => void;
}

type RenderVideoProps = Pick<
  VideoPlayerProps,
  | 'animationDuration'
  | 'autoplay'
  | 'controlsTimeout'
  | 'customStyles'
  | 'defaultMuted'
  | 'disableControlsAutoHide'
  | 'disableFullscreen'
  | 'disableSeek'
  | 'duration'
  | 'fullScreenOnLongPress'
  | 'hideControlsOnStart'
  | 'muted'
  | 'onEnd'
  | 'onHideControls'
  | 'onLoad'
  | 'onMutePress'
  | 'onPlayPress'
  | 'onPlaybackStateChanged'
  | 'onProgress'
  | 'onShowControls'
  | 'pauseOnPress'
  | 'paused'
  | 'repeat'
  | 'resizeMode'
  | 'showDuration'
  | 'source'
  | 'style'
> & { 
    sizeStyle: { width: number; height: number }, 
    onToggleFullScreen:() =>void,
      handleCTAFunc?: () => void;
      handleNEXT?: () => void;
      handleSUBTITLE?: () => void;
      type?: string;
    ctaType?:'vote'|'donate',
    isTime:boolean 
    isFullscreen:boolean 
    thumbnail: ImageSourcePropType | undefined
    handleGoBackFunc?:() =>void
    contentData:IContentData
    isSaveProgress?:boolean
};

export const RenderVideo = 
memo(
  forwardRef<VideoInternalRef, RenderVideoProps>((props, ref) => {
    const {
      animationDuration = 1000,
      autoplay = false,
      controlsTimeout = 10000,
      customStyles = {},
      defaultMuted,
      disableControlsAutoHide,
      disableFullscreen,
      disableSeek,
      fullScreenOnLongPress,
      hideControlsOnStart = false,
      muted,
      onEnd,
      onHideControls,
      onLoad,
      onMutePress,
      onPlayPress,
      onPlaybackStateChanged,
      onProgress,
      onShowControls,
      pauseOnPress,
      paused,
      repeat = false,
      resizeMode = 'contain',
      showDuration = false,
      source,
      style,
      sizeStyle,
      onToggleFullScreen,
      ctaType,
      handleCTAFunc,
      handleNEXT,
      handleSUBTITLE,
      type,
      isFullscreen,
      contentData,
      thumbnail,
      isTime,
      handleGoBackFunc,
      isSaveProgress
    } = props;

    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [isMuted, setIsMuted] = useState(defaultMuted ?? false);
    const [isControlsVisible, setIsControlsVisible] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isInteracting, setIsInteracting] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdsVisible, setAdsVisible] = useState<boolean>(false);
     const session = useCastSession();
     const remoteClient = useRemoteMediaClient();
     const isCasting = !!session && !!remoteClient;

    const videoRef = useRef<VideoRef>(null);
    // ref to keeps progress to avoid re-rendering
    const progressRef = useRef<number>(0);
    // ref to pass progress to controls (in ref to avoid re-rendering) and to pass when controls wrapper should animate
    const controlsRef = useRef<ProgressRef & AnimationRef>(null);
    // ref to keep timeout id to clear it on unmount
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const setProgress = useCallback((progress: number) => {
      if (!isFinite(progress)) return;

      progressRef.current = progress;
      controlsRef.current?.onProgress(progress);
    }, []);

    useImperativeHandle(ref, () => ({
      ...videoRef.current!,
      resume: () => {
        setIsPlaying(true);
        videoRef.current?.resume();
      },
      pause: () => {
        setIsPlaying(false);
        videoRef.current?.pause();
      },
      stop: () => {
        setProgress(0);
        videoRef.current?.dismissFullscreenPlayer();
      },
      onStart: () => {
        setIsPlaying(true);
        setProgress(progressRef.current >= 1 ? 0 : progressRef.current);
        hideControlsOnStart ? _hideControls() : _showControls();
      },
    }));

    const _clearControlsTimeout = useCallback(() => {
  if (controlsTimeoutRef.current) {
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = null;
  }
}, []);

 const _hideControls = useCallback(() => {
      _clearControlsTimeout();

      if(isInteracting) return
      // if ((!isPlaying && !isInteracting) || is) {
        console.log('reach here1 - setting timeout. isPlaying:', isPlaying, 'isInteracting:', isInteracting); // Debugging
        controlsTimeoutRef.current = setTimeout(() => {
          if (onHideControls) onHideControls();
          console.log('first2')
          controlsRef.current?.runControlsAnimation(0.1, () => {
            setIsControlsVisible(false);
          });
        }, 0);
        
      // } else {
      //   console.log('Skipping _hideControls timeout. isPlaying:', isPlaying, 'isInteracting:', isInteracting);
      // }
    }, [
      controlsTimeout,
      onHideControls,
      disableControlsAutoHide,
      isPlaying,
      isInteracting,
      _clearControlsTimeout,
    ]);

    // --- REFINED _showControls Logic ---
    const _showControls = useCallback(() => {
      console.log(isControlsVisible)
        // if (isControlsVisible && !disableControlsAutoHide) {
        //     _hideControls(); 
        //     return;
        // }

        if (onShowControls && !isControlsVisible) onShowControls();
        setIsControlsVisible(true);

        _clearControlsTimeout();
        console.log(isInteracting, 'interaction')
        if(isInteracting || disableControlsAutoHide) return;
         controlsTimeoutRef.current = setTimeout(() => {
          if (onHideControls) onHideControls();
          console.log('first2')
          _hideControls();
          // controlsRef.current?.runControlsAnimation(0.1, () => {
          //   setIsControlsVisible(false);
          // });
        }, controlsTimeout);

        setTimeout(() => {
            setProgress(progressRef.current);
            controlsRef.current?.runControlsAnimation(1);
        }, 0);
    }, [
        onShowControls,
        isControlsVisible,
        setProgress,
        _hideControls,
        _clearControlsTimeout,
        disableControlsAutoHide,
    ]);


    // --- PanResponder Logic ---
    const handleInteractionStart = useCallback(() => {
      console.log('somthing is happening')
      // setIsInteracting(true);
      _clearControlsTimeout();
      // _showControls();
      controlsRef.current?.runControlsAnimation(1);
    }, []);

    const handleInteractionEnd = useCallback(() => {
      setIsInteracting(false);
      _showControls();
    }, [_showControls]);


    const panResponderRef = useRef<PanResponderInstance | null>(null);
    if (!panResponderRef.current) {
      panResponderRef.current = PanResponder.create({
        onStartShouldSetPanResponder: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => true,
        onPanResponderGrant: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          handleInteractionStart();
        },
        onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          handleInteractionEnd();

          if (gestureState.dx === 0 && gestureState.dy === 0) {
            if (pauseOnPress) {
              _onPlayPress();
            }
          }
        },
        onPanResponderTerminationRequest: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => true,
        onPanResponderTerminate: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          handleInteractionEnd();
        },
      });
    }
    const panHandlers = panResponderRef.current.panHandlers;



    useEffect(() => {
        // if (autoplay && isPlaying && isControlsVisible && !isInteracting) {
        //     _hideControls();
        // }
        console.log(isPlaying, 'here...')
        // if (!isPlaying || isInteracting) {
        //     _clearControlsTimeout();
        //     if (!isControlsVisible) {
        //         setIsControlsVisible(true);
        //         controlsRef.current?.runControlsAnimation(1);
        //     }
        // }


      return () => {
        if (controlsTimeoutRef.current && isPlaying && !isInteracting) {
          clearTimeout(controlsTimeoutRef.current);
          controlsTimeoutRef.current = null;
        }
      };
    }, [isPlaying, _hideControls]);

    useEffect(() =>{
      if(disableControlsAutoHide) {
        setIsControlsVisible(true)
       controlsRef.current?.runControlsAnimation(1);
      }
    }, [disableControlsAutoHide, controlsRef.current]);


// This effect runs whenever the casting status changes
    useEffect(() => {
        if (isCasting && remoteClient && source?.uri) {
            // Stop local playback before casting
            setIsPlaying(false);
            videoRef.current?.pause();

            const mediaInfo: MediaInfo = {
                contentUrl: typeof source.uri === 'string' ? source.uri :'',
                contentType: 'video/mp4',
                metadata: {
                    type: 'generic',
                    title: contentData.title,
                    subtitle: contentData.desc, // Dynamically set this
                    images: [{ url:typeof thumbnail === 'string'? thumbnail:'' }],
                },
            };

            remoteClient.loadMedia({...mediaInfo, autoplay: true, startTime: progressRef.current * duration })
                .then(() => console.log(`[${new Date().toLocaleTimeString()}] Media loaded on Cast device.`))
                .catch(error => console.error(`[${new Date().toLocaleTimeString()}] Failed to load media on Cast device:`, error));

            _clearControlsTimeout();
            setIsControlsVisible(true);

        } 
        // else if (!isCasting && !session) {
        //     console.log(`[${new Date().toLocaleTimeString()}] Casting session ended. Resetting local player.`);
        //     setIsPlaying(false);
        //     videoRef.current?.pause();
        //     _showControls();
        // }
    }, [isCasting, remoteClient, source, session]);

     const lastWatchedRef = useRef(0);

  const saveProgress = useCallback(
    throttle(async (time: number) => {
      try {
        const data:IRegisteredContinueWatching = {duration:time,totalDuration:duration,parentId:contentData._id,parentType: type === 'series' ? 'episode' :'vod'}
        const res = await registerContinueWatching(data);
        console.log(res.data, data)
      } catch (err) {
        console.error("Failed to save progress", err);
      }
    }, 15000), // send at most once every 15s
    [duration]
  );


    const _onProgress = useCallback(
      (event: OnProgressData) => {
        if (onProgress) onProgress(event);

        if (isNaN(props?.duration || 0) && isNaN(duration)) {
          throw new Error(
            'Could not load video duration correctly, please add `duration` props'
          );
        }
        const watchedDration = event.currentTime / (props.duration || duration) 
        if(isSaveProgress) {
          lastWatchedRef.current = event.currentTime;
          saveProgress(event.currentTime)
        }
        setProgress(watchedDration);
      },
      [onProgress, props.duration, duration, setProgress]
    );

    async function removeSaveWatch(){
      saveProgress.flush?.();
    }

    const _onEnd = useCallback(() => {
      if (onEnd) onEnd();
        setProgress(1);
        if(isSaveProgress) {
          saveProgress(duration);
          removeSaveWatch()
        }
      if (repeat) videoRef.current?.seek(0);
      setIsPlaying(repeat);
    }, [onEnd, setProgress, repeat]);

    const _onLoad = useCallback(
      (event: OnLoadData) => {
        if (onLoad) onLoad(event);
        setDuration(event.duration);
        setLoading(false);
      },
      [onLoad]
    );

     const _onLoadStart = useCallback((data: OnLoadStartData) => {
      setLoading(true);
    }, []);

    const _onBuffer = useCallback((data: OnBufferData) => {
      setLoading(data.isBuffering);
    }, []);

    const _onPlayPress = useCallback(() => {
      handleInteractionStart()
      if (onPlayPress) onPlayPress();
      setIsPlaying((prev) => !prev);
      if(isPlaying) removeSaveWatch()

      if (progressRef.current >= 1) {
        videoRef.current?.seek(0);
      }

      handleInteractionEnd();
    }, [_showControls, onPlayPress]);

    const _onMutePress = useCallback(() => {
      handleInteractionStart();
      const newMutedState = !isMuted;
      if (onMutePress) onMutePress(newMutedState);
      setIsMuted(newMutedState);
      handleInteractionEnd();
    }, [isMuted, onMutePress, _showControls]);

    const _onPlaybackStateChanged = useCallback(
      (data: OnPlaybackStateChangedData) => {
        if (onPlaybackStateChanged) onPlaybackStateChanged(data);
        if (data.isPlaying !== isPlaying) setIsPlaying(data.isPlaying);
      },
      [isPlaying, onPlaybackStateChanged]
    );

    const seek = useCallback(
      (progress: number) => {
        handleInteractionStart();
        videoRef.current?.seek(progress);
        setProgress(progress / (props.duration || duration));
        handleInteractionEnd()
        _onPlayPress();
      },
      [duration, props.duration, setProgress]
    );

    console.log(isControlsVisible, 'control.....', disableControlsAutoHide)

    return (
      <View style={[{ flex:1, position:'relative' }, customStyles.videoWrapper]}>
        <Video
          {...props}
          ref={videoRef}
          style={[styles.video, sizeStyle, style]}
          muted={muted || isMuted}
          paused={paused || !isPlaying}
          fullscreenOrientation="landscape"
          onProgress={_onProgress}
          onEnd={_onEnd}
          onLoad={_onLoad}
          onLoadStart={_onLoadStart}
          onBuffer={_onBuffer}
          source={source}
          resizeMode={'cover'}
          onPlaybackStateChanged={_onPlaybackStateChanged}
          onReceiveAdEvent={event => [ (event.event === 'STARTED'|| event.event === 'CONTENT_PAUSE_REQUESTED' || event.event === 'FIRST_QUARTILE' || event.event === 'AD_PROGRESS') ? setAdsVisible(true) : (event.event === 'COMPLETED'|| event.event === 'CONTENT_RESUME_REQUESTED'||event.event === 'PAUSED') ? setTimeout(() => setAdsVisible(false),2000) : console.log(event.event)]}
        />

        {/* BACKGROUND VIDEO */}
        {/* <View></View> */}

       {(loading && !isPlaying) && <View className='absolute w-full h-full items-center justify-center z-[99px]'>
          {isFullscreen ? 
          <>
          <View className="mx-16 w-[50px] h-[70px] justify-center -mt-6">
              <LottieView
                source={require('@/assets/icons/RPlay.json')}
                style={{
                  width: 350,
                  height: 350,
                  alignSelf: 'center',
                }}
                autoPlay
                loop
              />
            </View>
          </>
          :<>
          <View>
             <LottieView
                source={require('@/assets/icons/RPlay.json')}
                style={{
                  width: 200,
                  height: 200,
                }}
                autoPlay
                loop
              />
          </View>
          </>}
        </View>}

       {!isAdsVisible && 
       
       <Animated.View
          style={styles.overlayButton}
         {...(isControlsVisible && {...panHandlers})}
        >
          <TouchableOpacity
          className='flex-1'
          activeOpacity={1}
          onPressIn={handleInteractionStart}
          disabled={disableControlsAutoHide}
            onLongPress={() => {
              if (fullScreenOnLongPress) onToggleFullScreen();
            }}
            onPress={() => isControlsVisible ? _hideControls() :_showControls()}
          >
          <Controls
            ref={controlsRef}
            customStyles={customStyles}
            showDuration={showDuration}
            disableFullscreen={disableFullscreen}
            duration={props.duration || duration}
            isPlaying={isPlaying}
            isMuted={isMuted}
            onPlayPress={_onPlayPress}
            onMutePress={_onMutePress}
            onToggleFullScreen={onToggleFullScreen}
            animationDuration={animationDuration}
            showControls={_showControls}
            autoplay={autoplay}
            disableSeek={disableSeek}
            setIsPlaying={setIsPlaying}
            onSeek={seek}
            controlsTimeoutId={controlsTimeoutRef.current}
            isControlsVisible={isControlsVisible}
            ctaType={ctaType}
            handleCTAFunc={handleCTAFunc}
            handleNEXT={handleNEXT}
            handleSUBTITLE={handleSUBTITLE}
            handleGoBackFunc={handleGoBackFunc}
            type={type}
            isFullscreeen={isFullscreen}
            isLoading={loading && !isPlaying}
            contentData={contentData}
            isTime={isTime}
          />
          </TouchableOpacity>
        </Animated.View>}
      </View>
    );
  })
);

const styles = StyleSheet.create({
  video:
    +Platform.Version >= 24
      ? {}
      : {
          backgroundColor: 'black',
        },
  overlayButton: {
    position:'absolute',
    width:'100%',
    height:'100%',
    zIndex:99999
  },
});
