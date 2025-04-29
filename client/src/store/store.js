import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import AdminProductSlice from './admin/product-slice'
import adminOrderSlice from './admin/order-slice/inex'
import shoppingProductSlice from './shop/products-slice'
import shoppingCartSLice from './shop/cart-slice'
import shopAddressSlice from './shop/address-slice'
import shopOrderSlice from './shop/order-slice'
import shopSearchSlice from './shop/search-slice'


const store=configureStore({
    reducer:{
        auth:authReducer,
        adminProducts :AdminProductSlice,
        adminOrder:adminOrderSlice,
        shoppingProducts: shoppingProductSlice,
        shoppingCart: shoppingCartSLice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch:shopSearchSlice

    }
})

export default store;