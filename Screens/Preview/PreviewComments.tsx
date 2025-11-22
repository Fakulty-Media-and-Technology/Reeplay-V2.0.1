import {ActivityIndicator, FlatList, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CommentCard from './components/CommentCard';
import { selectPreviewVODComments, setContentComments } from '@/store/slices/previewContentSlice';
import { useAppDispatch, useAppSelector } from '@/Hooks/reduxHook';
import { IReplyDetails } from '@/types/api/comment.types';
import { fetchCommentbyVOD } from '@/api/comment.api';

interface Props{
  setRepliesDetails: React.Dispatch<React.SetStateAction<IReplyDetails | null>>
  vodId:string
}
const PreviewComments = ({setRepliesDetails, vodId}:Props) => {
    const flatListRef = useRef(null);
    const dispatch = useAppDispatch();
    const commentList = useAppSelector(selectPreviewVODComments);
    const [page, setPage] = useState<number>(1)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

     async function handleRefresh() {
    setIsRefreshing(true);
    setHasMore(true);
    await Promise.all([handleFetchComments(1)]);
    setIsRefreshing(false);
  }

    async function handleFetchComments(page?:number){
      if(!hasMore || loading) return
      try {
        setLoading(true);
        const res = await fetchCommentbyVOD({vodId, pagination:{page:page??1, limit:20}});
        if(res.ok && res.data){
          const data = res.data.data
          const exitingId = new Set<string>(commentList.map(x => x._id))
          const merged = [
            ...commentList,
            ...data.filter(x => !exitingId.has(x._id))
          ]
          if(merged.length === commentList.length) setHasMore(false);
          dispatch(setContentComments(merged));
          if(page) setPage(page)
        }else{
          setHasMore(false)
        }
      } catch (error) {
        setHasMore(false)
      }finally{
        setLoading(false)
      }
    }

  const loadMore = useCallback(() => {
    if (!hasMore || commentList.length < 20) return;
      handleFetchComments(commentList.length >= page * 20 ? page + 1 : page);
  }, [page, hasMore]);

  useEffect(() =>{
    if(hasMore) return;
    setTimeout(() =>{
      setHasMore(true)
    }, 5000)
  }, [hasMore])

  return (
    <FlatList
          ref={flatListRef}
          keyboardShouldPersistTaps="always"
          keyExtractor={item => item._id}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          bounces={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingBottom: Platform.OS === 'ios' ? 20 : 30,
          }} 
          onEndReachedThreshold={1}         
          onEndReached={loadMore}
          showsVerticalScrollIndicator={false}
          data={commentList}
          renderItem={({item, index}) => {
            return (
              <CommentCard 
                item={item}
                commentIndex={index}
                setRepliesDetails={setRepliesDetails}
              />
            )}}
           ListFooterComponent={
          <>
            {loading && !isRefreshing && (
              <View className="h-20 items-center justify-center">
                <ActivityIndicator size={'large'} />
              </View>
            )}
          </>
        }
          />
  );
};

export default PreviewComments;

const styles = StyleSheet.create({});
