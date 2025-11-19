import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Video from "react-native-video";

// ✅ Extend props and allow PiP
export interface AppVideoProps extends React.ComponentProps<typeof Video> {
  containerStyle?: ViewStyle;
  videoRef?: React.RefObject<React.ElementRef<typeof Video>> | ((instance: React.ElementRef<typeof Video> | null) => void);
  pictureInPicture?: boolean; // ✅ PiP support
}

const AppVideo = ({ containerStyle, videoRef, pictureInPicture, ...otherProps }: AppVideoProps) => {
  return (
    <View style={[styles.videoContainer, containerStyle]}>
      {/* ✅ Cast props to any to allow pictureInPicture */}
      <Video
        ref={videoRef}
        {...(otherProps as any)}
        {...(pictureInPicture !== undefined ? { pictureInPicture } : {})}
      />
    </View>
  );
};

export default AppVideo;

const styles = StyleSheet.create({
  videoContainer: {
    height: "100%",
    width: "100%",
  },
});
