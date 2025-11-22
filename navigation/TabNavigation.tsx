import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import routes from './routes';
import HomeScreen from '@/Screens/Home/HomeScreen';
import LiveScreen from '@/Screens/Live/LiveScreen';
import UpcomingScreen from '@/Screens/Upcoming/UpcomingScreen';
import LibraryScreen from '@/Screens/Library/LibraryScreen';
import MyTabBar from './components/TabView';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {View} from 'react-native';
import OrientationWrapper from '@/components/OrientationWrapper';
import { useAppSelector } from '@/Hooks/reduxHook';
import { selectHideTabBar } from '@/store/slices/userSlice';

const Tab = createBottomTabNavigator();

export type BottomNavigator = {
  [routes.HOME_SCREEN]: undefined;
  [routes.LIVE_SCREEN]: undefined;
  [routes.UPCOMING_SCREEN]: undefined;
  [routes.LIBRARY_SCREEN]: undefined;
};

export type TabNavParams = NativeStackNavigationProp<BottomNavigator>;

const TabNavigation = () => {
  const hideTabBar = useAppSelector(selectHideTabBar)
  return (
    <Tab.Navigator
      initialRouteName={routes.HOME_SCREEN}
      tabBar={props => (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
            display: hideTabBar ? 'none': 'flex'
          }}>
          <MyTabBar {...props} />
        </View>
      )}
      // sceneContainerStyle={{
      //   backgroundColor: 'transparent',
      // }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
      }}>
      <Tab.Screen name={routes.HOME_SCREEN}>
        {() => (
    <OrientationWrapper>
       {(injectedProps) => <HomeScreen {...injectedProps} />}
    </OrientationWrapper>
  )}
      </Tab.Screen>
      <Tab.Screen name={routes.LIVE_SCREEN}>
         {() => (
    <OrientationWrapper>
       {(injectedProps) => <LiveScreen {...injectedProps} />}
    </OrientationWrapper>
  )}
      </Tab.Screen>
      <Tab.Screen name={routes.UPCOMING_SCREEN}>
        {() => (<OrientationWrapper>
            {(injectedProps) => <UpcomingScreen {...injectedProps} />}
            </OrientationWrapper>)}
      </Tab.Screen>
      <Tab.Screen name={routes.LIBRARY_SCREEN} component={LibraryScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
