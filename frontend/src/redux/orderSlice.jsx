import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoader } from "./loadingSlice";

// Place an order
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No Authorization token found");
    }
    try {
      dispatch(setLoader(true));
      const response = await axios.post(
        "https://ekartback-e2jq.onrender.com/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoader(false));
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/getOrders",
  async (_, {rejectWithValue,dispatch}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Autorization token not found");
    }
    try {
      dispatch(setLoader(true));
      const response = await axios.get(
        "https://ekartback-e2jq.onrender.com/api/orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      rejectWithValue(error.response?.data || "Error fetching orders")
    } finally {
      dispatch(setLoader(false));
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        (state.loading = false), (state.orders = action.payload);
      })
      .addCase(fetchOrders.rejected, (state, error) => {
        (state.loading = false), (state.error = error.payload);
      });
  },
});

export default orderSlice.reducer;
