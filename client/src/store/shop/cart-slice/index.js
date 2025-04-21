import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isLoading: false,
  error: null,
};

// Add to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/shop/cart/add`, {
        userId,
        productId,
        quantity,
      });
      console.log("✅ Add to Cart Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Add to Cart Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Cart Items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/shop/cart/get/${userId}`);
      console.log("✅ Fetch Cart Items Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Fetch Cart Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Cart Item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItems",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/shop/cart/${userId}/${productId}`);
      console.log("✅ Delete Cart Item Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Delete Cart Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Cart Quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/shop/cart/update-cart`, {
        userId,
        productId,
        quantity,
      });
      console.log("✅ Update Quantity Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Update Quantity Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "ShoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = { items: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Cart Item
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Cart Quantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = shoppingCartSlice.actions;


export default shoppingCartSlice.reducer;
