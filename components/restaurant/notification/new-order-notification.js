import {useDispatch} from "react-redux";
import { pipe, subscribe } from 'wonka';
import React, {useEffect, useState} from "react";
import Cookies from 'js-cookie'
import {notification} from "antd";
import {useRouter} from "next/router";
import graphqlClient from "../../../app/graphql";
import {fetchRestaurantOrders} from "../../../app/slices/orders";


const NewOrderNotification = () => {
    let dispatch = useDispatch()
    let router = useRouter()
    const [subscribed, setSubscribed] = useState(false);

    const subscription = `
        subscription($token: String!) {
            orderAddedSeeByRestaurant(token: $token) {
                error
                data {
                    _id
                }
            }
        }
    `;
    let token = Cookies.get('fja_token')
    let client = graphqlClient()
    useEffect(() => {
        if(!subscribed) {
            setSubscribed(true);
            const { unsubscribe } = pipe(
                client.subscription(subscription, {token}),
                subscribe(({data, error}) => {
                    if(!error) {
                        let {orderAddedSeeByRestaurant} = data
                        if(!orderAddedSeeByRestaurant.error) {
                            if(router.pathname === '/restaurant') {
                                dispatch(fetchRestaurantOrders({status: 'pending'}))
                            }
                            notification.open({
                                message: 'Notification',
                                description:
                                    'A New Order Request Received',
                                duration: 10,
                                onClick: () => {
                                    router.push('/restaurant/orders?status=pending&id=' + orderAddedSeeByRestaurant.data._id).then(() => {})
                                },
                            });
                        }
                    }
                })
            )
            router.events.on('routeChangeStart', url => unsubscribe())
        }
    })
    return <></>
}

export default NewOrderNotification


