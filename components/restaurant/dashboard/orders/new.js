import Link from "next/link";
import Card from "../../../card";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import Media from "../../../card/media";
import {fetchRestaurantOrders} from "../../../../app/slices/orders";

const NewOrders = () => {
    let dispatch = useDispatch()
    let orders = useSelector(state => state.orders)
    useEffect(() => {
        dispatch(fetchRestaurantOrders({status: 'pending'}))
    }, [])

    return (
        <Card>
            <div className="card-header">
                <h4 className="d-inline">New Order Request</h4>
                <div className="card-header-action">
                    <Link href="/restaurant/orders?status=pending">
                        <a className="btn btn-primary">View All</a>
                    </Link>
                </div>
            </div>
            <div className="card-body">
                <ul>
                    {orders.data.slice(0, 5).map(order => (
                        <Link href={"/restaurant/orders?status=pending&id=" + order._id}>
                            <a className="c-pointer">
                                <Media name={order.customer.first_name + " " + order.customer.last_name}
                                       phone={order.customer.mobile} status="Not Active" createdAt={order.createdAt}>
                                    {order.status === 'pending' && (
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

export default NewOrders
