import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import routes from './routes';
import Splashscreen from '@/Screens/Splashscreen/Splashscreen';
import OnboardingScreen from '@/Screens/authentication/OnboardingScreen';
import GetStartedScreen from '@/Screens/authentication/GetStartedScreen';
import LoginScreen from '@/Screens/authentication/LoginScreen';
import SignUpScreen from '@/Screens/authentication/SignUpScreen';
import ResetPassword from '@/Screens/authentication/ResetPassword';
import TermScreen from '@/Screens/support/TermScreen';
import PrivacyScreen from '@/Screens/support/PrivacyScreen';
import VerificationScreen from '@/Screens/authentication/VerificationScreen';
import CreatePIN from '@/Screens/authentication/CreatePIN';
import SetNewPIN from '@/Screens/authentication/SetNewPIN';
import InterestScreen from '@/Screens/authentication/InterestScreen';
import AppPIN from '@/Screens/authentication/AppPIN';

const Auth = createNativeStackNavigator();

export type AuthStackParamList = {
  [routes.GET_STARTED_SCREEN]: undefined;
  [routes.LOGIN_SCREEN]: undefined;
  [routes.SIGNUP_SCREEN]: undefined;
  [routes.RESET_PASSWORD_SCREEN]: undefined;
  [routes.SET_PIN]: undefined;
  [routes.APP_PIN]: undefined;
  [routes.VEERIFY_PHONE]: {
    userDetails: {
      email: string;
    };
  };
  [routes.SET_NEW_PIN]: {
    pin: string;
  };
};

const AuthNavigation = () => {
  return (
    <Auth.Navigator
      initialRouteName={routes.GET_STARTED_SCREEN}
      screenOptions={{
        header: () => null,
        headerShown: false,
      }}>
      <Auth.Screen
        name={routes.GET_STARTED_SCREEN}
        component={GetStartedScreen}
      />
      <Auth.Screen name={routes.LOGIN_SCREEN} component={LoginScreen} />
      <Auth.Screen name={routes.SIGNUP_SCREEN} component={SignUpScreen} />

      <Auth.Screen name={routes.VEERIFY_PHONE} component={VerificationScreen} />
      <Auth.Screen name={routes.SET_PIN} component={CreatePIN} />
      <Auth.Screen name={routes.SET_NEW_PIN} component={SetNewPIN} />
      <Auth.Screen name={routes.APP_PIN} component={AppPIN} />
      <Auth.Screen
        name={routes.RESET_PASSWORD_SCREEN}
        component={ResetPassword}
      />
    </Auth.Navigator>
  );
};

export default AuthNavigation;
