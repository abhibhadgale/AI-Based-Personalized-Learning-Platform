import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStudentData, getLearningPath } from '../../utils/api';

export const fetchStudentData = createAsyncThunk(
  'student/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getStudentData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLearningPath = createAsyncThunk(
  'student/fetchLearningPath',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLearningPath();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    progress: null,
    learningPath: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentData.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(fetchStudentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLearningPath.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLearningPath.fulfilled, (state, action) => {
        state.loading = false;
        state.learningPath = action.payload;
      })
      .addCase(fetchLearningPath.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentSlice.reducer;
