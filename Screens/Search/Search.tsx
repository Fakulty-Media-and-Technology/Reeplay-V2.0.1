import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardEvent,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  AppButton,
  AppHeader,
  AppImage,
  AppScreen,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import {LibraryData, RecentSearch} from '@/configs/data';
import {CloseBtn_S, SearchIcon_S} from '@/assets/icons';
import fonts from '@/configs/fonts';
import BlurView from 'react-native-blur-effect';
import {BlurView as Blur} from '@react-native-community/blur';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { selectAdsContent, setAdsContent } from '@/store/slices/adsSlice.slice';
import { ILiveContent, IVODContent } from '@/types/api/content.types';
import { fetchContentSuggestions, hasPaidContentStatus, randomAds, recentSearches, registerRecentSearch, searchContent } from '@/api/content.api';
import debounce from 'lodash.debounce';
import FastImage from 'react-native-fast-image';
import { useAppPersistStore } from '@/store/zustand.store';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { previewContentType, RootNav } from '@/navigation/AppNavigator';
import { setPreviewContent } from '@/store/slices/previewContentSlice';
import routes from '@/navigation/routes';
import Placeholder from '@/components/SkeletonLoader';
import AppModal from '@/components/AppModal';
import FullscreenModalPlayer from '../Live/FullscreenModalPlayer';
import { resetFullVideo, resetLiveVideo, selectFullVideoProps, selectLiveModalContent, setFullVideoProps, setLiveModalContent } from '@/store/slices/fullScreenVideo.slice';
import LiveInfoModal from '../Live/components/LiveInfoModal';
import { OrientationInjectedProps } from '@/components/OrientationWrapper';
import ToastNotification from '@/components/ToastNotifications';
import { isAndroid } from '@/configs/constant';

