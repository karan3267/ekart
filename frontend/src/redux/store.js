import { configureStore } from "@reduxjs/toolkit";
import paymentReducer from "./paymentSlice";
import cartReducer from "./cartSlice";
import utilsReducer from "./utils.jsx"
import authReducer from './authSlice.jsx'
import orderReducer from './orderSlice.jsx'
import productReducer from './productSlice.jsx'
import categoryReducer from './categorySlice.jsx'
import loadingReducer from './loadingSlice.jsx'

export const store = configureStore({
  reducer: {
    payment: paymentReducer,
    cart:cartReducer,
    utils:utilsReducer,
    auth:authReducer,
    order:orderReducer,
    products:productReducer,
    category:categoryReducer,
    loading:loadingReducer
  },
});
