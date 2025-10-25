import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { IConferenceState, IConferenceResponse } from '../types';
import { getLink } from '../api/conferenceThunks';

const initialState: IConferenceState = {
  isError: false,
  isLoading: true,
  message: null,
  isConnected: false,
  roomId: null,
  name: null, // добавили поле для имени
};

const conferenceSlice = createSlice({
  name: 'conference',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string | null>) => {
      state.roomId = action.payload;
    },
    setName: (state, action: PayloadAction<string | null>) => {
      state.name = action.payload; // редьюсер для установки имени
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLink.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(
        getLink.fulfilled,
        (state, action: PayloadAction<IConferenceResponse>) => {
          state.isError = false;
          state.message = action.payload.message;
          state.roomId = action.payload.roomId;
          state.isLoading = false;
        },
      )
      .addCase(getLink.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || 'Something went wrong';
      });
  },
});

export const { setRoomId, setName } = conferenceSlice.actions;
export default conferenceSlice.reducer;
