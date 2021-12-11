import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllOrdersByRider } from "../features/rider";

export const fetchAllOrdersByRider = createAsyncThunk('riderOrders', async ({ status }) => {
    return await getAllOrdersByRider(status);
});

const riderSlice = createSlice({
    name: 'riderOrders',
    initialState: {
        loading: true,
         data: []
    },
    reducers: {
        pending: (state) => {
            state.loading = true
        },
        fulfilled: (state, action) => {
            let { error, data } = action.payload;
            state.loading = false
            if (!error) {
                state.data = data
            };
        }
    }
});
let riderReducer = riderSlice.reducer;
export default riderReducer;