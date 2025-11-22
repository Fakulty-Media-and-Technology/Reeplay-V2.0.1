import React, {useState} from 'react';
import {AppHeader, AppScreen, AppText, AppView, OTPInput} from '@/components';
import {useNavigation} from '@react-navigation/native';
import routes from '@/navigation/routes';
import { AuthParamsNavigator } from '@/navigation/AuthNavigation';

const CreatePIN = () => {
  const {navigate, replace} = useNavigation<AuthParamsNavigator>();
  // const {replace} = useNavigation<AuthMainNavigation>();

  const [pin1, setPin1] = useState<string>('');

  const handlePin = (pin: string) => {
    setPin1(pin);
    console.log(pin);
    if (pin.length === 4) {
      navigate(routes.SET_NEW_PIN, {pin: pin});
    }
  };

  return (
    <AppScreen containerStyle={{paddingTop: 10}}>
      <AppHeader handleFunc={() => replace(routes.LOGIN_SCREEN)} />

      <AppText className="text-2xl text-white font-LEXEND_700 mt-12">
        Create your new
      </AppText>
      <AppText className="text-2xl text-white font-LEXEND_700 mb-2">
        App pin
      </AppText>

      <AppView className="mt-8">
        <OTPInput pinCount={4} handleCode={code => handlePin(code)} />
      </AppView>
    </AppScreen>
  );
};

export default CreatePIN;
