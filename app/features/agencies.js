import Cookies from "js-cookie";
import graphqlClient from "../graphql";

export const getAgencies = async (status, page, size) => {
    let query = `
        query ($status: String, $page: Int, $size: Int) {
            getAllAgencies(status: $status, page: $page, pagesize: $size) {
                error
                msg
                data {
                    totalDocs
                    docs {
                        _id
                        first_name
                        last_name
                        mobile
                        email
                        agency_level
                        status
                        national_id
                        rejection_msg
                        createdAt
                    }
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(query, {status: status || '', page, size}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getAllAgencies} = data
    return getAllAgencies
}

export const updateAgency = async agency => {
    let mutation = `
        mutation ($ag: AgencyInput) {
            updateAgencyWithStatus(agencyInput: $ag) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    console.log("client",client)
    console.log("agencies",agency.agency)
    const ag=agency.agency
    let {error, data} = await client.mutation(mutation, {ag}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {updateAgencyWithStatus} = data
    return updateAgencyWithStatus
}

export const addAgency = async agency => {
    let mutation = `
        mutation ($agency: AgencyInput) {
            addAgency(agencyInput: $agency) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {agency}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addAgency} = data
    return addAgency
}