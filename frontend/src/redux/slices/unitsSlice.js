// src/redux/slices/unitsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUnitTopics } from '../../utils/api';

export const fetchUnitTopicsThunk = createAsyncThunk(
    'units/fetchUnitTopics',
    async (unitId) => {
        const response = await fetchUnitTopics(unitId);
        return response.data; // Adjust based on your API response structure
    }
);

const unitsSlice = createSlice({
    name: 'units',
    initialState: {
        topics: [],
        unitName: '', // Added unitName to the initial state
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {
        // You can add custom reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnitTopicsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUnitTopicsThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.topics = action.payload.topics; // Assuming payload contains topics
                state.unitName = action.payload.unitName; // Assuming payload contains unitName
            })
            .addCase(fetchUnitTopicsThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message; // Capture any error messages
            });
    },
});

// Export actions and the reducer
export const { actions } = unitsSlice;
export const reducer = unitsSlice.reducer; // Ensure you export the reducer separately

// Optional: Export selectors to get specific pieces of state
export const selectAllTopics = (state) => state.units.topics;
export const selectUnitsStatus = (state) => state.units.status;
export const selectUnitsError = (state) => state.units.error;
