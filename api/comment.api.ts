import { IAddCommentOrReplyResponse, ICommentData, ICommentReplyResponse, ICommentResponse, IReplyData, IReplyResponse, ITotalCommentCountResponse } from "@/types/api/comment.types";
import { apiCall } from "./profile.api";
import { IGeneric, IPagination } from "@/types/api/auth.types";



export const totalCommentCount = async (_id:string) =>
    await apiCall<ITotalCommentCountResponse>(baseApi => baseApi.get<ITotalCommentCountResponse>(`/customers/socials/fetch/total-comments/${_id}`))

export const addComment = async (data: ICommentData) =>
    await apiCall<IAddCommentOrReplyResponse>(baseApi => baseApi.post<IAddCommentOrReplyResponse>(`/customers/socials/create/comment`, data))

export const addReplyToComment = async (data: IReplyData) =>
    await apiCall<IAddCommentOrReplyResponse>(baseApi => baseApi.post<IAddCommentOrReplyResponse>(`/customers/socials/create/reply`, data))

export const fetchCommentbyVOD = async (data: {vodId:string, pagination:IPagination}) =>
    await apiCall<ICommentResponse>(baseApi => baseApi.get<ICommentResponse>(`/customers/socials/fetch/comments/${data.vodId}?page=${data.pagination}&limit=${data.pagination.limit}`))

export const fetchRepliesbyCommentId = async (data: {commentId:string, pagination:IPagination}) =>
    await apiCall<IReplyResponse>(baseApi => baseApi.get<IReplyResponse>(`/customers/socials/fetch/replies/${data.commentId}?page=${data.pagination}&limit=${data.pagination.limit}`))

export const getCommentById = async (data: {commentId:string, type:'REPLY'|'COMMENT'}) =>
    await apiCall<ICommentReplyResponse>(baseApi => baseApi.get<ICommentReplyResponse>(`/customers/socials/fetch/comments/${data.commentId}/${data.type}`))