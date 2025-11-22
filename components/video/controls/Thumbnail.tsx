import {
  Image,
  ImageBackground,
  type ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { memo } from 'react';
import { CustomStyles, VideoPlayerProps } from '../DynamicVideoComponent';
import { B_PlayBtn, BigPlayIcon } from '@/assets/icons';

interface StartButtonProps {
  onStart: () => void;
  isFullscreen:boolean
  customStylesPlayButton: CustomStyles['playButton'];
  customStylesPlayArrow: CustomStyles['playArrow'];
}

interface ThumbnailProps extends StartButtonProps {
  thumbnailSource: ImageSourcePropType;
  style: VideoPlayerProps['style'];
  sizeStyles: { height: number; width: number };
  onStart: () => void;
  isFullscreen:boolean
  customStylesThumbnail: CustomStyles['thumbnail'];
  customStylesThumbnailImage: CustomStyles['thumbnailImage'];
  customStylesPlayButton: CustomStyles['playButton'];
  customStylesPlayArrow: CustomStyles['playArrow'];
}

export const StartButton = ({
  onStart,
  isFullscreen,
  customStylesPlayButton,
  customStylesPlayArrow,
}: StartButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.playButton, customStylesPlayButton]}
      onPress={onStart}
    >
      {!isFullscreen ? <BigPlayIcon /> : <B_PlayBtn />}
    </TouchableOpacity>
  );
};

export const Thumbnail = memo(
  ({
    thumbnailSource,
    style,
    sizeStyles,
    onStart,
    isFullscreen,
    customStylesThumbnail,
    customStylesThumbnailImage,
    customStylesPlayButton,
    customStylesPlayArrow,
  }: ThumbnailProps) => {
    return (
      <ImageBackground
        source={thumbnailSource}
        imageStyle={customStylesThumbnailImage}
        style={[styles.thumbnail, style, customStylesThumbnail]}
      >
        <StartButton
          customStylesPlayButton={customStylesPlayButton}
          onStart={onStart}
          isFullscreen={isFullscreen}
          customStylesPlayArrow={customStylesPlayArrow}
        />
      </ImageBackground>
    );
  }
);

const styles = StyleSheet.create({
  thumbnail: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1
  },
  playButton: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playArrow: {
    width: 28,
    height: 28,
    marginLeft: 2,
  },
});
