import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import colors from '@/configs/colors';
import LinearGradient from 'react-native-linear-gradient';
import { AppImage, AppText, AppView } from '@/components';
import Size from '@/Utils/useResponsiveSize';
import Caurosel from './Caurosel';
import { Rect, Svg } from 'react-native-svg';
import { HeroSliderDataProps, LiveSliderDataProps } from '@/types/data.types';
import Carousel from 'react-native-reanimated-carousel';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { selectSponsoredEvents } from '@/store/slices/liveEvents/sponsoredSlice';
import { IDownloadData, ILiveContent, IVODContent } from '@/types/api/content.types';
import { generateGradientColors } from '@/Utils/contentUtils';
import { useCurrencyByIP } from '@/Hooks/useCurrencyByIP';
import { selectPremiumCost, setSelectedPremiumCost } from '@/store/slices/bannerSlice.slice';

const SLIDER_HEIGHT =
  Platform.OS === 'ios' ? Size.getHeight() * 0.59 : Size.getHeight() * 0.62;
const SLIDER_HEIGHT_L =
  Platform.OS === 'ios' ? Size.getHeight() * 0.65 : Size.getHeight() * 0.62;
const ITEM_WIDTH = Size.getWidth() * 0.88;
const WIDTH = Dimensions.get('window').width;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface SliderProps {
  data: (IVODContent | ILiveContent)[];
  live?: boolean;
  makeFullscreen?: () => void
  setFullscreenContent?: React.Dispatch<React.SetStateAction<IDownloadData | null>>
}

// Type definition for the FlatList component
type MyFlatList = FlatList<any>;

const Slider = ({ data, live, makeFullscreen, setFullscreenContent }: SliderProps) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [movieData, setMovieData] = useState([...data, ...data, ...data]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<MyFlatList>(null);
  const premiumCost = useAppSelector(selectPremiumCost)
  const {data:premium, isLoading} = useCurrencyByIP({NGN:premiumCost?.premiumNGN??0, USD:premiumCost?.premiumUSD??0})
  const dispatch = useAppDispatch()

  // const sponsoredEvents = useAppSelector(selectSponsoredEvents);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const secondToLastIndex = movieData.length - 2;
    const maxScroll = ITEM_WIDTH * secondToLastIndex - 120;

    if (contentOffsetX > maxScroll) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }

    if (contentOffsetX < 0) {
      flatListRef.current?.scrollToOffset({ offset: maxScroll, animated: false });
    }
  };

  useEffect(() => {
    const listernerID = scrollX.addListener(({ value }) => {
      if (value < 0) return;
    });

    return () => {
      scrollX.removeListener(listernerID);
    };
  }, [scrollX]);

  useEffect(() =>{
    if(!isLoading) dispatch(setSelectedPremiumCost(premium));
  }, [isLoading])

  return (
    <AppView
      className="relative w-full">
      <LinearGradient
        colors={['rgb(0,0,0, 0.9)', 'rgba(0,0,0,0.65)', 'transparent']}
        style={styles.gradientStyles}
      />

      {!live && (
        <BackDrop
          data={data.filter((item): item is IVODContent => 'admin_id' in item)}
          curIndex={currentIndex}
          scrollX={scrollX}
        />
      )}

      {/* Image Carousel */}
      <View style={{ height: 510 }}>
        <Carousel
          loop
          style={{
            width: WIDTH,
            marginTop: 102,
          }}
          vertical={false}
          width={WIDTH}
          height={410}
          pagingEnabled={true}
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 80,
          }}
          mode="parallax"
          snapEnabled={true}
          data={data}
          scrollAnimationDuration={200}
          onSnapToItem={index => {
            setCurrentIndex(index);
          }}
          renderItem={({ item, index }) => {
            return (
              <>
                <Caurosel
                  item={item}
                  currentIndex={index === currentIndex}
                  colors={live ? [] : ['transparent', 'transparent', generateGradientColors('primaryColor' in item ? item.primaryColor : '#333333')[2]]}
                  live={live}
                  watchLive={makeFullscreen}
                  handleVODTrailer={() => ('admin_id' in item && setFullscreenContent) ? setFullscreenContent({_id:item._id,desc:item.description,landscapePhoto:item.landscapePhoto,pg:item.pg,portraitPhoto:item.portraitPhoto,title:item.title,video:item.trailer,size:'30',type:item.type,viewsCount:item.viewsCount,vidClass:item.vidClass}):console.log('')}
                />
              </>
            );
          }}
        />
      </View>
      <Indicators
        items={data}
        currentIndex={currentIndex}
      />
    </AppView>
  );
};

interface BackDropOptions {
  data: IVODContent[];
  scrollX: Animated.Value;
  curIndex: number;
}

const BackDrop = ({ data, scrollX, curIndex }: BackDropOptions) => {
  const MainItem = data;
  return (
    <AppView
      style={{
        zIndex: -1,
      }}
      className="w-full absolute h-full">
      <FlatList
        data={MainItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{
          height: SLIDER_HEIGHT + 30,
          // overflow: 'hidden',
        }}
        renderItem={({ item, index }) => {
          return (
            <Animated.View
            style={{
              height: '100%',
              width: '100%',
              }}>
              <LinearGradient
                colors={generateGradientColors(item.primaryColor)}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              />
            </Animated.View>
          );
        }}
      />
    </AppView>
  );
};

interface indicatorData {
  items: any[];
  currentIndex: number;
}

const Indicators = ({ items, currentIndex }: indicatorData) => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (currentIndex % 3 === 0) {
      setIndex(currentIndex);
    } else {
      const closestIndex = Math.floor(currentIndex / 3) * 3;
      setIndex(closestIndex);
    }
  }, [currentIndex]);

  return (
    <AppView className="flex-row items-center justify-center gap-x-[3px]">
      {items.map((item, i) => {
        if (item.title === 'spacer') return null;

        const activeArray = [index, index + 1, index + 2];

        const isNearActive = activeArray.includes(i);

        const color =
          currentIndex === i ? colors.RED : 'rgba(255, 19, 19, 0.4)';
        return (
          <View
            key={i}
            style={{
              width: isNearActive ? 23 : 6,
              height: 3,
              borderRadius: 10,
              backgroundColor: color,
            }}
          />
        );
      })}
    </AppView>
  );
};

export default Slider;

const styles = StyleSheet.create({
  gradientStyles: {
    width: '100%',
    height: Size.calcHeight(130),
    zIndex: 1,
    position: 'absolute',
  },
});
