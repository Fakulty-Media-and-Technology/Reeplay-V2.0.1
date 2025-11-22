import React, { useEffect, useState } from 'react';
import { StyleSheet} from 'react-native';
import {
  AppButton,
  AppImage,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import colors from '@/configs/colors';
import fonts from '@/configs/fonts';
import {
  CloseIcon,
  Exclusive,
  FreeIcon,
  InfoLiveBtn,
  PremiumIcon,
} from '@/assets/icons';
import { ImageStyle } from 'react-native-fast-image';
import { ILiveContent } from '@/types/api/content.types';
import { useAppDispatch } from '@/Hooks/reduxHook';
import { setFullVideoProps, setLiveModalContent } from '@/store/slices/fullScreenVideo.slice';
import ToastNotification from '@/components/ToastNotifications';
import { hasPaidContentStatus } from '@/api/content.api';

const ITEM_WIDTH: number = Size.calcWidth(232);

interface ContinueProps {
  item:ILiveContent
  removeCloseBtn?: boolean;
  live?: boolean;
  imageStyle?: ImageStyle;
  donate?: boolean;
  vote?: boolean;
  makeFullscreen: () => void
}

const ContinueWatchingComponent = ({
  item,
  removeCloseBtn,
  imageStyle,
  live,
  donate,
  vote,
  makeFullscreen
}: ContinueProps) => {
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
      }, [item._id])

  return (
    <AppView style={{width: ITEM_WIDTH}} className="mt-4 mr-3">
      <AppView className="relative overflow-hidden">
        {!removeCloseBtn && (
          <TouchableOpacity className="absolute z-10 top-1 right-1">
            <CloseIcon />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => !accessStatus ? dispatch(setLiveModalContent(item)) : [dispatch(setFullVideoProps(item)), makeFullscreen()]}
          style={{
            borderRadius: live ? 5 : 0,
          }}
          className="w-full overflow-hidden">
          <AppImage
            source={{uri: item.coverPhoto}}
            style={[imageStyle, {height: live ? 112 : 102, width:'100%'}]}
          />
        </TouchableOpacity>
      
      </AppView>
      <AppView className="flex-row justify-between mt-3">
        <AppView>
          <AppText
            style={
                [
                    styles.title,
                    {
                      fontSize: Size.calcHeight(10),
                      fontFamily: fonts.MANROPE_400,
                    },
                  ]
            }>
            {item.title}
          </AppText>
            <AppText style={styles.title}>{item.title}</AppText>
        </AppView>

        <AppView className="flex-row items-center">
            <AppView className="flex-row items-center">
              {item.vidClass === 'premium' ? (
                <PremiumIcon style={{marginRight: 4}} />
              ) :
                item.vidClass === 'exclusive' ? (
                <Exclusive style={{marginRight: 4}} />
              ) : (
                <FreeIcon style={{marginRight: 4}} />
              )}
                <AppText className="font-ROBOTO_500 text-[11px] text-white mr-1.5">
                  {item.pg}
                </AppText>
              
            </AppView>

          <AppButton
            bgColor={colors.RED}
            onPress={() => dispatch(setLiveModalContent(item))}
            replaceDefaultContent={<InfoLiveBtn />}
            style={{
              width: Size.calcWidth(45),
              height: live ? Size.calcWidth(18.5) : Size.calcWidth(20),
              borderRadius: 2,
              paddingVertical: 0,
              paddingHorizontal: 2,
            }}
          />
        </AppView>
      </AppView>
    </AppView>
  );
};

export default ContinueWatchingComponent;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.MANROPE_700,
    fontSize: Size.calcHeight(13.5),
    color: colors.WHITE,
    maxWidth: 130,
  },
});
