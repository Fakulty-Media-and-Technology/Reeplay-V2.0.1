import { IGeneric } from "./auth.types";
import { IVODContent } from "./content.types";

export interface IWatchListResponse extends IGeneric{
    data: IVODContent[]
}

export interface ICheckWatchListResponse extends IGeneric{
    data:{
        isListed:boolean
    }
}