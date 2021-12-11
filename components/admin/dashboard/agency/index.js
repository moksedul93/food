import {useSelector} from "react-redux";
import Card from "../../../card";
import Link from "next/link";
import React from "react";
import Media from "../../../card/media";

const NewAgencies = () => {
    let agencies = useSelector(state => state.agencies)

    return (
        <Card>
            <div className="card-header">
                <h4 className="d-inline">New Agency Requests</h4>
                <div className="card-header-action">
                    <Link href="/admin/agencies?status=pending">
                        <a className="btn btn-primary">View All</a>
                    </Link>
                </div>
            </div>
            <div className="card-body">
                <ul>
                    {agencies.data.slice(0,5).map(agency => (
                        <Link href={"/admin/agencies?status=pending&id=" + agency._id}>
                            <a className="c-pointer">
                                <Media name={agency.first_name + " " + agency.last_name} phone={agency.mobile} createdAt={agency.createdAt}>
                                    {agency.status === 'pending' && (
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

export default NewAgencies




