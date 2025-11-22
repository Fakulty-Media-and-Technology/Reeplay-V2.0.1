import {View, Text, SafeAreaView} from 'react-native';
import React, {JSX, useEffect} from 'react';
import AppStack from './AppStack';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import routes from '@/navigation/routes';
import Splashscreen from '@/Screens/Splashscreen/Splashscreen';
import OnboardingScreen from '@/Screens/authentication/OnboardingScreen';
import AuthNavigation from './AuthNavigation';
import TabNavigation from './TabNavigation';
import FullScreenModal from '@/Screens/VideoScreen/FullScreenModal';
import PreviewScreen from '@/Screens/Preview/PreviewScreen';
import CastScreeen from '@/Screens/Preview/CastScreeen';
import DownoadScreen from '@/Screens/Download/DownoadScreen';
import WatchlistScreen from '@/Screens/Menu/WatchlistScreen';
import InterestScreen from '@/Screens/authentication/InterestScreen';
import SettingScreen from '@/Screens/Settings/SettingScreen';
import PrivacyScreen from '@/Screens/support/PrivacyScreen';
import AboutUs from '@/Screens/support/AboutUs';
import TermScreen from '@/Screens/support/TermScreen';
import NotificatoinScreen_S from '@/Screens/Settings/NotificatoinScreen_S';
import Search from '@/Screens/Search/Search';
import GetStartedScreen from '@/Screens/authentication/GetStartedScreen';
import {useNavigation} from '@react-navigation/native';
import PaymentSummaryView from '@/Screens/Payments/PaymentSummaryView';
import LanguageScreen from '@/Screens/Language/LanguageScreen';
import {LiveEvents} from '@/types/api/live.types';
import { ICast } from '@/types/api/content.types';
import OrientationWrapper, { OrientationInjectedProps } from '@/components/OrientationWrapper';

const RootStack = createNativeStackNavigator();

export enum fullVideoType {
  'live',
  'series',
  'default',
}

export enum previewContentType {
  'tv series',
  'music video',
  'film',
}

export type RootStackParamList = {
  [routes.SPLASH_SCREEN]: undefined;
  [routes.ONBOARDING_SCREEN]: undefined;
  [routes.AUTH]: any;
  [routes.MAIN]: any;
  [routes.TAB_MAIN]: any;
  [routes.PREVIEW_SCREEN]: {
    content: previewContentType;
    contentType?: string;
    contentPrice?: string;
    videoURL: string;
  };
  [routes.LANGUAGE_SCREEN]: undefined;
  [routes.WATCHLIST_SCREEN]: undefined;
  [routes.CAST_SCREEN]: {cast:ICast, vodId:string};
  [routes.DOWNLOAD_SCREEN]: undefined;
  [routes.SETTINGS_SCREEN]: undefined;
  [routes.PRIVACY_SCREEN]: undefined;
  [routes.ABOUT_SCREEN]: undefined;
  [routes.TERMS_SCREEN]: undefined;
  [routes.SEARCH_SCREEN]: undefined;
  [routes.NOTIFICATION_SCREEN_S]: undefined;
  [routes.INTEREST_SCREEN]: {
    isSettings: boolean;
  };
  [routes.FULL_SCREEN_VIDEO]: {
    videoURL: string;
    type: fullVideoType;
    channelImage?: any;
    vote?: boolean;
    donate?: boolean;
    live_event_data?: LiveEvents;
    upcoming?: boolean;
    title: string;
    coverImg?: string;
    isTime?: boolean;
    _id: string;
  };
  [routes.PAYMENT_SCREEN]: undefined;
};

export type RootNav = NativeStackNavigationProp<RootStackParamList>;

const AppNavigator = (): JSX.Element => {
  return (
    <RootStack.Navigator
      initialRouteName={routes.SPLASH_SCREEN}
      screenOptions={{
        header: () => null,
      }}>
      <RootStack.Group>
        <RootStack.Screen
          name={routes.SPLASH_SCREEN}
          component={Splashscreen}
        />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name={routes.ONBOARDING_SCREEN}
          component={OnboardingScreen}
        />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen name={routes.AUTH} component={AuthNavigation} />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen name={routes.TAB_MAIN} component={TabNavigation} />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen name={routes.MAIN} component={AppStack} />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name={routes.FULL_SCREEN_VIDEO}
          component={FullScreenModal}
          options={{
            orientation: 'landscape_right',
          }}
        />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name={routes.PREVIEW_SCREEN}>
            {() => (
    <OrientationWrapper>
       {(injectedProps) => <PreviewScreen {...injectedProps} />}
    </OrientationWrapper>
  )}
          </RootStack.Screen>
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name={routes.PAYMENT_SCREEN}
          component={PaymentSummaryView}
        />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen name={routes.CAST_SCREEN} component={CastScreeen} />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name={routes.DOWNLOAD_SCREEN}
          >
          {() => (<OrientationWrapper>
            {(injectedProps) => <DownoadScreen {...injectedProps} />}
            </OrientationWrapper>)}
        </RootStack.Screen>
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name={routes.WATCHLIST_SCREEN}
          component={WatchlistScreen}
        />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name={routes.INTEREST_SCREEN}
          component={InterestScreen}
        />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name={routes.LANGUAGE_SCREEN}
          component={LanguageScreen}
        />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name={routes.SETTINGS_SCREEN}
          component={SettingScreen}
        />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name={routes.NOTIFICATION_SCREEN_S}
          component={NotificatoinScreen_S}
        />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name={routes.PRIVACY_SCREEN}
          component={PrivacyScreen}
        />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen name={routes.TERMS_SCREEN} component={TermScreen} />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen name={routes.ABOUT_SCREEN} component={AboutUs} />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen name={routes.SEARCH_SCREEN}>
          {() => (
    <OrientationWrapper>
       {(injectedProps) => <Search {...injectedProps} />}
    </OrientationWrapper>
  )}
        </RootStack.Screen>
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

export default AppNavigator;
