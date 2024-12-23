// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import gameReducer from './gameSlice';

const persistConfig = {
  key: 'game',
  storage,
  whitelist: ['mode', 'grid', 'superGrid'], // Specify which state to persist
};

const persistedReducer = persistReducer(persistConfig, gameReducer);

export const store = configureStore({
  reducer: {
    game: persistedReducer,
  },
});

export const persistor = persistStore(store);