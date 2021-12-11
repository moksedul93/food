import {createSlice} from "@reduxjs/toolkit";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    getDistricts,
    getDivisions,
    getMunicipals,
    getUnions,
    getUpazilas,
    getVillages,
    getWards
} from "../features/locations";

export const fetchDivisions = createAsyncThunk('locations/divisions', async ({}) => {
    return await getDivisions()
})
export const fetchDistricts = createAsyncThunk('locations/districts', async ({division_id}) => {
    return await getDistricts(division_id)
})
export const fetchMunicipals = createAsyncThunk('locations/municipals', async ({district_id}) => {
    return await getMunicipals(district_id)
})
export const fetchWards = createAsyncThunk('locations/wards', async ({municipal_id}) => {
    return await getWards(municipal_id)
})
export const fetchUpazilas = createAsyncThunk('locations/upazilas', async ({district_id}) => {
    return await getUpazilas(district_id)
})
export const fetchUnions = createAsyncThunk('locations/unions', async ({upazila_id}) => {
    return await getUnions(upazila_id)
})
export const fetchVillages = createAsyncThunk('locations/villages', async ({union_id}) => {
    return await getVillages(union_id)
})


const locationSlice = createSlice({
    name: 'locations',
    initialState: {
        divisions: [],
        districts: [],
        municipals: [],
        wards: [],
        upazilas: [],
        unions: [],
        villages: []
    },
    reducers: {
        'divisions/fulfilled': (state, action) => {
            let {error, data} = action.payload
            if(!error){
                state.divisions = data
            }
        },
        'districts/fulfilled': (state, action) => {
            let {error, data} = action.payload
            if(!error){
                state.districts = data
            }
        },
        'municipals/fulfilled': (state, action) => {
            let {error, data} = action.payload
            if(!error){
                state.municipals = data
            }
        },
        'wards/fulfilled': (state, action) => {
            let {error, data} = action.payload
            if(!error){
                state.wards = data
            }
        },
        'upazilas/fulfilled': (state, action) => {
            let {error, data} = action.payload
            if(!error){
                state.upazilas = data
            }
        },
        'unions/fulfilled': (state, action) => {
            let {error, data} = action.payload
            if(!error){
                state.unions = data
            }
        },
        'villages/fulfilled': (state, action) => {
            let {error, data} = action.payload
            if(!error){
                state.villages = data
            }
        },
        clearDistricts: (state, action) => {
            state.districts = []
            state.municipals = []
            state.wards = []
            state.upazilas = []
            state.unions = []
            state.villages = []
        },
        clearMunicipals: (state, action) => {
            state.municipals = []
            state.wards = []
        },
        clearWards: (state, action) => {
            state.wards = []
        },
        clearUpazilas: (state, action) => {
            state.upazilas = []
            state.unions = []
            state.villages = []
        },
        clearUnions: (state, action) => {
            state.unions = []
            state.villages = []
        },
        clearVillages: (state, action) => {
            state.villages = []
        }
    }
})
const locationsReducer = locationSlice.reducer
export default locationsReducer