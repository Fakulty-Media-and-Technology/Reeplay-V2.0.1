import { forwardRef, memo, useImperativeHandle, useState } from 'react';
import type { CustomStyles } from 'react-native-video-player';
import { StyleSheet, Text } from 'react-native';
import type { ProgressRef } from '../Controls';
import { formatDuration } from '@/Utils/formatVideoDuration';

const getDurationTime = (duration: number): string => {
  const padTimeValueString = (value: number): string =>
    value.toString().padStart(2, '0');

  if (!Number.isFinite(duration)) return '';

  const seconds = Math.floor(duration % 60);
  const minutes = Math.floor((duration / 60) % 60);
  const hours = Math.floor((duration / 3600) % 24);

  return hours
    ? `${padTimeValueString(hours)}:${padTimeValueString(minutes)}:${padTimeValueString(seconds)}`
    : `${padTimeValueString(minutes)}:${padTimeValueString(seconds)}`;
};

export const ProgressingDuration = forwardRef<
  ProgressRef,
  {
    duration: number;
  }
>(({ duration }, ref) => {
  const [progress, setProgress] = useState(0);

  useImperativeHandle(ref, () => ({
    onProgress: setProgress,
  }));
  return (
    <Text className="text-white text-[13px] font-OUTFIT_500 w-[60px] ml-2.5 text-right">
      {formatDuration(progress * duration)}
    </Text>
  );
});

export const DurationText = memo(
  forwardRef<
    ProgressRef,
    {
      duration: number;
    }
  >(({ duration }, ref) => {
    return (
      <>
         <Text className="text-white text-[13px] font-OUTFIT_500 w-[60px]">
      {formatDuration(duration)}
    </Text>
      </>
    );
  })
);

const styles = StyleSheet.create({
  durationText: {
    color: 'white',
  },
});
