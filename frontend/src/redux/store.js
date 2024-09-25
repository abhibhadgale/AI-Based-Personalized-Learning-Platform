import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './slices/quizSlice';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import { reducer as unitsReducer } from './slices/unitsSlice';

const store = configureStore({
  reducer: {
    quiz: quizReducer,
    student: studentReducer,
    auth: authReducer,
    units: unitsReducer,
  },
});

export default store;
