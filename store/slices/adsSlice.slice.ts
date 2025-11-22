import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app.store';
import { IAdsData } from '@/types/api/content.types';
// import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AdsSliceProps {
    ads: IAdsData[]
}

// Define the initial state using that type
const initialState: AdsSliceProps = {
    ads:[]
};

const adsSlice = createSlice({
    name: 'ads',
    initialState,
    reducers: {
        setAdsContent: (state, action) => {
            state.ads = action.payload;
        },
    },
});

export const { setAdsContent } = adsSlice.actions;


export const selectAdsContent = (state: RootState) =>
    state.ads;

export default adsSlice.reducer;
