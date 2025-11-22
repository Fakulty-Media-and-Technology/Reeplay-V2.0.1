import {
  View,
  Text,
  ImageSourcePropType,
  Animated,
  Platform,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';
import { AppButton, AppImage, AppText, AppView } from '@/components';
import Size from '@/Utils/useResponsiveSize';
import colors from '@/configs/colors';
import {
  Exclusive_B,
  FreeIcon_B,
  InfoIcon,
  PremiumIcon_B,
  SmPlayIcon,
} from '@/assets/icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import routes from '@/navigation/routes';
import { fullVideoType, previewContentType, RootNav } from '@/navigation/AppNavigator';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '@/configs/fonts';
import { AnimatedLin, MovieVideo } from '../HomeScreen';
import { checkTimeStatus } from '@/Utils/timeStatus';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { ILiveContent, IVODContent } from '@/types/api/content.types';
import { useScreenOrientation } from '@/Hooks/useScreenOrientation';
import getSymbolFromCurrency from 'currency-symbol-map';
import { formatAmount } from '@/Utils/formatAmount';
import AppModal from '@/components/AppModal';
import LiveInfoModal from '@/Screens/Live/components/LiveInfoModal';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { setPreviewContent } from '@/store/slices/previewContentSlice';
import { useCurrencyByIP } from '@/Hooks/useCurrencyByIP';
import { selectPremiumCost, selectUserPremiumCost, setSelectedPremiumCost } from '@/store/slices/bannerSlice.slice';
import { hasPaidContentStatus } from '@/api/content.api';
import ToastNotification from '@/components/ToastNotifications';
import { getWatchTag } from '@/Utils/contentUtils';
import { setFullVideoProps } from '@/store/slices/fullScreenVideo.slice';

const ITEM_WIDTH = Size.getWidth() * 0.88;
const WIDTH = Dimensions.get('window').width;

const SPACING = 6;

interface Props {
  item: IVODContent | ILiveContent;
  translate?: Animated.AnimatedInterpolation<string | number>;
  currentIndex: boolean;
  live?: boolean;
  colors: string[];
  watchLive?:() => void
   handleVODTrailer?: () => void
}

const Caurosel = ({
  item,
  colors: colorsArr,
  translate,
  currentIndex,
  live,
  watchLive,
handleVODTrailer
}: Props) => {
  const { navigate } = useNavigation<RootNav>();
  const [videoURL, setVideoURL] = useState<string>('');
  const [imgLoad, setImgLoad] = useState<boolean>(false);
  const [modal, setModal] = useState<string|null>(null);
  const isFocused = useIsFocused();
  const startTime = 'start' in item ? item.start : item.releaseDate;
  const endTime = 'start' in item ? item.expiry : item.expiryDate
  const isTime = checkTimeStatus(startTime, endTime);
  const dispatch = useAppDispatch()
  const [contentIsPaid, setContentIsPaid] = useState<boolean>('admin_id' in item ? false : item.canView)
  const data = useAppSelector(selectUserPremiumCost)

  async function handleContentStatusUpdate(){
            if(item.vidClass === 'free'){
              setContentIsPaid(true);
            }else{
              const res = await hasPaidContentStatus({contentType: live ?'live':'vod', _id:item._id})
              if(res.ok && res.data){
                setContentIsPaid(res.data.data.canView)
              }else{
                ToastNotification('error', `${res.data?.message}`)
              }
            }
          }
  

  async function getDefaultVideo() {
    if("admin_id" in item){
      setVideoURL(item.trailer);
    }else{
      if (isTime === 'normal' || isTime === 'countdown') {
        setVideoURL(item.previewVideo ?? '')
      } else {
        setVideoURL(item.stream_url)
      }
    }

  }

  useEffect(() => {
    getDefaultVideo();
    handleContentStatusUpdate();
  }, [isFocused]);

  return (
    <Animated.View
      style={{
        width: WIDTH,
        // paddingHorizontal: SPACING,
        position: 'relative',
        alignItems: 'center',
        overflow: 'hidden',
        flex: 1,
        flexGrow: 2,
      }}>
      {!live && (
        <AppView
          style={{ width: ITEM_WIDTH, height: '100%', bottom: -1 }}
          className="overflow-hidden absolute z-[1] rounded-b-[7px]">
          <LinearGradient
            colors={colorsArr}
            style={[
              {
                width: ITEM_WIDTH,
                height: '100%',
              },
            ]}
          />
        </AppView>
      )}

      {live && currentIndex && (
        <AnimatedLin
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(300)}
          colors={['transparent', 'rgba(0, 0, 0, 0.8)', 'rgb(0, 0, 0)']}
          style={[
            {
              bottom: -1,
              zIndex: 1,
              width: ITEM_WIDTH,
              position: 'absolute',
              height: '60%',
            },
          ]}
        />
      )}

      {imgLoad && (
        <AppView className="relative w-full h-full items-center justify-center z-10">
          <ActivityIndicator size={'large'} color={colors.RED} />
        </AppView>
      )}

      {(live && 'start' in item && item.coverPhoto) && (
        <FastImage
          source={{
            uri: item.coverPhoto,
            priority: FastImage.priority.high,
          }}
          onLoadStart={() => setImgLoad(true)}
          onLoadEnd={() => setImgLoad(false)}
          style={{
            width: ITEM_WIDTH,
            position: 'absolute',
            height: '100%',
            borderRadius: 7,
          }}
        />
      )}

      {("admin_id" in item && !live) && <FastImage
        source={{
          uri: item.portraitPhoto,
          priority: FastImage.priority.high,
        }}
        onLoadStart={() => setImgLoad(true)}
        onLoadEnd={() => setImgLoad(false)}
        style={{
          width: ITEM_WIDTH,
          position: 'absolute',
          height: '100%',
          borderRadius: 7,
        }}
      />}

      <AppView className="absolute bottom-4 z-10 items-center">
        <View className='flex-row items-center gap-x-1.5 mb-1'>
        {live && <TouchableOpacity
        activeOpacity={.7}
        // onPress={() => } TODO: ADD DESCRIPTION MODAL
        >
        {item.vidClass === 'premium' ? (
                  <PremiumIcon_B />
                ) :
                  item.vidClass === 'exclusive' ? (
                    <Exclusive_B />
                  ) : (
                    <FreeIcon_B />
                  )}
        </TouchableOpacity>}
        <AppText className="text-white text-sm uppercase font-MANROPE_400 mt-[2px]">
          {item.type}
        </AppText>
        </View>
        <AppText
          style={{
            maxWidth: item.title.length > 13 ? 270 : 248,
          }}
          className={`text-[40px] ${!live ? 'leading-[39px]' : 'leading-[50px]'} font-LEXEND_700 text-white mb-1 text-center`}> 
          {item.title}
        </AppText>
        {!live && (
          <AppView className="flex-row items-center justify-center">
            {'admin_id' in item &&
              item.genre &&
              item.genre.map((tag, i) => {
                return (
                  <Fragment key={i}>
                    <AppText className="font-ROBOTO_400 text-sm text-grey_200">
                      {tag.name}
                    </AppText>
                    {item.genre && i !== item.genre.length - 1 && (
                      <AppView className="w-1.5 h-1.5 rounded-full bg-white mt-[2.5px] mx-1.5" />
                    )}
                  </Fragment>
                );
              })}
          </AppView>
        )}

        <AppView className="flex-row items-center justify-center mt-1.5">
          <AppButton
            bgColor={live ? colors.GREY_600 : colors.RED}
            onPress={() =>
              !live
                ? [dispatch(setPreviewContent(item as IVODContent)),
                  navigate(routes.PREVIEW_SCREEN, {
                      content: item.type.includes('series') ? previewContentType['tv series'] : item.type.includes('video') ? previewContentType['music video'] : previewContentType.film,
                      videoURL: 'admin_id' in item ? item.trailer :'',
                    })
                ]
                : setModal('live')
            }
            replaceDefaultContent={
                <InfoIcon />
            }
            style={{
              width: Size.calcHeight(85),
              borderRadius: 4,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              marginRight: 2,
              paddingVertical: 17.5,
            }}
          />
          <AppButton
            bgColor={colors.RED}
            onPress={() => contentIsPaid ? [watchLive?.(), live && dispatch(setFullVideoProps(item)), handleVODTrailer && handleVODTrailer()] :navigate(routes.MAIN, {
              screen: routes.SUBSCRIPTION_SCREEN, 
              params:{
                tab: getWatchTag(item.vidClass.toLowerCase(), live ?? false), 
                    currency: item.vidClass === 'premium'&& data ? data.currencyCode : item.currency, 
                    amount: `${item.vidClass === 'premium'&& data ? data.amount : item.amount}`,
                    stage:'paymentSummary',
                    metadata: live ? {liveId:item._id} : {videoId: item._id}
              }}) }
            style={{
              width: Size.calcHeight(152),
              borderRadius: 4,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              paddingVertical: 17,
            }}
            replaceDefaultContent={
              <AppView className="flex-row items-center justify-center">
                {!contentIsPaid ?
                (item.vidClass === 'premium'&& data && data.currencyCode && data.amount) ? <Text className="text-[15px] text-white font-ROBOTO_700 text-center -ml-1">
                  {getSymbolFromCurrency(data.currencyCode)}{formatAmount(`${data.amount}`)}
                  </Text>  : 
                (item.amount && item.currency) ? <Text className="text-[15px] text-white font-ROBOTO_700 text-center -ml-1">
                  {getSymbolFromCurrency(item.currency)}{formatAmount(`${item.amount}`)}
                  </Text> : <>
                <SmPlayIcon />
                <AppText className="text-[15px] text-white font-ROBOTO_700 ml-[10px]">
                  {live ? 'Watch' : 'Play'}
                </AppText>
                </>: <>
                <SmPlayIcon />
                <AppText className="text-[15px] text-white font-ROBOTO_700 ml-[10px]">
                  {live ? 'Watch' : 'Play'}
                </AppText>
                </>}
              </AppView>
            }
          />
        </AppView>
      </AppView>

      <AppModal 
        isModalVisible={modal !== null}
        handleClose={() => setModal(null)}
        style={{padding:0, margin:0, marginLeft:0, height:Size.hp(50)}}
        hideCloseBtn
        hideLoge
        replaceDefaultContent={
          <>
          {modal === 'live' && <LiveInfoModal 
              item={item}
              handleClose={() => setModal(null)}
              isBanner
            />
          }
          </>
        }
      />
    </Animated.View>
  );
};

export default Caurosel;
