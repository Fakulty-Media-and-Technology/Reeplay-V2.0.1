import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppButton } from '@/components'
import colors from '@/configs/colors'
import Size from '@/Utils/useResponsiveSize'
import FastImage from 'react-native-fast-image'
import { FadeIn, FadeOut } from 'react-native-reanimated'
import { AnimatedLin } from '@/Screens/Home/HomeScreen'
import { ILiveContent, IVODContent } from '@/types/api/content.types'
import CloseIcon from '@/assets/icons/close_sm.svg';
import {
  Exclusive_B,
  FreeIcon_B,
  PremiumIcon_B,
  SmPlayIcon,
} from '@/assets/icons';
import getSymbolFromCurrency from 'currency-symbol-map'
import { formatAmount } from '@/Utils/formatAmount'
import { useNavigation } from '@react-navigation/native'
import { RootNav } from '@/navigation/AppNavigator'
import routes from '@/navigation/routes'
import { getWatchTag } from '@/Utils/contentUtils'
import { hasPaidContentStatus } from '@/api/content.api'
import ToastNotification from '@/components/ToastNotifications'
import { useAppDispatch } from '@/Hooks/reduxHook'
import { setFullVideoProps } from '@/store/slices/fullScreenVideo.slice'

interface Props{
    item: IVODContent | ILiveContent
    handleClose:() => void
     makeFullscreen?: () => void
    isBanner?:boolean
}

const LiveInfoModal = ({item, isBanner, makeFullscreen, handleClose}:Props) => {
    const {navigate} = useNavigation<RootNav>();
      const [accessStatus, setAccessStatus] = useState<boolean>(false);
      const dispatch = useAppDispatch()
    async function handleContentStatusUpdate(){
            if(item.vidClass === 'free'){
              setAccessStatus(true);
            }else{
              const res = await hasPaidContentStatus({contentType:'live', _id:item._id})
              if(res.ok && res.data){
                setAccessStatus(res.data.data.canView)
              }else{
                ToastNotification('error', `${res.data?.message}`)
              }
            }
          }

          function runFullscreen(){
            dispatch(setFullVideoProps(item));
            makeFullscreen?.();
          }

          useEffect(() =>{
            handleContentStatusUpdate();
          }, [])
    
  return (
     <View className='flex-1 w-full rounded-t-[7px]'>
          <View className='relative w-full h-[60%]'>
            <View
              style={{ width: '100%', height: '100%', bottom: -1 }}
              className="overflow-hidden left-0 absolute z-[1px]">
         <AnimatedLin
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(300)}
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          style={[
            {
              bottom: -1,
              zIndex: 1,
              width: '100%',
              height: '60%',
              marginTop:'auto'
            },
          ]}
        />
        </View>

        <View className='absolute z-20 h-full w-full px-4 pb-4'>
          <TouchableOpacity
          onPress={handleClose} 
          className='ml-auto mt-1.5'>
            <CloseIcon scale={1.2} />
          </TouchableOpacity>

          <View className='mt-auto w-full flex-row items-end justify-between'>
            <View>
              <Text className='font-ROBOTO_400 text-[10px] text-white'>{'location' in item ? item.location : ''}</Text>
              <Text className='font-ROBOTO_700 text-[15px] text-white'>{item.title}</Text>
            </View>

             { item.vidClass === 'premium' ? (
                  <PremiumIcon_B />
                ) :
                  item.vidClass === 'exclusive' ? (
                    <Exclusive_B />
                  ) : (
                    <FreeIcon_B />
                  )}
          </View>
        </View>
               <FastImage
                source={{
                  uri: 'coverPhoto' in item ? item.coverPhoto:'',
                  priority: FastImage.priority.high,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode='cover'
              />
            </View>

            <View className='p-5 items-center'>
              <Text className='font-ROBOTO_400 tex-xs text-black mb-5 text-center'>{item.description}</Text>

              <AppButton 
                bgColor={colors.RED}
                onPress={() => [accessStatus ? runFullscreen() : navigate(routes.MAIN, {
                    screen: routes.SUBSCRIPTION_SCREEN, 
                    params:{
                        tab: getWatchTag(item.vidClass.toLowerCase(), true), 
                        currency: item.currency, 
                        amount: `${item.amount}`,
                        stage:'paymentSummary',
                        metadata: {liveId: item._id}
                    }}), handleClose()]}
                style={{
                  width: Size.calcHeight(152),
                  borderRadius: 5,
                  paddingVertical: 14,
                }}
                replaceDefaultContent={
                  <View className="flex-row items-center justify-center">
                    {(item.amount && item.currency && !accessStatus) ? <Text className="text-[15px] text-white font-ROBOTO_700 text-center -ml-1">
                      {getSymbolFromCurrency(item.currency)}{formatAmount(`${item.amount}`)}
                      </Text> : <>
                    <SmPlayIcon />
                    <Text className="text-[15px] text-white font-ROBOTO_700 ml-[10px]">
                      Watch
                    </Text>
                    </>}
                  </View>
                }              
              />
            </View>
        </View>
  )
}

export default LiveInfoModal