import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  progress: {},
  analysis: {},
};

const studentAnalyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setAnalysis: (state, action) => {
      state.analysis = action.payload;
    }
  }
});

export const { setProgress, setAnalysis } = studentAnalyticsSlice.actions;
export default studentAnalyticsSlice.reducer;
