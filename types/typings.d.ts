import {RootStackParamList} from '@/navigation/AppNavigator';
import {DrawerNavigatorProps} from '@/navigation/AppStack';
import {AuthStackParamList} from '@/navigation/AuthNavigation';
import {BottomNavigator, TabNavParams} from '@/navigation/TabNavigation';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type SplashScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  'SplashScreen'
>;

export type OnboardingScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  'OnboardingScreen'
>;

export type AboutScreenRouteProps = NativeStackNavigationProp<
  RootStackParamList,
  'AboutScreen'
>;
export type InterestScreenRouteProps = RouteProp<
  RootStackParamList,
  'InterestScreen'
>;

export type VerifyRouteProps = RouteProp<
  AuthStackParamList,
  'VerifyPhoneScreen'
>;

export type SetNEWPINRouteProps = RouteProp<
  AuthStackParamList,
  'SetNewPINScreen'
>;
export type SetPINRouteProps = RouteProp<AuthStackParamList, 'SetPINScreen'>;

export type AppStackNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'MainNavigation'
>;

export type DashboardNavProps = NativeStackNavigationProp<
  DrawerNavigatorProps,
  'MenuScreen'
>;

export type SubscriptionNavProps = NativeStackNavigationProp<
  DrawerNavigatorProps,
  'SubscriptionScreen'
>;

export type SubscriptionRouteProps = RouteProp<
  DrawerNavigatorProps,
  'SubscriptionScreen'
>;

export type VoteScreenNavProps = NativeStackNavigationProp<
  DrawerNavigatorProps,
  'VoteScreen'
>;

export type LiveScreenNav = NativeStackNavigationProp<BottomNavigator, 'Live'>;
export type HomeScreenNav = NativeStackNavigationProp<BottomNavigator, 'Home'>;
export type UpcomingScreenNav = NativeStackNavigationProp<
  BottomNavigator,
  'Upcoming'
>;
export type LibrayScreenNav = NativeStackNavigationProp<
  BottomNavigator,
  'Library'
>;

export type FullScreenVideo = NativeStackNavigationProp<
  RootStackParamList,
  'FullScreenVideo'
>;

export type FullScreenVideoRoute = RouteProp<
  RootStackParamList,
  'FullScreenVideo'
>;

export type PreviewScreenRoute = RouteProp<RootStackParamList, 'PreviewScreen'>;

export type CastScreenRoute = RouteProp<RootStackParamList, 'CastScreen'>;

export type DownloadScreenNav = NativeStackNavigationProp<
  RootStackParamList,
  'DownloadScreen'
>;

export type WatchlistScreenNav = NativeStackNavigationProp<
  RootStackParamList,
  'WatchlistScreen'
>;

export type LanguageScreenNav = NativeStackNavigationProp<
  DrawerNavigatorProps,
  'LanguageScreen'
>;
export type SettingScreenNav = NativeStackNavigationProp<
  RootStackParamList,
  'SettingsScreen'
>;

export type PreviewScreenRoute = RouteProp<RootStackParamList, 'PreviewScreen'>;
export type VoteScreenRoute = RouteProp<DrawerNavigatorProps, 'VoteScreen'>;

export type CombinedStackParamList = RootStackParamList & AuthStackParamList;

export type CombinedStackNavigationProps<
  T extends keyof CombinedStackParamList,
> = NativeStackNavigationProp<CombinedStackParamList, T>;

export type AuthStackNavigationProps<T extends keyof AuthStackParamList> =
  NativeStackNavigationProp<AuthStackParamList, T>;
