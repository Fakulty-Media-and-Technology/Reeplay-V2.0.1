import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppText, AppView} from '@/components';
import {BigRateStart_F, BigRateStart_W, RateStar_F} from '@/assets/icons';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import StarRating from 'react-native-star-rating-widget';
import { IVODContent, IVODRatings } from '@/types/api/content.types';
import { formatRatingStats } from '@/Utils/contentUtils';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import HalfStar from '@/assets/icons/half_star.svg'


interface Props{
  rating:number;
  setRating: React.Dispatch<React.SetStateAction<number>>
  vodRatings:IVODRatings|null
  vod: IVODContent
}
const RatingView = ({vod,rating,setRating, vodRatings}:Props) => {
  const starRatings = vodRatings && formatRatingStats(vodRatings);

  console.log(JSON.stringify(starRatings,null,2), vodRatings)

  if(!starRatings) return<></>;
  return (
    <AppView className="mt-6 border-t border-grey_200/10">
      <AppView className="flex-row items-center justify-between gap-x-10">
        <AppView>
          <AppText className="font-MANROPE_600 text-white text-[40px]">
            {vod?.averageRating ?? 0}
          </AppText>
          <AppText className="font-MANROPE_400 text-base text-white -mt-1.5">
            out of 5
          </AppText>
        </AppView>

        {/* Rating */}
        <AppView className="flex-1">
          <AppView className="space-y-1 mt-[18px]">
            <AppView className="flex-row items-center justify-between gap-x-3">
              <StarIcon count={5} />
              <Bar progress={starRatings['5']} />
            </AppView>
            <AppView className="flex-row items-center justify-between gap-x-3">
              <StarIcon count={4} />
              <Bar progress={starRatings['4']} />
            </AppView>
            <AppView className="flex-row items-center justify-between gap-x-3">
              <StarIcon count={3} />
              <Bar progress={starRatings['3']} />
            </AppView>
            <AppView className="flex-row items-center justify-between gap-x-3">
              <StarIcon count={2} />
              <Bar progress={starRatings['2']} />
            </AppView>
            <AppView className="flex-row items-center justify-between gap-x-3">
              <StarIcon count={1} />
              <Bar progress={starRatings['1']} />
            </AppView>
          </AppView>
          <AppText className="text-right mt-[1px] font-MANROPE_400 text-base text-white">
            {starRatings['total'] > 1000 ? starRatings['total']+'+' : starRatings['total']} Ratings
          </AppText>
        </AppView>
      </AppView>

      <AppView className="mt-10 items-center">
        <StarRating
          rating={rating}
          onChange={setRating}
          style={{}}
          StarIconComponent={({type}) =>
            type === 'full' ? <BigRateStart_F /> : type=== 'half' ? <HalfStar /> : <BigRateStart_W />
          }
        />
        <AppText className="font-MANROPE_400 text-base text-white mt-[10px]">
          Tap stars to rate
        </AppText>
      </AppView>
    </AppView>
  );
};

export default RatingView;

const StarIcon = ({count}: {count: number}) => {
  return (
    <AppView className="flex-row items-center flex-1 mr-[15px] justify-end gap-x-[1px]">
      {[...Array(count)].map((_, i) => {
        return (
          <AppView key={i}>
            <RateStar_F />
          </AppView>
        );
      })}
    </AppView>
  );
};


const BAR_WIDTH = Size.calcWidth(164);

const Bar = ({progress}: {progress: number}) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    // Clamp progress between 0 and 1
    animatedProgress.value = withTiming(Math.min(Math.max(progress, 0), 1), {
      duration: 500,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: (-1 + animatedProgress.value) * BAR_WIDTH,
        },
      ],
    };
  });

  return (
    <AppView
      style={{width: BAR_WIDTH}}
      className="h-1 rounded bg-dark_gold overflow-hidden"
    >
      <Animated.View
        style={[styles.progressBar, animatedStyle, {width: BAR_WIDTH}]}
      />
    </AppView>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 4,
    backgroundColor: colors.YELLOW_500,
  },
});

