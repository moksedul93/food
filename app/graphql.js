import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  Client,
  createClient,
  defaultExchanges,
  Provider,
  subscriptionExchange,
} from "urql";
import React from "react";

//local server
// const ServerUrl = 'http://localhost:5000/graphql';
// const SubscriptionUrl = 'ws://localhost:5000/graphql';

//dev server
const ServerUrl = "https://dev.foodjocky.com/graphql";
const SubscriptionUrl = "wss://dev.foodjocky.com/graphql";

//prod server
// const ServerUrl = "https://backend.foodjocky.com/graphql";
// const SubscriptionUrl = "wss://backend.foodjocky.com/graphql";

const subscriptionClient = process.browser
  ? new SubscriptionClient(SubscriptionUrl, { reconnect: true })
  : null;

const graphqlClient = (token) => {
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

export default graphqlClient;

export const GraphQlProvider = (props) => {
  let token = props.token || "abc";

  const client = graphqlClient(token);

  return <Provider value={client}>{props.children}</Provider>;
};
