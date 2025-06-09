import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppText, AppView, TouchableOpacity } from '@/components';
import AppCategories from '@/components/AppCategories';
import {
  KidsChannel,
  LiveChannel,
  SliderLiveChannel,
  SportChannel,
} from '@/configs/data';
import Size from '@/Utils/useResponsiveSize';
import Swiper from './Swiper';
import { TabMainNavigation } from '@/types/typings';
import { useNavigation } from '@react-navigation/native';
import routes from '@/navigation/routes';
import { fullVideoType } from '@/navigation/AppNavigator';
import { LiveEvents } from '@/types/api/live.types';
import { IEvent } from '../DynamicViewContainer';
import FastImage from 'react-native-fast-image';
import { getLivestreamWatch, getVOD_Stream } from '@/api/live.api';
import { checkTimeStatus } from '@/Utils/timeStatus';
import { ILiveContent } from '@/types/api/content.types';

interface Props {
  scrollY: Animated.Value;
  item: IEvent;
}


const ChannelsTabs = ({ scrollY, item }: Props) => {
  const navigation = useNavigation<TabMainNavigation>();

  return (
    <AppView className="mb-20">
      {item.pop.length > 0 && (
        <Swiper
          data={item.pop}
          title="Popular Channels"
          channels
          containerStyle={{ height: 171, width: 303, marginRight: 8 }}
          spacing={8}
          scrollY={scrollY}
        />
      )}

      {item.others.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            item.others.length === 1
              ? {
                justifyContent: 'flex-start',
                paddingLeft: 10,
              }
              : { justifyContent: 'space-evenly' },
            {
              flexDirection: 'row',
              flexWrap: 'wrap',
              rowGap: 12,
              marginTop: 10,
              paddingBottom: 10,
            },
          ]}>
          {item.others.map((item, index) => {
            return <ChannelComp key={index} item={item} />;
          })}
        </ScrollView>
      ) : (
        <AppText
          style={{ alignSelf: 'center' }}
          className="mt-16 text-center font-ROBOTO_400 text-sm text-dark_grey max-w-[170]">
          No content available now, kindly check back later
        </AppText>
      )}
    </AppView>
  );
};

export default ChannelsTabs;

interface ChannelsCompProps {
  item: ILiveContent;
}

export const ChannelComp = ({ item }: ChannelsCompProps) => {
  const navigation = useNavigation<TabMainNavigation>();
  const [videoURL, setVideoURL] = useState<string>('');
  const isTime = checkTimeStatus(item.start, item.expiry);

  async function handleVideo() {
    if (isTime === 'normal' || isTime === 'countdown') {
      setVideoURL(item.previewVideo ?? '')
    } else {
      //USE SOCKET AND ADD RTMP_HTML_URL
    }
  }

  useEffect(() => {
    handleVideo();
  }, [item]);

  return (
    <TouchableOpacity
      style={{
        height: 90,
        width: Size.wp(46),
        borderRadius: 5,
        overflow: 'hidden',
      }}
      onPress={() =>
        navigation.navigate(routes.FULL_SCREEN_VIDEO, {
          type: fullVideoType.live,
          videoURL,
          channelImage: item.channelLogo,
          title: item.title,
          _id: item._id,
          coverImg: item.coverPhoto ?? '',
          isTime: isTime === 'now',
        })
      }>
      <FastImage
        source={{
          uri: item.coverPhoto ?? '',
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.web,
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});
