import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoader } from "./loadingSlice";

// Fetch products from API
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, {dispatch}) => {
    try {
      dispatch(setLoader(true));
      const response = await axios.get(
        "https://ekartback-e2jq.onrender.com/api/products"
      );
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoader(false));
    }
  }
);
export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await axios.get(
        `https://ekartback-e2jq.onrender.com/api/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoader(false));
    }
  }
);
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (query, { getState, rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoader(true));
      const allProducts = getState().products.products || [];
      const filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      return filteredProducts;
    } catch (error) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoader(false));
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // Update filtered products
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
