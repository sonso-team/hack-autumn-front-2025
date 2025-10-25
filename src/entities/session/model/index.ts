import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IAuthState, IAuthResponse, IWhoAmIResponse } from '../types';
import {
  login,
  logout,
  refresh,
  registration,
  sendCode,
  authCode,
  getUser,
} from '../api';

const initialState: IAuthState = {
  isError: false,
  isLoading: true,
  isAuth: false,
  user: null,
  message: null,
  goConfirmStep: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          state.isError = false;
          state.user = action.payload.user;
          state.message = action.payload.message;
          state.goConfirmStep = true;
          state.isLoading = false;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      .addCase(registration.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(
        registration.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          state.isError = false;
          state.user = action.payload.user;
          state.message = action.payload.message;
          state.goConfirmStep = true;
          state.isLoading = false;
        },
      )
      .addCase(registration.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isError = false;
        localStorage.removeItem('token');
        state.isAuth = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      .addCase(refresh.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(
        refresh.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          state.user = action.payload.user;
          state.isError = false;
          localStorage.setItem('token', action.payload.token);
          state.isAuth = true;
          state.isLoading = false;
        },
      )
      .addCase(refresh.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(sendCode.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(sendCode.fulfilled, (state) => {
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(sendCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      .addCase(authCode.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(
        authCode.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          localStorage.setItem('token', action.payload.token);
          state.user = action.payload.user;
          state.isAuth = true;
          state.isError = false;
          state.isLoading = false;
        },
      )
      .addCase(authCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.message = null;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<IWhoAmIResponse>) => {
          state.isLoading = false;
          state.user.name = action.payload.name;
          state.user.id = action.payload.id;
          state.user.email = action.payload.email;
        },
      )
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      });
  },
});
export default authSlice.reducer;
