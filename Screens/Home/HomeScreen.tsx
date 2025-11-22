import {
  Animated as Ani,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from './Header';

import Slider from './components/SliderContainer';
import colors from '@/configs/colors';
import ContinueWatchingComponent from './ContinueWatchingComponent';
import { AppText, AppView, TouchableOpacity } from '@/components';
import SwiperContainer from './components/SwiperContainer';
import SectionHeader from './components/SectionHeader';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import AppCategories from '@/components/AppCategories';
import Size from '@/Utils/useResponsiveSize';
import Sections from './components/Sections';
import { useNavigation } from '@react-navigation/native';
import routes from '@/navigation/routes';
import BlurView from 'react-native-blur-effect';
import { BlurView as Blur } from '@react-native-community/blur';
import { HAS_SKIPPED } from '../authentication/components/AuthFormComponent';
import { getData, storeData } from '@/Utils/useAsyncStorage';
import Orientation, { PORTRAIT } from 'react-native-orientation-locker';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import {
  setOrientations,
} from '@/store/slices/orientationSlize';
import { getProfileDetails } from '@/api/profile.api';
import { setCredentials, setHideTabBar, setNoticationsList, setWalletInfo } from '@/store/slices/userSlice';
import { hasUserDetails } from '../Splashscreen/Splashscreen';
import Animated from 'react-native-reanimated';
import { getSponsoredLiveEvents } from '@/api/live.api';
import { setSponsoredEventProps } from '@/store/slices/liveEvents/sponsoredSlice';
import LinearGradient from 'react-native-linear-gradient';
import { bannerApi, contentCostApi, deleteContinueWatchingById, fetchEnums, getContinueWatching, randomAds } from '@/api/content.api';
import { selectBannerContent, selectCategories, selectContinueWatching, setBannerContent, setCategories, setContinueWatching, setGenres, setPremiumContentCost, setSelectedPremiumCost } from '@/store/slices/bannerSlice.slice';
import { setAdsContent } from '@/store/slices/adsSlice.slice';
import ContentWrapper from '@/components/ContentWrapper';
import ContinueWatchingComp from '@/components/ContinueWatchingComp';
import { useAppPersistStore } from '@/store/zustand.store';
import { walletBalance } from '@/api/payment.api';
import { TabNavParams } from '@/navigation/TabNavigation';
import { resetFullVideo } from '@/store/slices/fullScreenVideo.slice';
import { useCurrencyByIP } from '@/Hooks/useCurrencyByIP';
import { getAllNotifications } from '@/api/notification.api';
import { OrientationInjectedProps } from '@/components/OrientationWrapper';
import DownloadFullscreenModalPlayer from '../Download/FullscreenModalPlayer';
import { IDownloadData } from '@/types/api/content.types';


const AnimatedView = Animated.createAnimatedComponent(AppView);
export const AnimatedLin = Animated.createAnimatedComponent(LinearGradient);

export const SeriesVideo: string =
  'https://res.cloudinary.com/dag4n1g6h/video/upload/f_auto:video,q_auto/video_rhsuqs';
export const MusicVideo: string =
  'https://res.cloudinary.com/dag4n1g6h/video/upload/f_auto:video,q_auto/gv1dw19vqjuv5mfbvbsl';
export const MovieVideo: string =
  'https://res.cloudinary.com/demo/video/upload/f_auto:video,q_auto/tz2nkki28sk5idwthlpk.mp4';

const HomeScreen = ({isFullscreen,makeFullscreen,makePortrait}:OrientationInjectedProps) => {
  const scrollY = useRef(new Ani.Value(0)).current;
  const [isScrolled, setIsScrolled] = useState(0);
  const { navigate } = useNavigation<TabNavParams>();
  const dispatch = useAppDispatch();
  const [orientation, setOrientation] = useState<string | null>(null);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const vods = useAppSelector(selectBannerContent).vods
  const cat = useAppSelector(selectCategories)
  const ContinueWatching = useAppSelector(selectContinueWatching);
  const {setIsToken} = useAppPersistStore();
  const [isFullscreenContent, setFullscreenContent] = useState<IDownloadData|null>(null)


  async function getSkippedState() {
    const hasSkipped = await getData(HAS_SKIPPED);
    if (hasSkipped) {
      setIsSkipped(true);
    }
  }

    async function getWallet() {
      const res = await walletBalance();
      if (res.ok && res.data) {
        dispatch(setWalletInfo(res.data.data));
      }
    }

    async function handlePremiumContentCost(){
      const res = await contentCostApi();
      if(res.ok && res.data) dispatch(setPremiumContentCost(res.data.data));
    }

    async function handleCache(key:string, data:string){
      await storeData(key, data)
    }

  async function userProfile() {
    const res = await getProfileDetails();
    const banner = await bannerApi();
    const categories = await fetchEnums('categories');
    const genres = await fetchEnums('genres');
    const cW = await getContinueWatching({page:1, limit:10});
     const resAds = await randomAds();
     if(cW.status === 401 || res.status === 401 || resAds.status === 401) setIsToken(true)
     if(resAds.ok && resAds.data){ 
      dispatch(setAdsContent(resAds.data.data));
    }
    if(cW.ok && cW.data) {
const allContent = cW.data.data;
    const completedContent = allContent.filter(x => x.duration === x.totalDuration);
    const inProgressContent = allContent.filter(x => x.duration !== x.totalDuration);
    
    await Promise.all(
      completedContent.map(x => deleteContinueWatchingById(x.watchedDocumentId))
    )
      dispatch(setContinueWatching(inProgressContent))
    }
    if (categories.ok && categories.data) {
      dispatch(setCategories(categories.data.data))
      const dataC = JSON.stringify(categories.data.data);
      handleCache('category', dataC);
    }
    if (genres.ok && genres.data) {
      dispatch(setGenres(genres.data.data))
      const dataG = JSON.stringify(genres.data.data);
      handleCache('genre', dataG);
    };
    if (banner.ok && banner.data){ 
      dispatch(setBannerContent(banner.data.data));
      const dataB = JSON.stringify(banner.data.data);
      handleCache('banner', dataB);
    }
    if (res.ok && res.data) {
      dispatch(setCredentials(res.data.data));
      await storeData(hasUserDetails, JSON.stringify(res.data.data));
    }
  }


  // LIVE EVENTS FUNCTIONS
  async function getSponsoredEvents() {
    try {
      const res = await getSponsoredLiveEvents();
      if (res.ok && res.data) dispatch(setSponsoredEventProps(res.data.data));
    } catch (error) { }
  }

  async function handleNotifications() {
    const res = await getAllNotifications({page:1, limit: 20});
    if (res.ok && res.data) {
      dispatch(setNoticationsList(res.data.data));
    }
  }

  useEffect(() => {
    const listernerID = scrollY.addListener(({ value }) => {
      if (value < 0) return;
      setIsScrolled(value);
    });

    return () => {
      scrollY.removeListener(listernerID);
    };
  }, [scrollY]);

  useEffect(() => {
    Orientation.lockToPortrait();
    checkOrientation();
    userProfile();
    getSponsoredEvents();
    dispatch(resetFullVideo());
    getSkippedState();
    getWallet();
    handlePremiumContentCost();
    handleNotifications();
  }, []);

  function checkOrientation() {
    Orientation.getOrientation(orient => {
      if (orientation !== orient) dispatch(setOrientations(orient));

      if (orient !== PORTRAIT) {
        Orientation.lockToPortrait();
        checkOrientation();
      } else {
        setOrientation(orient);
      }
      // dispatch(set(orientation))
    });
  }

  useEffect(() =>{
    dispatch(setHideTabBar(isFullscreen))
  }, [isFullscreen])


  return (
    <>
      {!isFullscreen && orientation === PORTRAIT && (
        <>
          {/* //Header */}
          <AppView
            style={{
              minHeight: 55,
              backgroundColor: 'rgba(0, 0, 0, 0.69)',
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
          <Header scroll={isScrolled} />

          <StatusBar
            hidden={isFullscreen || isFullscreenContent !== null}
            translucent
            barStyle="light-content"
            backgroundColor="transparent"
          />

          {/* HOME SCROLL */}
          <Ani.ScrollView
            scrollEnabled={true}
            onScroll={Ani.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false },
            )}
            scrollEventThrottle={16}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Size.hp(17), width: '100%' }}
            style={{
              backgroundColor: colors.DEEP_BLACK,
              position: 'relative',
            }}>
            <Slider data={vods} makeFullscreen={makeFullscreen} setFullscreenContent={setFullscreenContent} />

            <AppView className="mt-8 pl-5">
              {ContinueWatching.length > 0 ? (
                <>
                  <AppText className="text-lg text-white font-MANROPE_700">
                    Continue watching
                  </AppText>
                  <FlatList
                    data={ContinueWatching}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <ContinueWatchingComp 
                        item={item} 
                        key={index} 
                        makeFullscreen={makeFullscreen}
                        setFullscreenContent={setFullscreenContent}
                        />
                      );
                    }}
                  />
                </>
              ) : (
                <>
                 {cat.length > 0 && <ContentWrapper 
                    enums={cat[0]}
                    showPagination
                  />}
                 
                </>
              )}
            </AppView>

             <AppView className="mt-8">
              <AppView className="pl-5">
                <SectionHeader
                  title="Genres"
                  btnText="SEE ALL"
                  headerStyle={{ marginRight: 12 }}
                  onPress={() => navigate(routes.LIBRARY_SCREEN)}
                />
              </AppView>
              <SwiperContainer />
            </AppView>

           <Sections isSkipped={ContinueWatching.length > 0} />
          </Ani.ScrollView>
        </>
      )}

      {(isFullscreenContent && isFullscreen) && <DownloadFullscreenModalPlayer
          isFullscreen={isFullscreen}
          content={isFullscreenContent}
          setFullscreen={() => isFullscreen ? [makePortrait(), setFullscreenContent(null)] : makeFullscreen()} 
        />}
    </>
  );
};

export default HomeScreen;
