import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getPlans} from "../features/plans";

export const fetchPlans = createAsyncThunk('plans', getPlans)


const plansSlice = createSlice({
    name: 'plans',
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
            state.loading = true
            if(!error) {
                state.data = data
            } else {
                state.data = []
            }
        }
    }
})
let plansReducer = plansSlice.reducer
export default plansReducer