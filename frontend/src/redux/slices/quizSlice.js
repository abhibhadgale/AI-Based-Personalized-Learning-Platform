import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getQuizList, getQuizQuestions, submitQuizResponse, getStudentQuizResults } from '../../utils/api';

const initialState = {
  quizList: [],
  questions: [],
  result: null,
  studentQuizResults: [],
  loading: false,
  error: null,
};

// Fetch list of quizzes
export const fetchQuizList = createAsyncThunk(
  'quiz/fetchQuizList',
  async () => {
    const response = await getQuizList();
    return response.data;
  }
);

// Fetch quiz questions
export const fetchQuizQuestions = createAsyncThunk(
  'quiz/fetchQuizQuestions',
  async (quizId) => {
    const response = await getQuizQuestions(quizId);
    return response.data;
  }
);

// Submit quiz answers
export const submitQuizAnswers = createAsyncThunk(
  'quiz/submitQuizAnswers',
  async ({ quizId, answers }) => {
    const response = await submitQuizResponse(quizId, answers);
    return response.data;  // Expect the response to include quizId, subject, score, totalQuestions, correctAnswers
  }
);

// Fetch student quiz results
export const fetchStudentQuizResults = createAsyncThunk(
  'quiz/fetchStudentQuizResults',
  async () => {
    const response = await getStudentQuizResults();
    return response.data;
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizList.fulfilled, (state, action) => {
        state.loading = false;
        state.quizList = action.payload;
      })
      .addCase(fetchQuizList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuizQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(submitQuizAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;  // Store the result directly
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchStudentQuizResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentQuizResults.fulfilled, (state, action) => {
        state.loading = false;
        state.studentQuizResults = action.payload;
      })
      .addCase(fetchStudentQuizResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default quizSlice.reducer;
