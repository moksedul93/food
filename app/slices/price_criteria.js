import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllPriceCriteria } from "../features/price_criteria";

export const fetchPriceCriteria = createAsyncThunk(
  "priceCriteria",
  async ({ page, size }) => {
    return await getAllPriceCriteria(page, size);
  }
);

const priceCriteriaSlice = createSlice({
  name: "priceCriteria",
  initialState: {
    loading: true,
    data: [],
  },
  reducers: {
    pending: (state) => {
      state.loading = true;
    },
    fulfilled: (state, action) => {
      let { error, data } = action.payload;
      // console.log('action fulfilled voucher',data);
      state.loading = false;
      if (!error) {
        state.data = data.docs;
      } else {
        state.data = [];
      }
    },
  },
});

let priceCriteriaReducer = priceCriteriaSlice.reducer;
export default priceCriteriaReducer;
