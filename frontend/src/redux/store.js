import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './slices/quizSlice';

import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';

const store = configureStore({
  reducer: {
    quiz: quizReducer,
    student: studentReducer,
    auth: authReducer,
  },
});

export default store;
