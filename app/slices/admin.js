import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {verifyAdmin} from "../features/admin";

export const fetchAdmin = createAsyncThunk('admin', verifyAdmin)

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        auth: false,
        mobile:'',
        type:''
    },
    reducers: {
        fulfilled: (state, action) => {
            let {error, data} = action.payload
            if(!error) {
                state.auth = true
                state.mobile=data.mobile
                state.type=data.type
            }
        }
    }
})

const adminReducer = adminSlice.reducer
export default adminReducer