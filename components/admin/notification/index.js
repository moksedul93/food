import React from "react";
import NewUserNotification from "./new-user-notification";
import NewRestaurantNotification from "./new-restaurant-notification";
import NewAgentNotification from "./new-agent-notification";
import NewOrderNotification from "./new-order-notification";
import NewAgencySubscription from "./agency-subcription";
import NewRequestSubscription from "./request-subscription";

const Notification = () => {

    return (
        <div
            style={{
                position: 'fixed',
                top: 80,
                right: 40,
            }}
        >
            <NewAgencySubscription/>
            <NewRequestSubscription/>
            <NewUserNotification/>
            <NewRestaurantNotification/>
            <NewOrderNotification/>
            <NewAgentNotification/>
        </div>
    )
}

export default Notification
