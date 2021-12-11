import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getOwnerRestaurants, getRestaurants} from "../features/restaurants";

export const fetchRestaurants = createAsyncThunk('restaurants', async ({name,status, page, size}) => {
    return await getRestaurants(name,status, page, size)
})

export const fetchOwnerRestaurants = createAsyncThunk('restaurants/ownerRestaurants', async ({status}) => {
    return await getOwnerRestaurants(status)
})

const restaurantsSlice = createSlice({
    name: 'restaurants',
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
        },
        'ownerRestaurants/pending': (state) => {
            state.loading = true
        },
        'ownerRestaurants/fulfilled': (state, action) => {
            let {error, data} = action.payload
            state.loading = false
            if(error) {
                state.data =[]
            } else {
                state.data = data
            }
        }
    }
})
let restaurantsReducer = restaurantsSlice.reducer
export default restaurantsReducer