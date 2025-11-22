import { useEffect } from "react";
import { BackHandler } from "react-native";

export const useBackButtonHandler = (callback:() => void) => {
  useEffect(() => {
    const handleBackPress = () => {
      console.log('clicked back')
      callback();
      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, [callback]);
};