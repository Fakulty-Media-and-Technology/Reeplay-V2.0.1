import { View, Modal, StatusBar, StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import DynamicVideoComponent, { VideoPlayerRef } from '@/components/video/DynamicVideoComponent'
import { IDownloadData } from '@/types/api/content.types'
import convertToProxyURL from 'react-native-video-cache';

interface Props{
    isFullscreen:boolean
    setFullscreen: () => void
    content: IDownloadData
    isDownloadScreen?:boolean
}

// const adsUrl = "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&cust_params=sample_ct%3Dlinear&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator="
export const adTagUrl="https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpremidpostoptimizedpodbumper&ciu_szs=300x250&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&cmsid=496&vid=short_onecue&correlator="

const DownloadFullscreenModalPlayer = ({content, isFullscreen,isDownloadScreen, setFullscreen}:Props) => {
    const playerRef = useRef<VideoPlayerRef>(null);

    useEffect(() =>{
      if(content.seekTo){
        playerRef.current?.seek(content.seekTo)
      } 
    }, [content._id])

  return (
    <View className='flex-1'
        // style={StyleSheet.absoluteFill}
    >
      <StatusBar hidden />

        <View className='w-full h-full overflow-hidden bg-black'>
           <DynamicVideoComponent
            ref={playerRef}
            endWithThumbnail
            thumbnail={{
              uri:content.landscapePhoto,
            }}
            source={{
                uri: convertToProxyURL(content.video),
                // ad:{adTagUrl: (isDownloadScreen&&content.vidClass === 'free') ? '':adTagUrl}
            }}
            autoplay
            onError={(e) => console.log(e)}
            showDuration={true}
            isFullscreen={isFullscreen}
            onToggleFullScreen={setFullscreen}
            type={content.type}
            isTime={false}
            isSaveProgress={!isDownloadScreen}
            seekTo={content.seekTo}
            contentData={{
                _id:content._id,
                desc:content.desc,
                logo:null,
                title:content.title,
                viewsCount:content.viewsCount
            }}
    />  
      </View>
    </View>
  )
}

export default DownloadFullscreenModalPlayer