import {useDispatch} from "react-redux";
import { pipe, subscribe } from 'wonka';
import React, {useEffect, useState} from "react";
import Cookies from 'js-cookie'
import {notification} from "antd";
import {useRouter} from "next/router";
import graphqlClient from "../../../app/graphql";
import {fetchRestaurants} from "../../../app/slices/restaurants";

const NewRestaurantNotification = () => {
    let dispatch = useDispatch()
    let router = useRouter()
    const [subscribed, setSubscribed] = useState(false);

    const subscription = `
        subscription{
            restaurantAdded {
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
                        let {restaurantAdded} = data
                        if(!restaurantAdded.error) {
                            if(router.pathname === '/admin') {
                                dispatch(fetchRestaurants({status: 'pending', page: 1, size: 5}))
                            }
                            let notify = new Notification('New Restaurant', {
                                body: 'A New Restaurant Request Received!',
                            });
                            notify.onclick = () => {
                                window.focus()
                            }
                            notification.open({
                                message: 'Notification',
                                description:
                                    'A New Restaurant Request Received',
                                duration: 10,
                                onClick: () => {
                                    router.push('/admin/restaurant?id=' + restaurantAdded.data._id).then(() => {})
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

export default NewRestaurantNotification


