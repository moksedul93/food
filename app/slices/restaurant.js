import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getRestaurant, getRestaurantDashboardData, verifyRestaurant} from "../features/restaurant";

export const fetchRestaurant = createAsyncThunk('restaurant', verifyRestaurant)
export const fetchOneRestaurant = createAsyncThunk('restaurant/single', async ({id}) => {
    return await getRestaurant(id);
})
export const fetchRestaurantDashboard = createAsyncThunk('restaurant/dashboard', getRestaurantDashboardData)

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState: {
        auth: false,
        name: '',
        restaurant_or_homemade:'',
        description:'',
        foods_count:'',
        price_type:'',
        address:'',
        active: false,
        balance: 0,
        data: {},
        dashboard: null,
    },
    reducers: {
        fulfilled: (state, action) => {
            const {error, data} = action.payload
            console.log("data",data)
            if(!error) {
                state.auth = true
                state.name = data.name
                state.active = data.active
                state.balance = data.balance
                state.restaurant_or_homemade = data.restaurant_or_homemade
                state.description = data.description
                state.foods_count = data.foods_count
                state.price_type = data.price_type
                state.address = data.address.address
            }
        },
        'single/fulfilled': (state, action) => {
            const {error, data} = action.payload
            error ? state.data = {} : state.data = data
        },
        'dashboard/fulfilled': (state, action) => {
            const {error, data} = action.payload
            error ? state.dashboard = null : state.dashboard = data
        }
    },
})
const restaurantReducer = restaurantSlice.reducer
export default restaurantReducer