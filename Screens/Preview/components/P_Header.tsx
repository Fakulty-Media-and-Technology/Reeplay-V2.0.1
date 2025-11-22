import { View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import DynamicVideoComponent, { VideoPlayerRef } from '@/components/video/DynamicVideoComponent'
import { ILiveContent, IVODContent } from '@/types/api/content.types';
import convertToProxyURL from 'react-native-video-cache';
import { checkTimeStatus } from '@/Utils/timeStatus';
import { adTagUrl } from '@/Screens/Download/FullscreenModalPlayer';


export interface VideoOrientationProps{
    setFullscreen: () => void
    isFullscreen: boolean
    content: IVODContent
}
const P_Header = ({setFullscreen, isFullscreen, content}:VideoOrientationProps) => {
      const playerRef = useRef<VideoPlayerRef>(null);
       const [videoURL, setVideoURL] = useState<string>('');
      
        async function handleVideo() {
            setVideoURL((isFullscreen && content.type !== 'series') ? content.video : content.trailer)
        }

        useEffect(() =>{
          handleVideo();
        }, []);

  return (
    <View className='w-full h-full overflow-hidden'>
     <DynamicVideoComponent 
        ref={playerRef}
        endWithThumbnail
        thumbnail={{
          uri:isFullscreen ? content.landscapePhoto :content.portraitPhoto,
        }}
        autoplay
        source={{
          uri: convertToProxyURL(videoURL),
          // ad:{adTagUrl: (content.vidClass === 'free' && isFullscreen) ? adTagUrl : ''}
        }}
        disableControlsAutoHide={!isFullscreen}
        onError={(e) => console.log(e)}
        showDuration={true}
        isFullscreen={isFullscreen}
        onToggleFullScreen={setFullscreen}
        type={content.type}
        isTime={false}
        isSaveProgress={videoURL === content.video}
        contentData={{
          _id:content._id,
          desc:content.description,
          logo:null,
          title:content.title,
          viewsCount:content.viewsCount
        }}
    />
    </View>
  )
}

export default P_Header