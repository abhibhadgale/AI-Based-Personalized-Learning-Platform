import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './slices/quizSlice';
import studentReducer from './slices/studentSlice';

const store = configureStore({
  reducer: {
    quiz: quizReducer,
    student: studentReducer,
  },
});

export default store;
