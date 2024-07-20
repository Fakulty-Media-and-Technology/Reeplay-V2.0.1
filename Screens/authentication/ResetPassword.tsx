import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {
  AppButton,
  AppHeader,
  AppImage,
  AppText,
  AppView,
  OTPInput,
  TouchableOpacity,
} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import AuthFormComponent from './components/AuthFormComponent';
import colors from '@/configs/colors';
import {useNavigation} from '@react-navigation/native';
import {ResetPasswordScreenProps} from '@/types/typings';
import routes from '@/navigation/routes';
import AppModal from '@/components/AppModal';
import VerificationModal from './components/VerificationModal';
import LinearGradient from 'react-native-linear-gradient';
import {resendToken, resetPassword} from '@/api/auth.api';
import {ArrowLeft} from '@/assets/icons';
import fonts from '@/configs/fonts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const hasAtLeast8Characters = /^.{8,}$/;
const hasAtLeast1UppercaseLetter = /^(?=.*[A-Z]).+$/;
const hasAtLeast1LowercaseLetter = /^(?=.*[a-z]).+$/;
const hasAtLeast1Number = /^(?=.*\d).+$/;

const ResetPassword = () => {
  const {navigate} = useNavigation<ResetPasswordScreenProps>();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<string>('verify');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState<string>('');
  const [expiryTime, setExpiryTime] = useState(5 * 60);
  const [isExpired, setIsExpired] = useState(false);
  const [startTiimer, setStartTiimer] = useState<boolean>(false);

  function handleModal() {
    setIsShowModal(true);
    setTimeout(() => {
      setIsShowModal(false);
      setStep('verify');
      setStartTiimer(true);
    }, 5500);
  }

  async function handleRest() {
    //Auth endpoint
    const res = await resendToken({email});
    if (res.ok) {
      setLoading(false);
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
    case 'email':
      return (
        <View
          style={{
            position: 'relative',
            alignItems: 'center',
            height: Size.getHeight(),
          }}>
          <StatusBar hidden />

          <FastImage
            source={require('@/assets/images/Login-bg.png')}
            style={styles.imageContainer}
          />

          <LinearGradient
            colors={[
              'rgba(0,0,0,0.65)',
              'rgba(0,0,0,0.95)',
              'rgba(0,0,0,0.99)',
            ]}
            style={[styles.gradientStyles]}
          />

          <AppImage
            source={require('@/assets/images/authLogo.png')}
            style={{
              width: 300,
              height: 200,
              objectFit: 'contain',
              marginTop: 50,
            }}
          />

          <View
            style={{
              paddingHorizontal: Size.calcHeight(20),
              marginTop: 12,
              width: '100%',
            }}>
            <AuthFormComponent
              screen="reset"
              trigger={() => handleModal()}
              setEmail={setEmail}
            />
          </View>

          <AppView className="mt-auto mb-5 flex-row items-center">
            <AppText className="font-MANROPE_400 text-[#BCC1CA] text-base ">
              Return to{' '}
            </AppText>
            <AppButton
              title="Log in"
              bgColor="transparent"
              onPress={() => navigate(routes.LOGIN_SCREEN)}
              style={{width: 50, paddingHorizontal: 0}}
              labelStyle={{
                color: colors.RED,
                textDecorationStyle: 'solid',
                textDecorationLine: 'underline',
                textDecorationColor: colors.RED,
                fontSize: 16,
              }}
            />
          </AppView>

          <AppModal
            isModalVisible={isShowModal}
            hideLoge
            hideCloseBtn
            replaceDefaultContent={<VerificationModal reset />}
            handleClose={() => setIsShowModal(false)}
          />
        </View>
      );

    case 'verify':
      return (
        <VerifyEmail
          email={email}
          handleResendOtp={handleRest}
          otp={otp}
          setOtp={setOtp}
          setStep={setStep}
          expiryTime={expiryTime}
          isExpired={isExpired}
        />
      );

    case 'password':
      return <NewPasswords email={email} otp={otp} setStep={setStep} />;
  }
};

export default ResetPassword;

interface VerifyProps {
  email: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<string>>;
  otp: string;
  handleResendOtp: () => void;
  expiryTime: number;
  isExpired: boolean;
}

const VerifyEmail = ({
  email,
  setOtp,
  setStep,
  otp,
  handleResendOtp,
  isExpired,
  expiryTime,
}: VerifyProps) => {
  const {navigate} = useNavigation<ResetPasswordScreenProps>();
  const [isVerifyModal, setIsVerifyModal] = useState(false);

  return (
    <View
      style={{
        position: 'relative',
        paddingHorizontal: 24,
        height: Size.getHeight(),
      }}>
      <StatusBar hidden />

      <FastImage
        source={require('@/assets/images/Login-bg.png')}
        style={styles.imageContainer}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.95)', 'rgba(0,0,0,0.99)']}
        style={[styles.gradientStyles]}
      />

      <AppModal
        isModalVisible={isVerifyModal}
        hideLoge
        hideCloseBtn
        replaceDefaultContent={<VerificationModal />}
        handleClose={() => setIsVerifyModal(false)}
      />

      <View>
        <Pressable
          onPress={() => setStep('email')}
          style={{marginTop: Size.hp(10)}}>
          <ArrowLeft />
        </Pressable>
        <AppText className="text-2xl text-white font-LEXEND_700 mt-12 mb-2">
          Verify Email
        </AppText>
        <AppText className="text-base text-white font-MANROPE_400">
          Code sent to {email}
        </AppText>

        <AppView className="mt-8 items-center">
          <OTPInput pinCount={6} handleCode={code => setOtp(code)} space />
        </AppView>

        <AppText className="text-base text-white font-MANROPE_400 mt-10">
          Code is expired in {Math.floor(expiryTime / 60)}:
          {expiryTime % 60 < 10 ? '0' : ''}
          {expiryTime % 60}s
        </AppText>
        {isExpired && (
          <TouchableOpacity onPress={handleResendOtp} className="mt-5">
            <AppText className="text-base text-yellow font-MANROPE_400">
              Resend
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      <AppView className="w-full items-center mt-auto">
        <AppButton
          // isLoading={loading}
          isDisable={otp.length < 6}
          bgColor={colors.RED}
          title="Continue"
          onPress={() => setStep('password')}
          style={{borderRadius: 8, width: Size.getWidth() * 0.85}}
        />
        <AppView className="mt-2 mb-5 flex-row items-center">
          <AppText className="font-MANROPE_400 text-[#BCC1CA] text-base ">
            Return to{' '}
          </AppText>
          <AppButton
            title="Log in"
            bgColor="transparent"
            onPress={() => navigate(routes.LOGIN_SCREEN)}
            style={{width: 50, paddingHorizontal: 0}}
            labelStyle={{
              color: colors.RED,
              textDecorationStyle: 'solid',
              textDecorationLine: 'underline',
              textDecorationColor: colors.RED,
              fontSize: 16,
            }}
          />
        </AppView>
      </AppView>
    </View>
  );
};

interface PasswordProps {
  setStep: React.Dispatch<React.SetStateAction<string>>;
  otp: string;
  email: string;
}

export const NewPasswords = ({setStep, otp, email}: PasswordProps) => {
  const {navigate} = useNavigation<ResetPasswordScreenProps>();
  const [isVerifyModal, setIsVerifyModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [cpassword, setCpassword] = useState<string>('');
  const {bottom} = useSafeAreaInsets();
  const [msg, setMsg] = useState<string>('');

  function handleValidation() {
    if (!hasAtLeast8Characters.test(password))
      return 'Password must be at least 8 characters';
    else if (!hasAtLeast1UppercaseLetter.test(password))
      return 'Password must contain uppercase';
    else if (!hasAtLeast1LowercaseLetter.test(password))
      return 'Password must contain lowercase';
    else if (!hasAtLeast1Number.test(password))
      return 'Password must contain a number';
    else if (password !== cpassword) return 'Password does not match';
    else return '';
  }

  async function handleResetPassword() {
    const check = handleValidation();
    setError(check);
    setTimeout(() => {
      setError('');
    }, 3000);

    if (check.length > 0) return;
    else
      try {
        setLoading(true);
        const res = await resetPassword({
          password,
          cpassword,
          email,
          pin: otp,
        });
        if (res.ok && res.data) {
          setIsVerifyModal(true);
          setMsg(res.data.message.split(':')[1]);
          navigate(routes.LOGIN_SCREEN);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
  }

  return (
    <View
      style={{
        position: 'relative',
        paddingHorizontal: 24,
        height: Size.getHeight(),
      }}>
      <StatusBar hidden />

      <AppModal
        isModalVisible={isVerifyModal}
        hideLoge
        hideCloseBtn
        replaceDefaultContent={<VerificationModal message={msg} />}
        handleClose={() => setIsVerifyModal(false)}
      />

      <View>
        <Pressable
          onPress={() => setStep('verify')}
          style={{marginTop: Size.hp(10)}}>
          <ArrowLeft />
        </Pressable>
        <AppText className="text-2xl text-white font-LEXEND_700 mt-12 mb-12">
          Create your new {'\n'}password
        </AppText>

        {error.length > 0 && (
          <AppText className="mb-4 text-red text-[16px] text-center font-MANROPE_500 ">
            {error}
          </AppText>
        )}

        <AppView className="space-y-7">
          <TextInput
            value={password}
            onChangeText={text => [setPassword(text), setError('')]}
            placeholder="New Password"
            placeholderTextColor="#474748"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            value={cpassword}
            onChangeText={text => [setCpassword(text), setError('')]}
            placeholder="Confirm Password"
            placeholderTextColor="#474748"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </AppView>
      </View>

      <AppView
        style={{marginBottom: bottom + 10}}
        className="w-full items-center mt-auto">
        <AppButton
          isLoading={loading}
          isDisable={password.length === 0 && cpassword.length === 0}
          bgColor={colors.RED}
          title="Continue"
          onPress={() => handleResetPassword()}
          style={{borderRadius: 8, width: Size.getWidth() * 0.85}}
        />
      </AppView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    objectFit: 'contain',
  },
  gradientStyles: {
    height: Size.getHeight(),
    width: Size.getWidth(),
    // zIndex: 10,
    position: 'absolute',
  },
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
