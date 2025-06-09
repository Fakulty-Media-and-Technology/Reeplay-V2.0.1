import { Alert, Animated, Platform, ScrollView } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppScreen, AppText, AppView } from '@/components';
import colors from '@/configs/colors';
import UpcomingView from './components/UpcomingView';
import upcomingData from '@/configs/upcomingData';
import Size from '@/Utils/useResponsiveSize';
import BlurView from 'react-native-blur-effect';
import { BlurView as Blur } from '@react-native-community/blur';
import Orientation from 'react-native-orientation-locker';
import { getUpcomingEvents } from '@/api/upcomingEvents.api';
import { IUpcomingEvents } from '@/types/api/upcomingEvents.types';
import { IPagination } from '@/types/api/auth.types';
import { ILiveContent, IVODContent } from '@/types/api/content.types';

const UpcomingScreen = () => {
  const [playingIndexes, setPlayingIndexes] = useState<number[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [orientation, setOrientation] = useState<string | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<(IVODContent | ILiveContent)[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ page: 1, limit: 20 })

  async function handleUpcomingEvents() {
    try {
      const res = await getUpcomingEvents(pagination);
      if (res.ok && res.data) {
        const data: (IVODContent | ILiveContent)[] = [...res.data.data.lives, ...res.data.data.vods];

        const sortedData = data.sort((a, b) => {
          let dateA: Date;
          let dateB: Date;

          if ('releaseDate' in a) {
            dateA = new Date(a.releaseDate);
          } else {
            dateA = new Date(a.start);
          }

          if ('releaseDate' in b) {
            dateB = new Date(b.releaseDate);
          } else {
            dateB = new Date(b.start);
          }

          return dateA.getTime() - dateB.getTime();
        });

        console.log(sortedData);
        setUpcomingEvents(sortedData);
      } else {
        Alert.alert(`${res.data?.message}`)
      }
    } catch (error) {
      console.log(error);
    }
  }


  useLayoutEffect(() => {
    handleUpcomingEvents();
  }, []);

  function checkOrientation() {
    Orientation.getOrientation(orient => {
      console.log(orient);
      if (orient !== 'PORTRAIT') {
        Orientation.lockToPortrait();
        checkOrientation();
      } else {
        setOrientation(orient);
      }
      // dispatch(set(orientation))
    });
  }

  useEffect(() => {
    // Orientation.lockToPortrait();
    checkOrientation();
  }, []);

  return (
    <>
      <AppView
        style={{
          minHeight: Size.calcHeight(90),
          backgroundColor: 'rgba(0, 0, 0, 0.59)',
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
      {orientation === 'PORTRAIT' ? (
        <>
          <AppScreen
            containerStyle={{
              backgroundColor: colors.DEEP_BLACK,
              paddingHorizontal: 0,
              paddingBottom: Platform.OS === 'ios' ? 120 : 80,
            }}>
            <AppText className="pl-5 font-LEXEND_700 text-[17px] text-grey_100 my-4">
              COMING SOON
            </AppText>
            <AppView>
              <ScrollView
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: false },
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}>
                {upcomingEvents.map((item, i) => {
                  return (
                    <UpcomingView
                      key={i}
                      items={item}
                      index={i}
                      scrollY={scrollY}
                      playingIndexes={playingIndexes}
                      setPlayingIndexes={setPlayingIndexes}
                    />
                  );
                })}
              </ScrollView>
            </AppView>
          </AppScreen>
        </>
      ) : (
        <AppView className="w-full h-full bg-black" />
      )}
    </>
  );
};

export default UpcomingScreen;
