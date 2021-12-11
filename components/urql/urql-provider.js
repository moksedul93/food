import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  Client,
  createClient,
  defaultExchanges,
  Provider,
  subscriptionExchange,
} from "urql";
import React from "react";

// const ServerUrl = 'http://localhost:5000/graphql';
// const SubscriptionUrl = 'ws://localhost:5000/graphql';

const ServerUrl = "https://dev.foodjocky.com/graphql";
const SubscriptionUrl = "wss://dev.foodjocky.com/graphql";

// const ServerUrl = 'https://backend.foodjocky.com/graphql';
// const SubscriptionUrl = 'wss://backend.foodjocky.com/graphql';

const subscriptionClient = process.browser
  ? new SubscriptionClient(SubscriptionUrl, { reconnect: true })
  : null;

const UrqlClient = (token) => {
  return process.browser
    ? new Client({
        url: ServerUrl,
        fetchOptions: {
          headers: {
            Authorization: `Authorization ${token || ""}`,
          },
        },
        exchanges: [
          ...defaultExchanges,
          subscriptionExchange({
            forwardSubscription(operation) {
              return subscriptionClient.request(operation);
            },
          }),
        ],
      })
    : createClient({
        url: ServerUrl,
        fetchOptions: {
          headers: {
            Authorization: `Authorization ${token || ""}`,
          },
        },
      });
};

export { UrqlClient };

const UrqlProvider = (props) => {
  let token = props.token || "abc";

  const client = UrqlClient(token);

  return <Provider value={client}>{props.children}</Provider>;
};

export default UrqlProvider;
