import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getQuizQuestions, submitQuizResponse } from '../../utils/api';

export const fetchQuizQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await getQuizQuestions(quizId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const submitQuizAnswers = createAsyncThunk(
  'quiz/submitAnswers',
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      const response = await submitQuizResponse(quizId, answers);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    questions: [],
    result: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuizQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitQuizAnswers.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default quizSlice.reducer;
