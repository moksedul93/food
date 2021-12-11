import InputSelect from "../input/input-select";
import React from "react";
import {useQuery} from "urql";

export const Division = props => {
    let query = `
        query {
            getDivisions{
                error
                msg
                data {
                    id
                    name
                    bn_name
                }
            }
        }
    `

    let options = []
    const [res, reExecuteQuery] = useQuery({query});
    if(! ( res.fetching || res.error )) {
        options = res.data.getDivisions.data.map(division => {
            return {
                text: division.bn_name,
                key: division.id,
                value: division.id
            }
        });
    }

    if(props.hasAll) {
        options.unshift({
            text: 'All',
            key: 'all',
            value: ''
        })
    }


    return (
        <InputSelect label="Division" value={props.value} setValue={props.setValue} options={options} disabled={props.disabled}/>
    )
}


export const District = props => {
    let query = `
        query ($division_id: String!) {
            getDistricts(division_id: $division_id) {
                error
                msg
                data {
                    id
                    name
                    bn_name
                }
            }
        }
    `

    let options = []
    const [res, reExecuteQuery] = useQuery({query, variables: {division_id: props.divisionId || ''}});
    if(! ( res.fetching || res.error || res.data.getDistricts.error )) {
        options = res.data.getDistricts.data.map(district => {
            return {
                text: district.bn_name,
                key: district.id,
                value: district.id
            }
        });
    }

    if(props.hasAll) {
        options.unshift({
            text: 'All',
            key: 'all',
            value: ''
        })
    }


    return (
        <InputSelect label="District" value={props.value} setValue={props.setValue} options={options} disabled={props.disabled}/>
    )
}


export const Municipality = props => {
    let query = `
        query($district_id: String! ) {
            getMunicipals(district_id: $district_id) {
                error
                msg
                data {
                    id
                    name
                    bn_name
                }
            }
        }
    `

    let options = []
    const [res, reExecuteQuery] = useQuery({query, variables: {district_id: props.districtId || ''}});
    if(! ( res.fetching || res.error || res.data.getMunicipals.error )) {
        options = res.data.getMunicipals.data.map(municipal => {
            return {
                text: municipal.bn_name,
                key: municipal.id,
                value: municipal.id
            }
        });
    }

    if(props.hasAll) {
        options.unshift({
            text: 'All',
            key: 'all',
            value: ''
        })
    }


    return (
        <InputSelect label="Municipal" value={props.value} setValue={props.setValue} options={options} disabled={props.disabled}/>
    )
}

export const Ward = props => {
    let query = `
        query($municipal_id: String! ) {
            getWards(municipal_id: $municipal_id) {
                error
                msg
                data {
                    id
                    name
                    bn_name
                }
            }
        }
    `

    let options = []
    const [res, reExecuteQuery] = useQuery({query, variables: {municipal_id: props.municipalId || ''}});
    if(! ( res.fetching || res.error || res.data.getWards.error )) {
        options = res.data.getWards.data.map(ward => {
            return {
                text: ward.bn_name,
                key: ward.id,
                value: ward.id
            }
        });
    }

    if(props.hasAll) {
        options.unshift({
            text: 'All',
            key: 'all',
            value: ''
        })
    }


    return (
        <InputSelect label="Ward" value={props.value} setValue={props.setValue} options={options} disabled={props.disabled}/>
    )
}


export const Upazila = props => {
    let query = `
        query($district_id: String! ) {
            getUpazillas(district_id: $district_id) {
                error
                msg
                data {
                    id
                    name
                    bn_name
                }
            }
        }
    `

    let options = []
    const [res, reExecuteQuery] = useQuery({query, variables: {district_id: props.districtId || ''}});
    if(! ( res.fetching || res.error || res.data.getUpazillas.error )) {
        options = res.data.getUpazillas.data.map(upazila => {
            return {
                text: upazila.bn_name,
                key: upazila.id,
                value: upazila.id
            }
        });
    }

    if(props.hasAll) {
        options.unshift({
            text: 'All',
            key: 'all',
            value: ''
        })
    }


    return (
        <InputSelect label="Upazila" value={props.value} setValue={props.setValue} options={options} disabled={props.disabled}/>
    )
}


export const Union = props => {
    let query = `
        query($upazila_id: String!) {
            getUnions(upazilla_id: $upazila_id) {
                error
                msg
                data {
                    id
                    name
                    bn_name
                }
            }
        }
    `

    let options = []
    const [res, reExecuteQuery] = useQuery({query, variables: {upazila_id: props.upazilaId || ''}});
    if(! ( res.fetching || res.error || res.data.getUnions.error )) {
        options = res.data.getUnions.data.map(union => {
            return {
                text: union.bn_name,
                key: union.id,
                value: union.id
            }
        });
    }

    if(props.hasAll) {
        options.unshift({
            text: 'All',
            key: 'all',
            value: ''
        })
    }


    return (
        <InputSelect label="Union" value={props.value} setValue={props.setValue} options={options} disabled={props.disabled}/>
    )
}


export const Village = props => {
    let query = `
       query($union_id: String!){
            getVillages(union_id: $union_id) {
                error
                msg
                data {
                    id
                    name
                    bn_name
                }
            }
        }
    `

    let options = []
    const [res, reExecuteQuery] = useQuery({query, variables: {union_id: props.unionId || ''}});

    if(! ( res.fetching || res.error || res.data.getVillages.error )) {
        options = res.data.getVillages.data.map(village => {
            return {
                text: village.bn_name,
                key: village.id,
                value: village.id
            }
        });
    }

    if(props.hasAll) {
        options.unshift({
            text: 'All',
            key: 'all',
            value: ''
        })
    }


    return (
        <InputSelect label="Village" value={props.value} setValue={props.setValue} options={options} disabled={props.disabled}/>
    )
}
