import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getOwners} from "../features/owners";

export const fetchOwners = createAsyncThunk('owners', async ({status, page, size}) => {
    return await getOwners(status || '', page, size)
})

const ownersSlice = createSlice({
    name: 'owners',
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
                state.data = data.docs
            } else {
                state.data = []
            }
        }
    }
})
let ownersReducer = ownersSlice.reducer
export default ownersReducer