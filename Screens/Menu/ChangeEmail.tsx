import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppHeader, AppScreen, AppText, AppView} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import colors from '@/configs/colors';
import ComfirmPin from './ComfirmPin';
import {getProfileDetails, updateProfileDetails} from '@/api/profile.api';
import {setCredentials} from '@/store/slices/userSlice';
import {useAppDispatch} from '@/Hooks/reduxHook';
import AppModal from '@/components/AppModal';
import VerificationModal from '../authentication/components/VerificationModal';
import {useNavigation} from '@react-navigation/native';

const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ChangeEmail = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>('');
  const [confirmEmail, setConfirmEmail] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [step, setStep] = useState<string>('confirm');
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {goBack} = useNavigation();

  async function handleContinue() {
    if (email === '') {
      setError(true);
      setErrorMessage('Invalid Credentials');
      setTimeout(() => {
        setError(false);
      }, 2000);
    } else if (email !== confirmEmail) {
      setError(true);
      setErrorMessage('Emails must match');
      setTimeout(() => {
        setError(false);
      }, 2000);
    } else {
      if (regex.test(email)) {
        //   setLoading(true);  //Pass loading variable to button to handle loading
        //Run update email endpoint here endpoint

        try {
          setLoading(true);
          const res = await updateProfileDetails({
            email,
          });

          console.log(res);

          if (res.ok && res.data) {
            const profileRes = await getProfileDetails();
            if (profileRes.ok && profileRes.data) {
              setIsShowModal(true);
              dispatch(setCredentials(profileRes.data.data));
              setEmail('');
              setConfirmEmail('');
            }
          } else {
            setError(true);
            setErrorMessage(res.data?.message.split(':')[1] ?? '');
            setTimeout(() => {
              setError(false);
            }, 4000);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        setError(true);
        setErrorMessage('Invalid Email');
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    }
  }

  switch (step) {
    case 'confirm':
      return <ComfirmPin setStep={setStep} />;

    case 'main':
      return (
        <AppScreen containerStyle={{paddingTop: 10, position: 'relative'}}>
          <AppHeader />

          <AppText className=" font-LEXEND_700 text-white text-2xl mt-12 mb-[68px]">
            Change email
          </AppText>

          {error && (
            <AppText className=" text-red text-[16px] text-center font-MANROPE_500 mb-3">
              {errorMessage}
            </AppText>
          )}
          <AppView className="mt-2 space-y-7">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="New Email"
              placeholderTextColor="#474748"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              value={confirmEmail}
              onChangeText={setConfirmEmail}
              placeholder="Confirm Email"
              placeholderTextColor="#474748"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </AppView>

          <AppView className="absolute bottom-6 w-full">
            <AppButton
              isLoading={loading}
              isDisable={email === '' || confirmEmail === ''}
              bgColor={colors.RED}
              title="Continue"
              onPress={handleContinue}
              style={{borderRadius: 10, width: '100%'}}
            />
          </AppView>

          <AppModal
            isModalVisible={isShowModal}
            hideLoge
            hideCloseBtn
            replaceDefaultContent={
              <VerificationModal
                message={`User's email changed successfully`}
                messageStyle={{maxWidth: 200, lineHeight: 18, marginTop: 10}}
              />
            }
            handleClose={() => [setIsShowModal(false), goBack()]}
          />
        </AppScreen>
      );
  }
};

export default ChangeEmail;

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
