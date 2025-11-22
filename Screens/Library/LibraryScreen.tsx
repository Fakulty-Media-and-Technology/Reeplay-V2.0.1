import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  AppImage,
  AppScreen,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import {Dropdown} from '@/assets/icons';
import Size from '@/Utils/useResponsiveSize';
import {previewContentType, RootNav} from '@/navigation/AppNavigator';
import routes from '@/navigation/routes';
import {useNavigation} from '@react-navigation/native';
import BlurView from 'react-native-blur-effect';
import {BlurView as Blur} from '@react-native-community/blur';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { selectCategories, selectGenres } from '@/store/slices/bannerSlice.slice';
import { ICategoryData, IVODContent } from '@/types/api/content.types';
import { libraryContent } from '@/api/content.api';
import Placeholder from '@/components/SkeletonLoader';
import FastImage from 'react-native-fast-image';
import { setPreviewContent } from '@/store/slices/previewContentSlice';

const LibraryScreen = () => {
  const genres = useAppSelector(selectGenres)
  const categories = useAppSelector(selectCategories)
  const [genre, setGenre] = useState<string | null>(null);
  const [categoriesTxt, setCategoriesTxt] = useState<ICategoryData>(categories[0]);
  const [genreTxt, setGenreTxt] = useState<ICategoryData>(genres[0]);
  const [selectedItems, setSelectedItems] = useState<ICategoryData[]>([]);
  const [contents, setContents] = useState<IVODContent[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [loading_m, setLoading_m] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  function resetState() {
    setGenre(null);
  }

   async function handleFetchContent(page?:number, cat?:string, genre?:string, isLoadMore?:boolean){
    if(loading || !hasMore) return
    try {
      if(isLoadMore){
        setLoading_m(true)
      }else{
        setLoading(true);
      }
      const res = await libraryContent({catId: categoriesTxt._id, genreId:genreTxt._id, pagination:{page:page??1, limit:20}})
      if(res.ok && res.data){
        const data = res.data.data;
        setContents(prev =>{
          const existingIds = new Set<string>(prev.map(x => x._id));
          const merged = [
            ...prev,
            ...data.filter(x => !existingIds.has(x._id))
          ]
          if(merged.length === prev.length) setHasMore(false);
          return merged
        });
        if(page) setPage(page)
      }else{
        setHasMore(true);
      }
    } catch (error) {
      setHasMore(false)
    }finally{
      if(isLoadMore){
        setLoading_m(false)
      }else{
        setLoading(false);
      }
    }
  }

  async function handleSelect(value: ICategoryData) {
    resetState();
    if (genre === 'genre'){
       setGenreTxt(value);
      await handleFetchContent(1, undefined, value._id)
    }
    if (genre === 'categories'){
      setCategoriesTxt(value);
      await handleFetchContent(1, value._id, undefined)
      }
  }

  const loadMore = () => {
    if(!hasMore || contents.length < 20) return
    handleFetchContent(contents.length >= page * 20 ? page+1:page, undefined, undefined, true)
  }

  useEffect(() =>{
    handleFetchContent(page);
  }, [])

  useEffect(() =>{
    if(!hasMore) setTimeout(()=> setHasMore(true), 3000);
  }, [hasMore])


  // console.log(JSON.stringify(contents,null,2))


  return (
    <>
      <AppView
        style={{
          minHeight: 55,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        className="absolute bottom-0 w-full z-20">
        {Platform.OS === 'ios' ? (
          <Blur
            blurType="dark"
            blurAmount={120}
            style={{
              minHeight: 55,
              width: '100%',
            }}
          />
        ) : (
          <BlurView backgroundColor="rgba(0, 0, 0, 1)" blurRadius={120} />
        )}
      </AppView>
      <AppScreen containerStyle={{position: 'relative', paddingTop: 5}}>
        {genre !== null && (
          <Pressable style={styles.overlay} onPress={resetState} />
        )}
        <AppView className="relative z-10 flex-row items-center my-3 mb-4 gap-x-4">
          <TouchableOpacity
            className="flex-row items-center gap-x-1.5"
            onPress={() => [setGenre('genre'), setSelectedItems(genres)]}>
            <AppText className="font-ROBOTO_400 text-white text-[15px]">
              {genreTxt.name}
            </AppText>
            <Dropdown />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center gap-x-1.5"
            onPress={() => [
              setGenre('categories'),
              setSelectedItems(categories),
            ]}>
            <AppText className="font-ROBOTO_400 text-white text-[15px]">
              {categoriesTxt.name}
            </AppText>
            <Dropdown />
          </TouchableOpacity>

          {genre !== null && (
            <AppView
              style={genre === 'categories' && {left: 60}}
              className="absolute top-6 w-[174px] pb-5 pt-2 bg-black/70">
              {selectedItems.map((x, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelect(x)} className='mb-5'>
                    <AppText className="text-center text-white text-[15px] font-ROBOTO_400">
                      {x.name}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </AppView>
          )}
        </AppView>
        <AppView className="mb-[92px]">
          <FlatList 
            data={loading ? [...Array(20)] : contents}
            keyExtractor={(item,index) => loading ? index.toString() : item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.centerContent}
            onEndReachedThreshold={1}
        onEndReached={loadMore}
        ListFooterComponent={
          <>
            {loading_m && (
              <AppView className="h-20 items-center justify-center">
                <ActivityIndicator size={'large'} />
              </AppView>
            )}
          </>
        }
            renderItem={({item,index}) =>{
              if(loading) return <Placeholder style={styles.image} />
              return <ContentItem key={index} item={item} />
            }}
          />
        </AppView>
      </AppScreen>
    </>
  );
};

export default LibraryScreen;

export const ContentItem = ({item}:{item:IVODContent}) =>{
    const {navigate} = useNavigation<RootNav>();
    const [loading, setLoading] = useState<boolean>(true)
    const dispatch = useAppDispatch()

  return (
    <View className='relative'>
     {loading && <View className='absolute z-10'>
        <Placeholder style={styles.image} />
      </View>}
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() =>
      [dispatch(setPreviewContent(item)),
        navigate(routes.PREVIEW_SCREEN, {
          content: previewContentType.film,
          videoURL: item.trailer,
        })
      ]
      }>
        <AppImage 
          source={{
            uri: item.portraitPhoto,
            priority:FastImage.priority.high
          }} 
          style={styles.image}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </TouchableOpacity>
    </View>
  )
}

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
  overlay: {
    width: '100%',
    height: '200%',
    position: 'absolute',
    zIndex: 10,
  },
});
