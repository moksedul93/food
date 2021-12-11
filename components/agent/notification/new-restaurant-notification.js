import React from 'react';
import { useSubscription } from 'urql';
import BootstrapToast from "../../toast";

const NewRestaurantNotification = props => {
    const query = `
        subscription($token: String!){
            restaurantAddedSeeByAgent(token: $token){
                data{
                    _id
                }
            }
        }
    `;

    const handleSubscription = (agentss = [], response) => {
        return [response.restaurantAddedSeeByAgent, ...agentss];
    }


    const [res] = useSubscription({ query: query, variables: { token: props.token } }, handleSubscription);
    if (!res.data) {
        return "";
    }

    return (
        <>
            {res.data.map(agents => {
                if(agents.data._id == null) {
                    return  ""
                } else {
                    return (
                        <BootstrapToast header="New Restaurant" href={'/agent'}>
                            <p>A New Restaurant request received.</p>
                        </BootstrapToast>
                    )
                }
            })}
        </>
    );
};

export default NewRestaurantNotification
