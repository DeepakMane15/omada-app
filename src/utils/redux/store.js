// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { saveState, loadState } from '../localStorage'; // Import local storage utility functions
import authSlice, { AuthState } from './authSlice'; // Make sure to import AuthState type
import loaderReducer from './loaderSlice';

// Load the initial state from local storage
const preloadedState = loadState() || { auth: { /* your initial auth state */ } }; // Initialize with your default state if null

const store = configureStore({
  reducer: {
    auth: authSlice,
    loader: loaderReducer, 
  },
  preloadedState, // Load state
});

// Subscribe to store updates and save the state to local storage
store.subscribe(() => {
  saveState({
    auth: store.getState().auth, // Save only the necessary parts of the state
  });
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export default store;
