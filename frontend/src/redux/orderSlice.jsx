import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Place an order
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, { rejectWithValue }) => {
    const token=localStorage.getItem("token");
    if(!token){
      throw new Error("No Authorization token found")
    }
    try {
      const response = await axios.post("http://localhost:5000/api/orders", orderData,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrders=createAsyncThunk("orders/getOrders",async()=>{
  const token=localStorage.getItem("token");
  if(!token){
    throw new Error("Autorization token not found")
  }
  const response=await axios.get("http://localhost:5000/api/orders",
    {headers:{Authorization:`Bearer ${token}`}}
  );
  return response.data
})

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
      .addCase(fetchOrders.pending,(state)=>{
        state.loading=true;
      })
      .addCase(fetchOrders.fulfilled,(state,action)=>{
        state.loading=false,
        state.orders=action.payload;
      })
      .addCase(fetchOrders.rejected,(state,error)=>{
        state.loading=false,
        state.error=error.payload
      })
  },
});

export default orderSlice.reducer;
