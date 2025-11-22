import { Animated, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppText, AppView, TouchableOpacity } from '@/components';
import Size from '@/Utils/useResponsiveSize';
import Swiper from './Swiper';
import { useNavigation } from '@react-navigation/native';
import routes from '@/navigation/routes';
import { fullVideoType, RootNav } from '@/navigation/AppNavigator';
import { LiveEvents } from '@/types/api/live.types';
import { IEvent } from '../DynamicViewContainer';
import FastImage from 'react-native-fast-image';
import { getLivestreamWatch, getVOD_Stream } from '@/api/live.api';
import { checkTimeStatus } from '@/Utils/timeStatus';
import { ILiveContent } from '@/types/api/content.types';
import { useAppDispatch } from '@/Hooks/reduxHook';
import { setFullVideoProps, setLiveModalContent } from '@/store/slices/fullScreenVideo.slice';
import { hasPaidContentStatus } from '@/api/content.api';
import ToastNotification from '@/components/ToastNotifications';

interface Props {
  scrollY: Animated.Value;
  item: IEvent;
  makeFullscreen: () => void
}


const ChannelsTabs = ({ scrollY, item, makeFullscreen }: Props) => {

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
          makeFullscreen={makeFullscreen}
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
            return <ChannelComp key={index} item={item} makeFullscreen={makeFullscreen} />;
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
  style?:ViewStyle
    makeFullscreen: () => void
}

export const ChannelComp = ({ item, style, makeFullscreen }: ChannelsCompProps) => {
  const dispatch = useAppDispatch();
  const [accessStatus, setAccessStatus] = useState<boolean>(false);
  async function handleContentStatusUpdate(){
      if(item.vidClass === 'free'){
        setAccessStatus(true);
      }else{
        const res = await hasPaidContentStatus({contentType:'live', _id:item._id})
        if(res.ok && res.data){
          setAccessStatus(res.data.data.canView)
        }else{
          ToastNotification('error', `${res.data?.message}`)
        }
      }
    }

useEffect(() =>{
  handleContentStatusUpdate();
}, [item._id]);

  return (
    <TouchableOpacity
      style={[{
        height: 90,
        width: Size.wp(46),
        borderRadius: 5,
        overflow: 'hidden',
      }, style]}
      onPress={() => accessStatus ? dispatch(setLiveModalContent(item)) : [dispatch(setFullVideoProps(item)), makeFullscreen()]}>
      <FastImage
        source={{
          uri: item.coverPhoto ?? '',
          priority: FastImage.priority.high,
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </TouchableOpacity>
  );
};