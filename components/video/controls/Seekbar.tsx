import {
  type DimensionValue,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';
import type { CustomStyles, VideoPlayerProps } from 'react-native-video-player';
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ProgressRef } from '../Controls';
import colors from '@/configs/colors';

const parsePadding = (value: DimensionValue, layoutWidth: number) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.endsWith('%')) {
    return (parseFloat(value) / 100) * layoutWidth;
  }
  return 0;
};

export interface SeekbarProps {
  autoplay: VideoPlayerProps['autoplay'];
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  fullWidth?: boolean;
  disableSeek: VideoPlayerProps['disableSeek'];
  showControls: () => void;
  onSeek: (progress: number) => void;
  onSeeking: (progress: number) => void;
  controlsTimeoutId: NodeJS.Timeout | null;
  duration: number;
  isFullscreeen:boolean
  // custom styles
  seekBarCustomStyles?: CustomStyles['seekBar'];
  seekBarFullWidthCustomStyles?: CustomStyles['seekBarFullWidth'];
  seekBarProgressCustomStyles?: CustomStyles['seekBarProgress'];
  seekBarKnobCustomStyles?: CustomStyles['seekBarKnob'];
  seekBarKnobSeekingCustomStyles?: CustomStyles['seekBarKnobSeeking'];
  seekBarBackgroundCustomStyles?: CustomStyles['seekBarBackground'];
}

export const Seekbar = memo(
  forwardRef<ProgressRef, SeekbarProps>(
    (
      {
        fullWidth,
        autoplay,
        isPlaying,
        setIsPlaying,
        disableSeek,
        showControls,
        controlsTimeoutId,
        onSeek,
        onSeeking,
        duration,
        isFullscreeen,
        seekBarCustomStyles,
        seekBarFullWidthCustomStyles,
        seekBarKnobCustomStyles,
        seekBarKnobSeekingCustomStyles,
        seekBarProgressCustomStyles,
        seekBarBackgroundCustomStyles,
      },
      ref
    ) => {
      const [progress, setProgress] = useState(0);
      const [isSeeking, setIsSeeking] = useState(false);

      useImperativeHandle(ref, () => ({
        onProgress: setProgress,
      }));

      const seekBarWidth = useRef<number>(200);
      const seekTouchStart = useRef<number>(0);
      const seekProgressStart = useRef<number>(0);
      const wasPlayingBeforeSeek = useRef<boolean>(autoplay || isPlaying);

      const _onSeekBarLayout = useCallback(
        ({ nativeEvent }: LayoutChangeEvent) => {
          const layoutWidth = nativeEvent.layout.width;
          const customStyle = seekBarCustomStyles;
          const paddingHorizontal = customStyle?.paddingHorizontal
            ? parsePadding(customStyle.paddingHorizontal, layoutWidth) * 2
            : 0;
          const paddingLeft = customStyle?.paddingLeft
            ? parsePadding(customStyle.paddingLeft, layoutWidth)
            : 0;
          const paddingRight = customStyle?.paddingRight
            ? parsePadding(customStyle.paddingRight, layoutWidth)
            : 0;

          const totalPadding = paddingHorizontal || paddingLeft + paddingRight;
          seekBarWidth.current = layoutWidth - totalPadding;
        },
        [seekBarCustomStyles]
      );

      const _onSeekGrant = useCallback(
        (e: GestureResponderEvent) => {
          seekTouchStart.current = e.nativeEvent.pageX;
          seekProgressStart.current = progress ?? 0;
          wasPlayingBeforeSeek.current = isPlaying;
          setIsSeeking(true);
          setIsPlaying(false);
          if (controlsTimeoutId) clearTimeout(controlsTimeoutId);
        },
        [controlsTimeoutId, isPlaying, progress, setIsPlaying]
      );

      const _onSeekRelease = useCallback(() => {
        setIsSeeking(false);
        setIsPlaying(wasPlayingBeforeSeek.current);
        onSeek(progress * duration);
        showControls();
      }, [duration, onSeek, progress, setIsPlaying, showControls]);

      const _onSeek = useCallback(
        (e: GestureResponderEvent) => {
          const diff = e.nativeEvent.pageX - seekTouchStart.current;
          const ratio = 100 / seekBarWidth.current;
          const newProgress = seekProgressStart.current + (ratio * diff) / 100;
          const fixedProgress = Math.min(Math.max(newProgress, 0), 1);
          onSeeking(fixedProgress);
          setProgress(fixedProgress);
        },
        [onSeeking]
      );

      return (
        <View
          style={[
            styles.seekBar,
            seekBarCustomStyles,
            fullWidth && styles.seekBarFullWidth,
            fullWidth && seekBarFullWidthCustomStyles,
          ]}
          onLayout={_onSeekBarLayout}
        >
          <View
            style={[
              !isNaN(progress ?? 0) ? { flexGrow: progress ?? 0 } : null,
              seekBarProgressCustomStyles,
            ]}
            className={`bg-red ${isFullscreeen ?'h-[6px]' :'h-1'} rounded-[5px]`}
          />
          {!fullWidth && !disableSeek && (
            <View
              style={[
                styles.seekBarKnob,
                isFullscreeen && {width:18, height:18},
                seekBarKnobCustomStyles,
                isSeeking && styles.seekBarKnobSeeking,
                isSeeking && seekBarKnobSeekingCustomStyles,
              ]}
              hitSlop={{ top: 20, bottom: 20, left: 10, right: 20 }}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={_onSeekGrant}
              onResponderMove={_onSeek}
              onResponderRelease={_onSeekRelease}
              onResponderTerminate={_onSeekRelease}
            />
          )}
          <View
            style={[
              !isNaN(progress) ? { flexGrow: 1 - progress } : null,
              seekBarBackgroundCustomStyles,
            ]}
            className={`bg-grey_white_90 ${isFullscreeen ?'h-[6px]' :'h-1'} rounded-[5px]`}
          />
        </View>
      );
    }
  )
);

const styles = StyleSheet.create({
  seekBar: {
    alignItems: 'center',
    height: 30,
    flexGrow: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingRight:0,
    marginLeft: -10,
    marginRight: -5,
    marginBottom:-8
  },
  seekBarFullWidth: {
    marginLeft: 0,
    marginRight: 0,
    paddingHorizontal: 0,
    marginTop: -3,
    height: 4,
  },
  seekBarKnob: {
    width: 16,
    height: 16,
    marginHorizontal: -8,
    marginVertical: -10,
    borderRadius: 99,
    backgroundColor: '#fff',
    transform: [{ scale: 0.8 }],
    zIndex: 1,
  },
  seekBarKnobSeeking: {
    transform: [{ scale: 1 }],
  },
});
