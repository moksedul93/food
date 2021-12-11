import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getAgencies} from "../features/agencies";

export const fetchAgencies = createAsyncThunk('agencies', async ({status, page, size}) => {
    return await getAgencies(status || '', page, size)
})

const agenciesSlice = createSlice({
    name: 'agencies',
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
let agenciesReducer = agenciesSlice.reducer
export default agenciesReducer