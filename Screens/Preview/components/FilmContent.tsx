import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppImage, AppText, AppView, TouchableOpacity} from '@/components';
import {CastData} from '@/configs/data';
import RelatedContent from './RelatedContent';
import {useNavigation} from '@react-navigation/native';
import routes from '@/navigation/routes';
import { ICast } from '@/types/api/content.types';
import { RootNav } from '@/navigation/AppNavigator';
import FastImage from 'react-native-fast-image';

interface Props{
  casts: ICast[];
  vodId:string
  genreId:string
}

const FilmContent = ({casts,vodId, genreId}:Props) => {
  const {navigate} = useNavigation<RootNav>();
  return (
    <AppView className="pt-4 border-t border-grey_200/10 mt-5">
      <AppView className="w-[48px]">
        <AppText className="font-ROBOTO_700 text-white text-[13px]">
          CASTS
        </AppText>
        <AppView
          style={{alignSelf: 'center'}}
          className="w-[35px] mt-[3px] h-[2px] bg-grey_100 rounded-[1px]"
        />
      </AppView>

      <ScrollView
        style={styles.castView}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {casts.map((cast, index) => {
          return (
            <TouchableOpacity
              key={index}
              className="mr-3"
              onPress={() => navigate(routes.CAST_SCREEN, {cast, vodId})}>
              <AppImage source={{
                uri: cast.photoUrl,
                priority:FastImage.priority.high
                }} style={styles.image} />
              <AppText className="capitalize text-center mt-2 font-ROBOTO_400 text-white text-[10px]">
                {cast.name}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <RelatedContent 
        title="Related Movies" 
        genreId={genreId}
        vodId={vodId}
      />
    </AppView>
  );
};

export default FilmContent;

const styles = StyleSheet.create({
  image: {
    width: 69,
    height: 69,
    borderRadius: 10,
  },
  castView: {
    marginTop: 12,
  },
});
