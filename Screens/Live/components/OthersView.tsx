import { Platform, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import SectionHeader, {
  headerProps,
} from '@/Screens/Home/components/SectionHeader';
import { AppImage, AppText, AppView, TouchableOpacity } from '@/components';
import LinearGradient from 'react-native-linear-gradient';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import colors from '@/configs/colors';
import { Exclusive, FreeIcon, PremiumIcon } from '@/assets/icons';
import { checkTimeStatus } from '@/Utils/timeStatus';
import { useCountdownTimer } from '@/Hooks/useCountdown';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { ILiveContent } from '@/types/api/content.types';
import FastImage from 'react-native-fast-image';
import { useAppDispatch } from '@/Hooks/reduxHook';
import { setFullVideoProps, setLiveModalContent } from '@/store/slices/fullScreenVideo.slice';
import { hasPaidContentStatus } from '@/api/content.api';
import ToastNotification from '@/components/ToastNotifications';

interface OthersProps extends headerProps {
  data: ILiveContent[];
  makeFullscreen: () => void
}

const OthersView = ({ data, title, makeFullscreen }: OthersProps) => {
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
          paddingBottom: 20,
        }}>
        {data.map((item, index) => {
          return (
            <Comp
              key={index}
              index={index}
              event={event}
              tvShow={tvShow}
              item={item}
              makeFullscreen={makeFullscreen}
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
  makeFullscreen: () => void
}

export const Comp = ({ index, event, tvShow, makeFullscreen, item }: CompProps) => {
const isTime = checkTimeStatus(item.start, item.expiry);
  const dateObj = new Date(item.start);
  const countDown = useCountdownTimer(new Date(item.start).getTime());
  const [accessStatus, setAccessStatus] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const dateM = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short', // Use 'short' for abbreviated month name
    year: '2-digit',
  });
  const parts = dateM.split(' ');
  const date = `${parts[0]} ${parts[1]}. ${parts[2]}`;
  // .replace('.', '');

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
      }, [item._id])

  return (
    <TouchableOpacity
      key={index}
      onPress={() => !accessStatus ? dispatch(setLiveModalContent(item)) : [dispatch(setFullVideoProps(item)), makeFullscreen()]}
      style={
        Platform.OS === 'ios' ? { width: Size.getWidth() / 2 - 25 } : { width: Size.wp(43) }
      }
      className="h-[89px] rounded-t-[5px] overflow-hidden relative">
      <AppImage
        className="absolute top-0 bottom-0 z-10"
        style={{ height: 89, width: 171 }}
        source={{
          uri: item.coverPhoto ?? '',
          priority: FastImage.priority.high,
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
            <AppView className="bg-[#0000009C] px-[10px] pt-[4px] pb-[5px] rounded-[3px] -mb-1">
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
  },
});
