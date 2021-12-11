import {useDispatch} from "react-redux";
import { pipe, subscribe } from 'wonka';
import React, {useEffect, useState} from "react";
import Cookies from 'js-cookie'
import {notification} from "antd";
import {useRouter} from "next/router";
import graphqlClient from "../../../app/graphql";
import {fetchOrders} from "../../../app/slices/orders";

const NewOrderNotification = () => {
    let dispatch = useDispatch()
    let router = useRouter()
    const [subscribed, setSubscribed] = useState(false);

    const subscription = `
        subscription{
            orderAdded {
                error
                data {
                    _id
                }
            }
        }
    `;
    let client = graphqlClient(Cookies.get('fja_token'))
    useEffect(() => {
        if(!subscribed) {
            setSubscribed(true);
            const { unsubscribe } = pipe(
                client.subscription(subscription),
                subscribe(({data, error}) => {
                    if(!error) {
                        let {orderAdded} = data
                        if(!orderAdded.error) {
                            if(router.pathname === '/admin') {
                                dispatch(fetchOrders({status: 'pending', page: 1, size: 5}))
                            }
                            let notify = new Notification('New Order', {
                                body: 'A New Order Received!',
                            });
                            notify.onclick = () => {
                                window.focus()
                            }
                            notification.open({
                                message: 'Notification',
                                description:
                                    'A New Order Request Received',
                                duration: 10,
                                onClick: () => {
                                    router.push('/admin/orders?status=pending&id=' + orderAdded.data._id).then(() => {})
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


