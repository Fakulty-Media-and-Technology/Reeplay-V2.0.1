import { Alert, Animated as Ani, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  AppImage,
  AppText,
  AppVideo,
  AppView,
  TouchableOpacity,
} from '@/components';
import {
  FullscreenIcon,
  MutedIcon,
  RemindMe,
  UnRemindMe,
  UpcomingPlay,
  VolumeIcon,
} from '@/assets/icons';
import { OnLoadData, VideoRef } from 'react-native-video';
import useToggle from '@/Hooks/useToggle';
import LinearGradient from 'react-native-linear-gradient';
import { fullVideoType } from '@/navigation/AppNavigator';
import routes from '@/navigation/routes';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { IUpcomingEvents } from '@/types/api/upcomingEvents.types';
import FastImage from 'react-native-fast-image';
import { upcomingEventDate } from '@/Utils/formatTime';
import Size from '@/Utils/useResponsiveSize';
import { getVOD_Stream } from '@/api/live.api';
import {
  getReminderStatus,
  subscribeReminderStatus,
  unsubscribeReminderStatus,
} from '@/api/upcomingEvents.api';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { IDownloadData, ILiveContent, IVODContent } from '@/types/api/content.types';
import convertToProxyURL from 'react-native-video-cache';


const AnimatedView = Animated.createAnimatedComponent(AppView);

interface Props {
  items: IVODContent | ILiveContent;
  index: number;
  playingIndexes: number[];
  setPlayingIndexes: React.Dispatch<React.SetStateAction<number[]>>;
  scrollY: Ani.Value;
  setFullscreenContent: React.Dispatch<React.SetStateAction<IDownloadData | null>>
  makeFullscreen:() => void
}

