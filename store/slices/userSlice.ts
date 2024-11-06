import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../app.store';
import {IProfile} from '@/types/api/profile.types';
// import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface User {
  userInfo: {
    _id: string;
    fullname: string;
    email: string;
    password: string;
  };
}

// Define the initial state using that type
const initialState: IProfile = {
  profile: {
    _id: '',
    country_code: '',
    email: '',
    first_name: '',
    last_name: '',
    mobile: '',
    role: '',
    createdAt: '',
    paymentDetails: null,
    settings_info: {
      allow_notifications: false,
      new_services: false,
      upcoming_events: false,
      new_arrivals: false,
      live_channels: false,
      video_quality: '',
      watchlist: [],
      _id: '',
      user_id: '',
      interest: [],
    },
  },
  photo_url: '',
};

const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IProfile>) => {
      return action.payload;
    },
    setCredentialsEmail: (state, action) => {
      state.profile.email = action.payload;
    },
    logout: (state, action) => {
      return initialState;
    },
  },
});

export const {setCredentials, setCredentialsEmail, logout} = userSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.profile;
export const selectUserProfilePic = (state: RootState) => state.user.photo_url;

export default userSlice.reducer;
