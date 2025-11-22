import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppHeader, AppScreen, AppText, AppView, OTPInput} from '@/components';
import {getData} from '@/Utils/useAsyncStorage';
import {HAS_SET_NEWPIN} from '../authentication/GetStartedScreen';
import { resendToken } from '@/api/auth.api';
import { useAppSelector } from '@/Hooks/reduxHook';
import { selectUser } from '@/store/slices/userSlice';

interface Props {
  setStep: React.Dispatch<React.SetStateAction<string>>;
  isPasswordReset?:boolean
}

const ComfirmPin = ({setStep, isPasswordReset}: Props) => {
  const [appPin, setAppPin] = useState('');
  const [error, setError] = useState<boolean>(false);
  const email = useAppSelector(selectUser).email

  const handlePin = async (value: string) => {
    if (value.length === 4) {
      if (value === appPin) {
        if(isPasswordReset){
         const res = await resendToken({email});
         console.log(res.data)
        }
        setStep('main');
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      }
    }
  };

  async function getPinState() {
    const hasPin = await getData(HAS_SET_NEWPIN);
    if (hasPin) {
      setAppPin(hasPin);
    }
  }

  useEffect(() => {
    getPinState();
  }, []);

  return (
    <AppScreen containerStyle={{paddingTop: 20, position: 'relative'}}>
      <AppHeader />

      <AppView className="mt-56">
        <OTPInput pinCount={4} handleCode={code => handlePin(code)} />

        {error ? (
          <AppText
            style={{alignSelf: 'center'}}
            className="max-w-[120px] text-red text-[16px] text-center font-MANROPE_500 mt-3">
            Incorrect PIN. Please try again
          </AppText>
        ) : (
          <AppText
            style={{alignSelf: 'center'}}
            className="font-MANROPE_400 text-base text-white mt-3">
            Enter pin to continue
          </AppText>
        )}
      </AppView>
    </AppScreen>
  );
};

export default ComfirmPin;
