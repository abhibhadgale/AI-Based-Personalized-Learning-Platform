import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPath: null,
  progress: 0
};

const learningPathSlice = createSlice({
  name: 'learningPath',
  initialState,
  reducers: {
    setLearningPath: (state, action) => {
      state.currentPath = action.payload;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    }
  }
});

export const { setLearningPath, updateProgress } = learningPathSlice.actions;
export default learningPathSlice.reducer;
