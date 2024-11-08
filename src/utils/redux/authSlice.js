// src/redux/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { UserModel } from "src/Common/Models/Auth/UserModel";

// export interface AuthState {
//   isAuthenticated: boolean;
//   accessToken: string | null;
//   refreshToken: string | null;
//   permissions: number;
//   user: any;
// }

const initialState = {
  isAuthenticated: false, 
  accessToken: null,
  refreshToken: null,
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action
    ) {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.sessionId = action.payload.sessionId;
      state.user = action.payload.userData;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload; 
    },
    logout(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.sessionId = null;
      state.user = null
    },
  },
});

export const { login, logout, setAccessToken } = authSlice.actions;
export const selectToken = (state) => state.auth.accessToken;
export const selectSessionId = (state) => state.auth.sessionId;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export const selectUserData = (state) => state.auth.user;
export default authSlice.reducer;
