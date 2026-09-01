import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '../../services/dashboard.service.js';
import { handleApiError } from '../../handlers/globalerrorhandler.js';

export const fetchDashboardMetrics = createAsyncThunk('dashboard/fetchMetrics', async (_, { rejectWithValue }) => {
  try {
    return await dashboardService.getMetrics();
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    metrics: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
