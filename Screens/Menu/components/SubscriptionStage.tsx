import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import PlanView from './PlanView';
import PaymentSummaryView from './PaymentSummaryView';
import PayStackView from './PayStackView';
import TopUp from './TopUp';
import {ISubscription} from '@/types/api/subscription.types';

interface Props {
  stage: string;
  setStage: React.Dispatch<React.SetStateAction<string>>;
  tab: string;
  currency: string;
  plans: ISubscription[];
  amount: string
}

const SubscriptionStage = ({stage, setStage, plans, amount, tab, currency}: Props) => {
  const [backScreen, setGoBack] = useState<string>('');
  const [topUpAmount, setTopUpAmount] = useState<string>(amount);
  const [saveCard, setSaveCard] = useState<boolean>(false);
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
          setGoBack={setGoBack}
          currency={currency}
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
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        topUpAmount={topUpAmount}
        selectedPaymentMethod={selectedPaymentMethod}
        currency={currency}
        tab={tab}
        saveCard={saveCard}
        setSaveCard={setSaveCard}
        />
      );

    case 'payStack':
      return (
        <PayStackView
          tab={tab}
          setStage={setStage}
          topUpAmount={topUpAmount}
          selectedPaymentMethod={selectedPaymentMethod}
          currency={currency}
          saveCard={saveCard}
        />
      );
  }
};

export default SubscriptionStage;

const styles = StyleSheet.create({});
