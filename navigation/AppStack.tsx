import {View, Text, Platform} from 'react-native';
import React from 'react';
import routes from './routes';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AccountScreen from '@/Screens/Menu/AccountScreen';
import MenuScreen from '@/Screens/Menu/MenuScreen';
import ChangeEmail from '@/Screens/Menu/ChangeEmail';
import ChangePassword from '@/Screens/Menu/ChangePassword';
import ChangePhone from '@/Screens/Menu/ChangePhone';
import ChangePin from '@/Screens/Menu/ChangePin';
import SubscriptionScreen from '@/Screens/Menu/SubscriptionScreen';
import AddPaymentView from '@/Screens/Menu/components/AddPaymentView';
import CreateAds from '@/Screens/Menu/CreateAds';
import NotificationScreen from '@/Screens/Menu/NotificationScreen';
import SuggestionScreen from '@/Screens/Menu/SuggestionScreen';
import GiftCardRedeemScreen from '@/Screens/Menu/GiftCardRedeemScreen';
import SettingScreen from '@/Screens/Settings/SettingScreen';
import LanguageScreen from '@/Screens/Language/LanguageScreen';
import DeleteScreen from '@/Screens/support/DeleteScreen';
import CancelSubscription from '@/Screens/support/CancelSubscription';
import VoteScreen from '@/Screens/VideoScreen/VoteScreen';

const Drawer = createNativeStackNavigator();

export type DrawerNavigatorProps = {
  [routes.ACCOUNT_SCREEN]: undefined;
  [routes.MENU_SCREEN]: undefined;
  [routes.CHANGE_EMAIL]: undefined;
  [routes.CHANGE_PASSWORD]: undefined;
  [routes.CHANGE_PHONE]: undefined;
  [routes.CHANGE_PIN]: undefined;
  [routes.WATCHLIST_SCREEN]: undefined;
  [routes.ADD_PAYMENT_METHOD]: undefined;
  [routes.CREATE_ADS_SCREEN]: undefined;
  [routes.NOTIFICATION_SCREEN]: undefined;
  [routes.SUGGESTION_SCREEN]: undefined;
  [routes.GIFT_CARD_SCREEN]: undefined;
  [routes.DELETE_ACCOUNT_SCREEN]: undefined;
  [routes.CANCEL_SUBSCRIPTION_SCREEN]: undefined;
  [routes.VOTE_SCREEN]: {
    _id: string;
  };
  [routes.SUBSCRIPTION_SCREEN]: {
    tab: string;
  };
};

const AppStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName={routes.MENU_SCREEN}
      screenOptions={{
        headerShown: false,
      }}>
      {/* Account screens */}
      <Drawer.Screen name={routes.MENU_SCREEN} component={MenuScreen} />
      <Drawer.Screen name={routes.ACCOUNT_SCREEN} component={AccountScreen} />
      <Drawer.Screen name={routes.CHANGE_EMAIL} component={ChangeEmail} />
      <Drawer.Screen name={routes.CHANGE_PASSWORD} component={ChangePassword} />
      <Drawer.Screen name={routes.CHANGE_PHONE} component={ChangePhone} />
      <Drawer.Screen name={routes.CHANGE_PIN} component={ChangePin} />
      <Drawer.Screen
        name={routes.GIFT_CARD_SCREEN}
        component={GiftCardRedeemScreen}
      />
      <Drawer.Screen
        name={routes.ADD_PAYMENT_METHOD}
        component={AddPaymentView}
      />
      <Drawer.Screen
        name={routes.SUBSCRIPTION_SCREEN}
        component={SubscriptionScreen}
      />
      <Drawer.Screen name={routes.CREATE_ADS_SCREEN} component={CreateAds} />
      <Drawer.Screen
        name={routes.SUGGESTION_SCREEN}
        component={SuggestionScreen}
      />
      <Drawer.Screen
        name={routes.NOTIFICATION_SCREEN}
        component={NotificationScreen}
      />

      <Drawer.Screen
        name={routes.DELETE_ACCOUNT_SCREEN}
        component={DeleteScreen}
      />
      <Drawer.Screen
        name={routes.CANCEL_SUBSCRIPTION_SCREEN}
        component={CancelSubscription}
      />

      <Drawer.Screen name={routes.VOTE_SCREEN} component={VoteScreen} />
    </Drawer.Navigator>
  );
};

export default AppStack;
