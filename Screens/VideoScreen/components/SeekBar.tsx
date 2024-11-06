import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Size from '@/Utils/useResponsiveSize';
import colors from '@/configs/colors';
import {formatDuration} from '@/Utils/formatVideoDuration';

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
  seekWidth: number;
}

const SeekBar = ({
  currentTime,
  duration,
  setCurrentTime,
  handleSeek,
  setIsPlaying,
  setFixed,
  seekWidth,
}: Props) => {
  const translateX = useSharedValue(
    Platform.OS === 'android' ? -Size.getWidth() - 237 + 3 : -seekWidth + 1000,
  );
  const MAX_MIN =
    Platform.OS === 'android' ? Size.getWidth() - 237 + 3 : seekWidth - 14;
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
    })
    .onFinalize(event => {
      translateX.value = event.translationX + context.value.x;
      translateX.value = Math.max(-MAX_MIN, Math.min(translateX.value, 0));
      runOnJS(check)(translateX.value);

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

export default SeekBar;

const styles = StyleSheet.create({
  container: {
    height: 4,
    width: '100%',
    flex: 1,
    backgroundColor: colors.RED,
    position: 'absolute',
    top: 0,
    // bottom: Size.getHeight() * 0.3,
    borderRadius: 5,
  },
  bar: {
    width: 14,
    height: 14,
    borderRadius: 99,
    backgroundColor: 'white',
    // alignSelf: 'flex-end',
    // right: 0,
    top: -5,
  },
});
