import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service.js';
import { tokenService } from '../../services/api.service.js';
import { STORAGE_KEYS } from '../../constants/index.js';
import { handleApiError } from '../../handlers/globalerrorhandler.js';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    tokenService.setToken(data.token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
    return data.user;
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const data = await authService.register(userData);
    tokenService.setToken(data.token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
    return data.user;
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const checkAuth = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
  const token = tokenService.getToken();
  if (!token) return null;
  try {
    return await authService.getMe();
  } catch (err) {
    tokenService.clearToken();
    return rejectWithValue(handleApiError(err).message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    const data = await authService.updateProfile(userData);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(handleApiError(err).message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  tokenService.clearToken();
  return null;
});

const initialUser = localStorage.getItem(STORAGE_KEYS.USER_DATA)
  ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA))
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    isAuthenticated: !!initialUser,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

