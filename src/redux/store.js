import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import mailReducer from './mailSlice';
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: mailReducer,
  middleware: [...getDefaultMiddleware(), thunk],
});
