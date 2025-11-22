import { View, Modal, StatusBar, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import DynamicVideoComponent, { VideoPlayerRef } from '@/components/video/DynamicVideoComponent'
import { ILiveContent, IVODContent } from '@/types/api/content.types'
import convertToProxyURL from 'react-native-video-cache';
import { checkTimeStatus } from '@/Utils/timeStatus';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RootNav } from '@/navigation/AppNavigator';
import routes from '@/navigation/routes';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { resetFullVideo } from '@/store/slices/fullScreenVideo.slice';
import { selectUserPremiumCost } from '@/store/slices/bannerSlice.slice';
import { useSocket } from '@/Hooks/useSocket';
import { getAuthToken } from '@/api/profile.api';

interface Props{
    isFullscreen:boolean
    setFullscreen: () => void
    content: IVODContent|ILiveContent
    currentContentState: IVODContent | ILiveContent | null
    setContentState: React.Dispatch<React.SetStateAction<IVODContent | ILiveContent | null>>
}

const FullscreenModalPlayer = ({content, isFullscreen, currentContentState, setContentState, setFullscreen}:Props) => {
    const navigation = useNavigation<RootNav>();
    const playerRef = useRef<VideoPlayerRef>(null);
    const isLive = 'coverPhoto' in content 
    const [videoURL, setVideoURL] = useState<string>('');
    const isTime = checkTimeStatus(isLive ? content.start :'', isLive ?content.expiry:'');
    const dispatch = useAppDispatch()
      const data = useAppSelector(selectUserPremiumCost)
    const {socket} = useSocket()
                  
    async function handleVideo() {
        const token = await getAuthToken();
        if(isLive){
            if (isTime === 'normal' || isTime === 'countdown') {
                setVideoURL(content.previewVideo??'');
            } else {
                if(token) socket.emit('joinLivestream', {token, liveId:content._id})
                setVideoURL(content.stream_url);
            }
        }else{
            setVideoURL(content.trailer);
        }
    }

    async function handleCTAFunc(){
        // TODO: WHEN DONATION INDICATOR HAS BEEN ADDED
        setContentState(null);
        if(isLive && content.voteInfo){
            setFullscreen();
            navigation.navigate(routes.MAIN, {
                   screen: routes.VOTE_SCREEN,
                   params: {
                       _id:content._id,
                       voteInfo:content.voteInfo
                    },
                });
            }else{
                navigation.navigate(routes.MAIN, {
                    screen: routes.SUBSCRIPTION_SCREEN,
                    params: { 
                        tab: 'donate', 
                        currency: data ? data.currencyCode : 'NGN',
                        metadata:{
                            liveId:content._id
                        } 
                    },
                });
                setFullscreen();
        }
    }

    function handleGoBack(){
        if(playerRef.current) playerRef.current?.pause()
        dispatch(resetFullVideo());
        setTimeout(() => setFullscreen(), 5000)
    }
            
    useEffect(() =>{
        handleVideo();
    }, []);

  return (
    <View className='bg-black flex-1'>
        <StatusBar hidden  /> 
   {(currentContentState !== null) && <View 
   className='flex-1'
           style={StyleSheet.absoluteFill}
    >
        <View className='w-full h-full overflow-hidden'>
           <DynamicVideoComponent
            ref={playerRef}
                endWithThumbnail
                thumbnail={{
                uri:isLive ? content.coverPhoto: (isFullscreen ? content.landscapePhoto :content.portraitPhoto) ,
            }}
            source={{
                uri: isTime && isLive ? videoURL : convertToProxyURL(videoURL),
                ...(isTime && isLive && {type:'m3u8'})
            }}
            onError={(e) => console.log(e)}
            showDuration={true}
            isFullscreen={isFullscreen}
            onToggleFullScreen={setFullscreen}
            type={'live'}
            isTime={isTime === 'now'}
            ctaType={isLive ? content.voteInfo ? 'vote' : 'donate' : undefined}
            handleCTAFunc={handleCTAFunc}
            handleGoBackFunc={handleGoBack}
            contentData={{
                _id:content._id,
                desc:content.description,
                logo:isLive ? content.channelLogo:null,
                title:content.title,
                viewsCount:content.viewsCount
            }}
    />  
      </View>
    </View>}
    </View>
  )
}

export default FullscreenModalPlayer