import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import type {
  IAuthData,
  IAuthError,
  IAuthResponse,
  IWhoAmIResponse,
} from '../types';
import Endpoints from '@/shared/api/endpoints.ts';
import api from '@/shared/api/axios';

const login = createAsyncThunk<
  IAuthResponse,
  IAuthData,
  { rejectValue: IAuthError }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<IAuthResponse> = await api.post(
      Endpoints.AUTH_LOGIN,
      {
        login: email,
        password,
      },
    );
    return response.data;
  } catch (error) {
    return rejectWithValue({
      message: error?.response?.data?.message || error.message,
    });
  }
});

const registration = createAsyncThunk<
  IAuthResponse,
  IAuthData,
  { rejectValue: IAuthError }
>(
  'auth/registration',
  async ({ fio, password, email, nickname }, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<IAuthResponse> = await api.post(
        Endpoints.AUTH_REG,
        {
          fio,
          password,
          email,
          nickname,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error?.response?.data?.message || error.message,
      });
    }
  },
);

const logout = createAsyncThunk<object, void, { rejectValue: IAuthError }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put(Endpoints.AUTH_LOGOUT);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error?.response?.data?.message || error.message,
      });
    }
  },
);

const refresh = createAsyncThunk<
  IAuthResponse,
  void,
  { rejectValue: IAuthError }
>('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<IAuthResponse> = await api.get(
      Endpoints.AUTH_REFRESH,
    );
    return response.data;
  } catch (error) {
    return rejectWithValue({
      message: error?.response?.data?.message || error.message,
    });
  }
});

const sendCode = createAsyncThunk<
  IAuthResponse,
  IAuthData,
  { rejectValue: IAuthError }
>('auth/sendCode', async ({ login }, { rejectWithValue }) => {
  try {
    const response: AxiosResponse = await api.post(Endpoints.AUTH_SEND_CODE, {
      login,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue({
      message: error?.response?.data?.message || error.message,
    });
  }
});

const authCode = createAsyncThunk<
  IAuthResponse,
  IAuthData,
  { rejectValue: IAuthError }
>('auth/authCode', async ({ login, password }, { rejectWithValue }) => {
  try {
    const response: AxiosResponse = await api.post(Endpoints.AUTH_AUTH_CODE, {
      login,
      password,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue({
      message: error?.response?.data?.message || error.message,
    });
  }
});

const getUser = createAsyncThunk<
  IWhoAmIResponse,
  void,
  { rejectValue: IAuthError }
>('auth/user-info', async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse = await api.get(Endpoints.AUTH_WHO_AM_I);
    return response.data;
  } catch (error) {
    return rejectWithValue({
      message: error?.response?.data?.message || error.message,
    });
  }
});

export { login, registration, logout, refresh, sendCode, authCode, getUser };
