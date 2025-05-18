// redux/slices/adminOrderSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Accessing the environment variable in Next.js (see note below)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🧠 Helper: Get token from localStorage safely (client-side only)
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''}`,
  },
});

// 🔄 Fetch all admin orders
export const fetchAllOrders = createAsyncThunk(
  'adminOrders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/orders`, getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Server Error' });
    }
  }
);

// ✏️ Update order delivery status
export const updateOrderStatus = createAsyncThunk(
  'adminOrders/updateOrders',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/admin/orders/${id}`,
        { status },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Server Error' });
    }
  }
);

// ❌ Delete an order
export const deleteOrder = createAsyncThunk(
  'adminOrders/deleteOrder',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/orders/${id}`, getAuthHeaders());
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Server Error' });
    }
  }
);

const adminOrderSlice = createSlice({
  name: 'adminOrders',
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        state.totalSales = action.payload.reduce((sum, order) => sum + order.totalPrice, 0);
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // ✏️ Update Order
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.orders.findIndex((o) => o._id === updated._id);
        if (idx !== -1) {
          state.orders[idx] = updated;
        }
      })

      // ❌ Delete Order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      });
  },
});

export default adminOrderSlice.reducer;
