import {Animated, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Swiper from './Swiper';
import {TrendingNow} from '@/configs/data';
import Size from '@/Utils/useResponsiveSize';
import {AppText, AppView} from '@/components';
import OthersView from './OthersView';
import {IEvent} from '../DynamicViewContainer';

interface Props {
  scrollY: Animated.Value;
  item: IEvent;
}

const TvShowsTab = ({scrollY, item}: Props) => {
  return (
    <View>
      {item.pop.length > 0 || item.others.length > 0 ? (
        <>
          {item.pop.length > 0 && (
            <Swiper
              data={item.pop}
              title="Top TV Shows"
              containerStyle={{height: 171, width: Size.getWidth()}}
              mainStyle={{paddingLeft: 0}}
              spacing={8}
              scrollY={scrollY}
              headerStyle={{marginLeft: 20}}
            />
          )}

          {item.others.length > 0 && (
            <AppView className="px-5 mt-8 mb-20">
              <OthersView data={item.others} title="Others in TV Shows" />
            </AppView>
          )}
        </>
      ) : (
        <AppText
          style={{alignSelf: 'center'}}
          className="mt-16 text-center font-ROBOTO_400 text-sm text-dark_grey max-w-[170]">
          No content available now, kindly check back later
        </AppText>
      )}
    </View>
  );
};

export default TvShowsTab;

const styles = StyleSheet.create({});
