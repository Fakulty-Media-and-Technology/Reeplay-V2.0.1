import {TouchableOpacity} from '@/components/';
import useToggle from '@/Hooks/useToggle';
import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  isBiometrics?: boolean;
  isOn: boolean;
  setIsOn: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleButton = ({isOn, setIsOn, isBiometrics}: Props) => {
  const animation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: animation.value}],
    };
  });

  function handleAnimation() {
    if (animation.value === 0) {
      animation.value = withTiming(11.5, {duration: 400});
    } else {
      animation.value = withTiming(0, {duration: 400});
    }
  }

  useEffect(() => {
    if (isOn) animation.value = withTiming(11.5, {duration: 400});
  }, []);

  return (
    <TouchableOpacity
      className={`w-8 h-[19px] rounded-2xl pt-[1.5px] px-[2px] pb-[2.2px]  items-center flex-row ${
        isOn ? 'bg-red' : 'bg-[#bbbbbb]'
      }`}
      activeOpacity={1}
      onPress={() => [setIsOn(!isOn), handleAnimation()]}>
      <Animated.View style={[animatedStyle, styles.circle]} />
    </TouchableOpacity>
  );
};

export default ToggleButton;

const styles = StyleSheet.create({
  circle: {
    width: 16.5,
    height: 16.5,
    borderRadius: 17 / 2,
    backgroundColor: '#fff',
  },
});
