import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app.store';
import { OrientationType } from 'react-native-orientation-locker';
import { fullVideoType } from '@/navigation/AppNavigator';
import { LiveEvents } from '@/types/api/live.types';
import { ILiveContent } from '@/types/api/content.types';
// import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state

// Define the initial state using that type
const initialState: ILiveContent[] = [];

const sponsoredEventSlice = createSlice({
  name: 'sponsoredEvent',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSponsoredEventProps: (state, action: PayloadAction<ILiveContent[]>) => {
      return action.payload;
    },
  },
});

export const { setSponsoredEventProps } = sponsoredEventSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectSponsoredEvents = (state: RootState) =>
  state.sponsoredEvents;

export default sponsoredEventSlice.reducer;
