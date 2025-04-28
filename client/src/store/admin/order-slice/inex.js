import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState ={
    orderId: null,
  paymentStatus: null, // You can track payment status as well
  isLoading: false,
  error: null,
  orderList: [],
  orderDetails: null
}

export const getAllOrdersForAdmin = createAsyncThunk(
    "order/getAllOrdersForAdmin",
    async (userId, thunkAPI) => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/admin/orders/get`);
        return data; 
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "failed to get user id"
        );
      }
    }
  )
  
  export const getOrderDetailsForAdmin = createAsyncThunk(
    "order/getOrderDetailsForAdmin",
    async (id, thunkAPI) => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/admin/orders/details/${id}`);
  
        return data; 
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to get Order Details"
        );
      }
    }
  )
  export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({ id, orderStatus }, thunkAPI) => {
      try {
        const { data } = await axios.put(
          `http://localhost:5000/api/admin/orders/update/${id}`,
          { orderStatus }
        );
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to update order status"
        );
      }
    }
  );
  

const adminOrderSlice =createSlice({
    name: 'adminOrderSlice',
    initialState,
    reducers:{
        resetOrderDetails:(state)=>{
           state.orderDetails = null
        }
    },
    extraReducers: (builder)=>{
       builder
       .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.orderList = [];
      })
    
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        console.log("Order Details fetched from admin", action.payload); // ✅ Add this to see what's returned
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails=null
      })
    }
})

export const {resetOrderDetails} =adminOrderSlice.reducer


export default adminOrderSlice.reducer