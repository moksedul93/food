import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getFoods, getRestaurantFoods} from "../features/foods";


export const fetchFoods = createAsyncThunk('foods', getFoods)
export const fetchRestaurantFoods = createAsyncThunk('foods', getRestaurantFoods)

const foodsSlice = createSlice({
    name: 'foods',
    initialState: {
        loading: true,
        data: []
    },
    reducers: {
        fulfilled: (state, action) => {
            const {error, data} = action.payload
            state.loading = false
            if(error) {
                state.data = []
            } else {
                state.data = data
            }
        }
    }
})

const foodsReducer = foodsSlice.reducer
export default foodsReducer