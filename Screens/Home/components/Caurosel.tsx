import {
  View,
  Text,
  ImageSourcePropType,
  Animated,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';
import { AppButton, AppImage, AppText, AppView } from '@/components';
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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { HomeScreenNav, TabMainNavigation } from '@/types/typings';
import routes from '@/navigation/routes';
import { fullVideoType, previewContentType } from '@/navigation/AppNavigator';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '@/configs/fonts';
import { AnimatedLin, MovieVideo } from '../HomeScreen';
import { LiveEvents } from '@/types/api/live.types';
import { checkTimeStatus } from '@/Utils/timeStatus';
import { getLivestreamWatch, getVOD_Stream } from '@/api/live.api';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { ILiveContent, IVODContent } from '@/types/api/content.types';
import { useScreenOrientation } from '@/Hooks/useScreenOrientation';

const ITEM_WIDTH = Size.getWidth() * 0.88;
const WIDTH = Dimensions.get('window').width;

const SPACING = 6;

interface Props {
  item: IVODContent | ILiveContent;
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
  const { navigate } = useNavigation<TabMainNavigation>();
  const [videoURL, setVideoURL] = useState<string>('');
  const [imgLoad, setImgLoad] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const startTime = 'start' in item ? item.start : item.releaseDate;
  const endTime = 'start' in item ? item.expiry : item.expiryDate
  const isTime = checkTimeStatus(startTime, endTime);
  const { isLandscape } = useScreenOrientation()

  // console.log(videoURL, '.....video');

  async function getDefaultVideo() {
    if (isTime === 'normal' || isTime === 'countdown') {
      if (live && "start" in item) setVideoURL(item.previewVideo ?? '')
      if ("admin_id" in item) setVideoURL(item.trailer)
    } else {
      //USE SOCKET AND ADD RTMP_HTML_URL
    }
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
          style={{ width: ITEM_WIDTH, height: '100%', bottom: -1 }}
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

      {(live && 'start' in item && item.coverPhoto) && (
        <FastImage
          source={{
            uri: item.coverPhoto,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.web,
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
      )}

      {("admin_id" in item && !live) && <FastImage
        source={{
          uri: item.portraitPhoto,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.web,
        }}
        onLoadStart={() => setImgLoad(true)}
        onLoadEnd={() => setImgLoad(false)}
        style={{
          width: ITEM_WIDTH,
          position: 'absolute',
          height: '100%',
          borderRadius: 7,
        }}
      />}

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
            {'admin_id' in item &&
              item.genre &&
              item.genre.map((tag, i) => {
                return (
                  <Fragment key={i}>
                    <AppText className="font-ROBOTO_400 text-sm text-grey_200">
                      {tag.name}
                    </AppText>
                    {item.genre && i !== item.genre.length - 1 && (
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
                  videoURL,
                })
                : console.log('first')
            }
            replaceDefaultContent={
              live ? (
                item.vidClass === 'premium' ? (
                  <PremiumIcon_B />
                ) :
                  item.vidClass === 'exclusive' ? (
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
            onPress={() => console.log('first')}
            // onPress={() =>
            //   navigate(routes.FULL_SCREEN_VIDEO, {
            //     type: live ? fullVideoType.live : fullVideoType.default,
            //     videoURL: videoURL,
            //     donate: true,
            //     live_event_data: item as any,
            //     title: item.title,
            //     coverImg: 'start' in item ? item.coverPhoto : '',
            //     isTime: isTime === 'now',
            //     _id: '_id' in item ? item._id : '',
            //   })
            // }
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
