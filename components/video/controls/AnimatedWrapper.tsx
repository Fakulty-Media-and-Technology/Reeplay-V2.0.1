import type { CustomStyles } from 'react-native-video-player';
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
} from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import Size from '@/Utils/useResponsiveSize';

export interface AnimationRef {
  runControlsAnimation: (toValue: number, callback?: () => void) => void;
}

interface AnimatedWrapperProps {
  animationDuration: number;
  children: React.ReactNode;
}

export const AnimatedWrapper = 
memo(
  forwardRef<AnimationRef, AnimatedWrapperProps>(
    ({ animationDuration, children }, ref) => {
      const opacity = useSharedValue(0);
      const display = useSharedValue<'flex' | 'none'>('none');

      const runControlsAnimation = useCallback(
        (toValue: number, callback?: () => void) => {
          if (toValue === 1) {
            display.value = 'flex';
          }

          opacity.value = withTiming(toValue, { duration: animationDuration }, (finished) => {
            if (finished && toValue === 0) {
              display.value = 'none';
            }
            if (finished && callback) {
              runOnJS(callback)();
            }
          });
        },
        [animationDuration, opacity, display]
      );

      useImperativeHandle(ref, () => ({
        runControlsAnimation,
      }));

      const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        display: display.value,
      }));

      return (
        <Animated.View
          style={[
            styles.controls,
            animatedStyle
          ]}
        >
          {children}
        </Animated.View>
      );
    }
  )
);

const styles = StyleSheet.create({
  controls: {
    position: 'relative',
    height: '100%',
    // flexDirection: 'column',
    // alignItems: 'center',
  },
});
