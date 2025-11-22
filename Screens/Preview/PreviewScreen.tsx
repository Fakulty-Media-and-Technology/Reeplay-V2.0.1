import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
  AppButton,
  AppImage,
  AppScreen,
  AppText,
  AppView,
  TouchableOpacity,
} from '@/components';
import colors from '@/configs/colors';
import {
  BigClose,
  CommentSendBtn,
  DownloadIcon,
  PreviewDownloadIcon,
  PreviewPlayIcon,
  RateStar_F,
  RateStar_W,
  SM_Rate_E,
  SM_Rate_F,
  SM_Rate_H,
  ShareIcon,
  SmPlayIcon,
  VideoLogIcon,
  VideoLog_F,
} from '@/assets/icons';
import DownloadedCompleteIcon from '@/assets/icons/Download.svg';
import fonts from '@/configs/fonts';
import RelatedContent from './components/RelatedContent';
import FilmContent from './components/FilmContent';
import SeriesContent from './components/SeriesContent';
import useToggle from '@/Hooks/useToggle';
import RatingView from './components/RatingView';
import Share from 'react-native-share';
import AppModal from '@/components/AppModal';
import DownloadModal from './components/DownloadModal';
import Size from '@/Utils/useResponsiveSize';
import PreviewComments from './PreviewComments';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import { PreviewScreenRoute} from '@/types/typings';
import {fullVideoType, previewContentType, RootNav} from '@/navigation/AppNavigator';
import routes from '@/navigation/routes';
import BlurView from 'react-native-blur-effect';
import {BlurView as Blur} from '@react-native-community/blur';
import {MovieVideo, MusicVideo, SeriesVideo} from '../Home/HomeScreen';
import Orientation from 'react-native-orientation-locker';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { selectPreviewVODContent, setContentComments } from '@/store/slices/previewContentSlice';
import { formatAmount, formatLikesNumber } from '@/Utils/formatAmount';
import ToastNotification from '@/components/ToastNotifications';
import { addWatchList, checkIsWatchList } from '@/api/watchlist.api';
import { fetchCommentbyVOD, totalCommentCount } from '@/api/comment.api';
import { selectUserProfilePic } from '@/store/slices/userSlice';
import FastImage from 'react-native-fast-image';
import { IReplyDetails } from '@/types/api/comment.types';
import { IDownloadData, ISeasonData, IVODContent, IVODRatings } from '@/types/api/content.types';
import { useCommentHook } from './utils/commentHook';
import { addVODRating, fetchSeasonsForSeries, getVODRatings, hasPaidContentStatus } from '@/api/content.api';
import { useAppPersistStore } from '@/store/zustand.store';
import { downloadAndSave, encryptFile, getAESKeys } from './utils/downloadUtils';
import RNFS from 'react-native-fs';
import SmallCloseIcon from '@/assets/icons/small_close.svg'
import P_Header from './components/P_Header';
import { OrientationInjectedProps } from '@/components/OrientationWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getWatchTag } from '@/Utils/contentUtils';
import { selectUserPremiumCost } from '@/store/slices/bannerSlice.slice';
import getSymbolFromCurrency from 'currency-symbol-map';
import { getRemoteFileSize } from '@/api/external.api';
import { truncateText } from '@/Utils/textUtils';
import DownloadFullscreenModalPlayer from '../Download/FullscreenModalPlayer';


