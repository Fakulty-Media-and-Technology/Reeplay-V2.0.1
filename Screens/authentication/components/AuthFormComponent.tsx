import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppText, AppView, TouchableOpacity} from '@/components';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import {CheckIcon, DropDwn, EyeIcon, EyeIcon_C} from '@/assets/icons';
import useToggle from '@/Hooks/useToggle';
import {useNavigation} from '@react-navigation/native';
import {
  AuthMainNavigation,
  LoginScreenProps,
  MainLoginScreenProps,
  SignUpScreenProps,
} from '@/types/typings';
import routes from '@/navigation/routes';
import {CountryPicker} from 'react-native-country-codes-picker';
import {removeData, storeData} from '@/Utils/useAsyncStorage';
import country_codes from '@/configs/country_codes';
import BottomSheet from './BottomModal';
import {handleLoginAPI, handleSignUpAPI, resendToken} from '@/api/auth.api';
import {GUEST_TOKEN} from '@env';
import {getProfileDetails} from '@/api/profile.api';
import {useAppDispatch} from '@/Hooks/reduxHook';
import {setCredentials} from '@/store/slices/userSlice';
import {hasUserDetails} from '@/Screens/Splashscreen/Splashscreen';
import {HAS_SET_NEWPIN} from '../GetStartedScreen';

const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const HAS_SKIPPED = 'SKIPPED';

interface Props {
  screen: string;
  trigger?: () => void;
  setIsCountryCode?: React.Dispatch<React.SetStateAction<boolean>>;
  countryCode?: {
    cc: string;
    cf: string;
  };
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
}

