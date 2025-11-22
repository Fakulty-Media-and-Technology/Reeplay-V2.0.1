import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {AppText} from '@/components';
import {QualityCheck} from '@/assets/icons';
import fonts from '@/configs/fonts';
import {useAppDispatch, useAppSelector} from '@/Hooks/reduxHook';
import {selectUser, setCredentials} from '@/store/slices/userSlice';
import {getProfileDetails, setNotifications} from '@/api/profile.api';

const options = ['Automatic', '4K', '2K', '1080P', '720P', '480P'];

const VideoQualityOption = () => {
  const dispatch = useAppDispatch();
  const {
    allow_notifications,
    new_arrivals,
    new_services,
    upcoming_events,
    live_channels,
    video_quality,
  } = useAppSelector(selectUser).settings_info;
  const [activeIndx, setActiveIndx] = useState<string>(video_quality ?? '');

  async function handleSetVideoQuality(item: string) {
    setActiveIndx(item.toLowerCase());

    const res = await setNotifications({
      allow_notifications,
      new_arrivals,
      new_services,
      upcoming_events,
      live_channels,
      video_quality: item.toLowerCase(),
    });

    console.log(res);

    if (res.ok && res.data && res.data.message.includes('Successful')) {
      const user = await getProfileDetails();
      if (user.ok && user.data) dispatch(setCredentials(user.data.data));
    } else {
      setActiveIndx(video_quality);
      Alert.alert('Error', 'Failed to set video quality');
    }
  }

  return (
    <View>
      {options.map((item, i) => {
        const show = activeIndx.toLowerCase() === item.toLowerCase();
        return (
          <Pressable
            key={i}
            style={[styles.center]}
            onPress={() => handleSetVideoQuality(item)}>
            <AppText
              style={show && {fontFamily: fonts.ROBOTO_700}}
              className="mr-1 font-ROBOTO_400 text-[13px] text-black">
              {item}
            </AppText>
            {show && <QualityCheck />}
          </Pressable>
        );
      })}
    </View>
  );
};

export default VideoQualityOption;

const styles = StyleSheet.create({
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
