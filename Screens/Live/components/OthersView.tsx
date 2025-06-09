import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import SectionHeader, {
  headerProps,
} from '@/Screens/Home/components/SectionHeader';
import { AppImage, AppText, AppView, TouchableOpacity } from '@/components';
import LinearGradient from 'react-native-linear-gradient';
import Size from '@/Utils/useResponsiveSize';
import { BlurView as Blur } from '@react-native-community/blur';
import BlurView from 'react-native-blur-effect';
import fonts from '@/configs/fonts';
import colors from '@/configs/colors';
import routes from '@/navigation/routes';
import { fullVideoType } from '@/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { TabMainNavigation } from '@/types/typings';
import { Exclusive, FreeIcon, PremiumIcon } from '@/assets/icons';
import { LiveEvents } from '@/types/api/live.types';
import { checkTimeStatus } from '@/Utils/timeStatus';
import { getLivestreamWatch, getVOD_Stream } from '@/api/live.api';
import { useCountdownTimer } from '@/Hooks/useCountdown';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { ILiveContent } from '@/types/api/content.types';
import FastImage from 'react-native-fast-image';

interface OthersProps extends headerProps {
  data: ILiveContent[];
}

const OthersView = ({ data, title }: OthersProps) => {
  const tvShow = title === 'Others in TV Shows';
  const event = title === 'Others in Events';
  return (
    <>
      <SectionHeader
        title={title}
        btnText=""
        onPress={() => console.log('first')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          columnGap: 10,
          rowGap: 12,
          marginTop: 10,
          paddingBottom: 10,
        }}>
        {data.map((item, index) => {
          return (
            <Comp
              key={index}
              index={index}
              event={event}
              tvShow={tvShow}
              item={item}
            />
          );
        })}
      </ScrollView>
    </>
  );
};

export default OthersView;

interface CompProps {
  index: number;
  event: boolean;
  tvShow: boolean;
  item: ILiveContent;
}

export const Comp = ({ index, event, tvShow, item }: CompProps) => {
  const navigation = useNavigation<TabMainNavigation>();
  const [videoURL, setVideoURL] = useState<string>('');
  const isTime = checkTimeStatus(item.start, item.expiry);
  const dateObj = new Date(item.start);
  const countDown = useCountdownTimer(new Date(item.start).getTime());

  const dateM = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short', // Use 'short' for abbreviated month name
    year: '2-digit',
  });
  const parts = dateM.split(' ');
  const date = `${parts[0]} ${parts[1]}. ${parts[2]}`;
  // .replace('.', '');

  const time = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  async function handleVideo() {
    if (isTime === 'normal' || isTime === 'countdown') {
      setVideoURL(item.previewVideo ?? '')
    } else {
      //USE SOCKET AND ADD RTMP_HTML_URL
    }
  }

  useEffect(() => {
    handleVideo();
  }, []);

  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate(routes.FULL_SCREEN_VIDEO, {
          type: fullVideoType.live,
          videoURL: videoURL,
          vote: tvShow,
          donate: event,
          title: item.title,
          isTime: isTime === 'now',
          _id: item._id,
        })
      }
      style={
        Platform.OS === 'ios' ? { width: Size.getWidth() / 2 - 25 } : { width: 171 }
      }
      className="h-[89px] rounded-t-[5px] overflow-hidden relative">
      <AppImage
        className="absolute top-0 bottom-0 z-10"
        style={{ height: 89, width: 171 }}
        source={{
          uri: item.coverPhoto ?? '',
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.web
        }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
        style={{
          position: 'absolute',
          bottom: -4,
          height: 74,
          width: '100%',
          zIndex: 20,
        }}
      />

      <AppView className="w-[303px] absolute top-0 z-30">
        <AppView className="mt-1.5 ml-2">
          {item.vidClass === 'premium' ? (
            <PremiumIcon />
          ) : item.vidClass === 'exclusive' ? (
            <Exclusive />
          ) : (
            <FreeIcon />
          )}
        </AppView>
      </AppView>

      <AppView className="w-full px-2 absolute bottom-1.5 flex-row items-end justify-between z-30">
        <AppView>
          <AppText
            style={[
              styles.title,
              {
                fontSize: Size.calcHeight(7),
              },
            ]}>
            {item.location}
          </AppText>
          <AppText style={styles.title}>
            {item.title.length > 14
              ? `${item.title.substring(0, 14)}...`
              : item.title}
          </AppText>
        </AppView>
        <AppView className="flex-row items-center gap-x-2">
          <AppText className="mt-[2px] font-ROBOTO_500 text-[9px] text-white -mr-[4px]">
            {item.pg}
          </AppText>
          {isTime === 'now' ? (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginTop: 3, marginLeft: 5 }}
              transition={{
                type: 'timing',
                duration: 1500,
                easing: Easing.out(Easing.ease),
                delay: index * 300,
                loop: true,
              }}>
              <AppView className="w-[7px] h-[7px] rounded-full bg-red" />
            </MotiView>
          ) : (
            <AppView className="bg-[#0000009C] px-[10px] pt-[4px] pb-[5px] rounded-[3px]">
              <AppText className="font-ROBOTO_500 text-[8px] text-white">
                {isTime === 'countdown' ? countDown : date}
              </AppText>
            </AppView>
          )}
        </AppView>
      </AppView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.MANROPE_700,
    fontSize: Size.calcHeight(10),
    color: colors.WHITE,
    maxWidth: 130,
  },
  dateContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
    // paddingHorizontal:
  },
});
