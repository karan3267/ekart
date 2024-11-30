import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // Correct property name
  customer: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setProduct(state, action) {
      state.products = action.payload; // Replace the entire products array
    },
    addProduct(state, action) {
      state.products.push(action.payload); // Add a single product
    },
    setCustomer(state, action) {
      state.customer = action.payload;
    },
    resetPayment(state) {
      state.products = []; // Reset products to an empty array
      state.customer = null;
    },
  },
});

export const { setProduct, addProduct, setCustomer, resetPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
