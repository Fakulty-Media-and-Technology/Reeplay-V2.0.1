import { ApiResponse, create } from "apisauce";
import { getAuthToken } from "./profile.api";
import { BASE_URL } from "@env";
import { IBannerContentResponse } from "@/types/api/content.types";


const createContentApi = async () => {
    const token = await getAuthToken();
    return create({
        baseURL: BASE_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'customer-auth': token,
        },
    });
};

const apiCall = async <T>(
    apiFunction: (
        extraxApi: ReturnType<typeof create>,
    ) => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> => {
    const extraxApi = await createContentApi();
    return apiFunction(extraxApi);
};

export const bannerApi = async () =>
    await apiCall<IBannerContentResponse>(extraApi =>
        extraApi.get<IBannerContentResponse>('/customers/banner/contents'),
    );