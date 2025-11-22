import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../app.store';
import {fullVideoType} from '@/navigation/AppNavigator';
import {LiveEvents} from '@/types/api/live.types';
import { ILiveContent, IVODContent } from '@/types/api/content.types';
// import type { PayloadAction } from '@reduxjs/toolkit'

interface FullScreenVideo{
  content: IVODContent | ILiveContent | null
  live:ILiveContent|null
}

// Define the initial state using that type
const initialState: FullScreenVideo = {
    content: null,
    live: null
};

const fullVideoSlice = createSlice({
  name: 'fullvideo',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFullVideoProps: (state, action: PayloadAction<IVODContent|ILiveContent>) => {
      state.content = action.payload;
    },
    setLiveModalContent: (state, action: PayloadAction<ILiveContent>) => {
      state.live = action.payload;
    },

    resetFullVideo: state => {
      state.content = null;
      state.live = null;
    },
    resetLiveVideo: state => {
      state.live = null;
    },
  },
});

export const {setFullVideoProps,setLiveModalContent, resetLiveVideo, resetFullVideo} = fullVideoSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectFullVideoProps = (state: RootState) => state.fullvideo.content;
export const selectLiveModalContent = (state: RootState) => state.fullvideo.live;

export default fullVideoSlice.reducer;
