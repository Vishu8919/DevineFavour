// redux/slices/checkoutSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🧾 Create a checkout session
export const createCheckout = createAsyncThunk(
  'checkout/createCheckout',
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/checkout`,
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${
              typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
            }`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create checkout' });
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Checkout failed';
      });
  },
});

export default checkoutSlice.reducer;
