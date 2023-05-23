import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Dog, Location } from '../network/requests';

interface AppState {
  loggedIn: boolean;
  dogs: Dog[];
  favorites: string[];
  match?: Dog;
  location?: Location;
}

// Define the initial state for the application.
// Current keys: 
//  - loggedIn :: whether the user is authenticated with the API
const initialState: AppState = {
  loggedIn: false,
  dogs: [],
  favorites: []
};

/**
 * The Main Slice for our state. This holds all state for now,
 * though this may change in the future.
 */
export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setLoginStatus: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload
    },
    setDogs: (state, action: PayloadAction<Dog[]>) => {
      state.dogs = action.payload
    },
    updateFavorites: (state, action: PayloadAction<string>) => {
     if (state.favorites.includes(action.payload)) {
      state.favorites = state.favorites.filter(f => f !== action.payload);
     } else {
      state.favorites.push(action.payload);
     }
    },
    updateMatch: (state, action: PayloadAction<Dog>) => {
      state.match = action.payload;
    },
    updateLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload;
    }
  }
})

export const {setLoginStatus, updateFavorites, updateMatch,  updateLocation} = mainSlice.actions;

export const getLoginStatus = (state: RootState) => state.main.loggedIn

export default mainSlice.reducer;
