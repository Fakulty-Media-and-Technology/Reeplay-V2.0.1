import { View, Text, StatusBar, StyleSheet, Platform, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import { AppButton, AppImage, AppText } from '@/components'
import Size from '@/Utils/useResponsiveSize'
import colors from '@/configs/colors'
import routes from '@/navigation/routes'
import { useNavigation } from '@react-navigation/native'
import { AuthParamsNavigator } from '@/navigation/AuthNavigation'
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook'
import { selectUser, setCredentials } from '@/store/slices/userSlice'
import { formatDate } from '@/Utils/formatTime'
import { getProfileDetails, updateProfileDetails, uploadProfile } from '@/api/profile.api'
import { pickSingleImage } from '@/Utils/MediaPicker'
import EditIcon from '@/assets/icons/edit-profile.svg'

interface ImageUploadProps{
    uri:string,
    fileName:string,
    type:string
}

const ProfilePicUpdate = () => {
    const {replace} = useNavigation<AuthParamsNavigator>()
    const [loading, setLoading] = useState<boolean>(false);
    const [loading_u, setLoading_u] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [pic, setPic] = useState<ImageUploadProps|null>(null);
    const {first_name, last_name, createdAt,_id} = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    
    async function handleProfileUpload(){
        if(!pic) return
        try {
            setLoading_u(true);
             let data = new FormData();
          data.append('photo', {
            uri: pic.uri,
            name: pic.fileName,
            type: pic.type,
          });
    
            const profileRes = await updateProfileDetails(data, _id);
            if (profileRes.ok && profileRes.data) {
              const profile = await getProfileDetails();
              if (profile.ok && profile.data) {
                dispatch(setCredentials(profile.data.data));
                replace(routes.SET_PIN)
              }
            }else{
               setError(profileRes.data?.message??'');
        setTimeout(() => {
          setError('');
        }, 2000); 
            }
        } catch (error) {
             setError('Opps! Something went wrong');
        setTimeout(() => {
          setError('');
        }, 2000);
        }finally{
            setLoading_u(false)
        }
    }

     const openGallery = async () => {
        try {   
            setLoading(true);
            const result = await pickSingleImage();
        if (result && result.uri && result.fileName && result.type) {
         setPic({
            fileName:result.fileName,
            type:result.type,
            uri:result.uri
        });
        
    }
} catch (error) {  
}finally{
    setLoading(false)
}
      };

  return (
    <View className='relative flex-1'>
            <StatusBar hidden />
    
            <View className='absolute top-0 w-full h-full'>
            <FastImage
              source={require('@/assets/images/Login-bg.png')}
              style={styles.imageContainer}
              resizeMode='contain'
              />
              </View>
    
            <LinearGradient
              colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.95)', 'rgba(0,0,0,0.99)']}
              style={[styles.gradientStyles]}
            />
    
            <View className='flex-1 px-4'>

            <AppText
              style={{
                marginTop: Size.getHeight() < 668 ? 10 : Size.hp(14),
              }}
              className="font-LEXEND_700 text-white text-[34px]">
              Account Created
            </AppText>
            <AppText className="text-base text-white font-MANROPE_400 max-w-[80%] mt-1">
              Add desired photo to complete profile or skip to do later on profile settings.
            </AppText>

            <View className='items-center mt-20'>
                <View className='relative'>
                    <View className='w-[158px] h-[158px] rounded-[32px] overflow-hidden'>
                        <AppImage 
                            source={pic ? {uri:pic.uri} : require('@/assets/images/dummy-avatar.png')}
                            style={styles.image}
                        />
                    </View>

                    <TouchableOpacity 
                    onPress={openGallery}
                    activeOpacity={.7} 
                    className='absolute -right-3 top-28 z-50 w-[27px] h-[27px] rounded-[4px] overflow-hidden items-center justify-center'>
                        {loading ? <ActivityIndicator size={'small'} /> : <EditIcon />}
                    </TouchableOpacity>
                </View>

                <Text className='text-white text-xl font-MANROPE_700 text-center mt-2'>{first_name} {last_name}</Text>
                <Text className='text-sm text-[#8C8B8B] font-MANROPE_400 text-center'> Joined {formatDate(createdAt)}</Text>
            </View>
    

    <View className='mt-auto mb-6 w-full px-4'>
         <AppButton
            isLoading={loading_u}
            isDisable={pic === null}
            title="Save Photo"
            bgColor={colors.RED}
            onPress={handleProfileUpload}
            style={{
              borderRadius:4,
              width: '100%',
              paddingVertical: Size.calcHeight(15.8),
            }}
            labelStyle={{ fontSize: 16 }}
          />

          <TouchableOpacity
          activeOpacity={.7}
          className="flex-row justify-center mt-5"
          onPress={() => replace(routes.SET_PIN)}
          >
          <AppText className="text-base text-white font-MANROPE_400 text-center">
            Skip and do later
          </AppText>
          </TouchableOpacity>


    </View>
            </View>
            
            
          </View>
  )
}

export default ProfilePicUpdate

const styles = StyleSheet.create({
    image:{
        width: '100%',
        height:'100%',
    },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  gradientStyles: {
    height: Size.getHeight() + 100,
    width: Size.getWidth(),
    // zIndex: 10,
    position: 'absolute',
  },
})