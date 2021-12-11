import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllPromotionalImages } from "../features/promotional_images";

export const fetchPromotionalImages = createAsyncThunk(
  "promotionalImages",
  async ({ page, size }) => {
    return await getAllPromotionalImages(page, size);
  }
);

const promotionalImageSlice = createSlice({
  name: "promotionalImages",
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

let promotionalImagesReducer = promotionalImageSlice.reducer;
export default promotionalImagesReducer;
