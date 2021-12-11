import React from 'react';
import { useSubscription } from 'urql';
import BootstrapToast from "../../toast";

const NewOrderNotification = props => {
    const query = `
        subscription{
            orderAdded{
                data {
                    _id
                }
            }
        }
    `;

    const handleSubscription = (orders = [], response) => {
        return [response.orderAdded, ...orders];
    }


    const [res] = useSubscription({ query: query }, handleSubscription);
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
                        <BootstrapToast header="New Order" href={'/admin/order?id=' + order.data._id}>
                            <p>A New Order request received.</p>
                        </BootstrapToast>
                    )
                }
            })}
        </>
    );
};

export default NewOrderNotification
