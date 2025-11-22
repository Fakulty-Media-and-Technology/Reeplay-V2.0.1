import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppHeader, AppScreen} from '@/components';
import colors from '@/configs/colors';
import fonts from '@/configs/fonts';
import Size from '@/Utils/useResponsiveSize';

const PrivacyScreen = ({handleFunc}:{handleFunc?:() => void}) => {
  return (
    <AppScreen scrollable scrollContentStyle={{paddingBottom:Size.hp(5)}} style={{paddingTop: Platform.OS === 'android' ? 18 : 0}}>
      <StatusBar hidden={false} barStyle="light-content" />
      <AppHeader label="Privacy Policy" style={{marginBottom: 14}} handleFunc={handleFunc} />
      <Text style={styles.header}>Last updated: April 24, 2025</Text>
      <Text style={styles.body}>
        {' '}
       This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
      </Text>

        <Text style={styles.header}>Interpretation and Definitions</Text>
            <Text style={styles.body} className='-mt-1'>
Interpretation{'\n'}
The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </Text>
        <Text style={styles.header}>For the purposes of this Privacy Policy:</Text>

                    <Text style={styles.body}>
                      Account means a unique account created for You to access our Service or parts of our Service.
                    </Text>

                    <Text style={styles.body}>
Affiliate means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
                    </Text>

                    <Text style={styles.body}>
Application refers to Reeplay, the software program provided by the Company.
Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Fakulty Media and Technology, Cordial close, Ajah, Lagos.                    </Text>

                    <Text style={styles.body}>
Country refers to: Nigeria
                    </Text>

                    <Text style={styles.body}>
Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.                    </Text>

                    <Text style={styles.body}>
                      Personal Data is any information that relates to an identified or identifiable individual.
                    </Text>
                    <Text style={styles.body}>
Service refers to the Application.
                    </Text>
    </AppScreen>
  );
};

export default PrivacyScreen;

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
