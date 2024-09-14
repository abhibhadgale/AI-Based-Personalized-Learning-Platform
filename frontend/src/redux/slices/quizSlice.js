import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuiz: null,
  responses: []
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuiz: (state, action) => {
      state.currentQuiz = action.payload;
    },
    submitAnswer: (state, action) => {
      state.responses.push(action.payload);
    },
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.responses = [];
    }
  }
});

export const { setQuiz, submitAnswer, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
