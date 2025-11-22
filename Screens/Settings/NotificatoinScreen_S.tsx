import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppHeader, AppScreen, AppText, AppView} from '@/components';
import ToggleButton from '@/components/ToggleButton';
import {useAppDispatch, useAppSelector} from '@/Hooks/reduxHook';
import {selectUser, setCredentials} from '@/store/slices/userSlice';
import {getProfileDetails, setNotifications} from '@/api/profile.api';

const NotificatoinScreen_S = () => {
  const dispatch = useAppDispatch();
  const {
    allow_notifications,
    upcoming_events,
    live_channels,
    new_arrivals,
    new_services,
    video_quality,
  } = useAppSelector(selectUser).settings_info;
  const [allowNoti, setAllowNoti] = useState(allow_notifications);
  const [upcoming, setUpcoming] = useState(upcoming_events);
  const [arrivals, setArrivals] = useState(new_arrivals);
  const [liveChannel, setLiveChannel] = useState(live_channels);
  const [newService, setNewService] = useState(new_services);

  async function handleSettings() {
    try {
      const res = await setNotifications({
        allow_notifications: allowNoti,
        upcoming_events: upcoming,
        new_arrivals: arrivals,
        live_channels: liveChannel,
        new_services: newService,
        video_quality,
      });
      if (res.ok && res.data && res.data.message.includes('Successful')) {
        const user = await getProfileDetails();
        if (user.ok && user.data) dispatch(setCredentials(user.data.data));
      }
    } catch (error) {
      Alert.alert('error', 'Unable to update settings');
    }
  }

  useEffect(() => {
    handleSettings();
  }, [allowNoti, upcoming, newService, liveChannel, arrivals]);

  return (
    <AppScreen containerStyle={{paddingTop: 20, paddingHorizontal: 0}}>
      <AppView className="px-5">
        <AppHeader />
      </AppView>

      <AppView className="mt-6">
        <AppView style={styles.center} className="py-5 px-5">
          <AppText className="font-MANROPE_500 text-sm text-white">
            Allow Notifications
          </AppText>
          <ToggleButton isOn={allowNoti} setIsOn={setAllowNoti} />
        </AppView>
        <AppView style={styles.center} className="py-5 bg-[#3E3D3D59] px-5">
          <AppView>
            <AppText className="font-MANROPE_500 text-sm text-white">
              New Service Available
            </AppText>
            <AppText className="max-w-[90%] mt-1 font-MANROPE_400 text-[13px] text-grey_200">
              Allow ReePlay send you notifications every time we add or announce
              a new service.
            </AppText>
          </AppView>
          <ToggleButton isOn={newService} setIsOn={setNewService} />
        </AppView>

        <AppView style={styles.center} className="py-5 px-5">
          <AppText className="font-MANROPE_500 text-sm text-white">
            Upcoming Contents
          </AppText>
          <ToggleButton isOn={upcoming} setIsOn={setUpcoming} />
        </AppView>

        <AppView style={styles.center} className="py-5 px-5 bg-[#3E3D3D59]">
          <AppText className="font-MANROPE_500 text-sm text-white">
            New Arrivals
          </AppText>
          <ToggleButton isOn={arrivals} setIsOn={setArrivals} />
        </AppView>

        <AppView style={styles.center} className="py-5 px-5">
          <AppText className="font-MANROPE_500 text-sm text-white">
            Live Channels
          </AppText>
          <ToggleButton isOn={liveChannel} setIsOn={setLiveChannel} />
        </AppView>
      </AppView>
    </AppScreen>
  );
};

export default NotificatoinScreen_S;

const styles = StyleSheet.create({
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
