import cookie from "cookie";
import {UrqlClient} from "../urql/urql-provider";

const getToken = context => {
    if(! (context.req.headers && context.req.headers.cookie ) ) {
        context.res.writeHeader(307, { Location: "/admin/login" })
        context.res.end()
    }
    const cookies = cookie.parse(context.req.headers.cookie);
    return cookies.fja_token;
}

export {getToken}


const getQuery = context => {
    const url = require('url');
    const parsedUrl = url.parse(context.req.url, true);
    return parsedUrl.query;
}

export {getQuery}


const verifyToken = async (context) => {
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
    let client = UrqlClient();
    let token = getToken(context);
    let request = client.query(query, { token: token}).toPromise();
    let result = await request
    if(result.error || result.data.verifyAdminToken.error || result.data.verifyAdminToken.data.type !== 'admin') {
        context.res.writeHeader(307, { Location: "/admin/login" });
        context.res.end()
    }
    return result.data.verifyAdminToken.data;
}

export {verifyToken}