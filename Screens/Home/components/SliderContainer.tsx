import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import colors from '@/configs/colors';
import LinearGradient from 'react-native-linear-gradient';
import {AppView} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import Caurosel from './Caurosel';
import Carousel from 'react-native-reanimated-carousel';
import {ILiveContent, IVODContent} from '@/types/api/content.types';
import {generateGradientColors} from '@/Utils/contentUtils';

const SLIDER_HEIGHT =
  Platform.OS === 'ios' ? Size.getHeight() * 0.59 : Size.getHeight() * 0.62;
const ITEM_WIDTH = Size.getWidth() * 0.88;
const WIDTH = Dimensions.get('window').width;

interface SliderProps {
  data: (IVODContent | ILiveContent)[];
  live?: boolean;
}

type MyFlatList = FlatList<any>;

const Slider = ({data, live}: SliderProps) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  // ✅ MODIFICATION: movieData sorted by engagement
  const [movieData, setMovieData] = useState<(IVODContent | ILiveContent)[]>(
    [],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<MyFlatList>(null);

  // ✅ MODIFICATION: sort dynamically on data change
  useEffect(() => {
    if (data?.length) {
      const sortedData = [...data].sort((a, b) => {
        const engagementA =
          'views' in a && typeof a.views === 'number' ? a.views : 0;
        const engagementB =
          'views' in b && typeof b.views === 'number' ? b.views : 0;
        return engagementB - engagementA;
      });
      setMovieData(sortedData);
    }
  }, [data]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const secondToLastIndex = movieData.length - 2;
    const maxScroll = ITEM_WIDTH * secondToLastIndex - 120;

    if (contentOffsetX > maxScroll) {
      flatListRef.current?.scrollToOffset({offset: 0, animated: false});
    }

    if (contentOffsetX < 0) {
      flatListRef.current?.scrollToOffset({offset: maxScroll, animated: false});
    }
  };

  useEffect(() => {
    const listenerID = scrollX.addListener(({value}) => {
      if (value < 0) return;
    });
    return () => {
      scrollX.removeListener(listenerID);
    };
  }, [scrollX]);

  return (
    <AppView
      style={{height: live ? 510 : 510}}
      className="relative w-full z-0 bg-transparent">
      <LinearGradient
        colors={['rgb(0,0,0)', 'rgba(0,0,0,0.65)', 'transparent']}
        style={styles.gradientStyles}
      />

      {!live && (
        <BackDrop
          data={movieData.filter(
            (item): item is IVODContent => 'admin_id' in item,
          )}
          curIndex={currentIndex}
          scrollX={scrollX}
        />
      )}

      <View style={{height: 510}}>
        <Carousel
          loop
          style={{width: WIDTH, marginTop: 102}}
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
          data={movieData} // ✅ use sorted movieData
          scrollAnimationDuration={200}
          onSnapToItem={index => setCurrentIndex(index)}
          renderItem={({item, index}) => (
            <Caurosel
              item={item}
              currentIndex={index === currentIndex}
              colors={
                live
                  ? []
                  : [
                      'transparent',
                      'transparent',
                      generateGradientColors(
                        'primaryColor' in item ? item.primaryColor : '#333333',
                      )[2],
                    ]
              }
              live={live}
            />
          )}
        />
      </View>
      <Indicators items={movieData} currentIndex={currentIndex} />
    </AppView>
  );
};

interface BackDropOptions {
  data: IVODContent[];
  scrollX: Animated.Value;
  curIndex: number;
}

const BackDrop = ({data, scrollX, curIndex}: BackDropOptions) => {
  return (
    <AppView style={{zIndex: -1}} className="w-full absolute h-full">
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{height: SLIDER_HEIGHT, overflow: 'hidden'}}
        renderItem={({item}) => (
          <Animated.View style={{height: SLIDER_HEIGHT, width: '100%'}}>
            <LinearGradient
              colors={generateGradientColors(item.primaryColor ?? '#333333')}
              style={{height: SLIDER_HEIGHT, width: '100%'}}
            />
          </Animated.View>
        )}
      />
    </AppView>
  );
};

interface indicatorData {
  items: any[];
  currentIndex: number;
}

const Indicators = ({items, currentIndex}: indicatorData) => {
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
