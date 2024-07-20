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

export type GetStartedScreenProps = NativeStackNavigationProp<
  AuthStackParamList,
  'GetStartedScreen'
>;

export type LoginScreenProps = NativeStackNavigationProp<
  AuthStackParamList,
  'LoginScreen'
>;

export type MainLoginScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

export type SignUpScreenProps = NativeStackNavigationProp<
  AuthStackParamList,
  'SignupScreen'
>;
export type ResetPasswordScreenProps = NativeStackNavigationProp<
  AuthStackParamList,
  'ResetPasswordScreen'
>;

export type VerificationScreenProps = NativeStackNavigationProp<
  AuthStackParamList,
  'VerifyPhoneScreen'
>;
export type SetPinScreenProps = NativeStackNavigationProp<
  AuthStackParamList,
  'SetPINScreen'
>;

export type AppPINScreenProps = NativeStackNavigationProp<
  AuthStackParamList,
  'AppPINScreen'
>;

export type SetNewPINScreenProps = NativeStackNavigationProp<
  AuthStackParamList,
  'SetNewPINScreen'
>;

export type InterestScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  'InterestScreen'
>;

export type InterestScreenRouteProps = RouteProp<
  RootStackParamList,
  'InterestScreen'
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

export type TabMainNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'TabNavigation'
>;

export type AppStackNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'MainNavigation'
>;

export type AuthMainNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'Auth'
>;

export type DashboardNavProps = NativeStackNavigationProp<
  DrawerNavigatorProps,
  'MenuScreen'
>;

export type AccountdNavProps = NativeStackNavigationProp<
  DrawerNavigatorProps,
  'AccountScreen'
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

export type HomeScreenNav = NativeStackNavigationProp<BottomNavigator, 'Home'>;
export type LiveScreenNav = NativeStackNavigationProp<BottomNavigator, 'Live'>;
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

export type PreviewScreenNav = NativeStackNavigationProp<
  RootStackParamList,
  'PreviewScreen'
>;

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

export type CombinedStackParamList = RootStackParamList & AuthStackParamList;

export type CombinedStackNavigationProps<
  T extends keyof CombinedStackParamList,
> = NativeStackNavigationProp<CombinedStackParamList, T>;

export type AuthStackNavigationProps<T extends keyof AuthStackParamList> =
  NativeStackNavigationProp<AuthStackParamList, T>;
