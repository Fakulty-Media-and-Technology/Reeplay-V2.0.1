import {View, Text, FlatList, Pressable} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
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
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {useAppDispatch} from '@/Hooks/reduxHook';
import {Contestants, VoteInfo} from '@/types/api/live.types';
import {getVoteContestants, getVoteInfo} from '@/api/live.api';
import {formatAmount} from '@/Utils/formatAmount';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {VoteScreenRoute} from '@/types/typings';

const AnimatedView = Animated.createAnimatedComponent(AppView);

const VoteScreen = () => {
  const {_id} = useRoute<VoteScreenRoute>().params;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const isFocused = useIsFocused();
  const [playingIndexes, setPlayingIndexes] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<Contestants | null>(null);
  const [stage, setStage] = useState<string>('preview');
  const {goBack} = useNavigation();
  const [orientation, setOrientation] = useState<string | null>(null);
  const [voteInfo, setVoteInfo] = useState<VoteInfo | null>(null);
  const [contestants, setContestants] = useState<Contestants[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [amount, setAmount] = useState<number>(0);

  async function handleVoteInfo() {
    try {
      const res = await getVoteInfo('66c071f6591372c544797d03'); //_id
      if (res.ok && res.data) {
        setVoteInfo(res.data.data);
      }

      const resContestants = await getVoteContestants(
        '66c071f6591372c544797d03',
      ); //TODO: _id
      if (resContestants.ok && resContestants.data) {
        setContestants(resContestants.data.data);
      }
    } catch (error) {}
  }

  function checkOrientation() {
    if (!isFocused) return;
    Orientation.getOrientation(orientation => {
      if (orientation !== 'PORTRAIT') {
        Orientation.lockToPortrait();
        checkOrientation();
      } else {
        setOrientation(orientation);
      }
      // dispatch(set(orientation))
    });
  }

  useEffect(() => {
    Orientation.lockToPortrait();
    checkOrientation();

    handleVoteInfo();
  }, [isFocused]);

  const handlePress = (item: Contestants) => {
    setActiveId(item);
  };

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
                  To vote, select one of the options below and continue. ₦
                  {voteInfo ? formatAmount(voteInfo.price.toString()) : 0} /
                  Vote{' '}
                </AppText>
              </AppView>

              <AppView className="w-full pl-5 mt-12">
                <FlatList
                  data={[...Array(Math.ceil(contestants.length / 4))]}
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
                    const startIndex = index * 4;
                    const endIndex = startIndex + 4;
                    const contestantGroup = contestants.slice(
                      startIndex,
                      endIndex,
                    );
                    return (
                      <AppView key={index} className="mr-[13px]">
                        {contestantGroup.map((x, i) => {
                          const showRed = x._id === activeId?._id;
                          return (
                            <AnimatedView
                              entering={FadeInDown.delay(i * 200).springify()}
                              key={i}
                              style={{
                                backgroundColor: showRed ? '#E2D6FF' : 'white',
                              }}
                              className="items-center flex-row w-[335px] p-2 mb-5 rounded-[5px]">
                              <Pressable
                                onPress={() => handlePress(x)}
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
                                source={{uri: x.photo_url}}
                                className="w-[58px] h-[58px] overflow-hidden rounded-[22px] mr-6 ml-4"
                              />

                              <AppView>
                                <AppText className="mb-1 font-LEXEND_600 text-black text-base">
                                  {x.names}
                                </AppText>
                                <AppText className="font-MANROPE_400 text-xs text-black">
                                  {x.occupation}
                                </AppText>
                              </AppView>
                            </AnimatedView>
                          );
                        })}
                      </AppView>
                    );
                  }}
                />

                <AppView className="mt-7">
                  <AppButton
                    title="Continue"
                    isDisable={!activeId}
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
                    length={Math.ceil(contestants.length / 4)}
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
      return (
        <SelectVotesTab
          setStage={setStage}
          selectedContestant={activeId}
          price={voteInfo?.price}
          setAmount={setAmount}
        />
      );

    case 'paymentSummary':
      return (
        <PaymentSummaryView
          setStage={setStage}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          amount={amount}
        />
      );

    case 'payStack':
      return (
        <PayStackView
          tab="vote"
          setStage={setStage}
          selectedPaymentMethod={selectedPaymentMethod}
          amount={amount}
          live_id={voteInfo ? voteInfo.live_id : ''}
          contestant_id={activeId ? activeId._id : ''}
        />
      );
  }
};

export default VoteScreen;
