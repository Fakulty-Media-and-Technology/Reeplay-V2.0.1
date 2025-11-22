import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppImage, AppView, TouchableOpacity} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import {HamBurger, ModalLogo, SearchIcon} from '@/assets/icons';
import {useNavigation} from '@react-navigation/native';
import routes from '@/navigation/routes';
import BlurView from 'react-native-blur-effect';
import {BlurView as Blur} from '@react-native-community/blur';
import { RootNav } from '@/navigation/AppNavigator';

interface HeaderProps {
  scroll: number;
  isCast?: boolean;
}

const Header = ({scroll, isCast}: HeaderProps) => {
  const {navigate} = useNavigation<RootNav>();

  // console.log(scroll);

  const Children = () => (
    <AppView className="flex-row justify-between items-center px-6">
      <TouchableOpacity disabled={isCast} onPress={() => navigate(routes.MAIN)}>
        <HamBurger />
      </TouchableOpacity>

      {!isCast && (
        <>
          <AppImage source={require('@/assets/images/smallLogo.png')} />
          <TouchableOpacity
            onPress={() => navigate(routes.SEARCH_SCREEN)}
            style={{
              width: 30, 
              height: 30, 
              borderRadius: 99,
              backgroundColor:'#FF1313',
              alignItems:'center',
              justifyContent:'center'
            }}
            >
            <SearchIcon />
          </TouchableOpacity>
        </>
      )}
    </AppView>
  );

  return (
    <>
      {Platform.OS === 'ios' ? (
        <>
          {scroll > 0 ? (
            // <View>

            // </View>
            <>
              <Blur
                overlayColor="transparent"
                blurType="dark"
                blurAmount={5}
                style={[styles.container, isCast && styles.cast]}>
                {Platform.OS === 'ios' && Children()}
              </Blur>
            </>
          ) : (
            <View style={[styles.container, isCast && styles.cast]}>
              {Children()}
            </View>
          )}
        </>
      ) : (
        <>
          <AppView style={[styles.container, isCast && styles.cast]}>
            {scroll > 0 && (
              <BlurView
                backgroundColor="rgba(0, 0, 0, 0.4)"
                blurRadius={scroll > 0 ? 5 : 4}
              />
            )}

            <AppView
              style={[
                {
                  justifyContent: isCast ? 'center' : 'flex-end',
                  height: Size.hp(12),
                },
                isCast && {paddingTop: 25},
              ]}
              className="absolute w-full z-40 pb-3">
              {Children()}
            </AppView>
          </AppView>
        </>
      )}
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    height: Platform.OS === 'ios' ? Size.hp(12) : Size.hp(10),
    justifyContent: 'flex-end',
  },
  cast: {
    height: Platform.OS === 'ios' ? Size.calcHeight(110) : Size.calcHeight(115),
    justifyContent: 'center',
    paddingTop: 30,
  },
});
