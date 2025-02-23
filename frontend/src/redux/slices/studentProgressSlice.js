import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveStudentProgress } from '../../utils/api';

export const syncProgressWithBackend = createAsyncThunk(
  'studentProgress/syncProgress',
  async (progressData, { rejectWithValue }) => {
    try {
      // Extract unitId (first key of progressData object)
      const unitId = Object.keys(progressData)[0];

      // Extract subtopicId (last element of the array)
      const subtopicArray = progressData[unitId];
      const subtopicId = subtopicArray?.[subtopicArray.length - 1];

      if (!unitId) {
        return rejectWithValue({ error: "Missing unitId" });
      }

      if (!subtopicId) {
        return rejectWithValue({ error: "Missing subtopicId" });
      }

      console.log('Sending progress data:', { unitId, subtopicsId: [subtopicId] });

      // Send request in the expected format
      await saveStudentProgress({ unitId, subtopicsId: [subtopicId] });

    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Failed to sync progress" });
    }
  }
);

  
  

const studentProgressSlice = createSlice({
  name: 'studentProgress',
  initialState: {
    progress: {}, 
  },
  reducers: {
    updateProgress: (state, action) => {
      const { unitId, subtopicId } = action.payload;
      
      if (!state.progress[unitId]) {
        state.progress[unitId] = [];
      }
      
      if (!state.progress[unitId].includes(subtopicId)) {
        state.progress[unitId].push(subtopicId); // Convert Set to Array
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(syncProgressWithBackend.rejected, (state, action) => {
      console.error('Failed to sync progress:', action.payload);
    });
  },
});

export const { updateProgress } = studentProgressSlice.actions;
export default studentProgressSlice.reducer;
