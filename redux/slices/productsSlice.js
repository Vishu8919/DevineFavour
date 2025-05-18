// redux/slices/productsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔍 Fetch products with filters
export const fetchProductsByFilters = createAsyncThunk(
  'products/fetchByFilters',
  async ({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
  }) => {
    const query = new URLSearchParams();
    if (collection) query.append('collection', collection);
    if (size) query.append('size', size);
    if (color) query.append('color', color);
    if (gender) query.append('gender', gender);
    if (minPrice) query.append('minPrice', minPrice);
    if (maxPrice) query.append('maxPrice', maxPrice);
    if (sortBy) query.append('sortBy', sortBy);
    if (search) query.append('search', search);
    if (category) query.append('category', category);
    if (material) query.append('material', material);
    if (brand) query.append('brand', brand);
    if (limit) query.append('limit', limit);

    const response = await axios.get(`${BACKEND_URL}/api/products?${query.toString()}`);
    return response.data;
  }
);

// 📦 Fetch product details by ID
export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (id) => {
    const response = await axios.get(`${BACKEND_URL}/api/products/${id}`);
    return response.data;
  }
);

// ✏️ Update product (requires auth)
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }) => {
    const response = await axios.put(
      `${BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${
            typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
          }`,
        },
      }
    );
    return response.data;
  }
);

// 🔁 Fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  'products/fetchSimilarProducts',
  async (id) => {
    const response = await axios.get(`${BACKEND_URL}/api/products/similar/${id}`);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    error: null,
    filters: {
      category: '',
      size: '',
      color: '',
      gender: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sortBy: '',
      search: '',
      material: '',
      collection: '',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        size: '',
        color: '',
        gender: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        sortBy: '',
        search: '',
        material: '',
        collection: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch products';
      })

      // Fetch product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch product details';
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex((p) => p._id === updatedProduct._id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to update product';
      })

      // Fetch similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch similar products';
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
