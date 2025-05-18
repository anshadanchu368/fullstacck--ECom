import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  orderId: null,
  paymentStatus: null, // You can track payment status as well
  isLoading: false,
  error: null,
  orderList: [],
  orderDetails: null
};

// Async thunk to create a new Razorpay order
export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData, thunkAPI) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/create`, orderData);
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
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/verify`, paymentData);
      return data; // Return the verification response
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to verify Razorpay payment"
      );
    }
  }
);

export const getAllOrderByUSer = createAsyncThunk(
  "order/getAllOrderByUSer",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`);
      return data; // Return the verification response
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "failed to get user id"
      );
    }
  }
)

export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`);

      return data; // Return the verification response
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to get Order Details"
      );
    }
  }
)

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
      })
      .addCase(getAllOrderByUSer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrderByUSer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data
      })
      .addCase(getAllOrderByUSer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.orderList = [];
      })
    
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
      
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails=null
      })
  },
});

export const { resetOrderState } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
