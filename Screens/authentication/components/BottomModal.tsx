import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from 'react-native-gesture-handler';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import {SearchInput} from '@/assets/icons';
import country_codes from '@/configs/country_codes';

interface BottomSheetProps {
  handleNav: (item: CountryProps) => void;
  handleClose: () => void;
  handleGender?: (item: string) => void
  isGender?: boolean
}

interface CountryProps {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
}

const MAX_TRANSLATE_Y = -Size.getHeight() + 50;
const TRANSLATE_Y = -Size.getHeight() * 0.62;

const BottomSheet = ({handleNav, handleClose, isGender, handleGender}: BottomSheetProps) => {
  const [keyboardStatus, setKeyboardStatus] = useState<boolean>(false);
  const [countryCodeList, setCountryCodeList] = useState<CountryProps[]>([
    ...country_codes,
  ]);
  const [inputText, setInputText] = useState<string>('');
  const translateY = useSharedValue(0);

  function handleInput(value: string) {
    setInputText(value);

    const filteredList = country_codes.filter(c =>
      c.name.toLowerCase().includes(value.toLowerCase()),
    );
    setCountryCodeList(filteredList);
  }

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translateY.value = withSpring(destination, {damping: 50});
  }, []);

  const context = useSharedValue({y: 0});
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(
        Math.min(TRANSLATE_Y, translateY.value),
        MAX_TRANSLATE_Y,
      );
    });

  useEffect(() => {
    scrollTo(-Size.getHeight() * (isGender ? 0.2 : 0.62));
  }, []);

  useEffect(() => {
    const showKeyboard = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
      scrollTo(MAX_TRANSLATE_Y);
    });
    const hideKeyboard = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
      scrollTo(-Size.getHeight() * 0.62);
    });

    return () => {
      showKeyboard.remove();
      hideKeyboard.remove();
    };
  }, [Keyboard]);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 10],
      Extrapolate.CLAMP,
    );

    return {
      borderRadius,
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, rBottomSheetStyle]}>
        <View style={styles.line} />

{isGender ? 
  <>
  {['Male', 'Female'].map((x,i) =>{
    return <TouchableOpacity
                key={i}
                onPress={() => [handleGender?.(x), handleClose()]}
                style={[
                  styles.center,
                  styles.countryList,
                  {backgroundColor: 'transparent', borderTopWidth: i===0?0:1},
                ]}
                className=' border-gray-300'
                >
                <Text style={styles.text}>{x}</Text>
              
              </TouchableOpacity>
  })}
  </>
:<>
        <View style={{paddingHorizontal: Size.calcHeight(24)}}>
          <Text style={styles.header}>Select Country</Text>
          <View
            style={[
              styles.center,
              styles.inputContainer,
              Platform.OS === 'android' && {
                paddingVertical: 0,
              },
            ]}>
            <SearchInput />
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="Search"
              placeholderTextColor="#BCC1CA"
              value={inputText}
              onChangeText={text => handleInput(text)}
            />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {countryCodeList.map((country, index) => {
            const odd = index % 2 !== 0;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => [handleNav(country), handleClose()]}
                style={[
                  styles.center,
                  styles.countryList,
                  {backgroundColor: odd ? '#F1F1F1' : 'transparent'},
                ]}>
                <View
                  style={{
                    width: 34,
                    height: 26,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    marginBottom: -3,
                  }}>
                  <Text style={{fontSize: 25}}>
                    {country.flag}
                  </Text>
                </View>
                <Text style={styles.text}>{country.name}</Text>
                <Text
                  style={[
                    styles.text,
                    {marginLeft: 3},
                  ]}>{`(${country.dial_code})`}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
</>}
      </Animated.View>
    </GestureDetector>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    height: Size.getHeight(),
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: Size.getHeight(),
    // bottom: Size.getHeight() * 0.3,
    borderRadius: 24,
  },
  line: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: '#DEE1E6',
    marginTop: 20,
  },
  header: {
    fontFamily: fonts.MANROPE_600,
    fontSize: 20,
    color: '#171A1F',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    fontFamily: fonts.MANROPE_400,
    fontSize: 16,
    color: '#171A1F',
    marginLeft: 5,
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#9095A0',
    paddingVertical: 13,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 20,
  },
  text: {
    fontFamily: fonts.MANROPE_400,
    fontSize: 16,
    color: '#171A1F',
    marginLeft: 20,
  },
  countryList: {
    paddingVertical: 12,
    paddingHorizontal: Size.calcHeight(24),
  },
});
