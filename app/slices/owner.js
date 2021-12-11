import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getOwnerDashboardData, verifyOwner} from "../features/owner";

export const fetchOwner = createAsyncThunk('owner', verifyOwner)
export const fetchDashboardData = createAsyncThunk('owner/dashboard', getOwnerDashboardData)

const ownerSlice = createSlice({
    name: 'owner',
    initialState: {
        auth: false,
        name:'',
        first_name: '',
        last_name: '',
        mobile:'',
        email:'',
        owner_address:'',
        national_id:'',
        status:''


    },
    reducers: {
        fulfilled: (state, action) => {
            const {error, data} = action.payload
            if(error) {
                state.auth = false
            } else {
                state.auth = true
                state.name = data.first_name
                state.first_name = data.first_name
                state.last_name = data.last_name
                state.mobile = data.mobile
                state.email = data.email
                state.owner_address = data.owner_address
                state.national_id = data.national_id
                state.status = data.status
            }
        },
        'dashboard/fulfilled': (state, action) => {
            const {error, data} = action.payload
            console.log(data)
            if(error) {
                state.dashboard = undefined
            } else {
                state.dashboard = data
            }
        }
    }
})

const ownerReducer = ownerSlice.reducer
export default ownerReducer
