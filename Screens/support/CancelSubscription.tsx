import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {AppButton, AppHeader, AppScreen, AppText, AppView} from '@/components';
import colors from '@/configs/colors';

const CancelSubscription = () => {
  return (
    <AppScreen
      containerStyle={{
        paddingTop: 10,
        position: 'relative',
      }}>
      <AppView className="mt-2">
        <AppHeader />
      </AppView>
      <AppText
        style={{alignSelf: 'center'}}
        className="absolute top-0 font-LEXEND_600 text-[20px] text-white">
        Cancel Subscription
      </AppText>

      <ScrollView style={{marginTop: 34}}>
        <AppText className="font-LEXEND_400 text-xl text-white mb-5">
          Cancel or change your subscription.
        </AppText>

        <AppText className="font-MANROPE_400 text-base text-white">
          If you cancel your active subscription it will take effect at the end
          of your current billing.
        </AppText>
        <AppText className="font-MANROPE_400 text-base text-white mt-8">
          This means you can continue watching till end of current billing
          circle and if you have a payment method attached to your account you
          won't be auto billed anymore.
        </AppText>
        <AppText className="font-MANROPE_400 text-base text-white mt-8">
          Meanwhile you can use the change button to change your subscription
          plan.
        </AppText>
      </ScrollView>

      <AppView className="absolute bottom-3 w-full">
        <AppButton
          title="Cancel Subscription"
          bgColor={colors.RED}
          onPress={() => console.log('cancel subscription')}
          style={{width: '100%', borderRadius: 8, marginBottom: 15}}
        />
        <AppButton
          title="Change"
          bgColor={colors.GREY_600}
          onPress={() => console.log('change subscription')}
          style={{width: '100%', borderRadius: 8}}
        />
      </AppView>
    </AppScreen>
  );
};

export default CancelSubscription;
