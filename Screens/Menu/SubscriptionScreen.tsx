import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {AppHeader, AppScreen, AppView} from '@/components';
import SubscriptionStage from './components/SubscriptionStage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SubscriptionRouteProps} from '@/types/typings';
import Orientation from 'react-native-orientation-locker';
import {getSubscription} from '@/api/subscription.api';
import {ISubscription} from '@/types/api/subscription.types';

const SubscriptionScreen = () => {
  const {goBack} = useNavigation();
  const [stage, setStage] = useState<string>('plan');
  const route = useRoute<SubscriptionRouteProps>();
  const tab: string = route.params.tab;
  const [orientation, setOrientation] = useState<string | null>(null);
  const [plans, setPlans] = useState<ISubscription[]>([]);

  async function handlePlanList() {
    try {
      const res = await getSubscription();
      if (res.ok && res.data) {
        setPlans(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useLayoutEffect(() => {
    handlePlanList();
  }, []);

  useEffect(() => {
    Orientation.getOrientation(orientation => {
      console.log('Current UI Orientation: ', orientation);
      setOrientation(orientation);
      // dispatch(set(orientation))
    });
  }, []);

  function handleBackBtn() {}

  return (
    <AppScreen containerStyle={{paddingTop: 10}}>
      {orientation === 'PORTRAIT' ? (
        <>
          {tab !== 'topup' && tab !== 'donate' && (
            <AppHeader
              handleFunc={() =>
                stage === 'plan'
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
            plans={plans}
          />
        </>
      ) : (
        <AppView className="w-full h-full bg-black" />
      )}
    </AppScreen>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({});
