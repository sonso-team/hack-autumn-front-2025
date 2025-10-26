import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { IConferenceState, IConferenceResponse } from '../types';
import { connectRoom, createRoom } from '../api/conferenceThunks';

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
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(
        createRoom.fulfilled,
        (state, action: PayloadAction<IConferenceResponse>) => {
          state.isError = false;
          state.roomId = action.payload;
          state.isLoading = false;
        },
      )
      .addCase(createRoom.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(connectRoom.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(connectRoom.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(connectRoom.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setRoomId, setName } = conferenceSlice.actions;
export default conferenceSlice.reducer;
