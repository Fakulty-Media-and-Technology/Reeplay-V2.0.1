import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppModal from './AppModal'
import { CloseLogo } from '@/assets/icons';
import colors from '@/configs/colors';
import fonts from '@/configs/fonts';
import Size from '@/Utils/useResponsiveSize';
import OrientationWrapper from './OrientationWrapper';
import DownoadScreen from '@/Screens/Download/DownoadScreen';
import Orientation from 'react-native-orientation-locker';

interface Props{
  stage:string,
  setStage: React.Dispatch<React.SetStateAction<string>>
  refreshNetwork: () => void
}

const NetworkComponent = ({refreshNetwork, setStage,stage}:Props) => {

  useEffect(() =>{
    Orientation.lockToPortrait();
  }, []);

  switch(stage){
    case 'network':
      return <NetwrokModal setStage={setStage} refreshNetwork={refreshNetwork} />

    case 'downloadScreen':
      return <OrientationWrapper>
            {(injectedProps) => <DownoadScreen {...injectedProps} />}
            </OrientationWrapper>
  }
}

export default NetworkComponent

interface NetworkModalProps{
  refreshNetwork:() => void, 
  setStage: React.Dispatch<React.SetStateAction<string>>
}
export const NetwrokModal = ({refreshNetwork, setStage}:NetworkModalProps) =>{
  return(
     <AppModal
              isModalVisible
              hideLoge
              hideCloseBtn
              style={{ paddingBottom: 0, paddingHorizontal:0 }}
              replaceDefaultContent={
                <View className="h-full relative">
                  <View className="mb-[74px] mt-[60px] items-center">
                    <CloseLogo />
                    <Text className="mt-5 leading-5 font-ROBOTO_400 text-[14px] text-black text-center">
                      Your internet connection is lost.{'\n'} Fix connection and
                      retry.
                    </Text>
                  </View>
                  <View style={{width:Size.wp(70)}} className='items-center'>
                  <TouchableOpacity
                    onPress={()=> setStage('downloadScreen')}
                    className="">
                    <Text style={styles.secondaryModalButtonText}>
                      Go to Downloads
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={refreshNetwork}
                    // style={{ alignSelf: 'center' }}
                    className="mt-3">
                    <Text style={styles.secondaryModalButtonText}>
                      Retry
                    </Text>
                  </TouchableOpacity>
                    </View>
                </View>
              }
              handleClose={() => console.log('first')}
            />
  )
}


const styles = StyleSheet.create({
  secondaryModalButtonText: {
    color: colors.DEEP_BLACK,
    fontFamily: fonts.ROBOTO_400,
    fontSize: Size.calcWidth(16),
  },
});