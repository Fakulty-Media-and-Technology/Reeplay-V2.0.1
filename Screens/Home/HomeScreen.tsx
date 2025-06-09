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
import { ContinueWatching, HeroSliderData, TrendingNow } from '@/configs/data';
import { AppText, AppView, TouchableOpacity } from '@/components';
import SwiperContainer from './components/SwiperContainer';
import SectionHeader from './components/SectionHeader';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import AppCategories from '@/components/AppCategories';
import Size from '@/Utils/useResponsiveSize';
import Sections from './components/Sections';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNav, TabMainNavigation } from '@/types/typings';
import routes from '@/navigation/routes';
import BlurView from 'react-native-blur-effect';
import { BlurView as Blur } from '@react-native-community/blur';
import { HAS_SKIPPED } from '../authentication/components/AuthFormComponent';
import { getData, storeData } from '@/Utils/useAsyncStorage';
import { previewContentType } from '@/navigation/AppNavigator';
import Orientation, { PORTRAIT } from 'react-native-orientation-locker';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import {
  selectOrientation,
  setOrientations,
} from '@/store/slices/orientationSlize';
import { getProfileDetails } from '@/api/profile.api';
import { setCredentials } from '@/store/slices/userSlice';
import { hasUserDetails } from '../Splashscreen/Splashscreen';
import { LockModalIcon } from '@/assets/icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { getSponsoredLiveEvents } from '@/api/live.api';
import { setSponsoredEventProps } from '@/store/slices/liveEvents/sponsoredSlice';
import LinearGradient from 'react-native-linear-gradient';
import { bannerApi } from '@/api/content.api';
import { selectBannerContent, setBannerContent } from '@/store/slices/bannerSlice.slice';


const AnimatedView = Animated.createAnimatedComponent(AppView);
export const AnimatedLin = Animated.createAnimatedComponent(LinearGradient);

export const SeriesVideo: string =
  'https://res.cloudinary.com/dag4n1g6h/video/upload/f_auto:video,q_auto/video_rhsuqs';
export const MusicVideo: string =
  'https://res.cloudinary.com/dag4n1g6h/video/upload/f_auto:video,q_auto/gv1dw19vqjuv5mfbvbsl';
export const MovieVideo: string =
  'https://res.cloudinary.com/demo/video/upload/f_auto:video,q_auto/tz2nkki28sk5idwthlpk.mp4';

