import graphqlClient from "../graphql";
import Cookies from "js-cookie";

export const verifyAdmin = async () => {
    const query = `
        query($token: String!) {
            verifyAdminToken(token: $token) {
                error
                msg
                data {
                    _id
                    mobile
                    type
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient()
    let {error, data} = await client.query(query, {token}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {verifyAdminToken} = data
    return verifyAdminToken
}


export const adminLogin = async admin => {
    const query = `
        query ($phone: String!, $password: String!) {
            adminLogin(mobile: $phone password: $password ) {
                token
                msg
                error
            }
        } 
    `;
    let client = graphqlClient()
    let {error, data} = await client.query(query, admin).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {adminLogin} = data
    return adminLogin
}