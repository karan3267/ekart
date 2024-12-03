import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoader } from "./loadingSlice";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoader);
      const response = await axios.get(
        "https://ekartback-e2jq.onrender.com/api/category"
      );
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoader(false));
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        (state.loading = false), (state.category = action.payload);
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
