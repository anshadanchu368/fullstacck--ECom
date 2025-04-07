import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/product/fetchAllProducts",
  async ({filterParams ,sortParams}) => {
    try {
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams
      })

      const result = await axios.get(`http://localhost:5000/api/shop/products/get?${query}`);
      return result.data;


    } catch (err) {
      throw err.response?.data || new Error("Failed to fetch products");
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