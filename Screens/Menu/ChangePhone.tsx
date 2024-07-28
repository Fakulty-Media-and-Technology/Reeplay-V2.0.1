import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {AppButton, AppHeader, AppScreen, AppText, AppView} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import colors from '@/configs/colors';
import ComfirmPin from './ComfirmPin';
import {getProfileDetails, updateProfileDetails} from '@/api/profile.api';
import {DropDwn} from '@/assets/icons';
import BottomSheet from '../authentication/components/BottomModal';
import country_codes from '@/configs/country_codes';
import {useAppDispatch, useAppSelector} from '@/Hooks/reduxHook';
import {selectUser, setCredentials} from '@/store/slices/userSlice';
import AppModal from '@/components/AppModal';
import VerificationModal from '../authentication/components/VerificationModal';
import {useNavigation} from '@react-navigation/native';

const ChangePhone = () => {
  const {goBack} = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [phoneNum, setPhoneNum] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [laoding, setLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [step, setStep] = useState<string>('confirm');
  const [isCountryCode, setIsCountryCode] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState({
    cc: country_codes[0].dial_code,
    cf: country_codes[0].flag,
  });

  function getPhoneCode() {
    country_codes.map(code => {
      if (code.dial_code === user.country_code) {
        console.log(code.dial_code, 'saved');
        setCountryCode({cc: code.dial_code, cf: code.flag});
        return false;
      }
    });
  }

  async function handleContinue() {
    if (phoneNum === '') {
      setError(true);
      setErrorMessage('Invalid Credentials');
      setTimeout(() => {
        setError(false);
      }, 2000);
    } else {
      try {
        setLoading(true);

        const res = await updateProfileDetails({
          country_code: countryCode.cc,
          mobile: phoneNum,
        });

        console.log(res);

        if (res.ok && res.data) {
          const profileRes = await getProfileDetails();
          if (profileRes.ok && profileRes.data) {
            dispatch(setCredentials(profileRes.data.data));
            setLoading(false);
            setIsSuccess(true);
            setPhoneNum('');
          }
        } else {
          setError(true);
          setErrorMessage('Opps! something went wrong');
          setTimeout(() => {
            setError(false);
          }, 2000);
        }
      } catch (error) {
        setError(true);
        setErrorMessage('Opps! something went wrong');
        setTimeout(() => {
          setError(false);
        }, 2000);
      } finally {
        setLoading(false);
      }
      //Run update Phone endpoint
    }
  }

  useLayoutEffect(() => {
    getPhoneCode();
  }, []);

  switch (step) {
    case 'confirm':
      return <ComfirmPin setStep={setStep} />;

    case 'main':
      return (
        <>
          <AppScreen containerStyle={{paddingTop: 10, position: 'relative'}}>
            <AppHeader />

            <AppText className="max-w-[200px] font-LEXEND_700 text-white text-2xl mt-12 mb-[68px]">
              Change phone number
            </AppText>

            {/* In cases of server error */}
            {error && (
              <AppText className=" text-red text-[16px] font-MANROPE_500 mt-3">
                {errorMessage}
              </AppText>
            )}
            <AppView className="mt-2 space-y-7"></AppView>

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
                value={phoneNum}
                onChangeText={setPhoneNum}
                placeholder="New Phone"
                placeholderTextColor="#474748"
                style={styles.input}
                keyboardType="number-pad"
              />
            </AppView>

            <AppView className="absolute bottom-6 w-full">
              <AppButton
                bgColor={colors.RED}
                isLoading={laoding}
                isDisable={phoneNum.length < 10}
                title="Continue"
                onPress={handleContinue}
                style={{borderRadius: 10, width: '100%'}}
              />
            </AppView>

            <AppModal
              isModalVisible={isSuccess}
              hideLoge
              hideCloseBtn
              replaceDefaultContent={
                <VerificationModal
                  message={`Phone number changed ${'\n'}successfully`}
                />
              }
              handleClose={() => [setIsSuccess(false), goBack()]}
            />
          </AppScreen>

          {isCountryCode && (
            <View style={{position: 'absolute', width: '100%', height: '100%'}}>
              <View style={styles.bottomSheetContainer}>
                <Pressable
                  onPress={() => setIsCountryCode(false)}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#00000070',
                  }}
                />
                <BottomSheet
                  handleClose={() => setIsCountryCode(false)}
                  handleNav={item =>
                    setCountryCode({cc: item.dial_code, cf: item.flag})
                  }
                />
              </View>
            </View>
          )}
        </>
      );
  }
};

export default ChangePhone;

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: Size.calcHeight(18),
    paddingVertical: Size.calcHeight(15),
    fontFamily: fonts.MANROPE_500,
    fontSize: 16,
    color: '#474748',
    flex: 1,
  },
  bottomSheetContainer: {
    width: Size.getWidth(),
    height: Size.getHeight(),
    position: 'relative',
  },
  textInput: {
    width: '100%',
    fontFamily: fonts.MANROPE_400,
    fontSize: Platform.OS === 'ios' ? Size.calcHeight(16) : Size.calcHeight(16),
    color: '#BCC1CA',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft:
      Platform.OS === 'ios' ? Size.calcHeight(20) : Size.calcHeight(26),
  },
  adjust: {
    paddingVertical: Size.calcHeight(3),
    paddingLeft: Size.calcHeight(18),
  },
  text: {
    fontFamily: fonts.MANROPE_400,
    fontSize: Platform.OS === 'ios' ? Size.calcHeight(16) : Size.calcHeight(16),
    color: '#474748',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
