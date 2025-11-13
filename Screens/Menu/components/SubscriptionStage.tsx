import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PlanView from './PlanView';
import PaymentSummaryView from './PaymentSummaryView';
import PayStackView from './PayStackView';
import TopUp from './TopUp';

interface Props {
  stage: string;
  setStage: React.Dispatch<React.SetStateAction<string>>;
  tab: string;
}

const SubscriptionStage = ({stage, setStage, tab}: Props) => {
  switch (stage) {
    case 'plan':
      return tab === 'topup' || tab === 'donate' ? (
        <TopUp setStage={setStage} tab={tab} />
      ) : (
        <PlanView setStage={setStage} />
      );

    case 'paymentSummary':
      return <PaymentSummaryView setStage={setStage} />;

    case 'payStack':
      return <PayStackView tab={tab} setStage={setStage} />;
  }
};

export default SubscriptionStage;

const styles = StyleSheet.create({});