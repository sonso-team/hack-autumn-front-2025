import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/entities/session';
import loaderReducer from '@/entities/loader';
import conferenceReducer from '@/entities/conference'

export const rootReducer = combineReducers({
  authReducer,
  loaderReducer,
  conferenceReducer

});
export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof rootReducer>;
