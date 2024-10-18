import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../../utils/api'; // Ensure correct import

// Thunk to fetch user profile
export const getUserProfile = createAsyncThunk('userProfile/getUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchUserProfile();
    return response.data; // Assuming the data structure is correct
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Error fetching profile');
  }
});

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    user: null,
    userProfile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.userProfile = action.payload.userProfile;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userProfileSlice.reducer;
