import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import Size from '@/Utils/useResponsiveSize';
import colors from '@/configs/colors';
import fonts from '@/configs/fonts';

interface ButtonProps {
  title?: string;
  labelStyle?: TextStyle;
  style?: ViewStyle;
  onPress: () => void;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  bgColor: string;
  isLoading?: boolean;
  isDisable?: boolean;
  replaceDefaultContent?: JSX.Element;
  labelWeight?: any;
}

const Button = ({
  title,
  labelStyle,
  style,
  onPress,
  iconLeft,
  iconRight,
  bgColor,
  isLoading,
  isDisable,
  replaceDefaultContent,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.butnContainer,
        {
          backgroundColor:
            isLoading || isDisable ? colors.TRENDING_GRAY : bgColor,
        },
        style,
      ]}
      disabled={isDisable}
      activeOpacity={0.7}
      onPress={onPress}>
      {isLoading && (
        <ActivityIndicator
          size={'small'}
          color={colors.WHITE}
          style={{marginRight: 8}}
        />
      )}

      {replaceDefaultContent && replaceDefaultContent}
      {iconRight}
      {title && <Text style={[styles.label, labelStyle]}>{title}</Text>}
      {iconLeft}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  butnContainer: {
    paddingVertical: Size.calcHeight(17),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: Size.getWidth() * 0.75,
    position: 'relative',
  },
  label: {
    fontSize: Size.calcWidth(18),
    color: colors.WHITE,
    fontFamily: fonts.MANROPE_400,
    textAlign: 'center',
    marginBottom: 2,
  },
});
