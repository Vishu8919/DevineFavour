// redux/slices/adminSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper to safely get auth header on client
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''}`,
  },
});

// 🔄 Fetch all users (admin only)
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/users`, getAuthHeaders());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch users' });
    }
  }
);

// ➕ Add user
export const addUser = createAsyncThunk(
  'admin/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/admin/users`, userData, getAuthHeaders());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add user' });
    }
  }
);

// ✏️ Update user
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/admin/users/${id}`,
        { name, email, role },
        getAuthHeaders()
      );
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update user' });
    }
  }
);

// ❌ Delete user
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/users/${id}`, getAuthHeaders());
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete user' });
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
      })

      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add user';
      })

      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((u) => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export default adminSlice.reducer;
