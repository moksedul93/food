import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
// import { verifyAgent } from "../../components/agent/index";
import { verifyAgent } from "../features/agent";

export const fetchAgent = createAsyncThunk('agent', verifyAgent)

const agentSlice = createSlice({
    name: 'agent',
    initialState: {
      auth: false,
      name:'',
      first_name: '',
      last_name: '',
      mobile:'',
      email:'',
      owner_address:'',
      national_id:'',
      status:'',
      type: '',
      agent_level:'',
      division:'',
      district:'',
      municipal:'',
      ward:'',
      upazila:'',
      union:'',
      village:''
  },
    reducers: {
          fulfilled: (state, action) => {
          const {error, data} = action.payload
          console.log("slice-",data)
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
              state.type = data.type
              state.agent_level=data.agent_level

              state.division=data.division
              state.district=data.district
              state.municipal=data.municipal
              state.ward=data.ward
              state.upazila=data.upazila
              state.union=data.union
              state.village=data.village
          }
        }
    }
})
let agentReducer = agentSlice.reducer
export default agentReducer