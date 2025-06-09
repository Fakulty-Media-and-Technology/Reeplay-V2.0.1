import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app.store';
import { OrientationType } from 'react-native-orientation-locker';
import { ILiveContent, IVODContent } from '@/types/api/content.types';
// import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface BannerProps {
    lives: ILiveContent[];
    vods: IVODContent[];
}

// Define the initial state using that type
const initialState: BannerProps = {
    lives: [],
    vods: [],
};

const bannerSlice = createSlice({
    name: 'banner',
    initialState,
    reducers: {
        setBannerContent: (state, action) => {
            return action.payload;
        },
    },
});

export const { setBannerContent } = bannerSlice.actions;


export const selectBannerContent = (state: RootState) =>
    state.banner;

export default bannerSlice.reducer;
