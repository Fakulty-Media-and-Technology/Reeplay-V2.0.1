import { addComment, addReplyToComment, getCommentById } from "@/api/comment.api";
import ToastNotification from "@/components/ToastNotifications";
import { useAppDispatch, useAppSelector } from "@/Hooks/reduxHook";
import { addCommentReducers, addReplyByCommentId, selectPreviewVODComments, setContentComments } from "@/store/slices/previewContentSlice";
import { selectUser, selectUserProfilePic } from "@/store/slices/userSlice";
import { useAppPersistStore } from "@/store/zustand.store";
import { IComment, ICommentData, IReplyData } from "@/types/api/comment.types";
import { useState } from "react";

interface Props{
    text:string
    vodId:string
    parentCommentId?:string
    parentReplyId?:string
    reply?:boolean
    resetFunc:() => void
    handleFinalFunc:() => void
}

export const useCommentHook = ({reply, resetFunc, handleFinalFunc, text, vodId, parentReplyId, parentCommentId}:Props) =>{
    const user = useAppSelector(selectUser)
    const userProfilePic = useAppSelector(selectUserProfilePic)
    const commentList = useAppSelector(selectPreviewVODComments)
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const {setIsToken} = useAppPersistStore()


     async function getCommentArray(_id: string) {
    try {
      handleFinalFunc()
      const response = await getCommentById(
       {commentId: _id,
        type: reply ? 'REPLY'
          : 'COMMENT'}
      );
      if (response.data?.message.toLowerCase() === 'you shall not pass')
        setIsToken(true);
      if (response.ok && response.data) {
        const data = response.data.data;
        const replyData = 'parentCommentId' in data && data;
        dispatch(
          (replyData && replyData.parentCommentId)
            ? addReplyByCommentId({
                commentId: replyData.parentCommentId,
                reply: replyData,
              })
            : addCommentReducers({...data as IComment, loading: false}),
        );
      }
    } catch (error) {
      ToastNotification("Opps! Something went wrong, couldn't load comments");
    }
  }


    const addCommentFunc = async () => {
    let comment: ICommentData = {
      message: text,
      parentType:'vod',
      parentId: vodId
    };
    let replyComment: IReplyData = {
      message: text,
      parentType:'vod',
      parentId: vodId,
      parentCommentId:parentCommentId??'',
      parentReplyId: parentReplyId ??'',
    };

    const data:IComment = {
      _id: user._id,
      content: text,
      createdAt: `${new Date().toISOString()}`,
      updatedAt: `${new Date().toISOString()}`,
      totalReactions:0,
      reactionId:null,
      totalReplies:0,
      authorPhotoURL: userProfilePic,
      author: {
        userDocumentId: user._id,
        fullName: `${user.first_name} ${user.last_name}`,
        photoBucket:null,
        photoKey:null,
      },
      loading: true,
    };

    if (!reply) {
      dispatch(setContentComments([data,...commentList]));
    }

    if (reply && parentCommentId) {
      dispatch(
        addReplyByCommentId({
          commentId: parentCommentId,
          reply: {
            ...data,
           parentCommentAuthor:{
            fullName:'',
            photoBucket:null,
            photoKey:null,
            userDocumentId:''
           },
           parentCommentId,
          },
        }),
      );
    }


    try {
      setLoading(true);
      const response = reply
          ? await addReplyToComment(replyComment)
          : await addComment(comment);
      resetFunc();
      if (response.ok && response.data) {
        console.log(response.data)
        getCommentArray(
           response.data.data._id,
        );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return{
    addCommentFunc,
    loading
  }
}