import graphqlClient from "../graphql";
import Cookies from "js-cookie";


export const getAllOrdersByRider = async (status) => {
    const query = `
        query($status: String) {
            getAllOrdersByRider(status: $status) {
                error,
                msg,
                data {
                    _id,
                    items {
                        _id,name,size,quantity, price,base_price
                    },
                    customer {
                        first_name,last_name,mobile,
                    },
                    base_price_total,
                    total,
                    sub_total,
                    customer_discount_amount,
                    status,
                    delivery_info {
                        address {
                        address,
                        location {
                            lat,
                            lng
                        }
                  }
                    }
                }
            }
        }
    `;
    const token = Cookies.get('fjr_token');
    const client = graphqlClient(token);
    const { error, data } = await client.query(query, { status }).toPromise();
    if (error) {
        return { error: true, msg: 'Network Failed' }
    };
    const { getAllOrdersByRider } = data;
    return getAllOrdersByRider;
};

export const riderLogin = async (mobile, password) => {
    const query = `
        query($mobile: String!, $password: String!){
            riderLogin(mobile: $mobile, password: $password) {
                error,
                msg,
                token
            }
        }
    `;
    const client = graphqlClient();
    const { error, data } = await client.query(query, { mobile, password }).toPromise();
    if (error) {
        return { error: true, msg: 'Network Failed' }
    }
    const { riderLogin } = data
    Cookies.set('fjr_token', riderLogin.token)
    return riderLogin;
}

