import { createSlice } from '@reduxjs/toolkit';
import type { ILoaderState } from '../types';

const initialState: ILoaderState = {
  isLoaderLoading: false,
};

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    showLoader(state: ILoaderState) {
      state.isLoaderLoading = true;
    },
    hideLoader(state: ILoaderState) {
      state.isLoaderLoading = false;
    },
  },
});
export default loaderSlice.reducer;
