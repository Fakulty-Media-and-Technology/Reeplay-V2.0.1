import {View, Text, FlatList, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  AppButton,
  AppHeader,
  AppImage,
  AppScreen,
  AppText,
  AppView,
} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import {VoterDetails} from '@/configs/data';
import Dots from 'react-native-dots-pagination';
import colors from '@/configs/colors';
import SelectVotesTab from './components/SelectVotesTab';
import PaymentSummaryView from './components/PaymentSummaryView';
import PayStackView from './components/PayStackView';
import Orientation from 'react-native-orientation-locker';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '@/Hooks/reduxHook';

const VoteScreen = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [playingIndexes, setPlayingIndexes] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number>(1);
  const [stage, setStage] = useState<string>('preview');
  const {goBack} = useNavigation();
  const [orientation, setOrientation] = useState<string | null>(null);

  useEffect(() => {
    Orientation.getOrientation(orientation => {
      console.log('Current UI Orientation: ', orientation);
      setOrientation(orientation);
      // dispatch(set(orientation))
    });
  }, []);

  const handlePress = (id: number) => {
    setActiveId(id);
  };

  useEffect(() => {
    Orientation.lockToPortrait();
  });

  switch (stage) {
    case 'preview':
      return (
        <>
          {orientation === 'PORTRAIT' ? (
            <AppScreen containerStyle={{paddingTop: 15, paddingHorizontal: 0}}>
              <AppView style={{paddingHorizontal: Size.calcHeight(20)}}>
                <AppHeader
                  handleFunc={() => [
                    goBack(),
                    Orientation.lockToLandscapeLeft(),
                  ]}
                />
                <AppText
                  style={{alignSelf: 'center'}}
                  className="text-white text-xl font-LEXEND_500 mt-6 text-center w-[80%]">
                  To vote, select one of the options below and continue. ₦500 /
                  Vote{' '}
                </AppText>
              </AppView>

              <AppView className="w-full pl-5 mt-12">
                <FlatList
                  data={[...Array(3)]}
                  keyExtractor={(_, index) => index.toString()}
                  horizontal
                  bounces={false}
                  contentContainerStyle={{
                    height: 382,
                  }}
                  snapToInterval={335 + 12}
                  scrollEventThrottle={16}
                  showsHorizontalScrollIndicator={false}
                  onScroll={event => {
                    const offsetX = event.nativeEvent.contentOffset.x;
                    const index = Math.floor(offsetX / (303 - 14));
                    setCurrentPage(index);
                  }}
                  onMomentumScrollBegin={() => setPlayingIndexes([])}
                  renderItem={({item, index}) => {
                    return (
                      <AppView key={index} className="mr-[13px]">
                        {VoterDetails.map((x, i) => {
                          const showRed = i === activeId;
                          return (
                            <AppView
                              key={i}
                              style={{
                                backgroundColor: showRed ? '#E2D6FF' : 'white',
                              }}
                              className="items-center flex-row w-[335px] p-2 mb-5 rounded-[5px]">
                              <Pressable
                                onPress={() => handlePress(i)}
                                style={{
                                  borderColor: showRed ? colors.RED : '#565D6D',
                                  borderWidth: 1,
                                  borderRadius: 99,
                                  width: 16,
                                  height: 16,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginLeft: 7,
                                }}>
                                {showRed && (
                                  <AppView className="w-[9px] h-[9px] bg-red rounded-full" />
                                )}
                              </Pressable>

                              <AppImage
                                source={require('@/assets/images/bette.png')}
                                className="w-[58px] h-[58px] overflow-hidden rounded-[22px] mr-6 ml-4"
                              />

                              <AppView>
                                <AppText className="mb-1 font-LEXEND_600 text-black text-base">
                                  {x.name}
                                </AppText>
                                <AppText className="font-MANROPE_400 text-xs text-black">
                                  {x.desc}
                                </AppText>
                              </AppView>
                            </AppView>
                          );
                        })}
                      </AppView>
                    );
                  }}
                />

                <AppView className="mt-7">
                  <AppButton
                    title="Continue"
                    bgColor={colors.RED}
                    onPress={() => setStage('visualization')}
                    style={{
                      width: '95%',
                      borderRadius: 5,
                      marginBottom: 20,
                      paddingVertical: Size.calcHeight(14),
                    }}
                  />

                  <Dots
                    length={3}
                    active={currentPage}
                    passiveColor={'rgba(255, 19, 19, 0.4)'}
                    activeColor={colors.RED}
                    passiveDotHeight={Size.calcAverage(7)}
                    passiveDotWidth={Size.calcAverage(7)}
                    activeDotHeight={Size.calcAverage(10)}
                    activeDotWidth={Size.calcAverage(10)}
                    marginHorizontal={3}
                  />
                </AppView>
              </AppView>
            </AppScreen>
          ) : (
            <AppView className="w-full h-full bg-black" />
          )}
        </>
      );

    case 'visualization':
      return <SelectVotesTab setStage={setStage} />;

    case 'paymentSummary':
      return <PaymentSummaryView setStage={setStage} />;

    case 'payStack':
      return <PayStackView tab="vote" setStage={setStage} />;
  }
};

export default VoteScreen;