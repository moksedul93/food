import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getCategories} from "../features/categories";

export const fetchCategories = createAsyncThunk('categories', async ({page, size}) => {
    return await getCategories(page, size)
})

const categoriesSlice = createSlice({
    name: 'categories',
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
let categoriesReducer = categoriesSlice.reducer
export default categoriesReducer