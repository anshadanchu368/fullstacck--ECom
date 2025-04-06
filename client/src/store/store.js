import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import AdminProductSlice from './admin/product-slice'
import shoppingProductSlice from './shop/products-slice'

const store=configureStore({
    reducer:{
        auth:authReducer,
        adminProducts :AdminProductSlice,
        shoppingProducts: shoppingProductSlice

    }
})

export default store;