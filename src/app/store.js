import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import likesReducer from '../features/likesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    likes: likesReducer
  },
});