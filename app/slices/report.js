import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getAdminReport, getOwnerReport, getRestaurantReport} from "../features/report";

export const fetchRestaurantReport = createAsyncThunk('report', async ({range}) => {
    return getRestaurantReport(range)
})

export const fetchOwnerReport = createAsyncThunk('report', async ({restaurantID, range}) => {
    return getOwnerReport(restaurantID, range)
})

export const fetchAdminReport = createAsyncThunk('report', async ({ownerID, restaurantID, range}) => {
    return getAdminReport(ownerID, restaurantID, range)
})

const reportSlice = createSlice({
    name: 'report',
    initialState: {
        loading: true,
        data: []
    },
    reducers: {
        pending: (state) => {
            state.loading = true
        },
        fulfilled: (state, action) => {
            let {error, data} = action.payload
            state.loading = false
            if(!error) {
                state.data = data
            } else {
                state.data = {}
            }
        }
    }
})
let reportReducer = reportSlice.reducer
export default reportReducer