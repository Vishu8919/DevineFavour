// redux/slices/adminProductSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Environment-safe backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🧠 Safely retrieve token on the client
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''}`,
  },
});

// 🔄 Fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  'adminProducts/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/products`, getAuthHeaders());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch products' });
    }
  }
);

// ➕ Create new product
export const createProduct = createAsyncThunk(
  'adminProducts/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/admin/products`, productData, getAuthHeaders());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create product' });
    }
  }
);

// ✏️ Update product
export const updateProduct = createAsyncThunk(
  'adminProducts/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/api/admin/products/${id}`, productData, getAuthHeaders());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update product' });
    }
  }
);

// ❌ Delete product
export const deleteProduct = createAsyncThunk(
  'adminProducts/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/products/${id}`, getAuthHeaders());
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete product' });
    }
  }
);

const adminProductSlice = createSlice({
  name: 'adminProducts',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateProductInState: (state, action) => {
      const updated = action.payload;
      const idx = state.products.findIndex((p) => p._id === updated._id);
      if (idx !== -1) {
        state.products[idx] = updated;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching products';
      })

      // ➕ Create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      // ✏️ Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) {
          state.products[idx] = action.payload;
        }
      })

      // ❌ Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export default adminProductSlice.reducer;
export const { updateProductInState } = adminProductSlice.actions;
