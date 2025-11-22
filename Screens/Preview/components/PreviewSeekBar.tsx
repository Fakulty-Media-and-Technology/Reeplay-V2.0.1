import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Size from '@/Utils/useResponsiveSize';
import colors from '@/configs/colors';

interface Props {
  currentTime: number;
  duration: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  handleSeek: (time: number) => void;
  setIsPlaying: any;
  setFixed: React.Dispatch<
    React.SetStateAction<{
      time: number;
      set: boolean;
    }>
  >;
}

const PreviewSeekBar = ({
  currentTime,
  duration,
  setCurrentTime,
  handleSeek,
  setIsPlaying,
  setFixed,
}: Props) => {
  const translateX = useSharedValue(-Size.getWidth());
  const MAX_MIN = Size.getWidth();
  const [seeking, setSeeking] = useState(false);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translateX.value = destination;
  }, []);

  function check(value: number) {
    const percentage = value / -MAX_MIN;
    const newCurrentTime = Math.round(percentage * duration);
    setCurrentTime(duration - newCurrentTime);
    setSeeking(true);
    handleSeek(duration - newCurrentTime);
    setFixed({
      set: true,
      time: duration - newCurrentTime,
    });
  }

  function doneSeek(value: number) {
    setSeeking(false);
    console.log(currentTime, 'done');
  }

  const context = useSharedValue({x: 0});
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {x: translateX.value};
    })
    .onUpdate(event => {
      translateX.value = event.translationX + context.value.x;
      translateX.value = Math.max(-MAX_MIN, Math.min(translateX.value, 0));

      runOnJS(check)(translateX.value);
    })
    .onFinalize(event => {
      translateX.value = event.translationX + context.value.x;
      translateX.value = Math.max(-MAX_MIN, Math.min(translateX.value, 0));
      runOnJS(doneSeek)(translateX.value);
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  useEffect(() => {
    if (seeking) return;
    const percentage = currentTime / duration;
    scrollTo(-MAX_MIN - -MAX_MIN * percentage);
  }, [currentTime]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, rBottomSheetStyle]}>
        <View style={{position: 'relative', alignSelf: 'flex-end'}}>
          <View style={styles.bar} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default PreviewSeekBar;

const styles = StyleSheet.create({
  container: {
    height: 3,
    width: '100%',
    flex: 1,
    backgroundColor: colors.RED,
    position: 'absolute',
    top: 0,
  },
  bar: {
    width: 11.5,
    height: 11.5,
    borderRadius: 99,
    backgroundColor: 'white',
    top: -4.8,
  },
});
