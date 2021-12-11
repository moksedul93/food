import React from "react";
import UrqlProvider from "../../urql/urql-provider";
import Cookies from 'js-cookie';
import NewRestaurantNotification from "./new-restaurant-notification";

const Notification = props => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 80,
                right: 40,
            }}
        >
            <UrqlProvider >
                <NewRestaurantNotification token={Cookies.get('fja_token')}/>
            </UrqlProvider>
        </div>
    )
}

export default Notification
