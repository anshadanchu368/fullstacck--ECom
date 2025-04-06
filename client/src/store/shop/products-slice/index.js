import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/product/fetchAllProducts",
  async (_, thunkAPI) => {
    try {
      const result = await axios.get("http://localhost:5000/api/shop/products/get");
      return result.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);



const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllFilteredProducts.pending, (state, action) => {
      state.isLoading = true;
    }).addCase(fetchAllFilteredProducts.fulfilled,(state,action)=>{
        state.isLoading =false
        state.productList=action.payload.data
    }).addCase(fetchAllFilteredProducts.rejected,(state,action)=>{
        state.isLoading=false
        state.productList=[]

    })
}
})


    export default shoppingProductSlice.reducer;