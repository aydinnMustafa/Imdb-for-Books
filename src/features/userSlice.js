import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.status = "connect";
    },
    logout: (state) => {
      state.user = null;
      state.status = "disconnect";
    },
  },
});

export const { login, logout } = userSlice.actions;

// selectors
export const selectUser = (state) => state.user.user;
export const userStat = (state) => state.user.status;

export default userSlice.reducer;