const AuthFormComponent = ({
  screen,
  trigger,
  countryCode,
  setIsCountryCode,
  setEmail: setResetEmail,
}: Props) => {
  const dispatch = useAppDispatch();
  const navLogin = useNavigation<LoginScreenProps>();
  const navSignup = useNavigation<SignUpScreenProps>();
  const {reset} = useNavigation<MainLoginScreenProps>();
  const navigation = useNavigation<AuthMainNavigation>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [cpassword, setCpassword] = useState<string>('');
  const [fullname, setFullname] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNo, setPhoneNo] = useState<string>('');
  const [toogle, setToogle] = useToggle(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  async function resetState() {
    setEmail('');
    setPassword('');
    setCpassword('');
    setFullname('');
    setLastName('');
    setPhoneNo('');
    setError('');
    await removeData(HAS_SKIPPED);
  }

  async function handleLogin() {
    if (email === '' && password === '') {
      setError('Invalid Credentials');
      setTimeout(() => {
        setError('');
      }, 2000);
    } else {
      try {
        setLoading(true);
        if (regex.test(email)) {
          const res = await handleLoginAPI({
            email,
            password,
          });
          console.log(res, '.....Login......');
          if (res.ok && res.data) {
            //dispatch to redux
            await storeData('AUTH_TOKEN', res.data.data.accessToken);
            await storeData('REFRESH_TOKEN', res.data.data.refreshToken);
            const profileRes = await getProfileDetails();
            if (profileRes.ok && profileRes.data) {
              await storeData(
                hasUserDetails,
                JSON.stringify(profileRes.data.data),
              );
              if (profileRes.data.data.profile.pin)
                await storeData(
                  HAS_SET_NEWPIN,
                  profileRes.data.data.profile.pin,
                );
              dispatch(setCredentials(profileRes.data.data));
              reset({
                index: 0,
                routes: [
                  {
                    name: routes.TAB_MAIN,
                  },
                ],
              });
              resetState();
            }
          } else {
            if (
              res.data &&
              res.data.message.split(':')[1].trim() ===
                'user account not verified, check your email for verification code'
            ) {
              let userData = {
                email,
              };
              navLogin.navigate(routes.VEERIFY_PHONE, {
                userDetails: userData,
              });
            } else {
              setError(
                res.data?.message.split(':')[1] ||
                  'Opps, something weent wrong.',
              );
              setTimeout(() => {
                setError('');
              }, 5000);
            }
          }
        } else {
          setError('Invalid Email');
          setTimeout(() => {
            setError('');
          }, 2000);
        }
      } catch (error) {
        setError('Opps! Something went wrong');
        setTimeout(() => {
          setError('');
        }, 2000);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleRest() {
    if (email === '') {
      setError('Invalid Credentials');
      setTimeout(() => {
        setError('');
      }, 2000);
    } else {
      if (regex.test(email)) {
        setLoading(true);
        //Auth endpoint
        const res = await resendToken({email});
        console.log(res);
        if (res.ok) {
          setLoading(false);
          setResetEmail && setResetEmail(email);
          if (trigger) trigger();
          resetState();
        } else {
          const msg = res.data ? res.data.message : '';
          setError(msg.split(':')[1]);
          setTimeout(() => {
            setError('');
          }, 2000);
          setLoading(false);
        }
      } else {
        setError('Invalid Email');
        setTimeout(() => {
          setError('');
        }, 2000);
      }
    }
  }

  async function handleSignUp() {
    if (email === '' && password === '' && phoneNo === '' && fullname === '') {
      setError('Invalid Credentials');
      setTimeout(() => {
        setError('');
      }, 2000);
    } else {
      try {
        if (regex.test(email)) {
          setLoading(true);
          let userData = {
            email,
            password,
            fullname: `${fullname} ${lastName}`,
            phoneNo: `${countryCode && countryCode.cc}${phoneNo}`,
          };
          //TODO: RUN actual signup endpoint here
          const res = await handleSignUpAPI({
            email,
            password,
            cpassword: password,
            first_name: fullname,
            last_name: lastName,
            country_code: `${countryCode && countryCode.cc}`,
            mobile: phoneNo,
          });

          console.log(res);

          if (res.ok && res.data) {
            console.log(res.data);
            navSignup.navigate(routes.VEERIFY_PHONE, {
              userDetails: userData,
            });
            setLoading(false);
            resetState();
          } else {
            setLoading(false);
            res.data && setError(res.data.message);
            setTimeout(() => {
              setError('');
            }, 6000);
          }
        } else {
          setError('Invalid Email');
          setTimeout(() => {
            setError('');
          }, 2000);
        }
      } catch (error) {
        setError('Opps! something went wrong');
        setTimeout(() => {
          setError('');
        }, 2000);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleSkip() {
    await storeData(HAS_SKIPPED, 'true');
    await storeData('AUTH_TOKEN', GUEST_TOKEN);
    //navigate to home
    reset({
      index: 0,
      routes: [
        {
          name: routes.TAB_MAIN,
        },
      ],
    });
  }

  return (
    <AppView className="w-full pt-7 pb-[18px] items-center">
      {screen === 'reset' && (
        <AppText className="text-xl text-white font-MANROPE_600 text-center mt-4 mb-6">
          Reset your password
        </AppText>
      )}
      {error !== '' && (
        <AppText className="font-MANROPE_500 text-sm text-red mb-4 -mt-2">
          {error}
        </AppText>
      )}

      {screen === 'signUp' && countryCode && setIsCountryCode && (
        <>
          <AppView className="flex-row items-center w-full">
            <TextInput
              placeholder="First Names"
              value={fullname}
              onChangeText={setFullname}
              placeholderTextColor={colors.GREY_100}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.textInput,
                {flex: 1, marginRight: 10},
                Platform.OS === 'android' && {
                  fontSize: Size.calcHeight(14.5),
                  paddingTop: Size.calcHeight(14),
                  paddingBottom: Size.calcHeight(15),
                },
              ]}
            />
            <TextInput
              placeholder="Last Names"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor={colors.GREY_100}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.textInput,
                {flex: 1},
                Platform.OS === 'android' && {
                  fontSize: Size.calcHeight(14.5),
                  paddingTop: Size.calcHeight(14),
                  paddingBottom: Size.calcHeight(15),
                },
              ]}
            />
          </AppView>
          <AppView
            style={[
              styles.textInput,
              Platform.OS === 'android' && {
                paddingTop: Size.calcHeight(2),
                paddingBottom: Size.calcHeight(3),
              },
            ]}
            className="flex-row items-center my-6 mb-5">
            <Pressable
              style={[styles.center, {columnGap: 4}]}
              onPress={() => setIsCountryCode(true)}>
              <AppView className="w-7 h-[18px] items-center justify-center overflow-hidden">
                <AppText className="text-[30px] -mt-2">
                  {countryCode.cf}
                </AppText>
              </AppView>
              <AppText style={styles.text}>{countryCode.cc}</AppText>
              <DropDwn />
            </Pressable>
            <TextInput
              value={phoneNo}
              onChangeText={setPhoneNo}
              keyboardType="number-pad"
              // maxLength={} TODO: regulate max base on country code
              style={[styles.text, {flex: 1, marginLeft: 10}]}
            />
          </AppView>
        </>
      )}
      <TextInput
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={colors.GREY_100}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.textInput,
          Platform.OS === 'android' && {
            fontSize: Size.calcHeight(14.5),
            paddingTop: Size.calcHeight(14),
            paddingBottom: Size.calcHeight(15),
          },
        ]}
      />

      {screen !== 'reset' && (
        <AppView
          style={[
            styles.textInput,
            Platform.OS === 'android' && [
              styles.adjust,
              {paddingTop: 2, paddingBottom: 3},
            ],
          ]}
          className="flex-row items-center my-6 mt-5 mb-5">
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={colors.GREY_100}
            secureTextEntry={toogle}
            style={[styles.text, {flex: 1}]}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={setToogle}
            className="mx-3 mr-5"
            style={Platform.OS === 'android' && {marginRight: 15}}>
            {!toogle ? <EyeIcon /> : <EyeIcon_C />}
          </TouchableOpacity>
        </AppView>
      )}

      {screen === 'reset' && (
        <AppView className="w-full mt-2">
          <AppButton
            title="Reset password"
            isLoading={loading}
            bgColor={colors.RED}
            onPress={() => handleRest()}
            style={{
              marginTop: Size.calcHeight(24),
              borderRadius: 4,
              width: '100%',
              paddingVertical: Size.calcHeight(16),
            }}
            labelStyle={{fontSize: 16}}
          />
        </AppView>
      )}

      {screen === 'login' && (
        <>
          <AppButton
            isLoading={loading}
            title="Login"
            bgColor={colors.RED}
            onPress={handleLogin}
            style={{
              marginTop: Size.calcHeight(24),
              borderRadius: 4,
              width: '100%',
              paddingVertical: Size.calcHeight(16),
            }}
            labelStyle={{fontSize: 16}}
          />

          <AppButton
            title="Skip"
            bgColor={colors.GREY_700}
            onPress={handleSkip}
            style={{
              marginTop: Size.calcHeight(16),
              borderRadius: 4,
              width: '100%',
              paddingVertical: Size.calcHeight(16),
            }}
            labelStyle={{fontSize: 16}}
          />
        </>
      )}

      {screen === 'signUp' && (
        <AppView style={{marginTop: Size.calcHeight(1)}} className="w-full">
          <AppButton
            isLoading={loading}
            title="Create account"
            bgColor={colors.RED}
            onPress={handleSignUp}
            style={{
              marginTop: Size.calcHeight(15),
              borderRadius: 4,
              width: '100%',
              paddingVertical: Size.calcHeight(15.8),
            }}
            labelStyle={{fontSize: 16}}
          />
        </AppView>
      )}

      {screen === 'signUp' && (
        <>
          <AppText
            style={{fontFamily: fonts.INTER_400}}
            className="mt-8 text-[13px] text-[#9095A0] text-center">
            By signing up, you agree to REEPLAY's
          </AppText>
          <AppView className="mt-1 mb-4 flex-row items-center justify-center gap-x-1">
            <Pressable onPress={() => navigation.navigate(routes.TERMS_SCREEN)}>
              <AppText style={[styles.privacyText, styles.underline]}>
                Terms of Service
              </AppText>
            </Pressable>
            <AppText style={[styles.privacyText, {color: '#9095A0'}]}>
              and
            </AppText>
            <Pressable
              onPress={() => navigation.navigate(routes.PRIVACY_SCREEN)}>
              <AppText style={[styles.privacyText, styles.underline]}>
                Privacy Policy
              </AppText>
            </Pressable>
          </AppView>
        </>
      )}

      {screen === 'login' && (
        <Pressable
          onPress={() => navLogin.navigate(routes.SIGNUP_SCREEN)}
          style={{marginTop: Size.calcHeight(38)}}>
          <AppText className="font-MANROPE_400 text-base text-red">
            Create new account
          </AppText>
        </Pressable>
      )}

      {(screen === 'login' || screen === 'signUp') && (
        <AppView
          style={Platform.OS === 'android' && {marginTop: 1}}
          className="flex-row items-center mt-3">
          <AppText className="text-base text-[#BCC1CA] font-MANROPE_400 text-center">
            {screen === 'login'
              ? 'Forgot your Password?'
              : 'Already had an account?'}
          </AppText>
          <Pressable
            onPress={() =>
              navLogin.navigate(
                screen === 'login'
                  ? routes.RESET_PASSWORD_SCREEN
                  : routes.LOGIN_SCREEN,
              )
            }>
            <AppText
              style={[
                Platform.OS === 'android' && {
                  fontSize: 14,
                },
                {color: screen === 'login' ? '#379AE6' : colors.RED},
              ]}
              className="font-MANROPE_400 text-base ml-1">
              {screen === 'login' ? 'Reset it' : 'Log in'}
            </AppText>
          </Pressable>
        </AppView>
      )}
    </AppView>
  );
};

export default AuthFormComponent;

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    borderColor: '#BCC1CA73',
    borderWidth: 1,
    fontFamily: fonts.MANROPE_400,
    fontSize: Platform.OS === 'ios' ? Size.calcHeight(16) : Size.calcHeight(16),
    color: '#BCC1CA',
    paddingLeft:
      Platform.OS === 'ios' ? Size.calcHeight(20) : Size.calcHeight(26),
    paddingTop:
      Platform.OS === 'ios' ? Size.calcHeight(18) : Size.calcHeight(15),
    paddingBottom:
      Platform.OS === 'ios' ? Size.calcHeight(19) : Size.calcHeight(16),
    borderRadius: 4,
  },
  adjust: {
    paddingVertical: Size.calcHeight(3),
    paddingLeft: Size.calcHeight(18),
  },
  text: {
    fontFamily: fonts.MANROPE_400,
    fontSize: Platform.OS === 'ios' ? Size.calcHeight(16) : Size.calcHeight(16),
    color: '#BCC1CA',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyText: {
    fontFamily: fonts.INTER_400,
    fontSize: Size.calcHeight(14),
    color: '#379AE6',
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: '#379AE6',
  },
});