const Search = ({isFullscreen,makeFullscreen,makePortrait}:OrientationInjectedProps) => {
  const {navigate} = useNavigation<RootNav>()
  const ads = useAppSelector(selectAdsContent).ads;
  const [text, setText] = useState<string>('');
  const [keyboardHeight, setKeyboardHeight] = useState<number | null>(null);
  const [recentSearch, setRecentSearches] = useState<(IVODContent|ILiveContent)[]>([])
  const [suggestions, setSuggestions] = useState<(IVODContent|ILiveContent)[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [contents, setContents] = useState<(IVODContent|ILiveContent)[]>([])
  const {setIsToken, isToken} = useAppPersistStore();
  const dispatch = useAppDispatch();
  const isFullscreenContent = useAppSelector(selectFullVideoProps);
  const isLiveModalContent = useAppSelector(selectLiveModalContent);
  const [currentContentState, setContentState] = useState<IVODContent|ILiveContent|null>(isFullscreenContent)
        const isFocused = useIsFocused();
  

  const url = (ads && ads.length>0) ? ads[0].link : '';

  const handleLink = async () => {
    await InAppBrowser.open(url);
  };

  async function handleContentClick(item:(IVODContent|ILiveContent), canView?:boolean){
    await registerRecentSearch({contentId:item._id, contentType:'admin_id' in item ?'vod' :'live'})
    // HANDLING NAVIGATION
    if('admin_id' in item){
      dispatch(setPreviewContent(item)),
        navigate(routes.PREVIEW_SCREEN, {
        content: item.type.includes('series') ? previewContentType['tv series'] : item.type.includes('video') ? previewContentType['music video'] : previewContentType.film,
        videoURL: 'admin_id' in item ? item.trailer :'',
      })
    }else{
      //CAN VIEW ISSUE
      if(canView){
        dispatch(setFullVideoProps(item));
        setTimeout(() => makeFullscreen(),4000);
      }else{
        dispatch(setLiveModalContent(item));
      }
    }
  }


  async function handleSuggestions(){
    const resSug = await fetchContentSuggestions();
    if(resSug.status === 401) setIsToken(true)
    if(resSug.ok && resSug.data){
      const data = resSug.data.data
      setSuggestions([...data.vods, ...data.lives]);
    }
  }
  async function handleRecentSearches(){
    const res = await recentSearches();
    if(res.status === 401) setIsToken(true)
    if(res.ok && res.data){
      const data = res.data.data
      setRecentSearches([...data.vods, ...data.lives]);
    }
  }
  async function handleGetAds(){
    const resAds = await randomAds();
    if(resAds.status === 401) setIsToken(true)
    if(resAds.ok && resAds.data) dispatch(setAdsContent(resAds.data.data))
   
  }

  async function handleSearchContent(key:string){
    try {
      setLoading(true);
      if(key === '') setContents([]);

      const res = await searchContent(key);
      if(res.ok && res.data){
        const data = [...res.data.data.vods, ...res.data.data.events]
         const sortedData = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        
        setContents(prev =>{
          const existingId = new Set<string>(prev.map(x => x._id));
          const merged = [
            ...prev,
            ...sortedData.filter(x => !existingId.has(x._id))
          ];
          return merged
        })
      }else{
        ToastNotification('error', `${res.data?.message}`)
      }
    } catch (error) {
      ToastNotification('error', `${error}`)
    }finally{
      setLoading(false);
    }
  }

  const debouncedSearchProfiles = debounce(async (key: string) => {
    handleSearchContent(key);
  }, 500);

  function onKeyInputChange(key: string) {
    debouncedSearchProfiles(key);
  }

  useEffect(() => {
    const showKeyboard = Keyboard.addListener(
      'keyboardDidShow',
      (event: KeyboardEvent) => {
        // Extract keyboard height from the event
        const {height} = event.endCoordinates;
        // Set the keyboard height in state
        setKeyboardHeight(height);
      },
    );
    const hideKeyboard = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(null);
    });

    return () => {
      showKeyboard.remove();
      hideKeyboard.remove();
    };
  }, [Keyboard]);

  useLayoutEffect(() =>{
    handleGetAds();
    handleRecentSearches();
    handleSuggestions();
  }, [isToken]);

   useEffect(() =>{
      if(!currentContentState) setContentState(isFullscreenContent)
    }, [isFullscreenContent])

    useEffect(() =>{
      if(isFocused && !isFullscreen) dispatch(resetFullVideo())
    },[isFullscreen])

  useEffect(() =>{
      if(!isFullscreenContent) return;
      if(isFocused && !currentContentState) {
        setContentState(isFullscreenContent)
        makeFullscreen();
      } 
    }, [isFocused]);

  return (
    <>
    {!isFullscreen && !(isFullscreenContent && !currentContentState) && <AppScreen
      containerStyle={{
        paddingTop: 10,
        paddingBottom: 0,
        paddingHorizontal: 0,
        position: 'relative',
      }}>
        <StatusBar hidden={false} />
      <AppView className="px-5 flex-row items-center mb-2  relative">
        <AppHeader style={{width: 50}} />
        <AppView className="flex-1 -ml-[50px] z-[-10]">
          <AppText className="font-ROBOTO_700 text-[15px] text-white text-center">
            Search
          </AppText>
          {text !== '' && (
            <TouchableOpacity
              onPress={() => setText('')}
              className="absolute right-5">
              <AppText className="font-ROBOTO_400 text-center text-[15px] text-white">
                Cancel
              </AppText>
            </TouchableOpacity>
          )}
        </AppView>
      </AppView>
      {text === '' ? (
        <ScrollView style={[{height: Size.getHeight() - 300}]}>
          <AppView className="px-5 pb-20">
           {(ads && ads.length>0) && <>
            <AppView className="mt-6 bg-red pt-3 px-1 rounded-[15px]">
              <AppView className="flex-row items-center justify-between px-3 pb-2">
                <AppView>
                  <AppText className="font-LEXEND_400 text-base text-white ">
                    REEPLAY
                  </AppText>
                  <AppText className="font-MANROPE_500 text-white text-xs">
                    Ads that meet your interest
                  </AppText>
                </AppView>
              </AppView>

              <AppView className="h-[191px] mb-1 rounded-b-[15px] overflow-hidden border-[2px] border-black">
                <AppImage
                  source={{uri: ads[0].photoUrl}}
                  style={{
                    height:'100%',
                    width:'100%',
                    borderBottomLeftRadius:15,
                    borderBottomRightRadius:15
                  }}
                  resizeMode='cover'
                />
              </AppView>
            </AppView>

            <AppButton
              title={ads[0].cta}
              bgColor={colors.RED}
              onPress={() => handleLink()}
              style={{
                borderRadius: 5,
                width: '100%',
                marginTop: 15,
                paddingVertical: Size.calcHeight(15),
              }}
              labelStyle={{
                fontFamily: fonts.MANROPE_500,
                fontSize: 14.5,
                color: '#ffffff',
              }}
            />
            </>}

          {recentSearch.length > 0 &&  <AppView className="mt-6 rounded-[15px] overflow-hidden bg-[#1A1A1A]">
              <AppView className="bg-[#1A1A1A] rounded-t-[15px] pt-5 pb-4 px-[18px]">
                <AppText className="font-ROBOTO_700 text-white text-lg">
                  RECENT
                </AppText>
                <AppText className="font-MANROPE_400 text-white text-[13px]">
                  Your recent searches
                </AppText>
              </AppView>
              <AppView className="bg-black border-x-[3px] pl-[10px] pt-2 border-b-[3px] rounded-b-[15px] border-[#1A1A1A] w-full h-[150px]">
                <FlatList
                  data={recentSearch}
                  keyExtractor={(item) => item._id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity onPress={() => handleContentClick(item)} className="overflow-hidden w-[101px] h-[131px] mr-2 rounded-[10px]">
                        <AppImage
                          source={{uri: 'coverPhoto' in item ? item.coverPhoto:item.portraitPhoto}}
                          style={{width:'100%', height:'100%'}}
                          resizeMode='cover'
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              </AppView>
            </AppView>}

            {suggestions.length > 0 && <AppView className="mt-6 mb-3 rounded-[15px] overflow-hidden bg-[#1A1A1A]">
              <AppView className="bg-[#1A1A1A] rounded-t-[15px] pt-5 pb-4 px-[18px]">
                <AppText className="font-ROBOTO_700 text-white text-lg">
                  SUGGESTIONS
                </AppText>
              </AppView>
              <AppView className="bg-black border-x-[3px] pl-[10px] pt-2 border-b-[3px] rounded-b-[15px] border-[#1A1A1A] w-full h-[150px]">
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item._id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity onPress={() => handleContentClick(item)} className="overflow-hidden w-[101px] h-[131px] mr-2 rounded-[10px]">
                        <AppImage
                          source={{
                            uri: 'coverPhoto' in item ? item.coverPhoto : item.portraitPhoto,
                             priority:FastImage.priority.high,
                          }}
                          style={{
                            width:'100%',
                            height:'100%'
                          }}
                          resizeMode='cover'
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              </AppView>
            </AppView>}
          </AppView>
        </ScrollView>
      ) : (
        <ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <AppView style={styles.centerContent} className="pb-40 w-full mt-5">
            {contents.map((lib, index) => {  
              return <ContentItem key={`${lib._id}${index}`} lib={lib} handleContentClick={handleContentClick} />;
            })}
          </AppView>
        </ScrollView>
      )}

      <AppView
        style={
          keyboardHeight
            ? {marginBottom: keyboardHeight + (isAndroid ? -15:0)}
            : {}
        }
        className="absolute bottom-0 z-30 w-full">
        <AppView className="relative w-full items-center">
          {Platform.OS === 'android' ? (
            <AppView style={styles.blur}>
              <BlurView backgroundColor="rgba(0, 0, 0, 0.4)" blurRadius={50} />
            </AppView>
          ) : (
            <Blur blurType="dark" blurAmount={50} style={styles.blur} />
          )}
          <AppView
            style={{paddingVertical: Platform.OS === 'android' ? 6 : 18}}
            className="absolute top-3 mx-auto w-[95%] px-6 rounded-[40px] bg-black flex-row items-center z-50">
            <TouchableOpacity className="mr-3">
              {loading ? <ActivityIndicator size={'small'} /> : <SearchIcon_S />}
            </TouchableOpacity>
            <TextInput
              placeholder="Search Movies, Shows, Anime"
              placeholderTextColor={colors.GREY_WHITE}
              style={styles.input}
              value={text}
              onChangeText={text => [
                setText(text),
                onKeyInputChange(text)
              ]}
            />
            <TouchableOpacity onPress={() => [setText(''), setContents([])]} className="ml-3">
              <CloseBtn_S />
            </TouchableOpacity>
          </AppView>
        </AppView>
      </AppView>
    </AppScreen>}

    {(isFullscreenContent && isFullscreen) && <FullscreenModalPlayer
            currentContentState={currentContentState}
            setContentState={setContentState}
            isFullscreen={isFullscreen}
            content={isFullscreenContent}
            setFullscreen={() => isFullscreen ? [makePortrait()] : makeFullscreen()} 
          />}
    
          {!isFullscreen &&<AppModal
            isModalVisible={isLiveModalContent !== null}
            handleClose={() => dispatch(resetLiveVideo())}
            style={{padding:0, margin:0, marginLeft:0, height:Size.hp(50)}}
            hideCloseBtn
            hideLoge
            replaceDefaultContent={
              <>
               {isLiveModalContent && <LiveInfoModal
                  item={isLiveModalContent}
                  handleClose={() => dispatch(resetLiveVideo())}
                  makeFullscreen={makeFullscreen}
                  isBanner
                />}
              </>
            }
          />}
    </>
  );
};

