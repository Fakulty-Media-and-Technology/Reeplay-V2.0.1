import {
  View,
  Text,
  ImageSourcePropType,
  Animated,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {AppButton, AppImage, AppText, AppView} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import colors from '@/configs/colors';
import {
  Exclusive,
  Exclusive_B,
  FreeIcon,
  FreeIcon_B,
  InfoIcon,
  PremiumIcon,
  PremiumIcon_B,
  SmPlayIcon,
} from '@/assets/icons';
import {
  HomeSlideProps,
  LiveSlideProps,
  LiveSliderDataProps,
} from '@/types/data.types';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {HomeScreenNav, TabMainNavigation} from '@/types/typings';
import routes from '@/navigation/routes';
import {fullVideoType, previewContentType} from '@/navigation/AppNavigator';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '@/configs/fonts';
import {AnimatedLin, MovieVideo} from '../HomeScreen';
import {LiveEvents} from '@/types/api/live.types';
import {checkTimeStatus} from '@/Utils/timeStatus';
import {getLivestreamWatch, getVOD_Stream} from '@/api/live.api';
import {FadeIn, FadeOut} from 'react-native-reanimated';

const ITEM_WIDTH = Size.getWidth() * 0.88;
const WIDTH = Dimensions.get('window').width;

const SPACING = 6;

interface Props {
  item: HomeSlideProps | LiveEvents;
  translate?: Animated.AnimatedInterpolation<string | number>;
  currentIndex: boolean;
  live?: boolean;
  colors: string[];
}

const Caurosel = ({
  item,
  colors: colorsArr,
  translate,
  currentIndex,
  live,
}: Props) => {
  const {navigate} = useNavigation<TabMainNavigation>();
  const [videoURL, setVideoURL] = useState<string>('');
  const [imgLoad, setImgLoad] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const isTime = 'start' in item && checkTimeStatus(item.start, item.expiry);

  // console.log(videoURL, '.....video');

  async function getDefaultVideo() {
    try {
      if (live && 'preview_video' in item && '_id' in item) {
        const {key, bucket} = item.preview_video;

        //@ts-ignore
        // if (!('active' in item.active)) return;
        const res =
          isTime === 'normal' || isTime === 'countdown'
            ? await getVOD_Stream({
                key,
                bucket,
              })
            : await getLivestreamWatch(item._id);

        if (res.ok && res.data) {
          setVideoURL(
            'url' in res.data.data
              ? res.data.data.url
              : 'video_content' in res.data.data
              ? res.data.data.video_content
              : '',
          );
        }
      }
    } catch (error) {}
  }

  useEffect(() => {
    getDefaultVideo();
  }, [isFocused]);

  return (
    <Animated.View
      style={{
        width: WIDTH,
        // paddingHorizontal: SPACING,
        position: 'relative',
        alignItems: 'center',
        overflow: 'hidden',
        flex: 1,
        flexGrow: 2,
      }}>
      {!live && (
        <AppView
          style={{width: ITEM_WIDTH, height: '100%', bottom: -1}}
          className="overflow-hidden absolute z-[1] rounded-b-[7px]">
          <LinearGradient
            colors={colorsArr}
            style={[
              {
                width: ITEM_WIDTH,
                height: '100%',
              },
            ]}
          />
        </AppView>
      )}

      {live && currentIndex && (
        <AnimatedLin
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(300)}
          colors={['transparent', 'rgba(0, 0, 0, 0.8)', 'rgb(0, 0, 0)']}
          style={[
            {
              bottom: -1,
              zIndex: 1,
              width: ITEM_WIDTH,
              position: 'absolute',
              height: '60%',
            },
          ]}
        />
      )}

      {imgLoad && (
        <AppView className="relative w-full h-full items-center justify-center z-10">
          <ActivityIndicator size={'large'} color={colors.RED} />
        </AppView>
      )}

      {live && 'photo_url' in item ? (
        <FastImage
          source={{
            uri: item.photo_url,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          onLoadStart={() => setImgLoad(true)}
          onLoadEnd={() => setImgLoad(false)}
          style={{
            width: ITEM_WIDTH,
            position: 'absolute',
            height: '100%',
            borderRadius: 7,
          }}
        />
      ) : (
        <AppImage
          //@ts-ignore
          source={item.image}
          style={{width: ITEM_WIDTH}}
          className="absolute h-full rounded-[7px]"
        />
      )}
      <AppView className="absolute bottom-4 z-10 items-center">
        <AppText className="text-white text-sm uppercase font-MANROPE_400 mb-3">
          {item.type}
        </AppText>
        <AppText
          style={{
            maxWidth: item.title.length > 13 ? 270 : 248,
          }}
          className="text-[40px] leading-[39px] font-LEXEND_700 text-white mb-1 text-center">
          {item.title}
        </AppText>
        {!live && (
          <AppView className="flex-row items-center justify-center">
            {'tags' in item &&
              item.tags &&
              item.tags.map((tag, i) => {
                return (
                  <Fragment key={i}>
                    <AppText className="font-ROBOTO_400 text-sm text-grey_200">
                      {tag}
                    </AppText>
                    {item.tags && i !== item.tags.length - 1 && (
                      <AppView className="w-1.5 h-1.5 rounded-full bg-white mt-[2.5px] mx-1.5" />
                    )}
                  </Fragment>
                );
              })}
          </AppView>
        )}

        <AppView className="flex-row items-center justify-center mt-1.5">
          <AppButton
            bgColor={live ? colors.GREY_600 : colors.RED}
            onPress={() =>
              !live
                ? navigate(routes.PREVIEW_SCREEN, {
                    content: previewContentType.film,
                    videoURL: MovieVideo,
                  })
                : console.log('first')
            }
            replaceDefaultContent={
              live ? (
                //@ts-ignore
                item.vid_class === 'premium' ? (
                  <PremiumIcon_B />
                ) : 'subscription' in item &&
                  item.subscription === 'exclusive' ? (
                  <Exclusive_B />
                ) : (
                  <FreeIcon_B />
                )
              ) : (
                <InfoIcon />
              )
            }
            style={{
              width: Size.calcHeight(85),
              borderRadius: 4,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              marginRight: 2,
              paddingVertical: 17,
            }}
          />
          <AppButton
            bgColor={colors.RED}
            onPress={() =>
              navigate(routes.FULL_SCREEN_VIDEO, {
                type: live ? fullVideoType.live : fullVideoType.default,
                videoURL: videoURL,
                donate: true,
                live_event_data: item as any,
                title: item.title,
                coverImg: 'photo_url' in item ? item.photo_url : '',
                isTime: isTime === 'now',
                _id: '_id' in item ? item._id : '',
              })
            }
            style={{
              width: Size.calcHeight(152),
              borderRadius: 4,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              paddingVertical: 17,
            }}
            replaceDefaultContent={
              <AppView className="flex-row items-center justify-center">
                <SmPlayIcon />
                <AppText className="text-[15px] text-white font-ROBOTO_700 ml-[10px]">
                  {live ? 'Watch' : 'Play'}
                </AppText>
              </AppView>
            }
          />
        </AppView>
      </AppView>
    </Animated.View>
  );
};

export default Caurosel;
