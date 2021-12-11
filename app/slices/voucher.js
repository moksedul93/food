import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getAllVouchers} from "../features/voucher";

export const fetchVouchers = createAsyncThunk('vouchers',
async ({page,size})=>{
 return await getAllVouchers(page,size)
}
);

const voucherSlice = createSlice({
    name: 'vouchers',
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
           // console.log('action fulfilled voucher',data);
            state.loading = false
            if(!error) {
                state.data = data.docs
            }else{
                state.data=[]
            }
        },
    }
})

let voucherReducer = voucherSlice.reducer
export default voucherReducer