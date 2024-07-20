import {launchImageLibrary} from 'react-native-image-picker';

export const pickSingleImage = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.5,
  });
  if (result.didCancel) return console.log('Please pick an Image');

  if (!result.assets) {
    console.log('An Error occured while picking media', result);
    return null;
  }

  if (result.assets[0].uri) {
    return result.assets[0];
  } else {
    return null;
  }
};
