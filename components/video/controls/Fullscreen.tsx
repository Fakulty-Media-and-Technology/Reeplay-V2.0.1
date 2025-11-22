import { memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { FullscreenIcon } from '@/assets/icons';

interface FullscreenProps {
  onToggleFullScreen: () => void;
}

export const Fullscreen = memo(
  ({
    onToggleFullScreen,
  }: FullscreenProps) => {
    return (
      <TouchableOpacity
        onPress={onToggleFullScreen}
        // style={[styles.extraControl]}
      >
        <FullscreenIcon />
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  extraControl: {
    color: 'white',
    padding: 8,
  },
});
