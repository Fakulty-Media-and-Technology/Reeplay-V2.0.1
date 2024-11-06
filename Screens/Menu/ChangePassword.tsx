import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  AppButton,
  AppHeader,
  AppScreen,
  AppText,
  AppView,
  OTPInput,
  TouchableOpacity,
} from '@/components';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import ComfirmPin from './ComfirmPin';
import {useAppSelector} from '@/Hooks/reduxHook';
import {selectUser} from '@/store/slices/userSlice';
import {resendToken, resetPassword} from '@/api/auth.api';
import {handleValidation} from '@/Utils/validatePassword';
import AppModal from '@/components/AppModal';
import VerificationModal from '../authentication/components/VerificationModal';
import {useNavigation} from '@react-navigation/native';

const ChangePassword = () => {
  const {goBack} = useNavigation();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [isVerifyModal, setIsVerifyModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [msg, setMsg] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [step, setStep] = useState<string>('confirm');
  const [expiryTime, setExpiryTime] = useState(5 * 60);
  const [isExpired, setIsExpired] = useState(false);
  const [startTiimer, setStartTiimer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rloading, setRLoading] = useState<boolean>(false);
  const {email} = useAppSelector(selectUser);

  function handleContinue() {
    if (password === '') {
      setError(true);
      setErrorMessage('Invalid Credentials');
      setTimeout(() => {
        setError(false);
      }, 2000);
    } else if (password !== confirmPassword) {
      setError(true);
      setErrorMessage('Passwords do not match');
      setTimeout(() => {
        setError(false);
      }, 2000);
    } else {
      const check = handleValidation(password, confirmPassword);
      setError(true);
      setErrorMessage(check);
      setTimeout(() => {
        setError(false);
      }, 3000);

      if (check.length > 0) return;

      setStep('setPassword');
      setStartTiimer(true);
      handleRest();
    }
  }

  async function handleSetPassword() {
    try {
      setLoading(true);
      const res = await resetPassword({
        password,
        cpassword: confirmPassword,
        email,
        pin: otp,
      });
      if (res.ok && res.data) {
        setIsVerifyModal(true);
        setMsg(res.data.message.split(':')[1]);
        setTimeout(() => {
          goBack();
          setPassword('');
          setConfirmPassword('');
          setIsVerifyModal(false);
        }, 3000);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  async function handleRest() {
    //Auth endpoint
    setRLoading(true);
    const res = await resendToken({email});
    console.log(res);
    if (res.ok) {
      setRLoading(false);
    }
  }

  useEffect(() => {
    if (!startTiimer) return;
    const timer = setInterval(() => {
      setExpiryTime(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTiimer]);

  useEffect(() => {
    if (expiryTime === 0) {
      setIsExpired(true);
    }
  }, [expiryTime]);

  switch (step) {
    case 'confirm':
      return <ComfirmPin setStep={setStep} />;

    case 'setPassword':
      return (
        <AppScreen containerStyle={{paddingTop: 10, position: 'relative'}}>
          <AppHeader />

          <AppModal
            isModalVisible={isVerifyModal}
            hideLoge
            hideCloseBtn
            replaceDefaultContent={<VerificationModal message={msg} />}
            handleClose={() => setIsVerifyModal(false)}
          />

          <AppText className="max-w-[250px] font-LEXEND_700 text-white text-2xl mt-12 mb-[2px]">
            Code sent to
          </AppText>
          <AppText className="text-base text-white font-MANROPE_400">
            {email}
          </AppText>

          {error && (
            <AppText className=" text-red text-[16px] font-MANROPE_500 mt-3">
              {errorMessage}
            </AppText>
          )}
          <View>
            <AppView className="mt-8 items-center">
              <OTPInput pinCount={6} handleCode={code => setOtp(code)} space />
            </AppView>

            <AppText className="text-base text-white font-MANROPE_400 mt-10">
              Code is expired in {Math.floor(expiryTime / 60)}:
              {expiryTime % 60 < 10 ? '0' : ''}
              {expiryTime % 60}s
            </AppText>
            {isExpired && (
              <>
                {rloading ? (
                  <ActivityIndicator size={18} color={colors.YELLOW_500} />
                ) : (
                  <TouchableOpacity onPress={handleRest} className="mt-5">
                    <AppText className="text-base text-yellow font-MANROPE_400">
                      Resend
                    </AppText>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          <AppView className="absolute bottom-6 w-full">
            <AppButton
              isLoading={loading}
              isDisable={otp.length < 6}
              bgColor={colors.RED}
              title="Continue"
              onPress={handleSetPassword}
              style={{borderRadius: 10, width: '100%'}}
            />
          </AppView>
        </AppScreen>
      );

    case 'main':
      return (
        <AppScreen containerStyle={{paddingTop: 10, position: 'relative'}}>
          <AppHeader />

          <AppText className="max-w-[250px] font-LEXEND_700 text-white text-2xl mt-12 mb-[68px]">
            Change your new password
          </AppText>

          {error && (
            <AppText className=" text-red text-[16px] font-MANROPE_500 mt-3">
              {errorMessage}
            </AppText>
          )}
          <AppView className="mt-2 space-y-7">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="New Password"
              placeholderTextColor="#474748"
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor="#474748"
              secureTextEntry
              style={styles.input}
            />
          </AppView>

          <AppView className="absolute bottom-6 w-full">
            <AppButton
              bgColor={colors.RED}
              title="Continue"
              onPress={handleContinue}
              style={{borderRadius: 10, width: '100%'}}
            />
          </AppView>
        </AppScreen>
      );
  }
};

export default ChangePassword;

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: Size.calcHeight(18),
    paddingVertical: Size.calcHeight(15),
    fontFamily: fonts.MANROPE_500,
    fontSize: 16,
    color: '#474748',
  },
});
