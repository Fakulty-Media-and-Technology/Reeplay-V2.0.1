import { IGeneric, IPagination } from "@/types/api/auth.types";
import { apiCall } from "./profile.api";
import { IAddReactionResponse, IAdsResponse, IBannerContentResponse, IContentUserStatusResponse, IContinueWatchingResponse, IEnumsResponse, IPremiumContentCostResponse, IRatingData, IReactionData, IRegisteredContinueWatching, ISearchMainResponse, ISearchResponse, ISeasonDataResponse, IVODbyEnumIDResponse, IVODRatingResponse } from "@/types/api/content.types";


export const bannerApi = async () =>
    await apiCall<IBannerContentResponse>(extraApi =>
        extraApi.get<IBannerContentResponse>('/customers/banner/contents'),
    );

export const randomAds = async () =>
    await apiCall<IAdsResponse>(baseApi => baseApi.get<IAdsResponse>('/customers/ads/random'))

export const fetchEnums = async (enumType:string) =>
    await apiCall<IEnumsResponse>(baseAPi => baseAPi.get<IEnumsResponse>(`/customers/enums/shared/get-${enumType}?page=1&limit=1000`))

export const getContinueWatching = async (data?: IPagination) =>
    await apiCall<IContinueWatchingResponse>(baseApi => baseApi.get<IContinueWatchingResponse>(`/customers/watched/continue-watching${data ? `?page=${data.page}&limit=${data.limit}`:''}`))

export const registerContinueWatching = async (data?: IRegisteredContinueWatching) =>
    await apiCall<IGeneric>(baseApi => baseApi.post<IGeneric>(`/customers/watched/register`, data))

export const deleteContinueWatchingById = async (_id:string) =>
    await apiCall<IGeneric>(baseApi => baseApi.delete<IGeneric>(`/customers/watched/${_id}`))

export const getVODbyEnumID = async ({pagination, enumId}:{pagination?: IPagination, enumId:string}) =>
    await apiCall<IVODbyEnumIDResponse>(baseApi => baseApi.get<IVODbyEnumIDResponse>(`/customers/shared/vods/category/${enumId}${pagination ? `?page=${pagination.page}&limit=${pagination.limit}`:''}`))

export const getVODbyGenreID = async ({pagination, enumId, vodId}:{pagination: IPagination, enumId:string, vodId?:string}) =>
    await apiCall<IVODbyEnumIDResponse>(baseApi => baseApi.get<IVODbyEnumIDResponse>(`/customers/shared/vods/similar-by-genre/${enumId}?page=${pagination.page}&limit=${pagination.limit}&${vodId ?`vodId=${vodId}`:''}`))

export const getVODbyCastID = async ({pagination, enumId, vodId}:{pagination: IPagination, enumId:string, vodId?:string}) =>
    await apiCall<IVODbyEnumIDResponse>(baseApi => baseApi.get<IVODbyEnumIDResponse>(`/customers/shared/vods/similar-by-cast/${enumId}?page=${pagination.page}&limit=${pagination.limit}&${vodId ?`vodId=${vodId}`:''}`))

export const recentSearches = async () =>
    await apiCall<ISearchResponse>(baseApi => baseApi.get<ISearchResponse>(`/customers/recent-search/fetch`))

export const fetchContentSuggestions = async () =>
    await apiCall<ISearchResponse>(baseApi => baseApi.get<ISearchResponse>(`/customers/shared/vods/suggestions`))

export const registerRecentSearch = async (data:{contentId:string, contentType:string}) =>
    await apiCall<IGeneric>(baseApi => baseApi.post<IGeneric>(`/customers/recent-search/register`, data))

export const searchContent = async (text:string) =>
    await apiCall<ISearchMainResponse>(baseApi => baseApi.get<ISearchMainResponse>(`/customers/shared/featured/contents/search/${text}`))

export const libraryContent = async (data:{catId:string, genreId:string, pagination:IPagination}) =>
    await apiCall<IVODbyEnumIDResponse>(baseApi => baseApi.get<IVODbyEnumIDResponse>(`/customers/shared/vods/categ-and-genre/${data.genreId}/${data.catId}?page=${data.pagination.page}&limit=${data.pagination.limit}`))

export const getVODRatings = async (vodId:string) =>
    await apiCall<IVODRatingResponse>(baseApi => baseApi.get<IVODRatingResponse>(`/customers/ratings/fetch/${vodId}`))

export const addVODRating = async (data:IRatingData) =>
    await apiCall<IGeneric>(baseApi => baseApi.post<IGeneric>(`/customers/ratings/create`, data))

export const addReaction = async (data:IReactionData) =>
    await apiCall<IAddReactionResponse>(baseApi => baseApi.put<IAddReactionResponse>(`/customers/socials/create-update/reaction/${data.commentId}/${data.reaction}`))

export const deleteReaction = async (data:{reactionId:string}) =>
    await apiCall(baseApi => baseApi.put(`/customers/socials/delete/reaction/${data.reactionId}`))

export const hasPaidContentStatus = async (data:{contentType:'live'|'vod', _id:string}) =>
    await apiCall<IContentUserStatusResponse>(baseApi => baseApi.get<IContentUserStatusResponse>(`/customers/shared/check-content-payment/${data.contentType}/${data._id}`))

export const contentCostApi = async () =>
    await apiCall<IPremiumContentCostResponse>(baseApi => baseApi.get<IPremiumContentCostResponse>(`/customers/shared/content-costs`))

export const fetchSeasonsForSeries = async ({pagination,_id}:{pagination:IPagination, _id:string}) =>
    await apiCall<ISeasonDataResponse>(baseApi => baseApi.get<ISeasonDataResponse>(`/customers/shared/vods/seasons/${_id}?page=${pagination.page}&limit=${pagination.limit}`))