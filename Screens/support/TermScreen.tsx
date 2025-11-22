import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppHeader, AppScreen} from '@/components';
import colors from '@/configs/colors';
import fonts from '@/configs/fonts';
import Size from '@/Utils/useResponsiveSize';

const TermScreen = ({handleFunc}:{handleFunc?:() => void}) => {
  return (
    <AppScreen scrollable scrollContentStyle={{paddingBottom:Size.hp(10)}} style={{paddingTop: Platform.OS === 'android' ? 18 : 0}}>
      <StatusBar hidden={false} barStyle="light-content" />
      <AppHeader label="Reeplay Terms and Conditions" style={{marginBottom: 14,}} handleFunc={handleFunc} />
      <Text style={styles.body}>
        Welcome to Reeplay! By accessing or using our app, website, or services, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully before using Reeplay.
      </Text>
      <Text style={styles.header}>1. Acceptance of Terms</Text>
      <Text style={styles.body} className='-mt-1'>
        By registering, accessing, or using Reeplay, you confirm that you are at least 18 years old or have parental/guardian consent. Continued use of the app indicates your acceptance of these Terms.
      </Text>
      <Text style={styles.header}>2. Services Provided</Text>
      <Text style={styles.body} className='-mt-1'>
Reeplay offers live streaming, video-on-demand, pay-per-view content, and related services. We may modify, suspend, or discontinue parts of the platform at our discretion without prior notice.      </Text>
      <Text style={styles.header}>3. User Account</Text>
      <Text style={styles.body} className='-mt-1'>
You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. Reeplay reserves the right to suspend or terminate accounts for misuse or violation of these Terms.      </Text>
 <Text style={styles.header}>4. Payments and Transactions</Text>
      <Text style={styles.body} className='-mt-1'>
Reeplay operates on a pay-per-view and ad-supported model. All payments are processed securely through third-party providers. Fees are non-refundable except where required by law. Users agree to cover any applicable taxes or charges.      </Text>
 <Text style={styles.header}>5. Content Rights and Restrictions</Text>
      <Text style={styles.body} className='-mt-1'>
All content on Reeplay is protected by copyright and intellectual property laws. Users may not copy, distribute, or exploit content without authorization. Creators retain rights to their works but grant Reeplay limited rights to host, stream, and promote content on the platform.
      </Text>
 <Text style={styles.header}>6. Prohibited Use</Text>
      <Text style={styles.body} className='-mt-1'>
You agree not to misuse Reeplay, including but not limited to: attempting unauthorized access, distributing harmful material, or violating applicable laws.      </Text>
 <Text style={styles.header}>7. Limitation of Liability</Text>
      <Text style={styles.body} className='-mt-1'>
Reeplay is provided “as is” without warranties of any kind. We are not liable for interruptions, errors, or losses arising from your use of the app, except as required by applicable law.      </Text>
 <Text style={styles.header}>8. Privacy</Text>
      <Text style={styles.body} className='-mt-1'>
Your data is handled in accordance with our Privacy Policy. By using Reeplay, you consent to such collection and processing.      </Text>
 <Text style={styles.header}>9. Governing Law</Text>
      <Text style={styles.body} className='-mt-1'>
These Terms are governed by the laws of Nigeria, United states and applicable international regulations.      </Text>
      <Text style={styles.body}>
By continuing to use Reeplay, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.      </Text>
    </AppScreen>
  );
};

export default TermScreen;

const styles = StyleSheet.create({
  header: {
    fontFamily: fonts.MANROPE_700,
    fontSize: Size.calcHeight(16),
    color: colors.WHITE,
    marginVertical: Size.calcHeight(12),
  },
  body: {
    fontFamily: fonts.MANROPE_400,
    fontSize: Size.calcHeight(16),
    color: colors.WHITE,
    marginVertical: Size.calcHeight(18),
    lineHeight: Size.calcHeight(24),
  },
});
