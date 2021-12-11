import { UrqlClient } from "../../urql/urql-provider";
import Cookies from "js-cookie";
import graphqlClient from "../../../app/graphql";


const User = async (token, id) => {
    const getAUserQuery = `
        query ($id: ID!) {
            getOneOwner(_id: $id) {
                data {
                    _id
                    first_name
                    last_name
                    mobile
                    email
                    national_id
                    owner_address
                    status
                    rejection_msg
                }
            }
        }
    `;

    let client = UrqlClient(token);
    let request = client.query(getAUserQuery, {
        id: id
    }).toPromise();
    let result = await request

    if (result.error) {
        return {
            error: true
        }
    } else if (result.data.getOneOwner.error) {
        return {
            error: true
        }
    } else {
        return {
            error: false,
            data: result.data.getOneOwner.data
        }
    }
}

export { User }

const AllUser = async (token, status) => {
    const getAllUserQuery = `
        query($status: String) {
            getAllOwners(status: $status) {
                error
                msg
                data {
                    _id
                    first_name
                    last_name
                    mobile
                    national_id
                    status
                }
            }
        } 
    `;
    let client = UrqlClient(token);
    let request = client.query(getAllUserQuery, { status }).toPromise();
    let result = await request

    if (result.error) {
        return {
            error: true
        }
    } else if (result.data.getAllOwners.error) {
        return {
            error: true
        }
    } else {
        return {
            error: false,
            data: result.data.getAllOwners.data
        }
    }
}

export { AllUser }

const UpdateUser = async user => {
    const updateQuery = `
        mutation($user: OwnerInput!) {
            updateOwnerWithStatus(ownerInput: $user) {
                msg
                error
            }
        }
    `
    let client = UrqlClient(Cookies.get('fja_token'));
    let request = client.mutation(updateQuery, {
        user: user
    }).toPromise();
    let result = await request

    if (result.error) {
        return {
            error: true,
            msg: "Request Failed"
        }
    } else {
        return {
            error: result.data.updateOwnerWithStatus.error,
            msg: result.data.updateOwnerWithStatus.msg
        }
    }
}

export const forgotPassOtpSend = async mobile => {
    let mutation = `
        mutation ($mobile: String) {
            forgotPassOtpSend(mobile: $mobile) {
                error
                msg
            }
        }
    `;
    const client = graphqlClient();
    const { error, data } = await client.mutation(mutation, { mobile }).toPromise();
    if (error) {
        return { error: true, msg: 'Network Failed' };
    };
    return data.forgotPassOtpSend;
};

export const verifyOtp = async (mobile, otp) => {
    let mutation = `
        query($mobile: String, $otp:Int) {
            verifyOtp(mobile: $mobile, otp: $otp) {
                error
                msg
            }
        }
    `;
    const client = graphqlClient();
    const { error, data } = await client.mutation(mutation, { mobile, otp }).toPromise();
    if (error) {
        return { error: true, msg: 'Network Failed' };
    };
    return data.verifyOtp;
};

export const forgotPassword = async (mobile, password) => {
    const mutation = `
        mutation ($mobile:String!, $password:String!) {
            forgotPassword(mobile: $mobile, password: $password) {
                error
                msg,
                token
            }
        }
    `;
    const client = graphqlClient();
    const { error, data } = await client.mutation(mutation, { mobile, password }).toPromise();
    if (error) {
        return { error: true, msg: 'Network Failed' };
    };
    return data.forgotPassword;
};

export { UpdateUser }
