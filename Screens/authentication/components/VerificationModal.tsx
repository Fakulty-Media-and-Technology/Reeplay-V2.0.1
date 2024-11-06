import {View, Text, StyleSheet, TextStyle} from 'react-native';
import React from 'react';
import colors from '@/configs/colors';
import {CheckCircle} from '@/assets/icons';
import {MotiView} from 'moti';
import {Easing} from 'react-native-reanimated';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import {AppView} from '@/components';
import {formatAmount} from '@/Utils/formatAmount';

interface Props {
  reset?: boolean;
  message?: string;
  messageStyle?: TextStyle;
  isPayment?: boolean;
  tab?: string;
  amount?: number;
}

const VerificationModal = ({
  reset,
  message,
  isPayment,
  messageStyle,
  tab,
  amount,
}: Props) => {
  return (
    <View
      style={{
        marginTop: isPayment ? Size.calcHeight(70) : Size.calcHeight(70),
        marginBottom: isPayment ? Size.calcHeight(30) : Size.calcHeight(70),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={styles.animatedContainer}>
        {[...Array(3).keys()].map(index => {
          return (
            <MotiView
              key={index}
              from={{opacity: 0.5, scale: 1}}
              animate={{opacity: 0, scale: 2}}
              transition={{
                type: 'timing',
                duration: 2000,
                easing: Easing.out(Easing.ease),
                delay: index * 300,
                repeatReverse: false,
                loop: true,
              }}
              style={styles.animatedCircle}
            />
          );
        })}

        <View style={styles.circleContainer}>
          <CheckCircle />
        </View>
      </View>

      {isPayment && (
        <View>
          <Text style={styles.paymentText}>
            ₦{formatAmount(amount ? amount.toString() : '')}
          </Text>
          <Text style={styles.paymentText_SM}>
            {tab === 'topup'
              ? 'Top up successful'
              : tab === 'donate'
              ? 'Donation successful'
              : tab === 'vote'
              ? 'Vote is successful'
              : '6 Month subscription is successful'}
          </Text>
        </View>
      )}

      {message && <Text style={[styles.text, messageStyle]}>{message}</Text>}
      {!message && !isPayment && (
        <>
          <Text style={styles.text}>
            {reset ? 'Password reset link' : 'Verification'}
          </Text>
          <Text style={styles.text}>
            {reset ? 'was sent to your email' : 'Successfull'}
          </Text>
        </>
      )}
    </View>
  );
};

export default VerificationModal;

const styles = StyleSheet.create({
  circleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 10,
    width: 43,
    height: 43,
    borderRadius: 99,
    backgroundColor: colors.WHITE,
  },
  animatedCircle: {
    position: 'absolute',
    width: 43,
    height: 43,
    borderRadius: 99,
    backgroundColor: colors.RED,
  },
  animatedContainer: {
    position: 'relative',
    width: 43,
    height: 43,
    borderRadius: 99,
    marginBottom: Size.calcHeight(40),
  },
  text: {
    color: colors.BLACKER,
    fontFamily: fonts.MANROPE_700,
    fontSize: Size.calcHeight(18),
    textAlign: 'center',
  },
  paymentText: {
    fontFamily: fonts.MANROPE_600,
    textAlign: 'center',
    fontSize: 40,
    color: 'black',
  },
  paymentText_SM: {
    fontFamily: fonts.MANROPE_700,
    textAlign: 'center',
    fontSize: 20,
    color: colors.DARK_GREY,
    maxWidth: 220,
    lineHeight: 22,
    marginTop: 8,
  },
});
