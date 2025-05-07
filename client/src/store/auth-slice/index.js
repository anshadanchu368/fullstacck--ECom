import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log("Login Error:", error.response?.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/auth/logout`,{
          withCredentials:true,
        }
        
      );
      return response.data;
    } catch (error) {
      console.log("Login Error:", error.response?.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkAuth",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/check-auth",
        {
          withCredentials: true,
          headers: {
            "Cache-Control":
              "no-store,no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Request failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      console.log('Attempting password reset with token');
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`, 
        { password }
      );
      console.log('Reset password response:', res.data);
      return res.data;
    } catch (err) {
      console.error('Reset password error:', err);
      return rejectWithValue(
        err.response?.data?.message || 
        'Password reset failed. Please try again.'
      );
    }
  }
);

export const googleLogin = createAsyncThunk(
  '/auth/google-login',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/google-login',
        { token },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error('Google login error:', err);
      return rejectWithValue(
        err.response?.data?.message || 'Google login failed'
      );
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, Action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success ? true : false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Redux loginUser fulfilled payload:", action.payload);
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success ? true : false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("Login rejected:", action.error);
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state,action) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        console.log("Redux loginUser fulfilled payload:", action.payload);
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success ? true : false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      }).addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // Store any additional data from the payload
        if (action.payload.email) {
          state.resetEmail = action.payload.email;
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('Reset password rejected with payload:', action.payload);
      }).addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success ? true : false;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        console.log('Google login rejected with payload:', action.payload);
      })
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
