import Card from "../../card";
import Link from "next/link";
import React from "react";
import {useSelector} from "react-redux";
import Media from "../../card/media";

const NewRequests = () => {
    let transactions = useSelector(state => state.transactions)
    return (
        <Card>
            <div className="card-header">
                <h4 className="d-inline">New Payment Requests</h4>
                <div className="card-header-action">
                    <Link href="/admin/requests">
                        <a className="btn btn-primary">View All</a>
                    </Link>
                </div>
            </div>
            <div className="card-body">
                <ul>
                    {transactions.data.slice(0,5).map(transaction => (
                        <Link href={"/admin/requests?id=" + transaction._id}>
                            <a className="c-pointer">
                                <Media name={transaction.user_or_restaurant.first_name + " " + transaction.user_or_restaurant.last_name} phone={transaction.user_or_restaurant.mobile} createdAt={transaction.createdAt}>
                                    {transaction.status == 'pending' && (
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

export default NewRequests