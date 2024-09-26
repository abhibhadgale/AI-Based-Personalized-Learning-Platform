import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotesByTopic } from '../../utils/api';  // API call for fetching notes

export const fetchNotesByTopicId = createAsyncThunk(
  'notes/fetchNotesByTopicId',
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await fetchNotesByTopic(topicId);
      console.log("topicId:", topicId)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotesByTopicId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotesByTopicId.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotesByTopicId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notesSlice.reducer;
