import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/entities/session';
import loaderReducer from '@/entities/loader';

export const rootReducer = combineReducers({
  authReducer,
  loaderReducer,
});
export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof rootReducer>;