const HomeScreen = () => {
  const scrollY = useRef(new Ani.Value(0)).current;
  const [isScrolled, setIsScrolled] = useState(0);
  const { navigate } = useNavigation<HomeScreenNav>();
  const { navigate: nav, setOptions } = useNavigation<TabMainNavigation>();
  const dispatch = useAppDispatch();
  const [orientation, setOrientation] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const vods = useAppSelector(selectBannerContent).vods

  const [isSkipped, setIsSkipped] = useState<boolean>(false);

  async function getSkippedState() {
    const hasSkipped = await getData(HAS_SKIPPED);
    if (hasSkipped) {
      setIsSkipped(true);
    }
  }

  async function userProfile() {
    const res = await getProfileDetails();
    const banner = await bannerApi();

    if (banner.ok && banner.data) dispatch(setBannerContent(banner.data.data))
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
    getSkippedState();
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


  useLayoutEffect(() => {
    checkOrientation();
    userProfile();
    getSponsoredEvents();
  }, []);

  return (
    <>
      {/* <Pressable
        onPress={() => setShowModal(true)}
        onPressIn={() => setShowModal(true)}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: 10,
        }}
      /> */}

      {orientation === PORTRAIT ? (
        <>
          {/* //Header */}
          <AppView
            style={{
              minHeight: Size.calcHeight(90),
              backgroundColor: 'rgba(0, 0, 0, 0.69)',
            }}
            className="absolute bottom-0 w-full z-20">
            {Platform.OS === 'ios' ? (
              <Blur
                blurType="dark"
                blurAmount={120}
                style={{
                  minHeight: Size.calcHeight(90),
                  width: '100%',
                }}
              />
            ) : (
              <BlurView backgroundColor="rgba(0, 0, 0, 0.4)" blurRadius={120} />
            )}
          </AppView>
          <Header scroll={isScrolled} />

          <StatusBar
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
            // decelerationRate="normal"
            nestedScrollEnabled
            // bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50, width: '100%' }}
            style={{
              backgroundColor: colors.DEEP_BLACK,
              position: 'relative',
            }}>
            <Slider data={vods} />

            <AppView className="mt-8 pl-5">
              {isSkipped ? (
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
                        <ContinueWatchingComponent item={item} key={index} />
                      );
                    }}
                  />
                </>
              ) : (
                <>
                  <AppCategories
                    title="Popular on REEPLAY"
                    movieCategories={TrendingNow}
                    onPress={() => console.log('popular')}
                    style={{ marginRight: Size.calcHeight(12) }}
                    onPressMovie={() =>
                      nav(routes.PREVIEW_SCREEN, {
                        content: previewContentType['tv series'],
                        videoURL: SeriesVideo,
                      })
                    }
                  />
                  <AppView className="flex-row items-center justify-center gap-x-1.5 -mb-4 mt-4">
                    {[...Array(5)].map((item, i) => {
                      const active = i === 1 || i === 2 || i === 3;
                      const color = active
                        ? colors.RED
                        : 'rgba(255, 19, 19, 0.4)';
                      return (
                        <View
                          key={i}
                          style={{
                            marginTop: active ? 0 : 1,
                            width: active ? 9 : 7,
                            height: active ? 9 : 7,
                            borderRadius: 99,
                            backgroundColor: color,
                          }}
                        />
                      );
                    })}
                  </AppView>
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

            <Sections isSkipped={isSkipped} />
          </Ani.ScrollView>
        </>
      ) : (
        <AppView className="w-full h-full bg-black" />
      )}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => console.log('mvp modal')}>
        <AppView className="relative w-full h-full">
          {Platform.OS === 'ios' ? (
            <Blur
              blurType="dark"
              blurAmount={2}
              style={{
                height: Size.hp(100),
                width: '100%',
              }}
            />
          ) : (
            <BlurView backgroundColor="rgba(0, 0, 0, 0.4)" blurRadius={2} />
          )}

          <AnimatedView
            entering={FadeIn.duration(2000).springify()}
            style={{ height: Size.hp(60) }}
            className="mt-auto bg-black/50 pt-3">
            <AppView
              style={{ alignSelf: 'center' }}
              className="h-[2px] w-11 bg-[#DEE1E6]"
            />

            <AppView
              style={{ alignSelf: 'center' }}
              className="flex-row items-center mt-4">
              <LockModalIcon />
              <AppText className="mb-2 font-LEXEND_600 text-white text-lg">
                Coming Soon
              </AppText>
            </AppView>

            <AppText
              style={{ alignSelf: 'center' }}
              className="font-LEXEND_400 text-white text-xl px-3 mt-3">
              Reeplay video on demand is accepting contents.
            </AppText>

            <AppText
              style={{ alignSelf: 'center' }}
              className="font-MANROPE_400 text-base text-white mt-5 px-2">
              Reeplay streaming app is currently accepting contents. We will
              accept only African contents, produced in and out of Africa,
              produced by any race, provided content is of 70% black cast.
            </AppText>

            <AppText
              style={{ alignSelf: 'center' }}
              className="font-MANROPE_400 text-base text-yellow mt-5 px-3">
              <AppText className="text-white">
                Reeplay VOD Streaming platform accepts contents as Movies, Tv
                Series, Documentaries, Anime and More.
              </AppText>
              To submit your content for go through any Reeplay licensed
              publisher.
            </AppText>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="bg-[#626161] rounded-lg py-3 mx-5 mt-auto mb-8">
              <AppText className="font-MANROPE_400 text-white text-lg mb-[2px] text-center">
                Close
              </AppText>
            </TouchableOpacity>
          </AnimatedView>
        </AppView>
      </Modal>
    </>
  );
};

export default HomeScreen;
