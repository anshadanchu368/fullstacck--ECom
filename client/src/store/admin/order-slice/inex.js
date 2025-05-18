import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderId: null,
  paymentStatus: null,
  isLoading: false,
  error: null,
  orderList: [],
  orderDetails: null,
  deleteSuccess: false // New state to track deletion success
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "order/getAllOrdersForAdmin",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders/get`);
      return data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to get orders"
      );
    }
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "order/getOrderDetailsForAdmin",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`);
      return data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to get Order Details"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, orderStatus }, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
        { orderStatus }
      );
      return { ...data, id, orderStatus }; // Return id and orderStatus for updating local state
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

// New thunk for deleting a single order
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/orders/delete/${id}`);
      return { ...data, id }; // Return id for removing from local state
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

// New thunk for deleting all orders
export const deleteAllOrders = createAsyncThunk(
  "order/deleteAllOrders",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/orders/delete-all`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete all orders"
      );
    }
  }
);

const adminOrderSlice = createSlice({
  name: 'adminOrderSlice',
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    resetDeleteStatus: (state) => {
      state.deleteSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all orders
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.orderList = [];
      }) 
      
      // Get order details
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.orderDetails = null;
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update the order status in the list if it exists
        if (state.orderList) {
          state.orderList = state.orderList.map(order => 
            order._id === action.payload.id 
              ? { ...order, orderStatus: action.payload.orderStatus }
              : order
          );
        }
        
        // Update the order details if it's currently being viewed
        if (state.orderDetails && state.orderDetails._id === action.payload.id) {
          state.orderDetails = { ...state.orderDetails, orderStatus: action.payload.orderStatus };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete single order
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        
        // Remove the deleted order from the orderList
        if (state.orderList) {
          state.orderList = state.orderList.filter(order => order._id !== action.payload.id);
        }
        
        // Reset orderDetails if the deleted order is currently being viewed
        if (state.orderDetails && state.orderDetails._id === action.payload.id) {
          state.orderDetails = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })
      
      // Delete all orders
      .addCase(deleteAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteAllOrders.fulfilled, (state) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        state.orderList = [];
        state.orderDetails = null;
      })
      .addCase(deleteAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  }
});

export const { resetOrderDetails, resetDeleteStatus } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;