import Link from "next/link";
import Card from "../../card";
import React from "react";
import { useSelector} from "react-redux";
import Media from "../../card/media";

const NewUsers = () => {
    let users = useSelector(state => state.owners )
    return (
        <Card>
            <div className="card-header">
                <h4 className="d-inline">New Owner Request</h4>
                <div className="card-header-action">
                    <Link href="/admin/owners?status=pending">
                        <a className="btn btn-primary">View All</a>
                    </Link>
                </div>
            </div>
            <div className="card-body">
                <ul>
                    {users.data.slice(0,5).map(user => (
                        <Link href={"/admin/owners?status=pending&id=" + user._id} key={user._id}>
                            <a className="c-pointer">
                                <Media name={user.first_name + " " + user.last_name} phone={user.mobile} status={user.status} createdAt={user.createdAt}>
                                    {user.status === 'pending' && (
                                        <div className="badge badge-pill badge-danger mt-3 float-right">Pending</div>
                                    )}
                                </Media>
                            </a>
                        </Link>
                    ))}
                </ul>
            </div>
        </Card>
    )
}

export default NewUsers