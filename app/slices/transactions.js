import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getTransactions} from "../features/transactions";

export const fetchTransactions = createAsyncThunk('transactions', async ({status, page, size}) => {
    return await getTransactions(status, page, size)
})

const transactionsSlice = createSlice({
    name: 'transactions',
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
            let {error, data} = action.payload
            state.loading = false
            if(!error) {
                state.data = data.docs
            } else {
                state.data = []
            }
        }
    }
})
let transactionsReducer = transactionsSlice.reducer
export default transactionsReducer