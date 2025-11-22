import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet} from 'react-native';
import {
  AppButton,
  AppImage,
  AppText,
  AppVideo,
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
  InfoBtn,
  InfoLiveBtn,
  PremiumIcon,
  SmInfoIcon,
} from '@/assets/icons';
import {fullVideoType, previewContentType, RootNav} from '@/navigation/AppNavigator';
import routes from '@/navigation/routes';
import {useNavigation} from '@react-navigation/native';
import { ImageStyle } from 'react-native-fast-image';
import { IContinueWatching, IDownloadData } from '@/types/api/content.types';
import { deleteContinueWatchingById } from '@/api/content.api';
import { useAppDispatch } from '@/Hooks/reduxHook';
import { removeContinueWatchingById } from '@/store/slices/bannerSlice.slice';
import ToastNotification from './ToastNotifications';
import { setPreviewContent } from '@/store/slices/previewContentSlice';
import { getRemoteFileSize } from '@/api/external.api';

const ITEM_WIDTH: number = Size.calcWidth(232);

interface ContinueProps {
  item: IContinueWatching
  imageStyle?: ImageStyle;
  makeFullscreen: () => void
  setFullscreenContent: React.Dispatch<React.SetStateAction<IDownloadData | null>>
}

const ContinueWatchingComp = ({
  item,
  imageStyle,
  makeFullscreen,
  setFullscreenContent
}: ContinueProps) => {
  const {navigate} = useNavigation<RootNav>();
  const progressRatio = item.duration / item.totalDuration;
  const progressBarWidth = ITEM_WIDTH * progressRatio;
  const [loading, setLoading] = useState<boolean>(false)
  const [size, setSize] = useState<string>('')
  const dispatch = useAppDispatch();
  const episodeUrl = item.episode ? item.episode.video ?? item.episode.trailer : item.video.video ?? item.video.trailer
  const itemData:IDownloadData = {
      _id:item.episode ? item.episode._id :item.video._id,
      desc:item.episode ? item.episode.description :item.video.description,
      landscapePhoto:item.video.landscapePhoto,
      portraitPhoto:item.video.portraitPhoto,
      pg:item.video.pg,
      size,
      title:item.episode ? item.episode.title : item.video.title,
      type:item.video.type,
      vidClass:item.video.vidClass,
      video:episodeUrl??'',
      viewsCount:Number(item.episode ? item.episode.viewsCount:item.video.viewsCount),
      seekTo:progressRatio
    }

  async function removeContinueWatching(){
    try {
        setLoading(true);
        const res = await deleteContinueWatchingById(item.watchedDocumentId);
        if(res.ok){
            dispatch(removeContinueWatchingById(item.watchedDocumentId))
        }else{
          ToastNotification('error', `${res.data?.message}`)
        }
      } catch (error) {
      ToastNotification('error', `${error}`)
    }finally{
        setLoading(false)
    }
  }

  async function handleItem(){
    if(!episodeUrl) return
    const fileSize = await getRemoteFileSize(episodeUrl);
                const sizeInMB = fileSize ? (fileSize / (1024 * 1024)).toFixed(2) : null;
                if(sizeInMB) setSize(sizeInMB)
  }

  useEffect(() =>{
    handleItem();
  },[item.watchedDocumentId])
  
  return (
    <AppView style={{width: ITEM_WIDTH}} className="mt-4 mr-3">
      <AppView className="relative overflow-hidden">
       
          <TouchableOpacity onPress={removeContinueWatching} className="absolute z-10 top-1 right-1">
            {loading ? <ActivityIndicator size={'small'} /> : <CloseIcon />}
          </TouchableOpacity>
     


        <TouchableOpacity
          onPress={() => [setFullscreenContent({...itemData}), makeFullscreen()]}
          className="w-full h-[102px] overflow-hidden">
          {item.episode && episodeUrl && episodeUrl !== '' ? 
            <AppVideo
                source={{ uri: episodeUrl }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="cover"
                paused={true}
              />
          : <AppImage
            source={{uri: item.video.portraitPhoto}}
            style={[imageStyle, {height: 102, width:'100%'}]}
            />}

        </TouchableOpacity>
        <AppView className="absolute bottom-0 w-full">
          {/* ProgressBar */}
          <AppView
            style={{
              transform: [{translateX: -ITEM_WIDTH + progressBarWidth}],
              width: ITEM_WIDTH,
            }}
            className="h-[2px] bg-red"
          />
        </AppView>
      </AppView>
      <AppView className="flex-row justify-between mt-3">
        <AppView>
          {item.video.type && item.video.type.toLowerCase().includes('music') && <AppText
            style={[styles.title,{fontSize: Size.calcHeight(10),fontFamily: fonts.MANROPE_400,}]
            }>
            {item.video.subtitle}
          </AppText>}
          
            <AppText style={styles.title}>{item.episode ? item.episode.title : item.video.title}</AppText>
          
          <AppText style={[styles.title, {fontSize: Size.calcHeight(10.5)}]}>
            {item.video.type}
          </AppText>
        </AppView>

        <AppView className="flex-row">
          <AppButton
            bgColor={colors.RED}
            onPress={() =>
             [dispatch(setPreviewContent(item.video)), navigate(routes.PREVIEW_SCREEN, {
                content: item.video.type.includes('series') ? previewContentType['tv series'] : item.video.type.includes('video') ? previewContentType['music video'] : previewContentType.film,
                videoURL: item.video.trailer ?? episodeUrl,
              })]
            }
            replaceDefaultContent={<InfoBtn />}
            style={{
              width: Size.calcWidth(45),
              height:Size.calcWidth(20),
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

export default ContinueWatchingComp;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.MANROPE_700,
    fontSize: Size.calcHeight(13.5),
    color: colors.WHITE,
    maxWidth: 130,
  },
});
