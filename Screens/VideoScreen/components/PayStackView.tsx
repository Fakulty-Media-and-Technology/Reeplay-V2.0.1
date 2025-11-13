import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppScreen, AppText, AppView} from '@/components';
import colors from '@/configs/colors';
import AppModal from '@/components/AppModal';
import VerificationModal from '@/Screens/authentication/components/VerificationModal';
import {useNavigation} from '@react-navigation/native';
import {SubscriptionNavProps, VoteScreenNavProps} from '@/types/typings';
import routes from '@/navigation/routes';
import LottieView from 'lottie-react-native';
import Orientation from 'react-native-orientation-locker';

interface Props {
  setStage: React.Dispatch<React.SetStateAction<string>>;
  tab: string;
}

const PayStackView = ({setStage, tab}: Props) => {
  const [loading, setLoading] = useState(false);
  const [paySuccessful, setPaySuccessful] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const {goBack} = useNavigation();

  function handlePayment() {
    setLoading(true);
    setIsShowModal(true);

    setTimeout(() => {
      setLoading(false);
      setPaySuccessful(true);
    }, 5500);
  }

  function reset() {
    setIsShowModal(false);
    setPaySuccessful(false);
    if (tab === 'vote') {
      goBack();
      Orientation.lockToLandscapeLeft();
    } else {
      setStage('preview');
    }
    // goBack();
  }

  return (
    <AppScreen containerStyle={{position: 'relative'}}>
      <AppText className="mt-[80%] font-MANROPE_600 text-[40px] text-white text-center">
        PAYSTACK
      </AppText>
      <AppText className="font-MANROPE_700 text-[20px] text-center text-grey_200">
        or selected payment processor
      </AppText>

      <AppView className="absolute bottom-3 w-full">
        <AppButton
          bgColor={colors.RED}
          title="Pay"
          onPress={() => handlePayment()}
          style={{width: '100%', borderRadius: 8}}
        />
      </AppView>

      <AppModal
        isModalVisible={isShowModal}
        hideLoge
        hideCloseBtn={!paySuccessful}
        style={{
          height: paySuccessful ? 390 : 368,
          backgroundColor: loading ? 'transparent' : 'white',
        }}
        replaceDefaultContent={
          <>
            {loading && (
              <LottieView
                source={require('@/assets/icons/RPlay.json')}
                style={{
                  width: 500,
                  height: 500,
                }}
                autoPlay
                loop
              />
            )}
            {paySuccessful && <VerificationModal isPayment tab={tab} />}
          </>
        }
        handleClose={reset}
      />
    </AppScreen>
  );
};

export default PayStackView;