import graphqlClient from "../graphql";
import Cookies from "js-cookie";

export const ownerLogin = async owner => {
    const query = `
        query ($phone: String!, $password: String!) {
            ownerLogin(mobile: $phone password: $password ) {
                token
                msg
                error
            }
        } 
    `;
    let client = graphqlClient()
    let { error, data } = await client.query(query, owner).toPromise()
    if (error) {
        return { error: true, msg: 'Network Failed' }
    }
    const { ownerLogin } = data
    Cookies.set('fja_token', ownerLogin.token)
    return ownerLogin
}

export const ownerRegister = async user => {
    let mutation = `
        mutation ($user: OwnerInput!){
            addOwner(ownerInput: $user) {
                error
                msg
                token
            }
        }
    `
    let client = graphqlClient()
    let { error, data } = await client.mutation(mutation, { user }).toPromise()
    if (error) {
        return { error: true, msg: 'Network Failed' }
    }
    const { addOwner } = data
    return addOwner
}

export const verifyOwner = async () => {
    const query = `
        query($token: String!) {
            verifyOwnerToken(token: $token){
                error
                msg
                data{
                    first_name
                    last_name
                    mobile
                    email
                    type
                    owner_address
                    national_id
                    status

                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient()
    let { error, data } = await client.query(query, { token }).toPromise()
    if (error) {
        return { error: true, msg: 'Network Failed' }
    }
    const { verifyOwnerToken } = data
    return verifyOwnerToken
}


export const getOwnerDashboardData = async () => {
    const query = `
        query {
            getDashboardPageDataByOwner {
                error
                msg
                data {
                    ownerTotalEarnings
                    ownerTotalPayouts
                    ownerTotalRestaurant
                    ownerTodayTotalEarnings
                    ownerOrderStatistics{
                        _id
                        count
                    }
                    ownerTodayOrderStatistics {
                        _id
                        count
                    }
                    ownerPayoutsStatistics {
                        _id
                        count
                    }
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let { error, data } = await client.query(query).toPromise()
    if (error) {
        return { error: true, msg: 'Network Failed' }
    }
    const { getDashboardPageDataByOwner } = data
    return getDashboardPageDataByOwner
}