const PreviewScreen = ({isFullscreen,makeFullscreen,makePortrait}:OrientationInjectedProps) => {
  const userPic = useAppSelector(selectUserProfilePic)
  const previewContent:IVODContent = useAppSelector(selectPreviewVODContent)
  const [addWatchList_boolean, setAddWatchList] = useState(false);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [loading_r, setLoading_r] = useState<boolean>(false)
  const [addRatting, setAddRating] = useToggle(false);
  const [watchModal, setWatchModal] = useToggle(false);
  const [isComment, setIsComment] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(0);
  const route = useRoute<PreviewScreenRoute>();
  const {navigate} = useNavigation<RootNav>();
  const [replyDetails, setRepliesDetails] = useState<IReplyDetails|null>(null)
  const [commentTxt, setCommentTxt] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
const [downloadPercentage, setDownloadPercentage] = useState(0);
    const [vodRating, setVODRating] = useState<IVODRatings|null>(null);
    const [accessStatus, setAccessStatus] = useState<boolean>(false);
      const [isFullscreenContent, setFullscreenContent] = useState<IDownloadData|null>(null)
 const dispatch = useAppDispatch();
 const {hasDownloadById,addDownload} = useAppPersistStore()
 const isDownloaded = hasDownloadById(previewContent._id);
 const {top} = useSafeAreaInsets();
const premiumCost = useAppSelector(selectUserPremiumCost)
const isFocused = useIsFocused();
const lastUpdateRef = useRef(Date.now());

  async function getCommentCount(){
    const res = await totalCommentCount(previewContent._id)
    if(res.ok && res.data && res.data.data.totalComments) setCommentCount(res.data.data.totalComments)
  }

  async function handleVODRating(){
    const res = await getVODRatings(previewContent._id)
    // console.log(JSON.stringify(res.data,null,2))
    if(res.ok && res.data){
      if(res.data.data.totalStats.length>0) setVODRating(res.data.data)
    } 
  }

  async function handleAddRating(){
    try {
      setLoading_r(true);
      const res = await addVODRating({
        rate:rating, 
        parentId:previewContent._id,
        parentType:'vod'
      });
      if(res.ok && res.data){
        ToastNotification('success', res.data.message)
      }else{
        ToastNotification('error', `${res.data?.message}`)
      }
    } catch (error) {
      ToastNotification('error', `${error}`)
    }finally{
      setLoading_r(false);
      await handleVODRating();
    }
  }

  async function getWatchListStatus(){
    const res = await checkIsWatchList(previewContent._id)
    if(res.ok && res.data) setAddWatchList(res.data.data.isListed)
  }

  async function handleAddWatchList(){
    try {
      setLoading(true);
      setAddWatchList(true);
      const res = await addWatchList(previewContent._id);
      if(res.ok && res.data){
        ToastNotification('info', res.data.message)
      }else{
        ToastNotification('error', `${res.data?.message}`)
        setAddWatchList(false)
      }
    } catch (error) {
      ToastNotification('error', `${error}`);
    }finally{
      setLoading(false);
      getWatchListStatus();
    }
  }

  const content = route.params.content;

  const contentType: string = previewContent.vidClass
  const contentPrice: string = accessStatus ? 'Watch' : (previewContent.amount && previewContent.currency)
    ? `${getSymbolFromCurrency(previewContent.currency)}${formatAmount(`${previewContent.amount}`)}`
    : (contentType === 'premium'&&premiumCost?.currencyCode && premiumCost.amount) ? `${getSymbolFromCurrency(premiumCost?.currencyCode)}${formatAmount(`${premiumCost.amount}`)}`  : 'Watch';


    const {addCommentFunc,loading:loadingComment} = useCommentHook({
    handleFinalFunc: () => getCommentCount(),
    resetFunc: () => [setCommentTxt(''), setRepliesDetails(null)],
    text: commentTxt,
    vodId:previewContent._id,
    ...(replyDetails && {
      parentCommentId:replyDetails.commentId,
      parentReplyId:replyDetails.replyId, 
      reply:true
    })
  })

  async function handleFetchComments(page?:number){
          const res = await fetchCommentbyVOD({vodId:previewContent._id, pagination:{page:page??1, limit:20}});
          if(res.ok && res.data){
            const data = res.data.data
            dispatch(setContentComments(data));
          }
      }

    async function handleContentStatusUpdate(){
      if(contentType === 'free'){
        setAccessStatus(true);
      }else{
        const res = await hasPaidContentStatus({contentType:'vod', _id:previewContent._id})
        if(res.ok && res.data){
          setAccessStatus(res.data.data.canView)
        }else{
          ToastNotification('error', `${res.data?.message}`)
        }
      }
    }

      async function handleDownload() {

        const keys = await getAESKeys();
          if (!keys) {
            ToastNotification('error', 'Encryption keys missing');
            return;
          }
          const { key, iv } = keys;

          const fileSize = await getRemoteFileSize(previewContent.video); // bytes
          const sizeInMB = fileSize ? (fileSize / (1024 * 1024)).toFixed(2) : null;

          setDownloadPercentage(0);
          setIsDownloading(true);

        const path = await downloadAndSave({
          url: previewContent.video,
          filename: `${previewContent._id}.mp4`,
           onProgress: (percent) => {
        const now = Date.now();
        const minUpdateInterval = 200;
        if (percent === 100 || now - lastUpdateRef.current > minUpdateInterval) {
          setDownloadPercentage(percent);
          lastUpdateRef.current = now;
        }
      },
        });

        if (!path) {
          ToastNotification('error','Download failed');
          return;
        }

          const encryptedPath = `${RNFS.DocumentDirectoryPath}/${previewContent._id}.enc`;
          try {
            setIsDownloading(true)
    await encryptFile(path, encryptedPath, key, iv);
    console.log('Encryption successful:', encryptedPath);

    addDownload({
      _id:previewContent._id,
      title:previewContent.title,
      pg:previewContent.pg,
      portraitPhoto:previewContent.portraitPhoto,
      landscapePhoto:previewContent.landscapePhoto,
      video: encryptedPath,
      size:sizeInMB,
      desc:previewContent.description,
      type:previewContent.type,
      viewsCount:previewContent.viewsCount,
      vidClass:previewContent.vidClass
    })
  } catch (error) {
    console.error('Encryption failed:', error);
    ToastNotification('error', 'Encryption failed');
  }finally{
    setIsDownloading(false)
  }
}

  const handleShare = () => {
    Share.open({message: 'share movie'})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  useEffect(() => {
    if(!isFocused) return
    Orientation.lockToPortrait();
    handleFetchComments()
    handleContentStatusUpdate();
    handleVODRating();
    getWatchListStatus();
    getCommentCount();
  }, [isFocused]);

  useEffect(() =>{
    if(!isFullscreen) setFullscreenContent(null);
  }, [isFullscreen])


  return (
    <>
       {!(isFullscreenContent && isFullscreen) && <AppScreen
        isFullscreen={isFullscreen}
          containerStyle={{position: 'relative', paddingBottom: 100, paddingHorizontal: 0, flex:1}} className='bg-black'>
          <StatusBar hidden={isFullscreen} translucent backgroundColor={colors.DEEP_BLACK} />

          
            <View style={{height:isFullscreen ? Size.wp(100) : 216}} className='w-full'>
              <P_Header 
                isFullscreen={isFullscreen} 
                setFullscreen={isFullscreen ? makePortrait : makeFullscreen} 
                content={previewContent}
              />
          </View>

         {!isFullscreen && <>
          <AppView className="h-full">
            <AppView className="px-5 flex-row items-center justify-between mt-[13px]">
              <Pressable style={{marginLeft: 6}} onPress={handleAddWatchList}>
                {loading ? <ActivityIndicator size={'small'} color={colors.DARK_GREY} /> : addWatchList_boolean ? <VideoLog_F /> : <VideoLogIcon />}
              </Pressable>
              <AppView>
                <AppText className="text-[21px] text-grey_100 font-ROBOTO_700 text-center">
                  {truncateText(20,previewContent.title)}
                </AppText>
                <AppView className="mt-2 flex-row items-center justify-center">
                  {previewContent.genre.map((tag, i) => {
                    return (
                      <Fragment key={i}>
                        <AppText className="font-ROBOTO_700 text-xs text-grey_white">
                          {tag.name}
                        </AppText>
                        {i !== previewContent.genre.length - 1 && (
                          <AppView className="w-1.5 h-1.5 rounded-full bg-white mt-[2.8px] mx-1.5" />
                        )}
                      </Fragment>
                    );
                  })}
                </AppView>
              </AppView>
              <TouchableOpacity className='opacity-45' disabled onPress={handleShare}>
                <ShareIcon />
              </TouchableOpacity>
            </AppView>

            {!addRatting && (
              <AppView className="px-5">
                <AppView className="border-y border-grey_200/10 py-[7px] mt-4 flex-row items-center justify-between">
                  <TouchableOpacity onPress={setAddRating}>
                    <AppText className="text-center font-ROBOTO_400 text-grey_200 text-[11px]">
                      {formatLikesNumber(previewContent.viewsCount)} VIEWS
                    </AppText>
                    <View className='flex-row items-center justify-center gap-x-1 my-1'>
                    <AppText className="text-center font-ROBOTO_700 text-grey_200 text-[15px]">
                      {previewContent.averageRating}
                    </AppText>
                    <SM_Rate_F />
                    </View>
                    <Text className="text-center font-ROBOTO_400 text-grey_200 text-[10px]">Tap to Rate</Text>
                  </TouchableOpacity>
                  <AppView className="h-[30px] w-[1px] border-l border-grey_200/10" />
                  <AppView>
                    <AppText className="text-center font-ROBOTO_400 text-grey_200 text-[11px]">
                      PG
                    </AppText>
                    <AppText className="text-center my-1 font-ROBOTO_700 text-grey_200 text-[15px]">
                      {previewContent.pg}+
                    </AppText>
                    <AppText className="text-center font-ROBOTO_400 text-grey_200 text-[10px]">
                      Years Old
                    </AppText>
                  </AppView>
                  <AppView className="h-[30px] w-[1px] border-l border-grey_200/10" />

                  <TouchableOpacity onPress={() => setIsComment(!isComment)}>
                    <AppText className="text-center font-ROBOTO_400 text-grey_200 text-[11px]">
                      COMMENTS
                    </AppText>
                    <AppText className="text-center my-1 font-ROBOTO_700 text-grey_200 text-[15px]">
                      {formatLikesNumber(commentCount)}
                    </AppText>
                    <AppText className="text-center font-ROBOTO_400 text-grey_200 text-[10px]">
                      Tap to Add
                    </AppText>
                  </TouchableOpacity>
                  <AppView className="h-[30px] w-[1px] border-l border-grey_200/10" />

                  <AppView>
                    <AppText className="text-center font-ROBOTO_400 text-grey_200 text-[11px]">
                      DURATION
                    </AppText>
                    <AppText className="text-center my-1 font-ROBOTO_700 text-grey_200 text-[15px]">
                      {previewContent.runtime}
                    </AppText>
                    <AppText className="text-center font-ROBOTO_400 text-grey_200 text-[10px]">
                      {new Date(previewContent.releaseDate).getFullYear()}
                    </AppText>
                  </AppView>
                </AppView>
              </AppView>
            )}

            {Platform.OS === 'ios' && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={isComment && {paddingBottom: 112}}>
                <AppView
                  style={
                    isComment
                      ? {
                          height: Size.getHeight() - 100,
                        }
                      : {flex: 1}
                  }
                  className="relative mt-1">
                  {isComment && (
                    <AppView className="absolute z-30 w-full h-full">
                      <AppView className="relative">
                        <Blur
                          blurType="dark"
                          blurAmount={70}
                          style={styles.blur}
                        />

                        <AppView className="absolute w-full h-full pt-[18px]">
                          <AppView className="px-5">
                            <AppText className="ml-3 font-ROBOTO_500 text-grey_200 text-[14px]">
                              {commentCount} Comments
                            </AppText>

                            <AppView className="relative mt-4 w-full rounded-[30px] overflow-hidden bg-grey_900">
                           {replyDetails && <View className='h-12 w-full flex-row items-center justify-between px-5 bg-[#151414]'>
                              <Text className='font-ROBOTO_400 text-grey_600'>Replying to @{replyDetails.name}</Text>
                                <TouchableOpacity onPress={() => setRepliesDetails(null)}>
                                  <SmallCloseIcon />
                                </TouchableOpacity>
                            </View>}
                            <View className={`flex-row w-full p-[4px] ${replyDetails ? 'pl-3':''}`}>
                              <AppImage
                                className="w-[39px] h-[39px] rounded-full mr-3"
                                source={require('@/assets/images/bette.png')}
                              />
                              <TextInput
                                placeholder="Write a comment..."
                                placeholderTextColor="#C4C4C4C7"
                                cursorColor={colors.RED}
                                value={commentTxt}
                              onChangeText={setCommentTxt}
                              style={[
                                styles.input,
                                {flex: 1},
                              ]}
                            />
                            {/* Send button */}
                            <TouchableOpacity
                              style={{alignSelf: 'center'}}
                              disabled={commentTxt === '' || loadingComment}
                              onPress={()  => [Keyboard.dismiss(), addCommentFunc()]}
                              className="z-10 mr-4">
                              <CommentSendBtn />
                            </TouchableOpacity>
                              </View>
                            </AppView>
                          </AppView>

                          <PreviewComments 
                            setRepliesDetails={setRepliesDetails}
                            vodId={previewContent._id}
                          />
                        </AppView>
                        <TouchableOpacity
                          onPress={() => setIsComment(false)}
                          className="absolute bottom-0 z-40 w-full py-5 bg-[#1A1A1A]">
                          <AppText className="text-center text-grey_200 font-ROBOTO_400">
                            Close
                          </AppText>
                        </TouchableOpacity>
                      </AppView>
                    </AppView>
                  )}

                  {/* From here */}
                  <ScrollView
                    contentContainerStyle={{paddingBottom: 100, paddingTop: 2}}
                    showsVerticalScrollIndicator={false}>
                    {!addRatting ? (
                      <AppView className="px-5">
                        {/* desc */}

                        <AppView className="items-center mt-5 px-4">
                          <AppText className="font-ROBOTO_400 uppercase text-white text-[11px]">
                            {previewContentType[content]}
                          </AppText>
                          <AppText className="text-center mt-2 font-ROBOTO_400 text-white text-xs">
                            {previewContent.description}
                          </AppText>

                          <AppView className="my-3.5 w-full justify-center relative">
                          {content !== previewContentType['tv series'] && <TouchableOpacity
                          disabled={isDownloaded}
                          style={{opacity: isDownloaded?0.4 :1}}
                          className='absolute right-2 z-20'
                            onPress={handleDownload}>
                            <PreviewDownloadIcon />
                          </TouchableOpacity>}
                            <AppView
                className={`mx-auto ${
                  contentType === 'premium'
                    ? 'border-green px-1.5'
                    : contentType === 'free'
                    ? 'border-yellow px-3'
                    : 'border-red px-1.5'
                } pt-1.5 pb-1.5 border rounded-[3px]`}>
                <AppText
                  className={`text-[9px] uppercase font-ROBOTO_400 ${
                    contentType === 'premium'
                      ? 'text-green'
                      : contentType === 'free'
                      ? 'text-yellow'
                      : 'text-red'
                  }`}>
                  {contentType}
                </AppText>
              </AppView>
                          </AppView>

                          <AppButton
                            title={contentPrice}
                            style={{marginTop: 10, width: '100%'}}
                            bgColor={colors.RED}
                            labelStyle={styles.btnLabel_}
                            onPress={() =>
                              // contentPrice === 'Watch' && contentType === 'free'
                              //   ? navigate(routes.FULL_SCREEN_VIDEO, {
                              //       videoURL:
                              //         content === previewContentType.film
                              //           ? MovieVideo
                              //           : content ===
                              //             previewContentType['music video']
                              //           ? MusicVideo
                              //           : SeriesVideo,
                              //       type: previewContentType['tv series']
                              //         ? fullVideoType.series
                              //         : fullVideoType.default,
                              //     })
                                // : 
                                setWatchModal()
                            }
                            iconRight={
                              contentPrice === 'Watch' ? (
                                <PreviewPlayIcon />
                              ) : (
                                <></>
                              )
                            }
                          />
                        </AppView>

                        {/* Dynamic View */}
                        {/* {!isComment && ( */}
                          <>
                            {content === previewContentType['music video'] ? (
                              <RelatedContent 
                              title="Related Videos" 
                              vodId={previewContent._id} 
                              genreId={previewContent.genre[Math.floor(Math.random() * previewContent.genre.length)]._id}
                              />
                            ) : content === previewContentType['tv series'] ? (
                              <SeriesContent 
                                vod={previewContent} 
                                accessStatus={accessStatus} 
                                setFullscreenContent={setFullscreenContent}
                                makeFullscreen={makeFullscreen}
                              />
                            ) : (
                              <FilmContent 
                                vodId={previewContent._id} 
                                casts={previewContent.cast} 
                                genreId={previewContent.genre[Math.floor(Math.random() * previewContent.genre.length)]._id}
                                />
                            )}
                          </>
                        {/* )} */}
                      </AppView>
                    ) : (
                      <AppView
                        style={{height: Size.getHeight() - 400}}
                        className="relative">
                        <AppView className="px-5 w-full">
                          <RatingView 
                            rating={rating}
                            setRating={setRating}
                            vod={previewContent}
                            vodRatings={vodRating}
                          />
                        </AppView>

                        <AppButton
                          bgColor={colors.RED}
                        isLoading={loading_r}
                        isDisable={rating === 0}
                        title="Submit"
                        onPress={handleAddRating}
                          style={{
                            width: '90%',
                            alignSelf: 'center',
                            marginTop: 45,
                          }}
                        />

                        <Pressable
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            alignSelf: 'center',
                          }}
                          onPress={setAddRating}>
                          <BigClose />
                        </Pressable>
                      </AppView>
                    )}
                  </ScrollView>
                </AppView>
              </ScrollView>
            )}

            {Platform.OS === 'android' && (
              <AppView
                style={
                  isComment
                    ? {
                        height: Size.hp(55),
                        // flex: 1,
                        // marginBottom: 50,
                      }
                    : {flex: 1}
                }
                className="relative mt-1">
                {isComment && (
                  <AppView className="absolute z-30 w-full h-full">
                    <AppView className="relative">
                      {Platform.OS === 'android' ? (
                        <AppView style={styles.blur}>
                          <BlurView
                            backgroundColor="rgba(0, 0, 0, 0.4)"
                            blurRadius={20}
                          />
                        </AppView>
                      ) : (
                        <Blur
                          blurType="dark"
                          blurAmount={70}
                          style={styles.blur}
                        />
                      )}

                      <AppView className="absolute w-full h-full pt-[18px]">
                        <AppView className="px-5">
                          <AppText className="ml-3 font-ROBOTO_500 text-grey_200 text-[14px]">
                            {formatLikesNumber(commentCount)} Comments
                          </AppText>

                          <AppView className="relative mt-4 w-full rounded-[30px] overflow-hidden bg-grey_900">
                           {replyDetails && <View className='h-12 w-full flex-row items-center justify-between px-5 bg-[#151414]'>
                              <Text className='font-ROBOTO_400 text-grey_600'>Replying to @{replyDetails.name}</Text>
                                <TouchableOpacity onPress={() => setRepliesDetails(null)}>
                                  <SmallCloseIcon />
                                </TouchableOpacity>
                            </View>}
                            <View className={`flex-row w-full p-[4px] ${replyDetails ? 'pl-3':''}`}>
                            <AppImage
                              style={{
                                width:39,
                                height:39,
                                borderRadius:99,
                                marginRight: 10
                              }}
                              source={(userPic && userPic === '') ? {uri: userPic, priority:FastImage.priority.high} : require('@/assets/images/user.png')}
                            />
                            <TextInput
                              placeholder="Write a comment..."
                              placeholderTextColor="#C4C4C4C7"
                              cursorColor={colors.RED}
                              value={commentTxt}
                              onChangeText={setCommentTxt}
                              style={[
                                styles.input,
                                {flex: 1},
                              ]}
                            />
                            {/* Send button */}
                            <TouchableOpacity
                              style={{alignSelf: 'center'}}
                              disabled={commentTxt === '' || loadingComment}
                              onPress={()  => [Keyboard.dismiss(), addCommentFunc()]}
                              className="z-10 mr-4">
                              <CommentSendBtn />
                            </TouchableOpacity>
                            </View>
                          </AppView>
                        </AppView>

                        <PreviewComments 
                          setRepliesDetails={setRepliesDetails}
                          vodId={previewContent._id}
                        />
                      </AppView>
                      <TouchableOpacity
                        onPress={() => setIsComment(false)}
                        className="absolute bottom-0 z-40 w-full py-5 bg-[#1A1A1A]">
                        <AppText className="text-center text-grey_200 font-ROBOTO_400">
                          Close
                        </AppText>
                      </TouchableOpacity>
                    </AppView>
                  </AppView>
                )}

                {/* From here */}
                <ScrollView
                  contentContainerStyle={{paddingBottom: 100, paddingTop: 2}}
                  showsVerticalScrollIndicator={false}>
                  {!addRatting ? (
                    <AppView className="px-5">
                      {/* desc */}

                      <AppView className="items-center mt-5 px-4">
                        <AppText className="font-ROBOTO_400 uppercase text-white text-[11px]">
                          {previewContentType[content]}
                        </AppText>
                        <AppText className="text-center mt-2 font-ROBOTO_400 text-white text-xs">
                          {previewContent.description}
                        </AppText>

                        <AppView className="my-3.5 w-full justify-center relative">
                          {content !== previewContentType['tv series'] && <View><TouchableOpacity
                          disabled={isDownloaded||isDownloading || !accessStatus}
                          className='absolute right-2 z-20 items-center'
                             onPress={handleDownload}>
                             {isDownloaded ? <DownloadedCompleteIcon /> : <>
                            <PreviewDownloadIcon />
                            {isDownloading && <Text className='font-ROBOTO_400 text-white text-sm text-center my-[2px]'>{downloadPercentage}%</Text>}
                              </>}
                          </TouchableOpacity>
                          </View>}
                            <AppView
                              className={`mx-auto ${
                                contentType === 'premium'
                                  ? 'border-green px-1.5'
                                  : contentType === 'free'
                                  ? 'border-yellow px-3'
                                  : 'border-red px-1.5'
                              } pt-1.5 pb-1.5 border rounded-[3px]`}>
                              <AppText
                                className={`text-[9px] uppercase font-ROBOTO_400 ${
                                  contentType === 'premium'
                                    ? 'text-green'
                                    : contentType === 'free'
                                    ? 'text-yellow'
                                    : 'text-red'
                                }`}>
                                {contentType}
                              </AppText>
                            </AppView>
                        </AppView>

                        <AppButton
                          title={contentPrice}
                          style={{marginTop: 10, width: '95%', borderRadius:15}}
                          bgColor={colors.RED}
                          labelStyle={styles.btnLabel_}
                          onPress={() =>
                            accessStatus
                            ? 
                            makeFullscreen()
                              : 
                              navigate(routes.MAIN, {
                                screen: routes.SUBSCRIPTION_SCREEN, 
                                params:{
                                  tab: getWatchTag(previewContent.vidClass.toLowerCase(), false), 
                                  currency: contentType === 'premium'&&premiumCost ? premiumCost.currencyCode : previewContent.currency, 
                                  amount: `${contentType === 'premium'&&premiumCost ? premiumCost.amount : previewContent.amount}`,
                                  stage:'paymentSummary',
                                  metadata: {videoId: previewContent._id}
                              }})
                            }
                          iconRight={
                            contentPrice === 'Watch' ? (
                              <PreviewPlayIcon />
                            ) : (
                              <></>
                            )
                          }
                        />
                      </AppView>

                      {/* Dynamic View */}
                      {/* {!isComment && ( */}
                        <>
                          {content === previewContentType['music video'] ? (
                            <RelatedContent 
                            title="Related Videos" 
                            vodId={previewContent._id} 
                            genreId={previewContent.genre[Math.floor(Math.random() * previewContent.genre.length)]._id}
                            />
                          ) : content === previewContentType['tv series'] ? (
                            <SeriesContent
                              vod={previewContent} 
                              accessStatus={accessStatus} 
                              setFullscreenContent={setFullscreenContent}
                              makeFullscreen={makeFullscreen}
                            />
                          ) : (
                            <FilmContent 
                              casts={previewContent.cast}
                              genreId={previewContent.genre[Math.floor(Math.random() * previewContent.genre.length)]._id}
                              vodId={previewContent._id}
                            />
                          )}
                        </>
                      {/* )} */}
                    </AppView>
                  ) : (
                    <AppView
                      style={{height: Size.getHeight() - 400}}
                      className="relative">
                      <AppView className="px-5 w-full">
                        <RatingView 
                           rating={rating}
                            setRating={setRating}
                            vod={previewContent}
                            vodRatings={vodRating}
                        />
                      </AppView>

                      <AppButton
                        bgColor={colors.RED}
                        isLoading={loading_r}
                        isDisable={rating === 0}
                        title="Submit"
                        onPress={handleAddRating}
                        style={{
                          width: '90%',
                          alignSelf: 'center',
                          marginTop: 45,
                        }}
                      />

                      <Pressable
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          alignSelf: 'center',
                        }}
                        onPress={setAddRating}>
                        <BigClose />
                      </Pressable>
                    </AppView>
                  )}
                </ScrollView>
              </AppView>
            )}
          </AppView>

          <AppModal
            isModalVisible={watchModal}
            style={{
              height: 390,
            }}
            replaceDefaultContent={
              <AppView
                style={
                  contentType === 'premium' && {marginTop: 8, marginBottom: -2}
                }
                className="items-center mt-3 mb-2">
                <AppText className="text-center font-ROBOTO_500 text-[15px] text-black">
                  {contentType === 'exclusive' &&
                    'Sorry this Content is not free.'}
                  {contentType === 'premium' &&
                    `You don’t have an active subscription`}
                </AppText>
                {contentType === 'premium' && (
                  <AppText className="mt-4 mb-1 font-ROBOTO_700 text-[14px] text-black">
                    TO WATCH PREMIUM
                  </AppText>
                )}
                <AppText
                  style={contentType === 'premium' && {marginBottom: 18}}
                  className="text-center max-w-[80%] font-ROBOTO_400 text-[14px] text-black my-3 mb-4">
                  {contentType === 'exclusive' &&
                    'This is an Exclusive content, you must purchase to watch.'}
                  {contentType === 'premium' &&
                    'This is a Premium content, you must subscribe to watch.'}
                </AppText>

                {contentType === 'premium' && (
                  <>
                    <AppButton
                      bgColor={colors.RED}
                      title="Subscribe"
                      onPress={() => [
                        navigate(routes.MAIN, {
                          screen: routes.SUBSCRIPTION_SCREEN,
                          params: {tab: 'getSubscription'},
                        }),
                        setWatchModal(false),
                      ]}
                      style={styles.btn}
                      labelStyle={styles.btnLabel}
                    />
                  </>
                )}

                {contentType === 'exclusive' && (
                  <>
                    <AppButton
                      bgColor={colors.RED}
                      title="₦300"
                      onPress={() => [
                        navigate(routes.PAYMENT_SCREEN),
                        setWatchModal(),
                      ]}
                      style={styles.btn}
                      labelStyle={styles.btnLabel}
                    />
                    <AppButton
                      bgColor={colors.DARK_GREY}
                      title="Watch trailer"
                      onPress={() => [
                        // navigate(routes.FULL_SCREEN_VIDEO, {
                        //   videoURL:
                        //     content === previewContentType.film
                        //       ? MovieVideo
                        //       : content === previewContentType['music video']
                        //       ? MusicVideo
                        //       : SeriesVideo,
                        //   type: previewContentType['tv series']
                        //     ? fullVideoType.series
                        //     : fullVideoType.default,
                        // }),
                        setWatchModal(),
                      ]}
                      style={styles.btn}
                      labelStyle={styles.btnLabel}
                    />
                  </>
                )}
              </AppView>
            }
            handleClose={setWatchModal}
          />
         </>}

        </AppScreen>}

         {(isFullscreenContent && isFullscreen) && <DownloadFullscreenModalPlayer
          isFullscreen={isFullscreen}
          content={isFullscreenContent}
          setFullscreen={() => isFullscreen ? [makePortrait(), setFullscreenContent(null)] : makeFullscreen()} 
        />}
    </>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  btnLabel: {
    fontFamily: fonts.ROBOTO_700,
    fontSize: 17,
    color: colors.GREY_100,
    marginLeft: 8,
    marginTop: 1,
  },
  btnLabel_: {
    fontFamily: fonts.ROBOTO_700,
    fontSize: 17,
    color: colors.GREY_100,
    marginLeft: 8,
    marginTop: 1,
    textTransform: 'uppercase',
  },
  btn: {
    width: Size.getWidth() * 0.4,
    paddingTop: Size.calcHeight(11),
    paddingBottom: Size.calcHeight(10),
    borderRadius: 4,
    marginVertical: 5,
  },
  btnTxt: {
    fontFamily: fonts.ROBOTO_700,
    fontSize: 16,
    color: colors.WHITE,
    textAlign: 'center',
  },
  blur: {
    width: '100%',
    height: '100%',
  },
  input: {
    fontFamily: fonts.ROBOTO_400,
    fontSize: 14,
    color: colors.WHITE,
  },
});
