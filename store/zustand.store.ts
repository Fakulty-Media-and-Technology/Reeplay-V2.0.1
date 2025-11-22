import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {MMKV_ENCRYPTION_KEY} from '@env';
import { IDownloadData } from '@/types/api/content.types';
import { IProfile } from '@/types/api/profile.types';

type AppPersistStoreState = {
  userDetails?:IProfile;
  isToken?: boolean;
  isLock?: boolean;
  downloadedList?: IDownloadData[];
};
interface AppPersistStore extends AppPersistStoreState {
  setUserDetails: (userDetails?: IProfile) => void;
  setIsToken: (isToken?: boolean) => void;
  setIsLock: (isLock?: boolean) => void;
  addDownload: (downloadItem?: IDownloadData) => void;
  removeDownloadById: (id: string) => void;
  hasDownloadById: (id: string) => boolean;
}

interface MKKVZustandState<T> {
  state: T;
  version: number;
}

export type AppPersistStoreStateType = MKKVZustandState<AppPersistStoreState>;

export const appPersistStoreName = 'app-persist-storage-reeplay';

export const appPersistStorage = new MMKV({
  id: appPersistStoreName,
  encryptionKey: MMKV_ENCRYPTION_KEY,
});

export const useAppPersistStore = create<
  AppPersistStore,
  [['zustand/persist', AppPersistStore]]
>(
  persist(
    (set, get) => ({
      // DEFAULT DATA
      userDetails:undefined,
      isToken: undefined,
      isLock: undefined,
      downloadedList:[],
   

      //   ACTIONS OR MUTATORS
      setUserDetails: userDetails => set({userDetails}),
      setIsToken: isToken => set({isToken}),
      setIsLock: isLock => set({isLock}),
      addDownload: downloadItem =>
        set(state => ({
          downloadedList: downloadItem
            ? [...(state.downloadedList || []), downloadItem]
            : state.downloadedList,
        })),
      removeDownloadById: (id: string) =>
        set(state => ({
          downloadedList: state.downloadedList?.filter(item => item._id !== id) || [],
        })),
        hasDownloadById: (id: string) =>
          get().downloadedList?.some(item => item._id === id) ?? false,
    }),
    {
      name: appPersistStoreName,
      storage: {
        setItem: (name, value) => {
          return appPersistStorage.set(name, JSON.stringify(value));
        },
        getItem: name => {
          const value = appPersistStorage.getString(name);
          if (value) return JSON.parse(value);
          else return null;
        },
        removeItem: name => {
          return appPersistStorage.delete(name);
        },
      },
    },
  ),
);
