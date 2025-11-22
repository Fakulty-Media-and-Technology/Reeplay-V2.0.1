import {Alert, FlatList, Linking, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  AppHeader,
  AppImage,
  AppScreen,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import {DownloadsData, TrendingNow} from '@/configs/data';
import {DeleteIcon} from '@/assets/icons';
import {useNavigation} from '@react-navigation/native';
import {DownloadScreenNav} from '@/types/typings';
import routes from '@/navigation/routes';
import {previewContentType} from '@/navigation/AppNavigator';
import {MovieVideo} from '../Home/HomeScreen';
import AppModal from '@/components/AppModal';
import DownloadModal from '../Preview/components/DownloadModal';
import useToggle from '@/Hooks/useToggle';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useAppSelector } from '@/Hooks/reduxHook';
import { selectAdsContent } from '@/store/slices/adsSlice.slice';
import FastImage from 'react-native-fast-image';
import { useAppPersistStore } from '@/store/zustand.store';
import { IDownloadData } from '@/types/api/content.types';
import { decryptFile, encryptFile, getAESKeys } from '../Preview/utils/downloadUtils';
import ToastNotification from '@/components/ToastNotifications';
import DownloadFullscreenModalPlayer from './FullscreenModalPlayer';
import { OrientationInjectedProps } from '@/components/OrientationWrapper';

interface Download {
  _id: number;
  title: string;
  image: any;
  subscription: string;
  viewersDiscretion: string;
  size: string;
}

const DownoadScreen = ({isFullscreen,makeFullscreen,makePortrait}:OrientationInjectedProps) => {
  const {canGoBack} = useNavigation()
  const [data, setData] = useState<IDownloadData[]>([]);
  const [isDownload, setIsDownload] = useToggle(false);
  const [isDeleteIndex, setIsDeleteIndex] = useState<IDownloadData|null>(null);
  const {downloadedList, removeDownloadById} = useAppPersistStore();
  const [isFullscreenContent, setFullscreenContent] = useState<IDownloadData|null>(null)
    const ads = useAppSelector(selectAdsContent).ads;

  const url = ads.length > 0 ? ads[0].link : '';
  const handleLink = async () => {
    await InAppBrowser.open(url);
  };

  function handleDelete(id: string) {
    removeDownloadById(id)
    const newData = data.filter(item => item._id !== id);
    setData(newData);
  }

  useEffect(() => {
  if (downloadedList) {
    const seenIds = new Set();
    const uniqueDownloads = downloadedList.filter(item => {
      const isUnique = !seenIds.has(item._id);
      seenIds.add(item._id);
      return isUnique;
    });

    setData(uniqueDownloads);
  }
}, [downloadedList]);

  return (
    <>
      {!isFullscreen && <AppScreen containerStyle={{paddingTop: 15}}>
        {canGoBack() && <AppHeader />}

        {ads.length > 0 && <AppView className="mt-6 bg-red pt-3 px-1 rounded-[15px]">
          <AppView className="flex-row items-center justify-between px-3 pb-2">
            <AppView>
              <AppText className="font-LEXEND_400 text-base text-white ">
                REEPLAY
              </AppText>
              <AppText className="font-MANROPE_500 text-white text-xs">
                Ads that meet your interest
              </AppText>
            </AppView>
            <TouchableOpacity
              onPress={handleLink}
              className="bg-white py-2 px-3 rounded-[40px]">
              <AppText className="font-MANROPE_600 text-red text-xs">
                {ads[0].cta ?? 'CLICK HERE'}
              </AppText>
            </TouchableOpacity>
          </AppView>

          <AppView className="h-[191px] mb-1 rounded-b-[15px] overflow-hidden border-[2px] border-black">
            <AppImage
              source={{uri: ads[0].photoUrl, priority:FastImage.priority.high}}
              style={{
                width: '100%',
                height: '100%',
                borderBottomLeftRadius:15,
                borderBottomRightRadius:15
              }}
              resizeMode='contain'
            />
          </AppView>
        </AppView>}

        <AppView className="mt-6 mb-6 flex-row items-center justify-between">
          <AppView className="w-fit ml-4">
            <AppText className="font-ROBOTO_700 text-white text-[17px]">
              DOWNLOADS
            </AppText>
            <AppView className="w-[82px] mt-[3px] ml-[10px] h-[2px] bg-grey_100 rounded-[1px]" />
          </AppView>

          <AppText className="font-MANROPE_400 text-[13px] text-yellow">
            {data.length} downloads
          </AppText>
        </AppView>

        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          // bounces={false}
          renderItem={({item, index}) => {
            return (
              <DownloadItem 
                item={item} 
                handleDelete={() => [setIsDeleteIndex(item), setIsDownload(true)]} 
                handleFullscreenContent={(url) => [setFullscreenContent({...item, video:url}), makeFullscreen()]}
              />
            );
          }}
        />

        <AppModal
          isModalVisible={isDownload}
          hideCloseBtn
          hideLoge
          replaceDefaultContent={
            <DownloadModal
              img={isDeleteIndex?.portraitPhoto??''}
              handleDelete={() => handleDelete(isDeleteIndex?._id??'')}
              setIsDownload={() => setIsDownload(false)}
            />
          }
          handleClose={() => setIsDownload(false)}
        />
      </AppScreen>}

       {(isFullscreenContent && isFullscreen) && <DownloadFullscreenModalPlayer 
          isFullscreen={isFullscreen}
          content={isFullscreenContent}
          setFullscreen={() => isFullscreen ? [makePortrait(), setFullscreenContent(null)] : makeFullscreen()} 
          isDownloadScreen
        />}
    </>
  );
};

export default DownoadScreen;


interface Props{
  item:IDownloadData
  handleDelete:() => void
  handleFullscreenContent:(url:string) => void
}
export const DownloadItem = ({item, handleFullscreenContent, handleDelete}:Props) =>{
  const [url, setUrl] = useState<string>('')
  async function handleDecyptionURL(){
    const keys = await getAESKeys();
    if (!keys) {
      ToastNotification('error', 'Encryption keys missing');
        return;
      }
    const { key, iv } = keys;

    const path = await decryptFile(item.video, key, iv);
      setUrl(path);
  }

  useEffect(() =>{
    handleDecyptionURL();
  }, [item._id])

  return(
    <AppView className="pb-2 flex-row items-center mb-2 border-b border-grey_200/10">
              <TouchableOpacity
                onPress={() => handleFullscreenContent(url)}
                >
                <AppImage
                  source={{uri:item.portraitPhoto}}
                  style={{width:203, height:106, borderRadius:4}}
                />
              </TouchableOpacity>

              <AppView className="justify-center items-center flex-1">
                <AppText className="font-LEXEND_700 text-base text-white text-center leading-[17px]">
                  {item.title}
                </AppText>

                <AppView className="flex-row items-center gap-x-2 mt-2">
                  <AppText className="font-MANROPE_400 text-xs text-yellow">
                    {item.pg}+
                  </AppText>
                  <AppView className="w-[1px] h-[68%] bg-white" />
                  <AppText className="font-MANROPE_400 text-xs text-white">
                    {item.size && `${item.size}MB`}
                  </AppText>
                  <AppView className="w-[1px] h-[68%] mr-[2px] bg-white" />
                  <TouchableOpacity
                    onPress={handleDelete}>
                    <DeleteIcon />
                  </TouchableOpacity>
                </AppView>
              </AppView>
            </AppView>
  )
}

const styles = StyleSheet.create({});
