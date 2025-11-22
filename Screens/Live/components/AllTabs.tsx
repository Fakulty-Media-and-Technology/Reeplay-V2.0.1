import {FlatList, StyleSheet} from 'react-native';
import React from 'react';
import {AppView} from '@/components';
import SectionHeader from '@/Screens/Home/components/SectionHeader';
import ContinueWatchingComponent from '@/Screens/Home/ContinueWatchingComponent';
import { ILiveContent } from '@/types/api/content.types';
import { ChannelComp } from './ChannelsTabs';

interface Props{
  channels: ILiveContent[]
  events: ILiveContent[]
  tvShow: ILiveContent[]
  podcast: ILiveContent[]
  sport: ILiveContent[];
  makeFullscreen: () => void
}
const AllTabs = ({events, channels,podcast,sport,tvShow,makeFullscreen}:Props) => {
  return (
    <AppView className="mb-20">
      <AppView className="mt-3 pl-5">
        <SectionHeader
          title="Channels"
          btnText="SEE ALL"
          onPress={() => console.log('first')}
        />

       <FlatList
         data={channels}
         horizontal
         showsHorizontalScrollIndicator={false}
         bounces={false}
         contentContainerStyle={{marginTop: 3, height: 105, marginBottom: 10}}
         keyExtractor={(item, index) => item._id+index}
         renderItem={({item, index}) => {
           return (
             <ChannelComp
               item={item}
               key={index}
               style={{marginRight:10,height:102, width:182, borderRadius:5, overflow:'hidden'}}
               makeFullscreen={makeFullscreen}
             />
           );
         }}
       />

      </AppView>
     {events.length > 0 && <AppView className="mt-[21px] pl-5">
        <SectionHeader
          title="Events"
          btnText=""
          onPress={() => console.log('first')}
        />
        <FlatList
          data={events}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{marginTop: -5, height: 190, marginBottom: 20}}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({item, index}) => {
            return (
              <ContinueWatchingComponent
                item={item}
                key={index}
                removeCloseBtn
                live
                imageStyle={styles.image}
                donate
                makeFullscreen={makeFullscreen}
              />
            );
          }}
        />
      </AppView>}

     {tvShow.length > 0 && <AppView style={{marginTop: events.length > 0 ?-16 : 20}} className="pl-5">
        <SectionHeader
          title="Tv Shows"
          btnText=""
          onPress={() => console.log('first')}
        />
        <FlatList
          data={tvShow}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{marginTop: -5, height: 190, marginBottom: 20}}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({item, index}) => {
            return (
              <ContinueWatchingComponent
                item={item}
                key={index}
                removeCloseBtn
                live
                imageStyle={styles.image}
                vote
                makeFullscreen={makeFullscreen}
              />
            );
          }}
        />
      </AppView>}

     {podcast.length > 0 && <AppView style={{marginTop: (events.length>0 || tvShow.length>0) ? -17 : 20}} className="pl-5">
        <SectionHeader
          title="Podcasts"
          btnText=""
          onPress={() => console.log('first')}
        />
        <FlatList
          data={podcast}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{marginTop: -5, height: 190}}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({item, index}) => {
            return (
              <ContinueWatchingComponent
                item={item}
                key={index}
                removeCloseBtn
                live
                imageStyle={styles.image}
                makeFullscreen={makeFullscreen}
              />
            );
          }}
        />
      </AppView>}

     {sport.length > 0 && <AppView style={{marginTop: (events.length>0 || tvShow.length>0 ||podcast.length>0) ? -18 : 20}} className="pl-5">
        <SectionHeader
          title="Sports"
          btnText=""
          onPress={() => console.log('first')}
        />
        <FlatList
          data={sport}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{marginTop: -5, height: 190}}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({item, index}) => {
            return (
              <ContinueWatchingComponent
                item={item}
                key={index}
                removeCloseBtn
                live
                imageStyle={styles.image}
                makeFullscreen={makeFullscreen}
              />
            );
          }}
        />
      </AppView>}
    </AppView>
  );
};

export default AllTabs;

const styles = StyleSheet.create({
  image: {
    width: 234,
    height: 126,
    borderRadius: 5,
  },
});
