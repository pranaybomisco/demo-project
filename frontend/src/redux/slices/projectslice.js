import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../../services/project.service.js';
import { handleApiError } from '../../handlers/globalerrorhandler.js';

export const fetchProjects = createAsyncThunk('projects/fetchList', async (params, { rejectWithValue }) => {
  try {
    return await projectService.list(params);
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const fetchProjectDetail = createAsyncThunk('projects/fetchDetail', async (id, { rejectWithValue }) => {
  try {
    return await projectService.getById(id);
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const createProject = createAsyncThunk('projects/create', async (data, { rejectWithValue, dispatch }) => {
  try {
    const project = await projectService.create(data);
    dispatch(fetchProjects());
    return project;
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, data }, { rejectWithValue, dispatch }) => {
  try {
    const project = await projectService.update(id, data);
    dispatch(fetchProjectDetail(id));
    return project;
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue, dispatch }) => {
  try {
    await projectService.delete(id);
    dispatch(fetchProjects());
    return id;
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const addProjectMember = createAsyncThunk('projects/addMember', async ({ projectId, data }, { rejectWithValue, dispatch }) => {
  try {
    const res = await projectService.addMember(projectId, data);
    dispatch(fetchProjectDetail(projectId));
    return res;
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const removeProjectMember = createAsyncThunk('projects/removeMember', async ({ projectId, userId }, { rejectWithValue, dispatch }) => {
  try {
    await projectService.removeMember(projectId, userId);
    dispatch(fetchProjectDetail(projectId));
    return userId;
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    pagination: null,
    currentProject: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.projects;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
