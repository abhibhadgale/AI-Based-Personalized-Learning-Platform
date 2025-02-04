import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUnitTopics } from '../../utils/api';

export const fetchUnitTopicsThunk = createAsyncThunk(
  'units/fetchUnitTopics',
  async (unitId) => {
    const response = await fetchUnitTopics(unitId);
    return response.data; // Adjust based on your API response structure
  }
);

const unitsSlice = createSlice({
  name: 'units',
  initialState: {
    topics: [], // This will hold the topics from cluster 0
    unitName: '', // Unit name
    unitMcqTest: '', // Unit MCQ test
    subjectId: '', // Subject ID
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    // You can add custom reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnitTopicsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUnitTopicsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topics = action.payload.topics; // Assuming payload contains topics
        state.unitName = action.payload.unitName; // Assuming payload contains unitName
        state.unitMcqTest = action.payload.unitMcqTest; // Added unitMcqTest from API response
        state.subjectId = action.payload.subjectId; // Added subjectId from API response
      })
      .addCase(fetchUnitTopicsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; // Capture any error messages
      });
  },
});

export const { actions } = unitsSlice;
export const reducer = unitsSlice.reducer;

export const selectAllTopics = (state) => state.units.topics;
export const selectUnitsStatus = (state) => state.units.status;
export const selectUnitsError = (state) => state.units.error;
export const selectUnitMcqTest = (state) => state.units.unitMcqTest;
export const selectSubjectId = (state) => state.units.subjectId;
