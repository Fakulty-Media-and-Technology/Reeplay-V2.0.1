import {
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import Size from '@/Utils/useResponsiveSize';
import {AppImage, AppText, AppView} from '@/components';
import AuthFormComponent from './components/AuthFormComponent';
import LinearGradient from 'react-native-linear-gradient';

const LoginScreen = () => {
  const [keyboardStatus, setKeyboardStatus] = useState<boolean>(false);

  useEffect(() => {
    const showKeyboard = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideKeyboard = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showKeyboard.remove();
      hideKeyboard.remove();
    };
  }, [Keyboard]);
  return (
    <View
      style={{
        // flex: 1,
        position: 'relative',
        alignItems: 'center',
        // justifyContent: 'center',
        height: Size.getHeight(),
      }}>
      <StatusBar hidden />

      <FastImage
        source={require('@/assets/images/Login-bg.png')}
        style={styles.imageContainer}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.95)', 'rgba(0,0,0,0.99)']}
        style={[styles.gradientStyles]}
      />

      <AppImage
        source={require('@/assets/images/authLogo.png')}
        style={{
          width: 300,
          height: 200,
          marginTop: Size.getHeight() < 668 ? 10 : 50,
        }}
        resizeMode='contain'
      />

      <AppText className="font-MANROPE_600 text-white text-xl text-center -mt-3">
        Login Account
      </AppText>
      <AppText className="text-base text-white font-MANROPE_400 text-center">
        Watch your favorite stars
      </AppText>

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{
          paddingHorizontal: Size.calcHeight(20),
          marginTop: Size.getHeight() < 668 ? 12 : 0,
          width: '100%',
          height:'65%',
          borderWidth:1
        }}
        contentContainerStyle={{
          paddingBottom: keyboardStatus ? Size.hp(20) : Platform.OS === 'ios' ? 200 : 0,
        }}>
        <AuthFormComponent screen="login" />
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    objectFit: 'contain',
  },

  gradientStyles: {
    height: Size.getHeight(),
    width: Size.getWidth(),
    // zIndex: 10,
    position: 'absolute',
  },
});
