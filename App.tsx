/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from '@/navigation/AppNavigator';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store from '@/store/app.store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  AppState,
  BackHandler,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,

} from 'react-native';
import { getData, storeData } from './Utils/useAsyncStorage';
import { addEventListener } from '@react-native-community/netinfo';
import NetInfo from '@react-native-community/netinfo';
import colors from './configs/colors';
import fonts from './configs/fonts';
import Size from './Utils/useResponsiveSize';
import routes from './navigation/routes';
import Orientation from 'react-native-orientation-locker';
import { validateReefreshToken } from './api/auth.api';
import messaging from '@react-native-firebase/messaging';
import "./global.css"
import { useAppPersistStore } from './store/zustand.store';
import NetworkComponent from './components/NetworkComponent';
import SessionComponent from './components/SessionComponent';
import ModalComponent from './components/LockComponent';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToastProps, InfoToast } from 'react-native-toast-message';
import { generateAESKeys, getAESKeys, saveAESKeys } from '@/Screens/Preview/utils/downloadUtils';
import { SocketContextProvider } from './context/socketContent';

const LEFT_APP_TIME = 'LEFT_APP_TIME';

function App(): React.JSX.Element {
  const appState = useRef(AppState.currentState);
  const [stage, setStage] = useState<string>('network');
  const [network, setNetwork] = useState<boolean | null>(true);
  const [showNetworkModal, setShowNetworkModal] = useState<boolean>(false);
  const navigationRef = useRef<any>(null);
  const date = new Date(1711214160358);
  const {isToken, isLock, setIsLock, setIsToken} = useAppPersistStore();

  // const requestUserPermission = async () => {
  //   await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //   );
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   return enabled;
  // };


//  TODO: ADD EXPIRED SESSION MODAL

  const handleBackButtonPress = () => {
    console.log('checking...');
    if (
      navigationRef.current &&
      navigationRef.current.getCurrentRoute().index === 0
    ) {
      console.log('User pressed back button at index 0');
      return true;
    }
    // return false;
  };

  function refreshNetwork() {
    NetInfo.refresh().then(state => {
      if (state.isConnected) setNetwork(state.isConnected);
    });
  }

  const ensureAESKeysExist = async () => {
  const keys = await getAESKeys();
  if (!keys) {
    const { key, iv } = await generateAESKeys();
    await saveAESKeys(key, iv);
  }
};

  async function checkLockAppLogic() {
    const date = new Date();
    const lastLeftTime = await getData(LEFT_APP_TIME);
    if (lastLeftTime) {
      if (date.getTime() >= Number(lastLeftTime)) {
        console.log(
          'The difference between the timestamps is greater than or equal to 10 minutes.',
        );
        setIsLock(true);
      } else {
        console.log(
          'The difference between the timestamps is less than 10 minutes.',
        );
      }
    }
  }

 const toastConfig = {
    info: (props:BaseToastProps) => (
       <InfoToast 
          {...props}
          style={{ borderLeftColor: '#F3C63F' }}
       /> 
    )
}

  async function setLeftAppTime() {
    const date = new Date();

    await storeData(
      LEFT_APP_TIME,
      date.setTime(date.getTime() + 10 * 60 * 1000).toString(),
    );
  }

  async function handleTest() {
    // if (await requestUserPermission()) {
    //   getToken();

    //   messaging()
    //     .getInitialNotification()
    //     .then(async rm => {
    //       if (rm) {
    //         console.log('Notification: ', rm.notification);
    //       }
    //     });
    // }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        checkLockAppLogic();
      }

      appState.current = nextAppState;
      if (appState.current === 'background') {
        console.log('first background');
        setLeftAppTime();
      }
    });

    let backHandler: any = null;
    if (Platform.OS === 'android') {
      backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
    }

    return () => {
      subscription.remove();
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, []);

  useEffect(() => {
    handleTest();
    ensureAESKeysExist();
    Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setNetwork(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#000',
    },
  };
  return (
    <Provider store={store}>
      <SocketContextProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
        <SafeAreaProvider style={{flex:1}}>
        <StatusBar backgroundColor="#000" />
        <NavigationContainer ref={navigationRef} theme={navTheme}>
          {stage !== 'downloadScreen' && <AppNavigator />}
          {isLock && <ModalComponent />}
          {isToken && <SessionComponent />}
          {!network && <NetworkComponent 
          refreshNetwork={refreshNetwork} 
          setStage={setStage}
          stage={stage}
          />}
           <Toast visibilityTime={4000} config={toastConfig} />
        </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
      </SocketContextProvider>
    </Provider>
  );
}

export default App;

