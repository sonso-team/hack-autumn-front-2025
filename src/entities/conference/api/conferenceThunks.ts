import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import type {
  IConferenceData,
  IAuthError,
  IConferenceResponse,
} from '../types';
import Endpoints from '@/shared/api/endpoints.ts';
import api from '@/shared/api/axios';

const getLink = createAsyncThunk<
  IConferenceResponse,
  IConferenceData,
  { rejectValue: IAuthError }
>('auth/login', async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<IConferenceResponse> = await api.get(
      Endpoints.AUTH_LOGIN
    );
    return response.data;
  } catch (error) {
    return rejectWithValue({
      message: error?.response?.data?.message || error.message,
    });
  }
});


export { getLink };
