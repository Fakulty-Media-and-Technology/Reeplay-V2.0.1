import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  Touchable,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppImage, AppText, AppView, TouchableOpacity} from '@/components';
import {GenreTabs} from '@/configs/data';
import SwiperFlatList from 'react-native-swiper-flatlist';
import fonts from '@/configs/fonts';
import {MotiView} from 'moti';
import colors from '@/configs/colors';
import {Easing} from 'react-native-reanimated';
import Size from '@/Utils/useResponsiveSize';
import routes from '@/navigation/routes';
import {previewContentType, RootNav} from '@/navigation/AppNavigator';
import {useNavigation} from '@react-navigation/native';
import {MovieVideo} from '../HomeScreen';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { selectGenres } from '@/store/slices/bannerSlice.slice';
import { IVODContent } from '@/types/api/content.types';
import { getVODbyEnumID, getVODbyGenreID } from '@/api/content.api';
import Placeholder from '@/components/SkeletonLoader';
import FastImage from 'react-native-fast-image';
import { setPreviewContent } from '@/store/slices/previewContentSlice';

interface GenreList {
  title: string;
  images: any[];
}

const SwiperContainer = () => {
  const genres = useAppSelector(selectGenres)
  const {navigate} = useNavigation<RootNav>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevImages, setPrevImages] = useState<IVODContent[]>([]);
  const [contents, setContents] = useState<Record<string, IVODContent[]>>( genres.length > 0 ? { [genres[0].name]: [] } : {})
  const dispatch = useAppDispatch()

 async function handleFetchContent() {
  const items: Record<string, IVODContent[]> = {};

  await Promise.allSettled(
    genres.map(async (genre) => {
      const res = await getVODbyGenreID({
        enumId: genre._id,
        pagination: { page: 1, limit: 9 },
      });
      if (res.ok && res.data){
         items[genre.name] = res.data.data
        }else{
          items[genre.name] = []
        };
    })
  );
  setContents(items);
  setPrevImages(items[genres[0].name]);
}

  function handleTab(lists: string, index: number) {
    setActiveIndex(index);
    setPrevImages(contents[lists] ?? []);
  }

  useEffect(() =>{
    handleFetchContent();
  }, [genres]);

  return (
    <AppView>
      <AppView
        style={{width: Size.getWidth(), overflow: 'hidden'}}
        className="pl-5">
        {/* HeaderTabs */}
        <FlatList
          data={genres}
          keyExtractor={(_, i) => i.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 15,
          }}
          renderItem={({item, index}) => {
            const show = activeIndex === index;
            return (
              <Pressable
                style={{marginHorizontal: 6}}
                onPress={() => handleTab(item.name, index)}
                >
                <AppText
                  style={show && {fontFamily: fonts.MANROPE_700}}
                  className="text-center font-MANROPE_400 text-[12px] text-white capitalize px-4">
                  {item.name}
                </AppText>
                <MotiView
                  style={styles.bar}
                  from={{transform: [{scaleX: 0}]}}
                  animate={{transform: [{scaleX: show ? 1 : 0}]}}
                  transition={{
                    type: 'timing',
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                  }}
                />
              </Pressable>
            );
          }}
        />
      </AppView>

      {/* Main images */}
      {(genres.length > 0 && Object.keys(contents).length > 0) && <AppView>
        <SwiperFlatList
          showPagination={true}
          paginationActiveColor={colors.RED}
          paginationDefaultColor="rgba(255, 19, 19, 0.4)"
          paginationStyleItem={styles.pagination}
          data={contents[genres[activeIndex].name].length > 0 ? contents[genres[activeIndex].name] : [...Array(1)]}
          renderItem={({item, index}) => (
            <>
           {contents[genres[activeIndex].name].length > 0 ? <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                [dispatch(setPreviewContent(item)), navigate(routes.PREVIEW_SCREEN, {
                  content: previewContentType.film,
                  videoURL: item.trailer,
                })]
              }>
              <AppImage key={index} style={styles.image} source={{uri: item.portraitPhoto, priority:FastImage.priority.high}} />
            </TouchableOpacity> : 
            <Placeholder style={styles.image} noAnimate />
            }
            </>
          )}
        />
      </AppView>}
    </AppView>
  );
};

export default SwiperContainer;

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    backgroundColor: colors.RED,
    height: 1.5,
    marginTop: 4,
    transformOrigin: 'center',
  },
  pagination: {
    width: Size.calcAverage(23),
    height: Size.calcAverage(3),
    marginHorizontal: Size.calcWidth(3),
    marginTop: Size.calcHeight(52),
  },
  image: {
    width: Size.getWidth() - 32,
    height: Size.calcHeight(240),
    marginTop: Size.calcHeight(20),
    borderRadius: 15,
    marginHorizontal: 16,
  },
});
