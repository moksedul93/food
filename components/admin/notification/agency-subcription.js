import {useDispatch} from "react-redux";
import { pipe, subscribe } from 'wonka';
import {useEffect, useState} from "react";
import Cookies from 'js-cookie'
import {notification} from "antd";
import {useRouter} from "next/router";
import graphqlClient from "../../../app/graphql";
import {fetchAgencies} from "../../../app/slices/agencies";

const NewAgencySubscription = () => {
    let dispatch = useDispatch()
    let router = useRouter()
    const [subscribed, setSubscribed] = useState(false);

    const subscription = `
        subscription {
            agencyAdded{
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
                        let {agencyAdded} = data
                        if(!agencyAdded.error) {
                            if(router.pathname === '/admin') {
                                dispatch(fetchAgencies({status: 'pending', page: 1, size: 5}))
                            }
                            let notify = new Notification('New Agency', {
                                body: 'A New Agency Request Received!',
                            });
                            notify.onclick = () => {
                                window.focus()
                            }

                            notification.open({
                                message: 'Notification',
                                description:
                                    'A New Agency Request Received',
                                duration: 10,
                                className: 'c-pointer',
                                onClick: () => {
                                    router.push('/admin/agency?status=pending&id=' + agencyAdded.data._id).then(() => {})
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

export default NewAgencySubscription




