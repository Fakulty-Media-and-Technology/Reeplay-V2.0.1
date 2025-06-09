import { IGeneric } from "./auth.types";


export interface IBannerContentResponse extends IGeneric {
    data: {
        lives: ILiveContent[],
        vods: IVODContent[]
    }
}


export interface ILiveContent {
    _id: string;
    title: string;
    subTitle: string;
    location: string;
    channelLogo: string | null;
    pg: string;
    description: string
    active: boolean;
    expired: boolean
    type: string;
    start: string;
    expiry: string;
    sponsored: boolean;
    popular: boolean;
    upcoming: boolean;
    upcomingSubscribers: string[];
    featured: boolean;
    coverPhoto: string | null;
    engagements: number;
    viewsCount: number;
    streamKey: string;
    vidClass: string;
    clientId: string;
    previewVideo: string | null;
    createdAt: string
    updatedAt: string

}


export interface IVODContent {
    _id: string;
    admin_id: string;
    primaryColor: string;
    title: string;
    type: string
    description: string
    pg: string;
    genre: IGenre[]
    category: IGenre[];
    cast: ICast[];
    likes: [];
    runtime: string;
    featured: boolean;
    createdAt: string;
    upcomingSubscribers: string[];
    enagements: number
    landscapePhoto: string;
    portraitPhoto: string
    viewsCount: number;
    vidClass: string;
    releaseDate: string;
    expiryDate: string;
    defaultRating: number;
    averageRating: number;
    seasons: [];
    video: string;
    trailer: string;
}

export interface IGenre {
    _id: string;
    name: string;
    position: number
}

export interface ICast extends Omit<IGenre, 'position'> {
    title: string
}