export default Search;

interface Props{
  lib:IVODContent|ILiveContent
  handleContentClick:(lib:IVODContent|ILiveContent, canView?:boolean) => void
}
export const ContentItem = ({lib, handleContentClick}:Props) =>{
  const [loading, setLoading] = useState<boolean>(true)
  const [contentIsPaid, setContentIsPaid] = useState<boolean>(false)
   async function handleContentStatusUpdate(){
            if(lib.vidClass === 'free'){
              setContentIsPaid(true);
            }else{
              const res = await hasPaidContentStatus({contentType: 'coverPhoto' in lib ?'live':'vod', _id:lib._id})
              if(res.ok && res.data) setContentIsPaid(res.data.data.canView)
            }
          }

          useEffect(() =>{
              handleContentStatusUpdate()
          }, [lib._id])
          
  return(
    <View className='relative'>
         {loading && <View className='absolute z-10'>
            <Placeholder style={styles.image} />
          </View>}
    <TouchableOpacity onPress={() => handleContentClick(lib, contentIsPaid)} activeOpacity={0.6} key={lib._id}>
                  <AppImage 
                  source={{
                    uri: 'coverPhoto' in lib ? lib.coverPhoto :lib.portraitPhoto,
                    priority:FastImage.priority.high,
                  }} 
                  onLoadEnd={() => setLoading(false)}
                  style={styles.image} />
      </TouchableOpacity>
      </View>
  )
}

const styles = StyleSheet.create({
  blur: {
    width: '100%',
    height: 83,
  },
  input: {
    fontFamily: fonts.MANROPE_400,
    fontSize: Size.calcHeight(15),
    color: colors.GREY_WHITE,
    textAlign: 'center',
    flex: 1,
  },
  image: {
    width: Size.getWidth() / 3 - 20,
    height: 133,
    borderRadius: 15,
  },
  centerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Size.calcHeight(10),
    rowGap: Size.calcHeight(10),
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});
