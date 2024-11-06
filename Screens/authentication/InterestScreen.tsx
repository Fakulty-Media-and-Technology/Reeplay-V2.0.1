import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  AppButton,
  AppScreen,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import {interests} from '@/configs/data';
import colors from '@/configs/colors';
import Size from '@/Utils/useResponsiveSize';
import {useNavigation, useRoute} from '@react-navigation/native';
import {InterestScreenProps, InterestScreenRouteProps} from '@/types/typings';
import routes from '@/navigation/routes';
import {addinterests, getProfileDetails} from '@/api/profile.api';
import {useAppDispatch, useAppSelector} from '@/Hooks/reduxHook';
import {selectUser, setCredentials} from '@/store/slices/userSlice';

const InterestScreen = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<InterestScreenProps>();
  const [selectedItems, setSelectedItems] = useState<string[]>(
    user.settings_info.interest,
  );
  const [isMaxReached, setIsMaxReached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const route = useRoute<InterestScreenRouteProps>();
  const isSettings = route.params.isSettings;

  const isSelected = (title: string) => {
    return selectedItems.includes(title.toLowerCase());
  };

  const removeItem = (title: string) => {
    const newItems = selectedItems.filter(item => item !== title);
    setSelectedItems(newItems);
  };

  const handlePress = (title: string) => {
    if (isSelected(title)) {
      setIsMaxReached(false);
      return removeItem(title);
    }

    if (selectedItems.length < 7) {
      setIsMaxReached(false);
      if (selectedItems.length === 6) setIsMaxReached(true);
      return setSelectedItems([...selectedItems, title]);
    }
  };

  async function handleInterests() {
    try {
      if (selectedItems.length > 0) {
        setLoading(true);
        //TODO: handle interest endpoint and remove setTimeout

        const res = await addinterests({interest: selectedItems});

        if (res.ok && res.data) {
          if (isSettings) {
            Alert.alert('Settings', 'Interest has been added');
            const userRes = await getProfileDetails();
            if (userRes.ok && userRes.data)
              dispatch(setCredentials(userRes.data.data));
            navigation.navigate(routes.SETTINGS_SCREEN);
          } else {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: routes.TAB_MAIN,
                },
              ],
            });
          }
        } else {
          // handle error
          setError(res.data?.message!);
          setTimeout(setError, 2000, '');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppScreen containerStyle={{position: 'relative'}}>
      <AppText className="text-2xl text-white font-LEXEND_700 mt-5">
        Choose your
      </AppText>
      <AppText className="text-2xl text-white font-LEXEND_700 mb-2">
        interests
      </AppText>
      <AppText className="text-base text-grey_100 font-MANROPE_400 mt-2">
        We'll tailor an experience based on your interests, creating a
        personalized experience on reeplay. You can always change later.
      </AppText>

      {error.length > 0 && (
        <AppText
          style={{alignSelf: 'center'}}
          className="max-w-[120px] text-red text-[16px] text-center font-MANROPE_500 mt-3">
          {error}
        </AppText>
      )}

      {Platform.OS === 'ios' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={
            Size.getHeight() < 668 && {
              maxHeight: 360,
            }
          }
          contentContainerStyle={{
            flexDirection: 'row',
            rowGap: 20,
            columnGap: 12,
            flexWrap: 'wrap',
            marginTop: 12,
            overflow: 'hidden',
            paddingBottom: 20,
          }}>
          {interests.map((interest, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => handlePress(interest.toLowerCase())}
                style={[
                  {paddingHorizontal: interest.length >= 6 ? 22 : 34},
                  isSelected(interest) && {backgroundColor: colors.RED},
                ]}
                className="bg-white py-[14px] rounded-3xl">
                <AppText
                  className="text-base font-MANROPE_400 text-grey_600"
                  style={isSelected(interest) && {color: colors.WHITE}}>
                  {interest}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {Platform.OS === 'android' && (
        <AppView className="flex-row gap-y-5 gap-x-3 flex-wrap mt-3">
          {interests.map((interest, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => handlePress(interest)}
                style={[
                  {paddingHorizontal: interest.length >= 6 ? 22 : 34},
                  isSelected(interest) && {backgroundColor: colors.RED},
                ]}
                className="bg-white py-[14px] rounded-3xl">
                <AppText
                  className="text-base font-MANROPE_400 text-grey_600"
                  style={isSelected(interest) && {color: colors.WHITE}}>
                  {interest}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </AppView>
      )}

      <AppView className="absolute bottom-3">
        <AppButton
          isDisable={isSelected.length > 0 ? false : true}
          isLoading={loading}
          bgColor={colors.RED}
          title="Continue"
          onPress={() => handleInterests()}
          style={{borderRadius: 8, width: Size.getWidth() * 0.9}}
        />
        {!isSettings && (
          <Pressable
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: routes.TAB_MAIN,
                  },
                ],
              })
            }
            style={{marginTop: Size.calcHeight(16)}}>
            <AppText className="text-lg text-grey_700 font-MANROPE_400 text-center">
              Skip
            </AppText>
          </Pressable>
        )}
      </AppView>
    </AppScreen>
  );
};

export default InterestScreen;

const styles = StyleSheet.create({});
