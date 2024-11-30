import { configureStore } from "@reduxjs/toolkit";
import paymentReducer from "./paymentSlice";
import cartReducer from "./cartSlice";
import utilsReducer from "./utils.jsx"

export const store = configureStore({
  reducer: {
    payment: paymentReducer,
    cart:cartReducer,
    utils:utilsReducer
  },
});
