import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const tokenFromStorage = localStorage.getItem("token");

const initialState: AuthState = {
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      localStorage.setItem("token", token);
      state.token = token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.isAuthenticated = false;
    },
    checkToken: (state) => {
      if (state.token) {
        try {
          const decoded: { exp: number } = jwtDecode(state.token);
          if (decoded.exp * 1000 < Date.now()) {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
          }
        } catch (err) {
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem("token");
        }
      }
    },
  },
});

export const { login, logout, checkToken } = authSlice.actions;
export default authSlice.reducer;
