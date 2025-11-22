import {View, Text} from 'react-native';
import React from 'react';
import {AppHeader, AppScreen, AppText, AppView, OTPInput} from '@/components';

interface Props {
  setStep: React.Dispatch<React.SetStateAction<string>>;
  setPin: React.Dispatch<React.SetStateAction<string>>;
}

const SetChangePin = ({setStep, setPin}: Props) => {
  const handlePin = async (value: string) => {
    if (value.length === 4) {
      setPin(value);
      setStep('second');
    }
  };

  return (
    <AppScreen containerStyle={{paddingTop: 20, position: 'relative'}}>
      <AppHeader />

      <AppView className="mt-56">
        <OTPInput pinCount={4} handleCode={code => handlePin(code)} />

        <AppText
          style={{alignSelf: 'center'}}
          className="font-MANROPE_400 text-base text-white mt-3">
          Enter new pin to continue
        </AppText>
      </AppView>
    </AppScreen>
  );
};

export default SetChangePin;
