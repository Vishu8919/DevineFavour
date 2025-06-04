// redux/slices/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ SSR-safe localStorage access
let userFromStorage = null;
let initialGuestId = null;

if (typeof window !== "undefined") {
  const storedUser = localStorage.getItem("userInfo");
  if (storedUser) {
    try {
      userFromStorage = JSON.parse(storedUser);
    } catch (err) {
      console.error("Failed to parse userInfo:", err);
      localStorage.removeItem("userInfo");
    }
  }

  // Generate or get guestId
  initialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
  localStorage.setItem("guestId", initialGuestId);
} else {
  // fallback during SSR
  initialGuestId = null;
}

// Initial state
const initialState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// Async thunk: Login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`,
      userData
    );

    if (typeof window !== "undefined") {
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
    }

    return response.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Login failed" });
  }
});

// Async thunk: Register
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register`,
      userData
    );

    if (typeof window !== "undefined") {
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
    }

    return response.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Registration failed" });
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
        localStorage.setItem("guestId", state.guestId);
      }
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      if (typeof window !== "undefined") {
        localStorage.setItem("guestId", state.guestId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login error";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration error";
      });
  },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
