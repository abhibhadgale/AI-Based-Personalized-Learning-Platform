// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [], // This will hold the array of cart items.
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload; // Update the cart items
    },
  },
});

export const { setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
