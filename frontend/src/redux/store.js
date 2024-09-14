import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import analyticsReducer from './slices/studentAnalyticsSlice';
import quizReducer from './slices/quizSlice';
import learningPathReducer from './slices/learningPathSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    analytics: analyticsReducer,
    quiz: quizReducer,
    learningPath: learningPathReducer
  }
});

export default store;
