import {useDispatch} from "react-redux";
import { pipe, subscribe } from 'wonka';
import React, {useEffect, useState} from "react";
import Cookies from 'js-cookie'
import {notification} from "antd";
import {useRouter} from "next/router";
import graphqlClient from "../../../app/graphql";

const NewAgentNotification = () => {
    let dispatch = useDispatch()
    let router = useRouter()
    const [subscribed, setSubscribed] = useState(false);

    const subscription = `
        subscription{
            agentAdded {
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
                        let {agentAdded} = data
                        if(!agentAdded.error) {
                            if(router.pathname === '/admin') {

                            }
                            notification.open({
                                message: 'Notification',
                                description:
                                    'A New Agent Request Received',
                                duration: 10,
                                onClick: () => {
                                    router.push('/admin/agent?id=' + agentAdded.data._id).then(() => {})
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

export default NewAgentNotification


