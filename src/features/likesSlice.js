import { createSlice } from '@reduxjs/toolkit';

export const likesSlice = createSlice({
  name: 'likes',
  initialState: [],
  reducers: {
    addLike: (state, action) => {
      state.push(action.payload);
    },
    removeLike: (state, action) => {
      return state.filter(item => item.id !== action.payload.id);
    },
  },
});

export const { addLike, removeLike } = likesSlice.actions;

//selector
export const selectLikes = (state) => state.likes;

export default likesSlice.reducer;