import {StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import {AppImage, AppText, AppView, TouchableOpacity} from '@/components';
import {LibraryData} from '@/configs/data';
import Size from '@/Utils/useResponsiveSize';
import {previewContentType, RootNav} from '@/navigation/AppNavigator';
import routes from '@/navigation/routes';
import {useNavigation} from '@react-navigation/native';
import {MovieVideo} from '@/Screens/Home/HomeScreen';
import { IVODContent } from '@/types/api/content.types';
import ToastNotification from '@/components/ToastNotifications';
import { getVODbyGenreID } from '@/api/content.api';
import Placeholder from '@/components/SkeletonLoader';
import FastImage from 'react-native-fast-image';

interface props {
  title: string;
  vodId:string
  genreId:string
}

const RelatedContent = ({title, vodId, genreId}: props) => {
  const {navigate} = useNavigation<RootNav>();
  const [loading, setLoading] = useState<boolean>(false)
  const [content, setContent] = useState<IVODContent[]>([]);

  async function handleFetchContent(){
    try {
      setLoading(true);
      const res = await getVODbyGenreID({vodId, pagination:{page:1, limit:6}, enumId:genreId})
      if(res.ok && res.data){
        setContent(res.data.data)
      }
    } catch (error) {
      ToastNotification('error', `${error}`);
    }finally{
      setLoading(false)
    }
  }

  useEffect(() =>{
    handleFetchContent();
  }, [vodId])

  return (
    <AppView className="mt-5">
      <AppText className="mb-[10px] font-ROBOTO_700 text-white text-[21px]">
        {title}
      </AppText>
      <AppView style={styles.centerContent}>
        {(loading ? [...Array(6)] : content).map((lib, index) => {
          if(loading) return <Placeholder key={index} style={styles.image} />
          return (
            <TouchableOpacity
              activeOpacity={0.6}
              key={index}
              onPress={() =>
                navigate(routes.PREVIEW_SCREEN, {
                  content: previewContentType.film,
                  videoURL: MovieVideo,
                })
              }>
              <AppImage source={{
                uri: lib.image,
                priority:FastImage.priority.high
                }} 
                style={styles.image} 
              />
            </TouchableOpacity>
          );
        })}
      </AppView>
    </AppView>
  );
};

export default RelatedContent;

const styles = StyleSheet.create({
  image: {
    width: Size.getWidth() / 3 - 20,
    height: 133,
    borderRadius: 15,
  },
  centerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    columnGap: Size.calcHeight(10),
    rowGap: Size.calcHeight(15),
    paddingBottom: 20,
  },
});
