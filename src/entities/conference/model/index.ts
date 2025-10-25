import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IConferenceState, IConferenceResponse } from '../types';
import { getLink } from '../api/conferenceThunks';

const initialState: IConferenceState = {
  isError: false,
  isLoading: true,
  message: null,
  isConnected: false,
  roomId: null
};

const conferenceSlice = createSlice({
  name: 'conference',
  initialState,
  reducers: {},
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
        state.message = action.payload.message;
      })
  },
});
export default conferenceSlice.reducer;
