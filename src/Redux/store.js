// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { githubApi } from './githubApi';

export const store = configureStore({
  reducer: {
    [githubApi.reducerPath]: githubApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApi.middleware),
});
