import {ActivityIndicator, Platform, Pressable, SectionList, StyleSheet, Text, View} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {AppHeader, AppImage, AppScreen, AppText, AppView} from '@/components';
import { FlatList } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { useAppPersistStore } from '@/store/zustand.store';
import { selectGroupedNotifications, selectNotificationList, setNoticationsList } from '@/store/slices/userSlice';
import { INotification } from '@/types/api/notification.types';
import ToastNotification from '@/components/ToastNotifications';
import { getAllNotifications } from '@/api/notification.api';
import { getNotificationTime } from '@/Utils/formatTime';

const NotificationScreen = () => {
  const dispatch = useAppDispatch();
  const notificationsList = useAppSelector(selectGroupedNotifications);
  const notifications = useAppSelector(selectNotificationList);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const {setIsToken, isToken} = useAppPersistStore();
  const [searchText, setSearchText] = useState('');

   async function handleNotifications(page?: number) {
    try {
      setLoading(true);
      const res = await getAllNotifications({page: page ?? 1, limit: 20});
      if (res.data?.status === 401) setIsToken(true);
      if (res.ok && res.data) {
        const existing = new Set(notifications.map(x => x._id));
        const merged = [
          ...notifications,
          ...res.data.data.filter(x => !existing.has(x._id)),
        ];
        if (merged.length === notifications.length) setHasMore(false);
        dispatch(setNoticationsList(res.data.data));
        if (page) setPage(page);
      } else {
        ToastNotification('error', `${res.data?.message}`);
        setHasMore(false);
      }
    } catch (error) {
      ToastNotification('error',`${error}`);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  const loadMore = useCallback(() => {
    if (!hasMore || notifications.length < 20) return;
    handleNotifications(notifications.length >= page * 20 ? page + 1 : page);
  }, [page, hasMore]);

  // Filter based on search text
  const filteredNotifications = notifications.filter(x =>
    x.adminNotification.title?.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Group filtered results
  const groupedNotifications = filteredNotifications.reduce((acc, item) => {
    const date = new Date(item.createdAt).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, INotification[]>);

  const sections = Object.entries(
    searchText.length > 0 ? groupedNotifications : notificationsList,
  ).map(([date, data]) => ({title: date, data}));

  useEffect(() => {
    handleNotifications();
  }, [isToken]);

  return (
    <AppScreen containerStyle={{paddingTop: 30, position: 'relative'}}>
      <AppHeader style={{marginTop:5}} />
      <AppView className="absolute -top-[10px] w-full items-center">
        <AppImage source={require('@/assets/images/Logo_L.png')} style={{width: 268, height:49}}
          resizeMode='contain' />
      </AppView>
      <AppText className="font-MANROPE_700 text-white text-lg mt-12 mb-5">
        Notifications
      </AppText>

      <AppView>
        <SectionList
        sections={sections}
        keyExtractor={item => item._id.toString()}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={1}
        onEndReached={loadMore}
        renderSectionHeader={({section: {title}}) => {
          return <></>;
        }}
        renderItem={({item}) => <NotificationItem item={item} />}
        ListFooterComponent={
          <>
            {loading && notifications.length > 19 && (
              <AppView className="h-20 items-center justify-center">
                <ActivityIndicator size={'large'} />
              </AppView>
            )}
          </>
        }
      />
      </AppView>
    </AppScreen>
  );
};

export default NotificationScreen;

interface Props{
  item: INotification
}

export const NotificationItem = ({item}:Props) =>{
  return <AppView className="mb-[13px] flex-row items-start">
              <View className="w-[145px] h-[83px] rounded overflow-hidden">
                <AppImage
                  source={item.photoUri ?{uri:item.photoUri}:require('@/assets/images/NotificationBanner.png')}
                  style={{width:145, height:83}}
                />
              </View>

              <AppView className="ml-5 flex-1">
                <AppText className="text-grey_100 font-LEXEND_700 text-xs">
                  {item.adminNotification.title}
                </AppText>
                <AppText className="font-MANROPE_400 text-xs text-white">
                  {item.adminNotification.description}
                </AppText>
                <AppText className="font-MANROPE_500 text-[13px] text-yellow mt-[2px]">
                  {getNotificationTime(item.createdAt)}
                </AppText>
              </AppView>
            </AppView>
}