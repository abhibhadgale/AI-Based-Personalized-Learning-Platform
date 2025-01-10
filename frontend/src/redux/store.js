import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './slices/quizSlice';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import { reducer as unitsReducer } from './slices/unitsSlice';
import userProfileReducer from './slices/profileSlice'; // Import the userProfile reducer
import cartReducer from './slices/cartSlice'; // Import the cart reducer

const store = configureStore({
  reducer: {
    quiz: quizReducer,
    student: studentReducer,
    auth: authReducer,
    units: unitsReducer,
    userProfile: userProfileReducer, // Add the userProfile slice here
    cart: cartReducer, // Add the cart slice here
  },
});

export default store;

