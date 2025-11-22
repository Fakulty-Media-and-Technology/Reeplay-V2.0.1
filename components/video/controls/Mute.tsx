import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MutedIcon, VolumeIcon } from '@/assets/icons';

interface MuteProps {
  isMuted: boolean;
  onMutePress: () => void;
}

export const Mute = memo(
  ({
    isMuted,
    onMutePress,
  }: MuteProps) => {
    return (
      <TouchableOpacity
        onPress={onMutePress}
        className='h-[17px] mb-1'
      >
        {isMuted ? (
            <View className="mt-[3px]">
                <MutedIcon />
            </View>
        ) : (
            <VolumeIcon />
        )}
      </TouchableOpacity>
    );
  }
);