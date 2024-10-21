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
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload; 
    },
    logout(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { login, logout, setAccessToken } = authSlice.actions;
export const selectToken = (state) => state.auth.accessToken;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export default authSlice.reducer;
