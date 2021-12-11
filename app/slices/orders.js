import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOrders, getRestaurantOrders } from "../features/orders";

export const fetchOrders = createAsyncThunk('orders', async ({ status, page, size }) => {
    return await getOrders(status, page, size)
})

export const fetchRestaurantOrders = createAsyncThunk('orders/restaurantOrders', async ({ status }) => {
    return await getRestaurantOrders(status)
})

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        loading: true,
        total: 0,
        data: []
    },
    reducers: {
        pending: (state) => {
            state.loading = true
        },
        fulfilled: (state, action) => {
            let { error, data } = action.payload
            state.loading = false
            if (!error) {
                state.data = data.docs
            } else {
                state.data = []
            }
        },
        'restaurantOrders/pending': (state) => {
            state.loading = true
        },
        'restaurantOrders/fulfilled': (state, action) => {
            let { error, data } = action.payload
            state.loading = false
            if (!error) {
                state.data = data
            } else {
                state.data = []
            }
        }
    }
})
let ordersReducer = ordersSlice.reducer
export default ordersReducer