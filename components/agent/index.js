import {UrqlClient} from "../urql/urql-provider";
import cookie from "cookie";

export const agentLogin = async (mobile, password ) => {
    let query = `
        query($mobile: String!, $password: String!){
            agentLogin(mobile: $mobile, password: $password) {
                error,
                msg,
                token
            }
        }
    `
    let client = UrqlClient();
    let request = client.mutation(query, {mobile, password}).toPromise();
    let result = await request;
    if(result.error) {
        return {
            error: true,
            msg: "Request Failed",
        }
    } else {
        return {
            error : result.data.agentLogin.error,
            msg : result.data.agentLogin.msg,
            token: result.data.agentLogin.token,
        }
    }
}


const getToken = context => {
    if(! (context.req.headers && context.req.headers.cookie ) ) {
        context.res.writeHeader(307, { Location: "/agent/login" })
        context.res.end()
    }
    const cookies = cookie.parse(context.req.headers.cookie);
    return cookies.fja_token;
}



export const verifyAgent = async (context) => {
    const query = `
        query($token: String!) {
            verifyAgentToken(token: $token) {
                error
                msg
                data {
                    _id
                    first_name
                    mobile
                    type
                    agent_level
                    division
                    district
                    municipal
                    ward
                    upazila
                    union
                    village
                }
            }
        }
    `
    let client = UrqlClient();
    let token = getToken(context);
    let request = client.query(query, { token: token}).toPromise();
    let result = await request
    if(result.error || result.data.verifyAgentToken.error || result.data.verifyAgentToken.data.type !== 'agent') {
        context.res.writeHeader(307, { Location: "/agent/login" });
        context.res.end()
    }
    return result.data.verifyAgentToken.data;
}



