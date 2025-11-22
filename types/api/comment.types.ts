import { IGeneric } from "./auth.types"

export interface ITotalCommentCountResponse extends IGeneric{
    data:{
        totalComments:number
    }
}

export interface ICommentData{
    message : string,
    parentType: string,
    parentId: string
}

export interface IReplyData extends ICommentData{
    parentCommentId: string,
    parentReplyId?: string
}

export interface ICommentResponse extends IGeneric{
    data: IComment[]
}

export interface IAddCommentOrReplyResponse extends IGeneric{
    data:{_id:string}
}

export interface IComment {
  _id: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  reactionId: string|null;
  totalReactions: number;
  totalReplies: number;
  content: string;
  authorPhotoURL?: string
  loading?:boolean
}

export interface Author {
  fullName: string;
  photoKey: null;
  photoBucket: null;
  userDocumentId: string;
}

export interface ICommentReplyResponse extends IGeneric{
    data: IComment | IReply
}

export interface IReplyResponse extends IGeneric{
    data: IReply[]
}

export interface IReply extends Omit<IComment, 'totalReplies'>{
    parentCommentAuthor?: Author;
    parentCommentAuthorPhotoURL?: string
    parentCommentId?: string
}

export interface IReplyDetails{
    name:string;
    commentId:string
    replyId?:string
}
