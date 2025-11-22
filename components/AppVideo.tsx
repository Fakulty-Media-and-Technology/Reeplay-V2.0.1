import {View, Text, StyleProp, ViewStyle, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import Video, { ReactVideoProps, VideoRef} from 'react-native-video';

interface VideoProps extends ReactVideoProps {
  containerStyle?: ViewStyle;
  videoRef?:
    | ((instance: VideoRef | null) => void)
    | React.RefObject<VideoRef | null>
    | null;
}

const AppVideo = ({
  containerStyle,
  videoRef,
  ...otherProps
}: VideoProps) => {
  return (
    <View style={[styles.videoContainer, containerStyle]}>
      <Video ref={videoRef} {...otherProps} />
    </View>
  );
};

export default AppVideo;

const styles = StyleSheet.create({
  videoContainer: {
    height: '100%',
    width: '100%',
  },
});
