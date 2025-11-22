import colors from '@/configs/colors';
import fonts from '@/configs/fonts';
import React, {useRef, useState, useEffect} from 'react';
import {Platform, StyleProp, TextStyle} from 'react-native';
import {TextInput, View, StyleSheet} from 'react-native';

interface OTPInputProps {
  pinCount: number;
  handleCode: (code: string) => void;
  style?: StyleProp<TextStyle>;
  space?: boolean;
}

const OTPInput = ({pinCount, handleCode, style, space}: OTPInputProps) => {
  const [code, setCode] = useState<string[]>(Array(pinCount).fill(''));
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleTextChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;

    console.log(newCode[index]);

    setCode(newCode);

    if (text.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (newCode.every(value => value.length === 1)) {
      // Move the focus away from the last input field
      inputRefs.current[pinCount - 1]?.blur();
    }
  };

  useEffect(() => {
    handleCode(code.join(''));
  }, [code]);

  const getInputStyle = (index: number) => {
    return code[index] ? styles.inputFilled : styles.inputEmpty;
  };

  const getSpaceStyle = (index: number) => {
    return index === 3 ? {marginLeft: 20} : {};
  };

  return (
    <View style={styles.container}>
      {Array.from({length: pinCount}, (_, index) => (
        <TextInput
          key={index}
          ref={ref => (inputRefs.current[index] = ref as TextInput)}
          cursorColor={colors.WHITE}
          style={[
            styles.input,
            getInputStyle(index),
            space && getSpaceStyle(index),
            style,
          ]}
          maxLength={1}
          keyboardType="numeric"
          inputMode="numeric"
          onChangeText={text => handleTextChange(text, index)}
          value={code[index]}
          onKeyPress={({nativeEvent}) => {
            if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
              inputRefs.current[index - 1]?.focus();
            }
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    width: 39,
    height: 43,
    textAlign: 'center',
    margin: 5,
    fontSize: 16,
    fontFamily: fonts.MANROPE_400,
    borderRadius: 4,
    color: colors.WHITE,
  },
  inputEmpty: {
    borderColor: colors.WHITE,
  },
  inputFilled: {
    borderColor: colors.RED,
  },
});

export default OTPInput;
