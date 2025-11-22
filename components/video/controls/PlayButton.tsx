import { TouchableOpacity } from 'react-native';
import { memo } from 'react';
import { B_PauseBtn, B_PlayBtn, BigPlayIcon } from '@/assets/icons';
import { View } from 'react-native';

interface PlayButtonProps {
  isPlaying: boolean;
  isFullscreen: boolean
  onPlayPress: () => void;
}

export const PlayButton = memo(
  ({
    isPlaying,
    isFullscreen,
    onPlayPress,
  }: PlayButtonProps) => {
    return (
      <TouchableOpacity
        onPress={onPlayPress}
        className='w-[50px] h-[70px] justify-center items-center'
      >
       {!isPlaying ? (
        <>
           {!isFullscreen ? <BigPlayIcon /> : <B_PlayBtn />}
        </>
        ) : (
            <>
            {!isFullscreen ? <View className="flex-row items-center gap-x-[9px] justify-center">
                <View className="w-1.5 h-[25px] bg-white rounded" />
                <View className="w-1.5 h-[25px] bg-white rounded" />
              </View> : <B_PauseBtn style={{ marginLeft: -20 }} />}
            </>
        )}
      </TouchableOpacity>
    );
  }
);
