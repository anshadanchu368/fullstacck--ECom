import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  approvalURL: null,
  orderId: null,
  paymentStatus: null, // You can track payment status as well
  isLoading: false,
  error: null,
};

// Async thunk to create a new Razorpay order
export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData, thunkAPI) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/shop/order/create", orderData);
      return data; // Return the data, which will include the order info
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create Razorpay order"
      );
    }
  }
);

// Async thunk to verify Razorpay payment after the user completes the transaction
export const verifyPayment = createAsyncThunk(
  "order/verifyPayment",
  async (paymentData, thunkAPI) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/shop/order/verify", paymentData);
      return data; // Return the verification response
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to verify Razorpay payment"
      );
    }
  }
);

// Slice
const shoppingOrderSlice = createSlice({
  name: "shopOrder",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.approvalURL = null;
      state.orderId = null;
      state.paymentStatus = null;
      state.isLoading = false;
      state.error = null;
    },
    
  },
  extraReducers: (builder) => {
    builder
      // --- Create Razorpay Order ---
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
     
        state.orderId = action.payload.orderId; // Store the generated orderId from the backend mongodb
        sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId)); // Store in sessionStorage if needed
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.approvalURL = null;
        state.orderId = null;
      })
      
      // --- Verify Razorpay Payment ---
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentStatus = "confirmed"; // Set status to confirmed if payment is successful
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.paymentStatus = "failed"; // Set status to failed if verification fails
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
