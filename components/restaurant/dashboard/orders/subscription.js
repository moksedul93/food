import React from 'react';
import { useSubscription } from 'urql';
import Media from "../../../card/media";
import Link from "next/link";
import Cookies from 'js-cookie'


const NewOrderSubscription = props => {
    const query = `
        subscription($token: String!){
            orderAddedSeeByRestaurant(token: $token){
                data {
                     _id
                    items {
                        name
                    }
                    customer {
                        mobile
                        first_name
                        last_name
                    }
                    total
                    status
                }
            }
        }
    `;

    const handleSubscription = (orders = props.orders, response) => {
        return [response.orderAddedSeeByRestaurant.data, ...orders];
    }

    const [res] = useSubscription({ query: query, variables: {token: Cookies.get('fja_token') } }, handleSubscription);
    if (!res.data) {
        return (
            <ul>
                {props.orders.map(order => (
                    <Link href={"/restaurant/order?status=pending&id=" + order._id}>
                        <a className="c-pointer">
                            <Media name={order.customer.first_name + " " + order.customer.last_name} phone={order.customer.mobile} status={order.status}>
                                {order.status == 'pending' && (
                                    <div className="badge badge-pill badge-danger mt-3 float-right">Pending</div>
                                )}
                                {order.status == 'approved' && (
                                    <div className="badge badge-pill badge-primary mt-3 float-right">Approved</div>
                                )}
                                {order.status == 'suspended' && (
                                    <div className="badge badge-pill badge-secondary mt-3 float-right">Suspended</div>
                                )}
                                {order.status == 'cancelled' && (
                                    <div className="badge badge-pill badge-dark mt-3 float-right">Cancelled</div>
                                )}
                            </Media>
                        </a>
                    </Link>
                ))}
            </ul>
        )
    }
    return (
        <ul>
            {res.data.map(order => (
                <Link href={"/restaurant/order?id=" + order._id}>
                    <a className="c-pointer">
                        <Media name={order.customer.first_name + " " + order.customer.last_name} phone={order.customer.mobile} status={order.status}>
                            {order.status == 'pending' && (
                                <div className="badge badge-pill badge-danger mt-3 float-right">Pending</div>
                            )}
                            {order.status == 'approved' && (
                                <div className="badge badge-pill badge-primary mt-3 float-right">Approved</div>
                            )}
                            {order.status == 'suspended' && (
                                <div className="badge badge-pill badge-secondary mt-3 float-right">Suspended</div>
                            )}
                            {order.status == 'cancelled' && (
                                <div className="badge badge-pill badge-dark mt-3 float-right">Cancelled</div>
                            )}
                        </Media>
                    </a>
                </Link>
            ))}
        </ul>
    );
};

export default NewOrderSubscription
