import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app.store';
import { IVODContent } from '@/types/api/content.types';
import { IComment, IReply } from '@/types/api/comment.types';

// Define the initial state using that type
interface PreviewVODProps{
    content: IVODContent;
    comments: IComment[];
    replies: Record<string, IReply[]>
}

const EMPTY_ARRAY:[] = []

const initialState: PreviewVODProps = {
    content: {
     _id: '',
       admin_id: '',
       primaryColor: '',
       title: '',
       subtitle: '',
       type: '',
       description: '',
       pg: '',
       genre: [],
       category: [],
       cast: [],
       likes: [],
       runtime: '',
       featured: false,
       createdAt: '',
       upcomingSubscribers: [],
       active:false,
       showViews:false,
       enagements: 0,
       landscapePhoto: '',
       portraitPhoto: '',
       viewsCount: 0,
       vidClass: '',
       releaseDate: '',
       expiryDate: '',
       defaultRating: 0,
       averageRating: 0,
       seasons: [],
       video: '',
       trailer: '',
},
comments:[],
replies:{}
};

const previewVODSlice = createSlice({
    name: 'previewVOD',
    initialState,
    reducers: {
        setPreviewContent: (state, action:PayloadAction<IVODContent>) => {
          if (state.content._id !== action.payload._id) {
        state.comments = [];
        state.replies = {};
      }
            state.content = action.payload;
        },
        setContentComments:(state, action:PayloadAction<IComment[]>) =>{
          state.comments = action.payload
        },
        setRepliesByCommentId: (
      state,
      action: PayloadAction<{commentId: string; replies: IReply[]}>,
    ) => {
      const {commentId, replies} = action.payload;
      state.replies = {
        ...state.replies,
        [commentId]: replies,
      };
    },
    addReplyByCommentId: (
      state,
      action: PayloadAction<{commentId: string; reply: IReply}>,
    ) => {
      const {commentId, reply} = action.payload;
      const existing = state.replies[commentId] ?? [];

      const index = existing.findIndex(
        x => x.author.userDocumentId === reply.author.userDocumentId && x.content === reply.content,
      );

      let updated: IReply[];
      if (index !== -1) {
        updated = [...existing];
        updated[index] = reply;
      } else {
        updated = [reply, ...existing];
      }

      state.replies = {
        ...state.replies,
        [commentId]: updated,
      };
    },
    addCommentReducers: (state, action: PayloadAction<IComment>) => {
      const newComment = action.payload;

      const index = state.comments.findIndex(
        comment =>
          comment.author.userDocumentId === newComment.author.userDocumentId &&
          comment.content === newComment.content,
      );

      if (index !== -1) {
        state.comments = [
          ...state.comments.slice(0, index),
          newComment,
          ...state.comments.slice(index + 1),
        ];
      } else {
        state.comments = [newComment, ...state.comments];
      }
    },
     updateCommentById: (state, action: PayloadAction<IComment>) => {
      const index = state.comments.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.comments[index] = {
          ...action.payload,
        };
      }
    },

    updateRepliesByReplyId: (
      state,
      action: PayloadAction<{commentId: string; reply: IReply}>,
    ) => {
      const {commentId, reply} = action.payload;
      const existing = state.replies[commentId] ?? [];

      const index = existing.findIndex(r => r._id === reply._id);
      if (index === -1) return;

      const updated = [...existing];
      updated[index] = reply;

      state.replies = {
        ...state.replies,
        [commentId]: updated,
      };
    },
    },
});

export const { setPreviewContent, setContentComments, updateCommentById, updateRepliesByReplyId, setRepliesByCommentId, addCommentReducers, addReplyByCommentId } = previewVODSlice.actions;


export const selectPreviewVODContent = (state: RootState) =>
    state.previewVODContent.content;

export const selectPreviewVODComments = (state: RootState) =>
    state.previewVODContent.comments;

export const selectRepliesByCommentId =
  (discussionId: string) => (state: RootState) => {
    return state.previewVODContent.replies[discussionId] ?? EMPTY_ARRAY;
  };

export default previewVODSlice.reducer;
