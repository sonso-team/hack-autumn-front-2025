import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import type {
  IConferenceData,
  IAuthError,
  IConferenceResponse,
} from '../types';
import Endpoints from '@/shared/api/endpoints.ts';
import api from '@/shared/api/axios';

const createRoom = createAsyncThunk<
  IConferenceResponse,
  IConferenceData,
  { rejectValue: IAuthError }
>(
  'conference/createRoom',
  async ({ maxParticipants, name }, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<IConferenceResponse> = await api.post(
        Endpoints.CREATE_ROOM,
        { maxParticipants, name, description: '', type: '' },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error?.response?.data?.message || error.message,
      });
    }
  },
);

const connectRoom = createAsyncThunk<
  IConferenceResponse,
  IConferenceData,
  { rejectValue: IAuthError }
>('conference/connectRoom', async ({ roomId }, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<IConferenceResponse> = await api.post(
      `${Endpoints.CONNECT_ROOM}/${roomId}/join`,
      {},
    );
    return response.data;
  } catch (error) {
    return rejectWithValue({
      message: error?.response?.data?.message || error.message,
    });
  }
});

export { createRoom, connectRoom };
