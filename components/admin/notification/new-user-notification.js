import {useDispatch} from "react-redux";
import { pipe, subscribe } from 'wonka';
import React, {useEffect, useState} from "react";
import Cookies from 'js-cookie'
import {notification} from "antd";
import {useRouter} from "next/router";
import graphqlClient from "../../../app/graphql";
import {fetchOwners} from "../../../app/slices/owners";


const NewUserNotification = () => {
    let dispatch = useDispatch()
    let router = useRouter()
    const [subscribed, setSubscribed] = useState(false);

    const subscription = `
        subscription{
            ownerAdded {
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
                        let {ownerAdded} = data
                        if(!ownerAdded.error) {
                            if(router.pathname === '/admin') {
                                dispatch(fetchOwners({status: 'pending', page: 1, size: 5}))
                            }
                            let notify = new Notification('New User', {
                                body: 'A New User Request Received!',
                            });
                            notify.onclick = () => {
                                window.focus()
                            }
                            notification.open({
                                message: 'Notification',
                                description:
                                    'A New Owner Request Received',
                                duration: 10,
                                onClick: () => {
                                    router.push('/admin/users?status=pending&id=' + ownerAdded.data._id).then(() => {})
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

export default NewUserNotification


