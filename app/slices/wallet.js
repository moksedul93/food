import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getWallet} from "../features/wallet";

export const fetchWallet = createAsyncThunk('wallet', getWallet)

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {},
    reducers: {
        fulfilled: (state, action) => {
            const {error, data} = action.payload
            if(error) {
                return {}
            } else {
                return data
            }
        }
    }
})

const walletReducer = walletSlice.reducer
export default walletReducer