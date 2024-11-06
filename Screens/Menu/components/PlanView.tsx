import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppButton, AppText, AppView} from '@/components';
import colors from '@/configs/colors';
import {SubscriptionNavProps} from '@/types/typings';
import {useNavigation} from '@react-navigation/native';
import routes from '@/navigation/routes';
import {getSubscription} from '@/api/subscription.api';
import {ISubscription} from '@/types/api/subscription.types';
import {formatAmount} from '@/Utils/formatAmount';
import Animated, {FadeIn, FadeInDown} from 'react-native-reanimated';

interface Props {
  setStage: React.Dispatch<React.SetStateAction<string>>;
  plans?: ISubscription[];
  setSelectedPlan: React.Dispatch<React.SetStateAction<ISubscription | null>>;
}

const AnimatedView = Animated.createAnimatedComponent(AppView);
const AnimatedText = Animated.createAnimatedComponent(AppText);

const PlanView = ({setStage, plans, setSelectedPlan}: Props) => {
  const {navigate, goBack} = useNavigation<SubscriptionNavProps>();
  const [activeId, setActiveId] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);

  const handlePress = (plan: ISubscription) => {
    setActiveId(plan._id);
    setSelectedPlan(plan);
  };

  return (
    <AppView className="mt-10">
      <AnimatedText
        entering={FadeIn.duration(1000)}
        style={{alignSelf: 'center'}}
        className="max-w-[80%] font-LEXEND_500 text-white text-[20px] text-center">
        Our monthly plan equals $1 only, converted to your local currency
      </AnimatedText>

      <AppView className="mt-14 space-y-5">
        {plans &&
          plans.map((plan, i) => {
            const showRed = plan._id === activeId;
            return (
              <AnimatedView
                onLayout={() => setShow(true)}
                entering={FadeInDown.delay(1 * 200).springify()}
                key={plan._id}
                style={{backgroundColor: showRed ? '#E2D6FF' : 'white'}}
                className="rounded-md px-4 py-5 flex-row items-center">
                <Pressable
                  onPress={() => handlePress(plan)}
                  style={{
                    borderColor: showRed ? colors.RED : '#565D6D',
                    borderWidth: 1,
                    borderRadius: 99,
                    width: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {showRed && (
                    <AppView className="w-[9px] h-[9px] bg-red rounded-full" />
                  )}
                </Pressable>

                <AppView className="ml-5">
                  <AppText className="font-LEXEND_600 text-base text-black mb-1">
                    ₦{formatAmount(plan.price.toString())} /{' '}
                    {plan.months_duration}{' '}
                    {plan.months_duration > 1 ? 'months' : 'month'}
                  </AppText>
                  <AppText className="font-MANROPE_400 text-xs text-black">
                    {plan.details}
                  </AppText>
                </AppView>

                {/* TODO:: FOR POPULAR TAG */}
                {/* {plan._id === 3 && (
                <AppView className="ml-auto mb-auto py-1 px-2 rounded-[24px] bg-yellow ">
                  <AppText className="font-MANROPE_400 text-xs text-[#5E4C00]">
                    Popular
                  </AppText>
                </AppView>
              )} */}
              </AnimatedView>
            );
          })}
      </AppView>

      {show && (
        <AppView className="mt-11">
          <AnimatedView
            entering={FadeInDown.delay(400).springify()}
            className="w-full">
            <AppButton
              bgColor={colors.RED}
              title="Continue"
              onPress={() => setStage('paymentSummary')}
              style={{width: '100%', borderRadius: 6}}
            />
          </AnimatedView>
          <AnimatedView
            entering={FadeInDown.delay(600).springify()}
            className="w-full">
            <AppButton
              bgColor="transparent"
              title="Cancel anytime"
              onPress={() => goBack()}
              style={{width: '100%', marginTop: 5}}
              labelStyle={{color: '#9095A1'}}
            />
          </AnimatedView>
        </AppView>
      )}
    </AppView>
  );
};

export default PlanView;
