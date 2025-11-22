import {apiCall} from './profile.api';
import {IGeneric} from '@/types/api/auth.types';
import axios from 'axios'



export const suggestionApi = async (data: {message: string}) =>
  await apiCall<IGeneric>(extraApi =>
    extraApi.post<IGeneric>('/customers/suggestion/create', data),
  );

 export async function getRemoteFileSize(url: string): Promise<number | null> {
  try {
    const response = await axios.head(url);
    const contentLength = response.headers['content-length'];
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch (error) {
    console.warn('Failed to get content size', error);
    return null;
  }
}
