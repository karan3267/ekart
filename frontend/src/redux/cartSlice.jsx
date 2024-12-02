import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://ekartback-e2jq.onrender.com/api/cart/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in the Authorization header
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartItem, { rejectWithValue }) => {
    const token=localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://ekartback-e2jq.onrender.com/api/cart/",
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        }
      );
      return response.data; // Return updated cart data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Remove item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (product, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `https://ekartback-e2jq.onrender.com/api/cart/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        }
      );
      console.log(response.data)
      return response.data; // Return updated cart data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Clear cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId, { rejectWithValue }) => {
    const token=localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `https://ekartback-e2jq.onrender.com/api/cart/clear/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // This reducer can be used for local manipulation if necessary
    updateTotalPrice: (state) => {
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Item to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Item from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalPrice = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateTotalPrice } = cartSlice.actions;

export default cartSlice.reducer;
