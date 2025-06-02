// redux/slices/cartSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper: save cart to localStorage (browser only)
const saveCartToStorage = (cart) => {
  if (typeof window !== 'undefined' && cart && typeof cart === 'object') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

// 🛒 Fetch cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/cart`, {
        params: { userId, guestId },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch cart' });
    }
  }
);

// ➕ Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/cart`, {
        productId,
        quantity,
        size,
        color,
        guestId,
        userId,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add to cart' });
    }
  }
);

// ✏️ Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/api/cart`, {
        productId,
        quantity,
        guestId,
        userId,
        size,
        color,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update cart' });
    }
  }
);

// ❌ Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const res = await axios({
        method: 'DELETE',
        url: `${BACKEND_URL}/api/cart`,
        data: { productId, guestId, userId, size, color },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to remove item' });
    }
  }
);

// 🔁 Merge guest cart with user cart
export const mergeCart = createAsyncThunk(
  'cart/mergeCart',
  async ({ guestId, user }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/cart/merge`,
        { guestId, user },
        {
          headers: {
            Authorization: `Bearer ${
              typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
            }`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to merge cart' });
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: { products: [] }, // Start empty to avoid SSR issues
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      if (typeof window !== 'undefined') localStorage.removeItem('cart');
    },
    hydrateCart: (state, action) => {
      state.cart = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch cart';
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add to cart';
      })

      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update item quantity';
      })

      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to remove item';
      })

      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to merge cart';
      });
  },
});

export const { clearCart, hydrateCart } = cartSlice.actions;
export default cartSlice.reducer;
