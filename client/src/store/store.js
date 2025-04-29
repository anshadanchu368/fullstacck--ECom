import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import AdminProductSlice from './admin/product-slice'
import adminOrderSlice from './admin/order-slice/inex'
import shoppingProductSlice from './shop/products-slice'
import shoppingCartSLice from './shop/cart-slice'
import shopAddressSlice from './shop/address-slice'
import shopOrderSlice from './shop/order-slice'
import shopSearchSlice from './shop/search-slice'
import shopReviewSlice from './shop/review-slice'
import wishlistReducer from './shop/wishlist/index';


const store=configureStore({
    reducer:{
        auth:authReducer,
        adminProducts :AdminProductSlice,
        adminOrder:adminOrderSlice,
        shoppingProducts: shoppingProductSlice,
        shoppingCart: shoppingCartSLice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch:shopSearchSlice,
        shopReview:shopReviewSlice,
        wishlist: wishlistReducer,

    }
})

export default store;