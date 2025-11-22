import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {AppImage, AppText, AppView, TouchableOpacity} from '@/components';
import {LikeBtn, LikeBtn_F, ReplyIcon} from '@/assets/icons';
import useToggle from '@/Hooks/useToggle';
import { IComment, IReply, IReplyDetails } from '@/types/api/comment.types';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { selectRepliesByCommentId, setRepliesByCommentId, updateCommentById, updateRepliesByReplyId } from '@/store/slices/previewContentSlice';
import { fetchRepliesbyCommentId, getCommentById } from '@/api/comment.api';
import ToastNotification from '@/components/ToastNotifications';
import Size from '@/Utils/useResponsiveSize';
import fonts from '@/configs/fonts';
import colors from '@/configs/colors';
import { getTimeAgo } from '@/Utils/formatTime';
import { formatLikesNumber } from '@/Utils/formatAmount';
import { addReaction, deleteReaction } from '@/api/content.api';
import { useAppPersistStore } from '@/store/zustand.store';
import FastImage from 'react-native-fast-image';

interface Props{
  item: IComment
  commentIndex:number
  setRepliesDetails: React.Dispatch<React.SetStateAction<IReplyDetails | null>>
}
const CommentCard = ({commentIndex, setRepliesDetails, item}:Props) => {
  const dispatch = useAppDispatch();
  const [viewAllReply, setViewAllReply] = useState<boolean>(false);
  const sortedReplies: IReply[] =
    item._id === item.author.userDocumentId
      ? []
      : useAppSelector(selectRepliesByCommentId(item._id));
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

   async function fetchReplies(page?: number) {
    if (loading) return;
    try {
      setLoading(true);

      const res = await fetchRepliesbyCommentId({commentId:item._id, pagination:{
        page: page ?? 1,
        limit: 10,
      }});
      if (res.ok && res.data) {
        const data = res.data.data;
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        const existing = new Set(sortedReplies.map(x => x._id));
        const uniqueReplies = sortedData.filter(
          reply => !existing.has(reply._id),
        );
        const newReplies = [...sortedReplies, ...uniqueReplies];
        if (newReplies.length === sortedReplies.length) setHasMore(false);
        dispatch(
          setRepliesByCommentId({commentId: item._id, replies: newReplies}),
        );

        if (page) setPage(page);
      } else {
        ToastNotification('error', `${res.data?.message}`);
        setHasMore(false);
      }
    } catch (error) {
      ToastNotification('error',`${error}`);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

    const loadMore = useCallback(() => {
    if (!hasMore || sortedReplies.length < 10) return;
    fetchReplies(sortedReplies.length >= page * 10 ? page + 1 : page);
  }, [page, hasMore]);

  useEffect(() => {
    fetchReplies();
  }, [item._id]);

  useEffect(() => {
    if (!viewAllReply) loadMore();
  }, [viewAllReply]);


  return (
    <AppView className="border-t border-grey_200/10 mt-4 pt-4 px-3">
      <SingleCommentCard 
        item={item}
        showReplies={showReplies}
        showButton={sortedReplies.length > 0}
        setShowButton={setShowReplies}
        setRepliesDetails={setRepliesDetails}

      />

       <View className="ml-[50px] mt-3">
          {showReplies && sortedReplies.length > 0 &&
            sortedReplies.map((singleReply, index) => {
              return (
                <SingleCommentCard 
                  key={singleReply._id}
                  item={singleReply}
                  setRepliesDetails={setRepliesDetails}
                  isReply
                />
              );
            })}
          {(showReplies && hasMore && sortedReplies.length > 9) && (
            <TouchableOpacity
              onPress={() => viewAllReply ? setShowReplies(!showReplies) : setViewAllReply(!viewAllReply)}
              className='mt-5'>
              <AppText
                style={{
                  fontFamily: fonts.ROBOTO_500,
                  fontWeight: '500',
                  fontSize: Size.calcAverage(14),
                  color: colors.WHITE,
                }}>
                View {!viewAllReply ? 'more' : 'less'} replies
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      
    </AppView>
  );
};

export default CommentCard;


interface SingleCommentCardProps{
  item: IComment | IReply
  isReply?:boolean
  setShowButton?: React.Dispatch<React.SetStateAction<boolean>>
  showButton?:boolean
  showReplies?:boolean
  setRepliesDetails?: React.Dispatch<React.SetStateAction<IReplyDetails | null>>
} 

const SingleCommentCard = ({item, isReply, showReplies, setRepliesDetails, showButton, setShowButton}:SingleCommentCardProps) => {
  const [isLike, setIsLike] = useState<boolean>(false);
  const [reactionCount, setReactionCount] = useState<number>(0);
   const [clicked, setClicked] = useState<boolean>(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const img = item.authorPhotoURL || "parentCommentAuthorPhotoURL" in item && item.parentCommentAuthorPhotoURL
  const dispatch = useAppDispatch();
  const {setIsToken} = useAppPersistStore()

  function handleReplyTo(){
    if(item.loading) return;
    setRepliesDetails?.({
      name: item.author.fullName,
      commentId: ('parentCommentId' in item && item.parentCommentId) ? item.parentCommentId : item._id,
      ...('parentCommentId' in item && {replyId:item._id})
    })
  }

   async function getCommentArray() {
      const response = await getCommentById(
       {commentId: item._id,
        type: isReply ? 'REPLY' : 'COMMENT'
      }
      );
      if (response.data?.message.toLowerCase() === 'you shall not pass')
        setIsToken(true);
      if (response.ok && response.data) {
        const data = response.data.data;
        const reply = 'parentCommentId' in data && data;
        dispatch(
          (reply && isReply && reply.parentCommentId)
            ? updateRepliesByReplyId({commentId: reply.parentCommentId, reply})
            : updateCommentById({...data as IComment, loading: false}),
        );
      }
  }

  async function handleCommentReaction() {
    if (item.loading || clicked) return;
    try {
      setClicked(true);

      if (!isLike && !userReaction) {
        setIsLike(true);
        setReactionCount(reactionCount + 1);

        const response = await addReaction(
          {reaction:'love', commentId:item._id},
        );
        if (!response.ok) {
          setReactionCount(reactionCount);
          setIsLike(false);
          ToastNotification('error',
            'Oops! Something went wrong, Please try liking this event again',
          );
        } else {
          if (response.data) setUserReaction(response.data.data.reactionId);
        }
      }

      if (isLike && userReaction) {
        setIsLike(false);
        setReactionCount(reactionCount - 1);

        const response = await deleteReaction({reactionId:userReaction});
        if (response.status !== 204) {
          setReactionCount(reactionCount);
          setIsLike(true);
          ToastNotification('error',
            'Oops! Something went wrong, Please try unliking this event again',
          );
        } else {
          setUserReaction(null);
        }
      }
    } catch (error) {
      ToastNotification('error',`${error}`);
    } finally {
      getCommentArray();
      setClicked(false);
    }
  }

  useEffect(() => {
    if (item.reactionId) {
      setIsLike(true);
      setUserReaction(item.reactionId);
    }
  }, [item._id]);

  useEffect(() => {
    setReactionCount(item.totalReactions);
  }, [item.totalReactions]);

  return (
    <View className="flex-row relative">
       {item.loading && (
        <View className='absolute top-10 right-4 z-50'>
        <Text className='text-xs text-white font-ROBOTO_400'>Loading...</Text>
        </View>
      )}
      <AppImage
        style={{
          width:39,
          height:39,
          borderRadius:99,
          marginRight: 10
        }}
        source={(img && img !== '') ? {uri: img, priority:FastImage.priority.high} : require('@/assets/images/user.png')}
      />
      <AppView>
        {/* Content */}
        <AppText className="font-ROBOTO_400 text-[11.8px] tracking-wide max-w-[93%] text-white">
         {item.content}
        </AppText>

        {/* Name */}
        <AppView className="flex-row items-center gap-x-1 mt-[3px]">
          <AppText className="font-ROBOTO_700 text-[11.8px] text-yellow">
            {item.author.fullName}
          </AppText>
          <AppText className="font-ROBOTO_400 text-[11.8px] text-grey_200">
            {getTimeAgo(item.updatedAt)}
          </AppText>
        </AppView>

        {/* Buttons */}
        <AppView className="flex-row items-center gap-x-4 mt-[10px]">
          <AppView className="flex-row items-center gap-x-1.5">
            <TouchableOpacity onPress={handleCommentReaction}>
              {isLike ? <LikeBtn_F /> : <LikeBtn />}
            </TouchableOpacity>
            <AppText className="font-ROBOTO_400 text-white text-[11.8px]">
              {formatLikesNumber(reactionCount)}
            </AppText>
          </AppView>
          <TouchableOpacity 
          disabled={item.loading}
          onPress={handleReplyTo}
          className="flex-row items-center gap-x-1.5">
            <ReplyIcon />
            <AppText className="text-[11.8px] text-yellow font-ROBOTO_400">
              Reply
            </AppText>
          </TouchableOpacity>
         {showButton && <TouchableOpacity onPress={() => setShowButton?.(prev => !prev)} className="flex-row items-center gap-x-1.5">
            <AppText className="text-[11.8px] text-white font-ROBOTO_400">
              {showReplies ? 'Hide' : 'View'} replies
            </AppText>
          </TouchableOpacity>}
        </AppView>
      </AppView>
    </View>
  );
};
