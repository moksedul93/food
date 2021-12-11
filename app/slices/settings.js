import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getSettings} from "../features/settings";

export const fetchSettings = createAsyncThunk('settings', getSettings)

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {},
    reducers: {
        fulfilled: (state, action) => {
            let {error, data} = action.payload
            if(!error) {
                return data
            } else {
                return {}
            }
        }
    }
})
let settingsReducer = settingsSlice.reducer
export default settingsReducer