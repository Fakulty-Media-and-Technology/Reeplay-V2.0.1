import { IPagination } from "@/types/api/auth.types";
import { apiCall } from "./profile.api";
import { INotificationResponse } from "@/types/api/notification.types";



export const getAllNotifications = async ({page, limit}:IPagination) =>
    await apiCall<INotificationResponse>(baseApi => baseApi.get<INotificationResponse>(`/customers/notifications?page=${page}&limit=${limit}`))