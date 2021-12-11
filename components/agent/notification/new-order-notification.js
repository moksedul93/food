import React from 'react';
import { useSubscription } from 'urql';
import BootstrapToast from "../../toast";

const NewOrderNotification = props => {
    const query = `
        subscription($token: String!){
            orderAddedSeeByAgent(token: $token){
                data {
                    _id
                }
            }
        }
    `;

    const handleSubscription = (orders = [], response) => {
        return [response.orderAddedSeeByAgent, ...orders];
    }


    const [res] = useSubscription({ query: query, variables: { token: props.token } }, handleSubscription);
    if (!res.data) {
        return "";
    }

    return (
        <>
            {res.data.map(order => {
                if(order.data._id == null) {
                    return  ""
                } else {
                    return (
                        <BootstrapToast header="New Order" href={'/agent'}>
                            <p>A New Order request received.</p>
                        </BootstrapToast>
                    )
                }
            })}
        </>
    );
};

export default NewOrderNotification
