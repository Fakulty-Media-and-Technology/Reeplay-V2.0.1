import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  AppHeader,
  AppImage,
  AppScreen,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import {LibraryData} from '@/configs/data';
import AppModal from '@/components/AppModal';
import {CloseLogo} from '@/assets/icons';
import {useNavigation} from '@react-navigation/native';
import {WatchlistScreenNav} from '@/types/typings';
import routes from '@/navigation/routes';
import {previewContentType} from '@/navigation/AppNavigator';
import {MovieVideo} from '../Home/HomeScreen';

interface WatchListData {
  image: string;
}

const WatchlistScreen = () => {
  const {goBack, navigate} = useNavigation<WatchlistScreenNav>();
  const [watchList, setWatchList] = useState<WatchListData[]>([]);

  return (
    <AppScreen containerStyle={{paddingTop: 10}}>
      <AppHeader style={{zIndex: 99}} />
      {watchList.length === 0 ? (
        <AppModal
          isModalVisible={true}
          hideLoge
          replaceDefaultContent={
            <AppView className="mb-[74px] mt-14 items-center">
              <CloseLogo />
              <AppText className="mt-5 leading-5 font-ROBOTO_400 text-[14px] text-black text-center">
                Your watchlist is empty.{'\n'} You haven't added any content to
                your watchlist yet.
              </AppText>
            </AppView>
          }
          handleClose={goBack}
        />
      ) : (
        <>
          <AppText className="text-center font-LEXEND_700 text-grey_100 -mt-5 text-[17px]">
            My Watchlist
          </AppText>

          <ScrollView
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.centerContent}>
            {watchList.map((lib, index) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigate(routes.PREVIEW_SCREEN, {
                      content: previewContentType.film,
                      videoURL: MovieVideo,
                    })
                  }
                  activeOpacity={0.6}
                  key={index}>
                  <AppImage source={{uri: lib.image}} style={styles.image} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}
    </AppScreen>
  );
};

export default WatchlistScreen;

const styles = StyleSheet.create({
  image: {
    width: Size.getWidth() / 3 - 20,
    height: 133,
    borderRadius: 15,
  },
  centerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Size.calcHeight(10),
    rowGap: Size.calcHeight(13),
    paddingBottom: 20,
    marginTop: 20,
  },
});
