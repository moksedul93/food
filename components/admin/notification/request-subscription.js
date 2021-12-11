import {useDispatch} from "react-redux";
import { pipe, subscribe } from 'wonka';
import {useEffect, useState} from "react";
import Cookies from 'js-cookie'
import {notification} from "antd";
import {useRouter} from "next/router";
import graphqlClient from "../../../app/graphql";
import {fetchTransactions} from "../../../app/slices/transactions";

const NewRequestSubscription = () => {
    let dispatch = useDispatch()
    let router = useRouter()
    const [subscribed, setSubscribed] = useState(false);
    const subscription = `
        subscription {
            withdrawOwnerBalanceSubscription {
                error
                msg
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
                        let {withdrawOwnerBalanceSubscription} = data
                        if(!withdrawOwnerBalanceSubscription.error) {
                            if(router.pathname === '/admin') {
                                dispatch(fetchTransactions({status: 'pending', page: 1, size: 5}))
                            }
                            let notify = new Notification('New Request', {
                                body: 'A New Payment Request Received!',
                            });
                            notify.onclick = () => {
                                window.focus()
                            }

                            notification.open({
                                message: 'Notification',
                                description: 'A New Withdraw Request Received',
                                duration: 10,
                                onClick: () => {
                                    router.push('/admin/requests?id=' + withdrawOwnerBalanceSubscription.data._id).then(() => {})
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

export default NewRequestSubscription




