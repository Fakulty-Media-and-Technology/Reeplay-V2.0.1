import {ViewStyle} from 'react-native';
import React from 'react';
import {AppText, AppView, TouchableOpacity} from '@/components';

export interface headerProps {
  title: string;
  onPress?: () => void;
  btnText?: string;
  headerStyle?: ViewStyle;
}

const SectionHeader = ({title, onPress, btnText, headerStyle}: headerProps) => {
  return (
    <AppView
      style={headerStyle}
      className="flex-row items-center justify-between">
      <AppText className="text-base text-white font-MANROPE_700">
        {title}
      </AppText>
      <TouchableOpacity onPress={onPress}>
        <AppText className="text-xs text-red font-MANROPE_400">
          {btnText}
        </AppText>
      </TouchableOpacity>
    </AppView>
  );
};

export default SectionHeader;
