import {useQuery} from "urql";
import Link from "next/link";
import React from "react";
import {UrqlClient} from "../../urql/urql-provider";
import Cookies from "js-cookie";

const Riders = props => {

    const [res, reExecuteQuery] = useQuery(
        {query: `
                query($status: String!) {
                    getAllRiders(status: $status) {
                        error
                        msg
                        data {
                            _id
                            first_name
                            last_name
                            mobile
                            email
                            owner_address
                            status
                        }
                    }
                }  
        `,
            variables: { status: props.status || ''}
        });



    if (res.fetching) return (
        <div className="wrapper urql-loading">
            <i className="fas fa-spinner fa-spin text-primary" style={{fontSize: 70}}></i>
            <p className="text-primary" style={{margin:10}}>Loading...</p>
        </div>
    );
    if (res.error) return (
        <div className="wrapper urql-loading">
            <i className="fas fa-exclamation-triangle text-danger" style={{fontSize: 70}}></i>
            <p className="text-danger" style={{margin:10}}>Error in Loading Data</p>
        </div>
    );



    return (
        <>
            {res.data.getAllRiders.data.map((rider, index) => (
                <tr>
                    <td>{index + 1}</td>
                    <td>{rider.first_name}</td>
                    <td>{rider.last_name}</td>
                    <td>{rider.mobile}</td>
                    <td>{rider.email}</td>
                    <td>{rider.owner_address}</td>
                    <td>
                        {rider.status == 'pending' && (
                            <div className="badge badge-pill badge-danger mt-3">Pending</div>
                        )}
                        {rider.status == 'approved' && (
                            <div className="badge badge-pill badge-primary mt-3">Approved</div>
                        )}
                        {rider.status == 'suspended' && (
                            <div className="badge badge-pill badge-secondary mt-3">Suspended</div>
                        )}
                        {rider.status == 'cancelled' && (
                            <div className="badge badge-pill badge-dark mt-3">Cancelled</div>
                        )}
                    </td>
                    <td>
                        <Link href={"/admin/rider?id=" + rider._id }>
                            <a className="text-primary table-action c-pointer"><i className="fa fa-eye"></i> </a>
                        </Link>
                    </td>
                </tr>
            ))}
        </>
    )

}

export default Riders


export const getAllRiders = async (token,status) => {
    const query = `
        query($status: String) {
            getAllRiders(status: $status) {
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
    let request = client.query(query, {status}).toPromise();
    let result = await request

    if(result.error) {
        return {
            error: true
        }
    } else if(result.data.getAllRiders.error) {
        return {
            error: true
        }
    } else {
        return {
            error: false,
            data: result.data.getAllRiders.data
        }
    }
}


export const getARider = async (token, id) => {
    let query = `
        query($id: ID!) {
            getOneRider(_id: $id) {
                msg
                error
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
    `
    let client = UrqlClient(token);
    let request = client.query(query, {id}).toPromise();
    let result = await request
    if(result.error || result.data.getOneRider.error) {
        return {
            error: true
        }
    } else {
        return {
            error: false,
            data: result.data.getOneRider.data
        }
    }
}

export const UpdateRider = async rider => {
    const updateQuery = `
        mutation($rider: RiderInput!) {
            updateRiderWithStatus(riderInput: $rider) {
                msg
                error
            }
        }
    `
    let client = UrqlClient(Cookies.get('fja_token'));
    let request = client.mutation(updateQuery , {rider}).toPromise();
    let result = await request


    if(result.error) {
        return {
            error: true,
            msg: "Request Failed"
        }
    } else {
        return {
            error: result.data.updateRiderWithStatus.error,
            msg: result.data.updateRiderWithStatus.msg
        }
    }
}


