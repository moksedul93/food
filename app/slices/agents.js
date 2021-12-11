import { createSlice } from "@reduxjs/toolkit";

const agentsSlice = createSlice({
    name: 'agents',
    initialState: {
        loading: true,
        total: 0,
        data: []
    },
    reducers: {
        pending: (state) => {
            state.loading = true
        },
        fulfilled: (state, action) => {
            let { error, data } = action.payload
            state.loading = true
            if (!error) {
                state.total = data.docs
                state.data = data.totalDocs
            }
        }
    }
});
let agentsReducer = agentsSlice.reducer
export default agentsReducer