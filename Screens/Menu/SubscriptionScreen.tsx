import {StyleSheet} from 'react-native';
import React, { useEffect, useState} from 'react';
import {AppHeader, AppScreen, AppView} from '@/components';
import SubscriptionStage from './components/SubscriptionStage';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {SubscriptionRouteProps} from '@/types/typings';
import {ISubscription} from '@/types/api/subscription.types';
import Orientation from 'react-native-orientation-locker';

const SubscriptionScreen = () => {
  const route = useRoute<SubscriptionRouteProps>();
  const {goBack} = useNavigation();
  const [stage, setStage] = useState<string>(route.params.stage ?? 'plan');
  const tab: string = route.params.tab;
  const currency: string = route.params.currency;
  const amount:string = route.params.amount ?? ''
  const [plans, setPlans] = useState<ISubscription[]>([]);
  const isFocused = useIsFocused();

 useEffect(() => {
    Orientation.lockToPortrait();
  }, [isFocused]);

  return (
    <AppScreen containerStyle={{paddingTop: 10}}>
        <>
          {(stage !== 'plan') && (
            <AppHeader
              handleFunc={() =>
                (stage === 'plan' || tab.includes('watch'))
                  ? goBack()
                  : setStage(
                      stage === 'paymentSummary'
                        ? 'plan'
                        : stage === 'payStack'
                        ? 'paymentSummary'
                        : '',
                    )
              }
            />
  )}
          <SubscriptionStage
            stage={stage}
            setStage={setStage}
            tab={tab}
            currency={currency}
            plans={plans}
            amount={amount}
          />
        </> 
    </AppScreen>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({});
