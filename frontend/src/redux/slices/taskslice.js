import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/task.service.js';
import { handleApiError } from '../../handlers/globalerrorhandler.js';
import { fetchDashboardMetrics } from './dashboardslice.js';

export const fetchTasks = createAsyncThunk('tasks/fetchList', async (params, { rejectWithValue }) => {
  try {
    return await taskService.list(params);
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const createTask = createAsyncThunk('tasks/create', async (data, { rejectWithValue, dispatch }) => {
  try {
    const task = await taskService.create(data);
    dispatch(fetchTasks());
    dispatch(fetchDashboardMetrics());
    return task;
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue, dispatch }) => {
  try {
    const task = await taskService.update(id, data);
    dispatch(fetchTasks());
    dispatch(fetchDashboardMetrics());
    return task;
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue, dispatch }) => {
  try {
    await taskService.delete(id);
    dispatch(fetchTasks());
    dispatch(fetchDashboardMetrics());
    return id;
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    pagination: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
