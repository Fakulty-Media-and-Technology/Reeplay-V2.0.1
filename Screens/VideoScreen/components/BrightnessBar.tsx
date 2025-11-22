import {
  Platform,
  StyleSheet,
  View,
  Alert,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  PanResponderInstance,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import colors from '@/configs/colors';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import {isAndroid} from '@/configs/constant';
import ToastNotification from '@/components/ToastNotifications';

interface Props{
  brightLevel: number | null
  setLevel: React.Dispatch<React.SetStateAction<number | null>>
}

const BrightnessBar = ({brightLevel,setLevel}:Props) => {
  const translateY = useSharedValue(0);
  const [hasPermission, setHasPermission] = useState(Platform.OS === 'ios');
  const barHeight = useRef<number>(165); // The maximum height of the brightness slider
  const touchStart = useRef<number>(0);
  const brightnessStart = useRef<number>(0);
  

  console.log(brightLevel, 'brightness')

  const setBrightness = async (value: number) => {
    // Only attempt to set brightness if we have permission or are on iOS
      const invertedValue = barHeight.current - value;
      const platformBrightnessValue = invertedValue / barHeight.current;
      setLevel(platformBrightnessValue)

      try {
        await DeviceBrightness.setBrightnessLevel(platformBrightnessValue);
      } catch (e) {
        console.error('Failed to set brightness:', e);
        ToastNotification('error', 'Could not set screen brightness.');
      }
  };

  const getInitialBrightness = async () => {
    try {
      const brightness = brightLevel ? brightLevel : isAndroid
        ? await DeviceBrightness.getSystemBrightnessLevel()
        : await DeviceBrightness.getBrightnessLevel();

      const scaledValue = barHeight.current - brightness * barHeight.current;
      translateY.value = Math.max(10, Math.min(scaledValue, barHeight.current));
    } catch (e) {
      console.error('Failed to get initial brightness:', e);
      translateY.value = barHeight.current / 2;
    }
  };

  // Run on mount to get initial brightness
  useEffect(() => {
    getInitialBrightness();
  }, [hasPermission]);

  // --- PanResponder Logic ---
  const panResponderRef = useRef<PanResponderInstance | null>(null);
  if (!panResponderRef.current) {
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        console.log('PanResponder Grant');
        touchStart.current = evt.nativeEvent.pageY;
        brightnessStart.current = translateY.value;
      },
      onPanResponderMove: (evt, gestureState) => {
        const diff = evt.nativeEvent.pageY - touchStart.current;
        const newBrightnessPosition = brightnessStart.current + diff;
        const clampedPosition = Math.max(
          0,
          Math.min(newBrightnessPosition, barHeight.current)
        );
        
        translateY.value = clampedPosition;
        setBrightness(clampedPosition);
      },
      onPanResponderRelease: (evt, gestureState) => {
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
    });
  }

  // Animated style for the bar position
  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <Animated.View
      style={[styles.container, rBottomSheetStyle]}
      {...panResponderRef.current.panHandlers}
    >
      <View style={styles.bar} />
    </Animated.View>
  );
};

export default BrightnessBar;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    position: 'absolute',
    top: 0,
  },
  bar: {
    height: '100%',
    width: 6,
    flex: 1,
    backgroundColor: colors.WHITE,
    borderRadius: 5,
    marginLeft: 'auto',
  },
});