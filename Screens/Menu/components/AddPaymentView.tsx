import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {AppScreen, AppText, AppView, TouchableOpacity} from '@/components';
import {
  BigClose,
  Black_Card,
  Blue_PayPal,
  CheckIcon_R,
  Credit_Card,
  PayPal,
} from '@/assets/icons';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import {
  CardNumber,
  Cvv,
  ExpiryDate,
  Frames,
  SubmitButton,
} from 'frames-react-native';
import useToggle from '@/Hooks/useToggle';
import {useNavigation} from '@react-navigation/native';

const AddPaymentView = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [cardHolder, setCardHolder] = useState<string>('');
  const [terms, setTerms] = useToggle(false);
  const [defaults, setDefaults] = useToggle(false);
  const {goBack} = useNavigation();

  function handlePress(value: number) {
    setActiveIndex(value);
  }

  return (
    <AppScreen containerStyle={{paddingTop: 10}}>
      <StatusBar backgroundColor="black" translucent={false} />
      <AppView className="relative w-full">
        <TouchableOpacity onPress={goBack} className="absolute left-0 z-20">
          <BigClose />
        </TouchableOpacity>
        <AppText className="font-LEXEND_700 text-white text-[20px] text-center">
          Add Payment
        </AppText>
      </AppView>

      <AppText className="mt-10 font-LEXEND_400 text-[15px] text-white">
        Select Payment Method
      </AppText>

      <AppView className="flex-row items-center gap-x-8 mt-2">
        {['card', 'paypal'].map((item, i) => {
          const showRed = activeIndex === i;
          return (
            <AppView
              key={i}
              style={{
                backgroundColor: showRed ? 'white' : '#FFFFFFBF',
                borderColor: showRed ? colors.RED : 'white',
              }}
              className="flex-row items-center justify-between rounded border py-2 px-[10px] w-[106px]">
              {item === 'card' && <Black_Card />}
              {item === 'paypal' && <Blue_PayPal />}
              <Pressable
                onPress={() => handlePress(i)}
                style={{
                  borderColor: showRed ? colors.RED : 'white',
                  borderWidth: 1,
                  borderRadius: 99,
                  width: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {showRed && (
                  <AppView className="w-[9px] h-[9px] bg-red rounded-full" />
                )}
              </Pressable>
            </AppView>
          );
        })}
      </AppView>

      <AppView className="mt-8">
        <Frames
          config={{
            debug: true,
            publicKey: '',
          }}
          cardTokenized={e => {
            console.log(e.token);
          }}>
          <AppView>
            <AppText className="mb-3 font-LEXEND_400 text-[15px] text-white">
              Card holder
            </AppText>
            <TextInput
              value={cardHolder}
              onChangeText={setCardHolder}
              placeholder="Your name"
              placeholderTextColor="#474748"
              style={styles.input}
            />
          </AppView>

          <View>
            <AppText className="mb-3 mt-7 font-LEXEND_400 text-[15px] text-white">
              Card number
            </AppText>
            <AppView style={[styles.input]} className="flex-row items-center">
              <Credit_Card />
              <CardNumber
                style={{
                  marginLeft: -10,
                  borderWidth: 0,
                  height: 21,
                  paddingBottom: 6,
                }}
                placeholderTextColor="#474748"
                placeholder="XXXX XXXX XXXX XXXX"
                showIcon={false}
                // onChange={text => console.log(text.nativeEvent.text)}
              />
            </AppView>
          </View>

          <AppView className="flex-row items-center gap-x-4">
            <AppView className="flex-1">
              <AppText className="mb-3 mt-7 font-LEXEND_400 text-[15px] text-white">
                Valid until
              </AppText>
              <ExpiryDate
                style={styles.expiry}
                placeholder="MM/YYYY"
                placeholderTextColor="#474748"
              />
            </AppView>
            <AppView className="flex-1">
              <AppText className="mb-3 mt-7 font-LEXEND_400 text-[15px] text-white">
                Security code
              </AppText>
              <Cvv
                style={styles.expiry}
                placeholder="***"
                placeholderTextColor="#474748"
              />
            </AppView>
          </AppView>

          <AppView className="mt-6 flex-row items-center gap-x-2">
            <TouchableOpacity
              activeOpacity={1}
              onPress={setTerms}
              style={{borderColor: terms ? colors.RED : '#9095A1'}}
              className="border rounded-[2px] w-4 h-4 items-center justify-center">
              {/* //svg */}
              {terms && <CheckIcon_R />}
            </TouchableOpacity>
            <AppView className="flex-row items-center gap-x-[2px]">
              <AppText className="font-MANROPE_400 text-[14px] text-white underline">
                Accept the
              </AppText>
              <AppText className="text-[#379AE6] font-MANROPE_400 text-[14px] underline">
                Term and Conditions
              </AppText>
            </AppView>
          </AppView>

          <AppView className="mt-4 flex-row items-center gap-x-2">
            <TouchableOpacity
              activeOpacity={1}
              onPress={setDefaults}
              style={{borderColor: defaults ? colors.RED : '#9095A1'}}
              className="border rounded-[2px] w-4 h-4 items-center justify-center">
              {/* //svg */}
              {defaults && <CheckIcon_R />}
            </TouchableOpacity>
            <AppText className="font-MANROPE_400 text-[14px] text-white">
              Use as default payment method
            </AppText>
          </AppView>

          <SubmitButton
            title="Add card"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => console.log('merchant action')}
          />
        </Frames>
      </AppView>
    </AppScreen>
  );
};

export default AddPaymentView;

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
  expiry: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: Size.calcHeight(18),
    paddingVertical: Size.calcHeight(14.5),
    fontFamily: fonts.MANROPE_500,
    fontSize: 16,
    color: '#474748',
  },
  button: {
    marginTop: 30,
    backgroundColor: colors.RED,
    paddingVertical: 12,
    paddingBottom: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: fonts.MANROPE_400,
    fontSize: 16,
    color: colors.WHITE,
    textAlign: 'center',
  },
});
