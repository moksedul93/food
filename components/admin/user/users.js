import {useQuery} from "urql";
import Link from "next/link";
import Media from "../../card/media";
import {useState} from "react";

const Users = props => {

    const [res, reExecuteQuery] = useQuery(
        {query: `
                query($status: String!) {
                    getAllOwners(status: $status) {
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
            {res.data.getAllOwners.data.map((user, index) => (
                <tr>
                    <td>{index + 1}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.mobile}</td>
                    <td>{user.email}</td>
                    <td>{user.owner_address}</td>
                    <td>
                        {user.status == 'pending' && (
                            <div className="badge badge-pill badge-danger mt-3">Pending</div>
                        )}
                        {user.status == 'approved' && (
                            <div className="badge badge-pill badge-primary mt-3">Approved</div>
                        )}
                        {user.status == 'suspended' && (
                            <div className="badge badge-pill badge-secondary mt-3">Suspended</div>
                        )}
                        {user.status == 'cancelled' && (
                            <div className="badge badge-pill badge-dark mt-3">Cancelled</div>
                        )}
                    </td>
                    <td>
                        <Link href={"/admin/products/all?id=" + user._id }>
                            <a className="text-primary table-action c-pointer mr-2"><i className="fa fa-shopping-cart"></i> </a>
                        </Link>
                        <Link href={"/admin/user?id=" + user._id }>
                            <a className="text-primary table-action c-pointer"><i className="fa fa-eye"></i> </a>
                        </Link>
                    </td>
                </tr>
            ))}
        </>
    )

}

export default Users


const AllUsers = props => {

}