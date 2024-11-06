import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../app.store';
import {OrientationType} from 'react-native-orientation-locker';
import {fullVideoType} from '@/navigation/AppNavigator';
import {LiveEvents} from '@/types/api/live.types';
// import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface FullScreenVideoProps {
  videoURL: string;
  type: fullVideoType;
  channelImage?: any;
  vote?: boolean;
  donate?: boolean;
  live_event_data?: LiveEvents;
  title: string;
  _id: string;
}

// Define the initial state using that type
const initialState: FullScreenVideoProps = {
  videoURL: '',
  type: fullVideoType.default,
  channelImage: '',
  title: '',
  _id: '',
};

const fullVideoSlice = createSlice({
  name: 'fullvideo',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFullVideoProps: (state, action: PayloadAction<FullScreenVideoProps>) => {
      return action.payload;
    },

    resetFullVideo: state => {
      state.videoURL = '';
      state.type = fullVideoType.default;
      state.channelImage = '';
      state.title = '';
      state._id = '';
    },
  },
});

export const {setFullVideoProps, resetFullVideo} = fullVideoSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectFullVideoProps = (state: RootState) => state.fullvideo;

export default fullVideoSlice.reducer;