const UpcomingView = ({
  items,
  index,
  playingIndexes,
  setPlayingIndexes,
  setFullscreenContent,
  makeFullscreen,
  scrollY,
}: Props) => {
  const isPlaying = playingIndexes.includes(index);
  const videoRefs = useRef<Record<number, VideoRef | null>>({});
  const [muteVideo, setMuteVideo] = useState(true);
  const [remindMe, setRemindMe] = useState<boolean>(false);
  const [verticalScrollState, setVerticalScrollState] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isBufferingLoad, setIsBufferingLoad] = useState(false);
  const [videoURL, setVideoURL] = useState<string>('');

  const onLoad = (data: OnLoadData) => {
    setIsLoading(false);
  };

  const onLoadStart = () => setIsLoading(true);

  const onBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
    setIsBuffering(isBuffering);
    if (isBuffering) {
      setIsBufferingLoad(true);
    }
  };

  const onReadyForDisplay = () => {
    setIsBufferingLoad(false);
  };

  function handlePlayVideo(query: number) {
    if (playingIndexes.includes(query)) {
      // Pause the video
      setPlayingIndexes(prevIndexes => prevIndexes.filter(i => i !== query));
      setVerticalScrollState(null);
    } else {
      // Play the video
      setPlayingIndexes([query]);
      setVerticalScrollState(Number(scrollY));
    }
  }

  async function handleVideo() {
    if ("start" in items) setVideoURL(items.previewVideo ?? '')
    if ("admin_id" in items) setVideoURL(items.trailer)
  }

  async function getSubscribedStatus() {
    try {
      const res = await getReminderStatus(items._id, 'start' in items ? 'live':'vod');
      if (res.ok && res.data) {
        setRemindMe(res.data.data.user_subscribed);
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log(items)

  const handleSubscribe = async () => {
    setRemindMe(!remindMe);
    try {
      const res = remindMe
        ? await unsubscribeReminderStatus(items._id,'start' in items ? 'live':'vod')
        : await subscribeReminderStatus(items._id,'start' in items ? 'live':'vod');
      if (res.ok) {
        getSubscribedStatus();
      } else {
        Alert.alert("Opps! couldn't subscribe for the event");
        setRemindMe(remindMe);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (playingIndexes.length === 0) return;
      if (
        verticalScrollState !== null &&
        verticalScrollState !== Number(scrollY)
      ) {
        setPlayingIndexes([]);
        setVerticalScrollState(null);
      }
    };

    scrollY.addListener(handleScroll);

    return () => {
      // Remove the listener when the component unmounts
      scrollY.removeAllListeners();
    };
  }, [scrollY, playingIndexes, verticalScrollState]);

  useEffect(() => {
    handleVideo();
    getSubscribedStatus();
  }, []);


  return (
    <AnimatedView
      entering={FadeInLeft.delay(index * 200).springify()}
      className="items-center mt-1.5">
      <AppView className="relative max-w-[400px] h-[196px] items-center justify-center">
        {!isPlaying ? (
          <>
            <FastImage
              source={{
                uri: 'start' in items ? items.coverPhoto ?? '' : items.landscapePhoto,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.web,
              }}
              style={{
                width: Size.wp(92),
                height: 190,
                borderRadius: 20,
              }}
            />
            {/* <AppImage
              source={{uri: items.landscape_photo}}
              className="h-[186px] rounded-[20px]"
            /> */}
            <TouchableOpacity
              onPress={() => handlePlayVideo(index)}
              style={styles.shadow}
              className="absolute">
              <UpcomingPlay />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {isBufferingLoad ||
              (isLoading && (
                <AppView className="absolute z-20 pb-3">
                  <LottieView
                    source={require('@/assets/icons/RPlay.json')}
                    style={{
                      width: 200,
                      height: 200,
                    }}
                    autoPlay
                    loop
                  />
                </AppView>
              ))}
          </>
        )}

        {isPlaying && (
          <>
            <LinearGradient
              colors={['transparent', '#000000']}
              style={{
                position: 'absolute',
                bottom: 0,
                height: 70,
                width: '100%',
                zIndex: 20,
              }}
            />
            <AppView className="absolute w-[90%] bottom-3 mb-1 px-2 flex-row items-center justify-between z-30">
              <TouchableOpacity
                style={{ height: 17, marginBottom: 3 }}
                onPress={() => setMuteVideo(!muteVideo)}>
                {muteVideo ? (
                  <AppView className="mt-[3px]">
                    <MutedIcon />
                  </AppView>
                ) : (
                  <VolumeIcon />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                [
                  setFullscreenContent({_id:items._id,desc:items.description,landscapePhoto: 'start' in items ? items.coverPhoto ?? '' : items.landscapePhoto,pg:items.pg,portraitPhoto:'start' in items ? items.coverPhoto ?? '' : items.portraitPhoto,title:items.title,video:'start' in items ? items.previewVideo ?? '' : items.trailer,size:'30',type:items.type,viewsCount:items.viewsCount,vidClass:items.vidClass})
                  ,makeFullscreen()
                ]
                }>
                <FullscreenIcon />
              </TouchableOpacity>
            </AppView>
          </>
        )}

        {isPlaying && (
          <AppVideo
            source={{ uri: convertToProxyURL(videoURL) }}
            videoRef={(ref: VideoRef | null) => {
              videoRefs.current[index] = ref;
            }}
            style={{
              width: 353,
              height: 186,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}
            resizeMode="cover"
            muted={muteVideo}
            onEnd={() => setPlayingIndexes([])}
            paused={!isPlaying}
            onLoad={onLoad}
            onLoadStart={onLoadStart}
            onBuffer={onBuffer}
            onReadyForDisplay={onReadyForDisplay}
          />
        )}
      </AppView>

      <AppView className="w-full items-center mt-1 mb-1 pt-1 pb-1.5 border-y border-grey_200/10">
        <AppView className="flex-row items-center gap-x-2">
          <AppText className="bg-red font-ROBOTO_700 text-white text-[8px] pt-[3px] pb-1 px-2 text-center max-w-[43px]">
            {items.type}
          </AppText>
          <AppText className="font-LEXEND_700 text-2xl text-white">
            {items.title}
          </AppText>
        </AppView>
        <AppView className="flex-row items-center">
          <AppText className="uppercase mr-2 font-MANROPE_700 text-[10px] text-grey_200">
            coming {upcomingEventDate('start' in items ? items.start : items.releaseDate)}
          </AppText>
          <TouchableOpacity onPress={handleSubscribe}>
            {remindMe ? <RemindMe /> : <UnRemindMe />}
          </TouchableOpacity>
          <AppText className="text-white ml-1.5 font-MANROPE_400 text-[10px]">
            Remind me
          </AppText>
        </AppView>

        <AppText className="font-MANROPE_400 text-white text-[13px] text-center max-w-[286px] mt-2">
          {items.description}
        </AppText>
      </AppView>
    </AnimatedView>
  );
};

export default UpcomingView;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#818181',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.74,
    shadowRadius: 6.27,
    elevation: 10,
  },
});
