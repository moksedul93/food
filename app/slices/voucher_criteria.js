import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllVoucherCriteria } from "../features/voucher_criteria";

export const fetchVoucherCriteria = createAsyncThunk(
  "voucherCriteria",
  async ({ page, size }) => {
    return await getAllVoucherCriteria(page, size);
  }
);

const voucherCriteriaSlice = createSlice({
  name: "voucherCriteria",
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

let voucherCriteriaReducer = voucherCriteriaSlice.reducer;
export default voucherCriteriaReducer;
