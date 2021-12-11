import Cookies from "js-cookie";
import graphqlClient from "../graphql";

export const getOwners = async (status, page, size) => {
    let query = `
        query( $status: String!, $page: Int, $size: Int) {
            getAllOwners(status: $status, page: $page, pagesize: $size) {
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
                        owner_address
                        status
                        national_id
                        createdAt
                        rejection_msg
                    }
                }
            }
        }  
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(query, {status, page, size}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getAllOwners} = data
    return getAllOwners
}

export const updateOwner = async (owner) => {
    let mutation = `
        mutation($owner: OwnerInput!) {
            updateOwnerWithStatus(ownerInput: $owner) {
                msg
                error
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {owner}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {updateOwnerWithStatus} = data
    return updateOwnerWithStatus
}