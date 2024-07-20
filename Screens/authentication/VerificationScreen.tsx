import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
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
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  SignUpScreenProps,
  VerificationScreenProps,
  VerifyRouteProps,
} from '@/types/typings';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import routes from '@/navigation/routes';
import AppModal from '@/components/AppModal';
import VerificationModal from './components/VerificationModal';
import {storeData} from '@/Utils/useAsyncStorage';
import {hasUserDetails} from '../Splashscreen/Splashscreen';
import {
  resendToken,
  resendVerificationToken,
  verifyAccount,
} from '@/api/auth.api';
import {getProfileDetails} from '@/api/profile.api';
import {useAppDispatch} from '@/Hooks/reduxHook';
import {setCredentials} from '@/store/slices/userSlice';

const VerificationScreen = () => {
  const dispatch = useAppDispatch();
  const {replace} = useNavigation<VerificationScreenProps>();
  const route = useRoute<VerifyRouteProps>();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingToken, setLoadingToken] = useState(false);
  const [isVerifyModal, setIsVerifyModal] = useState(false);
  const [expiryTime, setExpiryTime] = useState(5 * 60);
  const [isExpired, setIsExpired] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const email = route.params.userDetails.email;
  const userDetails = route.params.userDetails;

  async function handleResendOtp() {
    try {
      setLoadingToken(true);
      const res = await resendVerificationToken({email, token: otp});
      if (res.ok && res.data) {
        setIsSent(true);
        setTimeout(setIsSent, 2000, false);
        setExpiryTime(5 * 60);
        setIsExpired(false);
      } else {
        setErrorMsg(res.data?.message!);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingToken(false);
    }
  }

  async function handleVerification() {
    try {
      if (otp.length === 6) {
        setLoading(true);
        const res = await verifyAccount({
          email: userDetails.email,
          token: otp,
        });

        console.log(res);

        if (res.ok && res.data) {
          await storeData('AUTH_TOKEN', res.data.data.token);
          const profileRes = await getProfileDetails(res.data.data.token);
          console.log(profileRes);
          if (profileRes.ok && profileRes.data) {
            await storeData(
              hasUserDetails,
              JSON.stringify(profileRes.data.data),
            );
            dispatch(setCredentials(profileRes.data.data));
            setIsVerifyModal(true);
            setTimeout(() => {
              setIsVerifyModal(false);
              replace(routes.SET_PIN);
            }, 4000);
          }
        } else {
          setError(true);
          res.data && setErrorMsg(res.data.message.split(':')[1]);
          setTimeout(() => {
            setError(false);
          }, 3000);
        }
      } else {
        setError(true);
        setErrorMsg('Invalid PIN Please try again');
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      setError(true);
      setErrorMsg('Opps! Something went wrong');
      setTimeout(() => {
        setError(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (expiryTime === 0) {
      setIsExpired(true);
    }
  }, [expiryTime]);

  return (
    <AppScreen containerStyle={{paddingTop: 15}}>
      <AppHeader />
      <StatusBar hidden />

      <AppModal
        isModalVisible={isVerifyModal}
        hideLoge
        hideCloseBtn
        replaceDefaultContent={<VerificationModal />}
        handleClose={() => setIsVerifyModal(false)}
      />

      <View style={{height: '85%'}}>
        <AppText className="text-2xl text-white font-LEXEND_700 mt-12 mb-2">
          Verify Email
        </AppText>
        <AppText className="text-base text-white font-MANROPE_400">
          Code sent to {email}
        </AppText>

        <AppView className="mt-8 items-center">
          <OTPInput pinCount={6} handleCode={code => setOtp(code)} space />
          {error && (
            <AppText className="max-w-[120px] text-red text-[16px] text-center font-MANROPE_500 mt-3">
              {errorMsg}
            </AppText>
          )}
        </AppView>

        <AppText className="text-base text-white font-MANROPE_400 mt-10">
          Code is expired in {Math.floor(expiryTime / 60)}:
          {expiryTime % 60 < 10 ? '0' : ''}
          {expiryTime % 60}s
        </AppText>
        {loadingToken ? (
          <ActivityIndicator size={18} color={colors.WHITE} />
        ) : (
          <TouchableOpacity
            onPress={() => (isSent ? console.log('first') : handleResendOtp())}
            disabled={!isExpired || isSent}
            className="mt-5">
            <AppText className="text-base text-yellow-300 font-MANROPE_400">
              {isSent ? 'Sent' : 'Resend'}
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      <AppView className="w-full items-center">
        <AppButton
          isLoading={loading}
          bgColor={colors.RED}
          title="Verify"
          onPress={() => handleVerification()}
          style={{borderRadius: 8, width: Size.getWidth() * 0.85}}
        />
      </AppView>
    </AppScreen>
  );
};

export default VerificationScreen;
