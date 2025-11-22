import Size from '@/Utils/useResponsiveSize';
import {
  FHomeIcon,
  FLibraryIcon,
  FLiveIcon,
  FUpcomingIcon,
  HomeIcon,
  Library,
  LiveIcon,
  UpcomingIcon,
} from '@/assets/icons';
import colors from '@/configs/colors';
import fonts from '@/configs/fonts';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';

const MyTabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        minHeight: 80,
        paddingTop: 20,
        width: '100%',
        // backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{alignItems: 'center'}}>
            {label === 'Home' && (isFocused ? <FHomeIcon /> : <HomeIcon />)}
            {label === 'Live' && (isFocused ? <FLiveIcon /> : <LiveIcon />)}
            {label === 'Upcoming' &&
              (isFocused ? <FUpcomingIcon /> : <UpcomingIcon />)}
            {label === 'Library' &&
              (isFocused ? <FLibraryIcon /> : <Library />)}
            <Text
              style={[
                styles.tabLabel,
                {color: isFocused ? colors.RED : colors.GREY_100},
              ]}>
              {label.toString()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default MyTabBar;

const styles = StyleSheet.create({
  tabLabel: {
    marginTop: Size.calcHeight(8),
    fontFamily: fonts.ROBOTO_700,
    fontSize: Size.calcWidth(12),
  },
});
