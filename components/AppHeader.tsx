import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {AppText, AppView} from '@/components';
import {ArrowLeft} from '@/assets/icons';
import {useNavigation} from '@react-navigation/native';

interface Props {
  style?: ViewStyle;
  label?: string;
  labelStyle?: TextStyle;
  hideback?: boolean;
  handleFunc?: () => void;
}

const AppHeader = ({style, hideback, handleFunc, label, labelStyle}: Props) => {
  const {goBack} = useNavigation();
  return (
    <AppView
      style={[style]}
      className="flex-row items-center justify-center w-full relative">
      {!hideback && (
        <Pressable
          onPress={() => (handleFunc ? handleFunc() : goBack())}
          style={{position: 'absolute', left: 0}}>
          <ArrowLeft />
        </Pressable>
      )}
      <AppText
        style={labelStyle}
        className="text-lg text-white font-LEXEND_700 font-bold">
        {label}
      </AppText>
    </AppView>
  );
};

export default AppHeader;

const styles = StyleSheet.create({});
