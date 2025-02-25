import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveStudentProgress } from '../../utils/api';

export const syncProgressWithBackend = createAsyncThunk(
  'studentProgress/syncProgress',
  async (progressData, { rejectWithValue }) => {
    try {
      if (!progressData || typeof progressData !== 'object' || Object.keys(progressData).length === 0) {
        return rejectWithValue({ error: "Invalid progress data" });
      }

      const unitId = Object.keys(progressData)[0];
      if (!unitId) return rejectWithValue({ error: "Missing unitId" });

      const subtopicArray = progressData[unitId]?.subtopics || [];
      if (subtopicArray.length === 0) return rejectWithValue({ error: "Missing subtopicId" });

      const subtopicId = subtopicArray[subtopicArray.length - 1];
      if (!subtopicId) return rejectWithValue({ error: "Invalid subtopicId" });

      const { startTime, endTime } = progressData[unitId];
      if (!startTime || !endTime) return rejectWithValue({ error: "Missing time data" });

      console.log('Sending progress data:', { unitId, subtopicsId: [subtopicId], startTime, endTime });

      await saveStudentProgress({ unitId, subtopicsId: [subtopicId], startTime, endTime });

    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Failed to sync progress" });
    }
  }
);

const studentProgressSlice = createSlice({
  name: 'studentProgress',
  initialState: {
    progress: {}, 
    skipped: {}
  },
  reducers: {
    updateProgress: (state, action) => {
      const { unitId, subtopicId, startTime, endTime } = action.payload;

      if (!state.progress[unitId]) {
        state.progress[unitId] = { subtopics: [], startTime: null, endTime: null };
      }

      if (!state.progress[unitId].subtopics.includes(subtopicId)) {
        state.progress[unitId].subtopics.push(subtopicId);
      }

      state.progress[unitId].startTime = startTime;
      state.progress[unitId].endTime = endTime;
    },
    
    markSkippedSubtopic: (state, action) => {
      const { unitId, subtopicId, endTime } = action.payload;
      if (!state.skipped[unitId]) state.skipped[unitId] = [];
      state.skipped[unitId].push({ subtopicId, endTime });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(syncProgressWithBackend.rejected, (state, action) => {
      console.error('Failed to sync progress:', action.payload);
    });
  },
});

export const { updateProgress, markSkippedSubtopic } = studentProgressSlice.actions;
export default studentProgressSlice.reducer;
