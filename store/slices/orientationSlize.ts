import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../app.store';
import {OrientationType} from 'react-native-orientation-locker';
// import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface Orientation {
  orientation: OrientationType | null;
}

// Define the initial state using that type
const initialState: Orientation = {
  orientation: null,
};

const orientationSlice = createSlice({
  name: 'orientation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setOrientations: (state, action) => {
      state.orientation = action.payload;
    },

    resetOrientation: (state, action) => {
      state.orientation = null;
    },
  },
});

export const {setOrientations, resetOrientation} = orientationSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectOrientation = (state: RootState) =>
  state.orientation.orientation;

export default orientationSlice.reducer;
