import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppText, AppView } from '@/components';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import colors from '@/configs/colors';
import { LiveTabs } from '@/configs/data';
import SelectTabs from './SelectTabs';
import AllTabs from './components/AllTabs';
import ChannelsTabs from './components/ChannelsTabs';
import EventsTab from './components/EventsTab';
import TvShowsTab from './components/TvShowsTab';
import SportsTab from './components/SportsTab';
import PodcastTab from './components/PodcastTab';
import { LiveEvents } from '@/types/api/live.types';
import {
  getChannels,
  getChannelsPop,
  getEventsPop,
  getLiveEvents,
  getPodcastEvents,
  getPodcastPop,
  getSportEvents,
  getSportPop,
  getTVShowsEvents,
  getTVShowsPop,
} from '@/api/live.api';
import { ILiveContent } from '@/types/api/content.types';

export interface IEvent {
  pop: ILiveContent[];
  others: ILiveContent[];
}

const initial: IEvent = {
  pop: [],
  others: [],
};

interface Props {
  scrollY: Animated.Value;
  makeFullscreen: () => void
}

const DynamicViewContainer = ({ scrollY, makeFullscreen }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabTitle, setTabTitle] = useState('All');
  const [events, setEvents] = useState<IEvent>(initial);
  const [channels, setChannels] = useState<IEvent>(initial);
  const [tvshows, setTVShows] = useState<IEvent>(initial);
  const [sports, setSports] = useState<IEvent>(initial);
  const [podcasts, setPodcast] = useState<IEvent>(initial);
  const [isLoading, setIsLoading] = useState(true);

  async function getAllEvents() {
    try {
      setIsLoading(true);

      // POPULAR EVENTS
      const resPopEvents = await getEventsPop();
      if (resPopEvents.ok && resPopEvents.data) {
        const data = resPopEvents.data.data;
        setEvents(prev => ({ ...prev, pop: data }));
      }

      const resPopChannels = await getChannelsPop();
      if (resPopChannels.ok && resPopChannels.data) {
        const data = resPopChannels.data.data;
        setChannels(prev => ({ ...prev, pop: data }));
      }

      const resPopTVShows = await getTVShowsPop();
      if (resPopTVShows.ok && resPopTVShows.data) {
        const data = resPopTVShows.data.data;
        setTVShows(prev => ({ ...prev, pop: data }));
      }

      const resPopSports = await getSportPop();
      if (resPopSports.ok && resPopSports.data) {
        const data = resPopSports.data.data;
        setSports(prev => ({ ...prev, pop: data }));
      }

      const resPopPodcast = await getPodcastPop();
      if (resPopPodcast.ok && resPopPodcast.data) {
        const data = resPopPodcast.data.data;
        setPodcast(prev => ({ ...prev, pop: data }));
      }

      // OTHER EVENTS
      const res = await getLiveEvents();
      if (res.ok && res.data) {
        const data = res.data.data;
        setEvents(prev => ({ ...prev, others: data }));
      }

      const resChan = await getChannels();
      if (resChan.ok && resChan.data) {
        const data = resChan.data.data;
        setChannels(prev => ({ ...prev, others: data }));
      }

      const resTV = await getTVShowsEvents();
      if (resTV.ok && resTV.data) {
        const data = resTV.data.data;
        setTVShows(prev => ({ ...prev, others: data }));
      }

      const resSport = await getSportEvents();
      if (resSport.ok && resSport.data) {
        const data = resSport.data.data;
        setSports(prev => ({ ...prev, others: data }));
      }

      const resPodcast = await getPodcastEvents();
      if (resPodcast.ok && resPodcast.data) {
        const data = resPodcast.data.data;
        setPodcast(prev => ({ ...prev, others: data }));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllEvents();
  }, []);

  function handleTab(title: string, index: number) {
    setActiveIndex(index);
    setTabTitle(title);
  }

  return (
    <AppView className="mt-5">
      <AppView
        style={{ width: Size.getWidth(), overflow: 'hidden' }}
        className="px-5">
        <FlatList
          data={LiveTabs}
          keyExtractor={(_, i) => i.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 15,
          }}
          renderItem={({ item, index }) => {
            const show = activeIndex === index;
            return (
              <Pressable
                style={{ marginHorizontal: 4 }}
                onPress={() => handleTab(item, index)}>
                <AppText
                  style={show && { fontFamily: fonts.MANROPE_700 }}
                  className="mx-1.5 font-MANROPE_400 text-[13px] text-white">
                  {item}
                </AppText>
                <MotiView
                  style={styles.bar}
                  from={{ transform: [{ scaleX: 0 }] }}
                  animate={{ transform: [{ scaleX: show ? 1 : 0 }] }}
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

      <SelectTabs
        tabs={[
          {
            tab: 'All',
            element: <AllTabs 
              channels={channels.others}
              events={events.others}
              tvShow={tvshows.others}
              podcast={podcasts.others}
              sport={sports.others}
              makeFullscreen={makeFullscreen}
            />,
          },
          {
            tab: 'Channels',
            element: <ChannelsTabs item={channels} scrollY={scrollY} makeFullscreen={makeFullscreen} />,
          },
          {
            tab: 'Events',
            element: <EventsTab item={events} scrollY={scrollY} makeFullscreen={makeFullscreen} />,
          },
          {
            tab: 'TV Shows',
            element: <TvShowsTab item={tvshows} scrollY={scrollY} makeFullscreen={makeFullscreen} />,
          },
          {
            tab: 'Sports',
            element: <SportsTab item={sports} scrollY={scrollY} makeFullscreen={makeFullscreen} />,
          },
          {
            tab: 'Podcast',
            element: <PodcastTab item={podcasts} scrollY={scrollY} makeFullscreen={makeFullscreen} />,
          },
        ]}
        selectedTab={tabTitle}
      />
    </AppView>
  );
};

export default DynamicViewContainer;

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    backgroundColor: colors.RED,
    height: 1.5,
    marginTop: 4,
    transformOrigin: 'center',
  },
});
