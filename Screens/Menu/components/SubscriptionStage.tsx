import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import PlanView from './PlanView';
import PaymentSummaryView from './PaymentSummaryView';
import PayStackView from './FlutterwaveView';
import TopUp from './TopUp';
import {ISubscription} from '@/types/api/subscription.types';

interface Props {
  stage: string;
  setStage: React.Dispatch<React.SetStateAction<string>>;
  tab: string;
  plans: ISubscription[];
}

const SubscriptionStage = ({stage, setStage, plans, tab}: Props) => {
  const [topUpAmount, setTopUpAmount] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<ISubscription | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  switch (stage) {
    case 'plan':
      return tab === 'topup' || tab === 'donate' ? (
        <TopUp
          setStage={setStage}
          tab={tab}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          text={topUpAmount}
          setText={setTopUpAmount}
        />
      ) : (
        <PlanView
          setStage={setStage}
          plans={plans}
          setSelectedPlan={setSelectedPlan}
        />
      );

    case 'paymentSummary':
      return (
        <PaymentSummaryView
          setStage={setStage}
          selectedPlan={selectedPlan}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
        />
      );

    case 'payStack':
      return (
        <PayStackView
          tab={tab}
          setStage={setStage}
          selectedPlan={selectedPlan}
          topUpAmount={topUpAmount}
          setSelectedPlan={setSelectedPlan}
          selectedPaymentMethod={selectedPaymentMethod}
        />
      );
  }
};

export default SubscriptionStage;

const styles = StyleSheet.create({});
