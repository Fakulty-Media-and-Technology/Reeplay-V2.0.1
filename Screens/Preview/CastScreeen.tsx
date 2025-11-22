import {
  Alert,
  Animated,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  AppButton,
  AppImage,
  AppScreen,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import Header from '../Home/Header';
import colors from '@/configs/colors';
import LinearGradient from 'react-native-linear-gradient';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import {LibraryData} from '@/configs/data';
import {useNavigation, useRoute} from '@react-navigation/native';
import Share from 'react-native-share';
import {previewContentType, RootNav} from '@/navigation/AppNavigator';
import routes from '@/navigation/routes';
import BlurView from 'react-native-blur-effect';
import {BlurView as Blur} from '@react-native-community/blur';
import {MovieVideo} from '@/Screens/Home/HomeScreen';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { CastScreenRoute } from '@/types/typings';
import FastImage from 'react-native-fast-image';
import { IVODContent } from '@/types/api/content.types';
import ToastNotification from '@/components/ToastNotifications';
import { getVODbyCastID } from '@/api/content.api';
import Placeholder from '@/components/SkeletonLoader';

const CastScreeen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isScrolled, setIsScrolled] = useState(0);
  const [loading, setLoading] = useState<boolean>(false)
    const [content, setContent] = useState<IVODContent[]>([]);
  const {goBack, navigate} = useNavigation<RootNav>();
  const route = useRoute<CastScreenRoute>()
  const cast = route.params.cast
  const vodId = route.params.vodId
  const url = cast.link;

  const handleLink = async () => {
    await InAppBrowser.open(url);
  };

  const handleShare = () => {
    Share.open({message: cast.link})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  
    async function handleFetchContent(){
      try {
        setLoading(true);
        const res = await getVODbyCastID({vodId, pagination:{page:1, limit:6}, enumId:cast._id})
        if(res.ok && res.data){
          setContent(res.data.data)
        }
      } catch (error) {
        ToastNotification('error', `${error}`);
      }finally{
        setLoading(false)
      }
    }

  useEffect(() => {
    const listernerID = scrollY.addListener(({value}) => {
      if (value < 0) return;
      setIsScrolled(value);
    });

    return () => {
      scrollY.removeListener(listernerID);
    };
  }, [scrollY]);

  useEffect(() =>{
    handleFetchContent();
  }, [])

  return (
    <>
      <Header scroll={isScrolled} isCast />

      <View
        style={{
          paddingHorizontal: 0,
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: colors.DEEP_BLACK,
        }}>
        <AppView className="relative">
          <LinearGradient
            colors={['rgba(0,0,0,0.85)', 'transparent']}
            style={styles.gradientStyles}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.65)', 'rgba(0,0,0,0.95)']}
            style={[
              styles.gradientStyles,
              {bottom: 0, height: Size.calcHeight(160)},
            ]}
          />

          <AppImage
            source={{uri: cast.photoUrl, priority:FastImage.priority.high}}
            style={{
              width:Size.wp(100),
              height:500
            }}
          />

          <AppView className="absolute bottom-0 z-30 items-center w-full">
            <AppText className="teext-center uppercase font-ROBOTO_700 text-[15px] text-white">
              {cast.title}
            </AppText>
            <AppText className="capitalize mt-1 font-ROBOTO_700 text-[30px] text-white text-center">
              {cast.name}
            </AppText>
            <AppButton
              bgColor={colors.RED}
              title={cast.selectButtonType.replace('-', ' ').toUpperCase()}
              onPress={handleLink}
              style={styles.btn}
              labelStyle={styles.btnText}
            />
          </AppView>
        </AppView>

        <AppView className="w-full items-center pt-4">
          <AppText className="max-w-[83%] mt-2 tracking-wide font-ROBOTO_400 text-white text-[14px] text-center">
            {cast.description}
          </AppText>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{height: 250, marginTop: 24}}
            contentContainerStyle={{
              width: '100%',
              alignSelf: 'center',
            }}>
            <AppText className="font-ROBOTO_700 text-[15px] text-white text-center">
              OTHER MOVIES FEATURED ON
            </AppText>

            <AppView className="w-full mt-5 px-1 flex-row flex-wrap items-center gap-x-[10px] mb-32">
              {content.map((lib, index) => {
                if(loading) return <Placeholder key={index} style={styles.image}  />
                return (
                  <TouchableOpacity
                    className="mb-3"
                    activeOpacity={0.6}
                    key={index}
                    onPress={() =>
                      navigate(routes.PREVIEW_SCREEN, {
                      content: lib.type.includes('series') ? previewContentType['tv series'] : lib.type.includes('video') ? previewContentType['music video'] : previewContentType.film,
                        videoURL: MovieVideo,
                      })
                    }>
                    <AppImage source={{
                      uri: lib.portraitPhoto,
                      priority:FastImage.priority.high
                      }} style={styles.image} />
                  </TouchableOpacity>
                );
              })}
            </AppView>
          </ScrollView>
        </AppView>
      </View>
      <AppView className="absolute bottom-0 w-full h-[123px]">
        <AppView className="relative">
          {Platform.OS === 'android' ? (
            <AppView style={styles.blur}>
              <BlurView backgroundColor="rgba(0, 0, 0, 0.4)" blurRadius={120} />
            </AppView>
          ) : (
            <Blur blurType="dark" blurAmount={120} style={styles.blur} />
          )}

          <AppView className="absolute w-full h-full px-2 pt-1">
            <TouchableOpacity
              className="py-5 border-b border-grey_200/10 pb-[21px]"
              onPress={handleShare}>
              <AppText className="text-center font-ROBOTO_400 text-[13px] text-grey_100">
                Share
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity className="py-5" onPress={goBack}>
              <AppText className="text-center font-ROBOTO_400 text-[13px] text-grey_100">
                Close
              </AppText>
            </TouchableOpacity>
          </AppView>
        </AppView>
      </AppView>
    </>
  );
};

export default CastScreeen;

const styles = StyleSheet.create({
  gradientStyles: {
    width: '100%',
    height: Size.calcHeight(130),
    zIndex: 1,
    position: 'absolute',
  },
  btn: {
    width: Size.calcWidth(186),
    borderRadius: 8,
    paddingVertical: Size.calcHeight(14.5),
    marginTop: Size.calcHeight(12),
  },
  btnText: {
    fontFamily: fonts.ROBOTO_700,
    fontSize: 15,
    color: colors.WHITE,
  },
  blur: {
    width: '100%',
    height: 123,
  },
  image: {
    width: Size.getWidth() / 3 - 20,
    height: 133,
    borderRadius: 15,
  },
});
