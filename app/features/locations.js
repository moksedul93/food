import graphqlClient from "../graphql";

export const getDivisions = async () => {
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
    let client = graphqlClient()
    let {error, data} = await client.query(query).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getDivisions} = data
    return getDivisions
}

export const getDistricts = async division_id => {
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
    let client = graphqlClient()
    let {error, data} = await client.query(query, {division_id}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getDistricts} = data
    return getDistricts
}

export const getMunicipals = async district_id => {
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
    let client = graphqlClient()
    let {error, data} = await client.query(query, {district_id}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getMunicipals} = data
    return getMunicipals
}

export const getWards = async municipal_id => {
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
    let client = graphqlClient()
    let {error, data} = await client.query(query, {municipal_id}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getWards} = data
    return getWards
}

export const getUpazilas = async district_id => {
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
    let client = graphqlClient()
    let {error, data} = await client.query(query, {district_id}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getUpazillas} = data
    return getUpazillas
}

export const getUnions = async upazila_id => {
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
    let client = graphqlClient()
    let {error, data} = await client.query(query, {upazila_id}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getUnions} = data
    return getUnions
}

export const getVillages = async union_id => {
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
    let client = graphqlClient()
    let {error, data} = await client.query(query, {union_id}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getVillages} = data
    return getVillages
}