import transactionsReducer from "./slices/transactions";
import restaurantReducer from "./slices/restaurant";
import restaurantsReducer from "./slices/restaurants";
import categoriesReducer from "./slices/categories";
import { configureStore } from "@reduxjs/toolkit";
import agenciesReducer from "./slices/agencies";
import settingsReducer from "./slices/settings";
import agentReducer from "./slices/agent";
import agentsReducer from "./slices/agents";
import ownerReducer from "./slices/owner";
import ownersReducer from "./slices/owners";
import ordersReducer from "./slices/orders";
import riderReducer from "./slices/rider";
import plansReducer from "./slices/plans";
import adminReducer from "./slices/admin";
import locationsReducer from "./slices/locations";
import walletReducer from "./slices/wallet";
import foodsReducer from "./slices/foods";
import reportReducer from "./slices/report";
import voucherReducer from "./slices/voucher";
import voucherCriteriaReducer from "./slices/voucher_criteria";
import priceCriteriaReducer from "./slices/price_criteria";
import promotionalImagesReducer from "./slices/promotional_images";

export default configureStore({
  reducer: {
    transactions: transactionsReducer,
    restaurants: restaurantsReducer,
    restaurant: restaurantReducer,
    categories: categoriesReducer,
    locations: locationsReducer,
    settings: settingsReducer,
    agencies: agenciesReducer,
    agent: agentReducer,
    agents: agentsReducer,
    owner: ownerReducer,
    owners: ownersReducer,
    orders: ordersReducer,
    riderOrders: riderReducer,
    wallet: walletReducer,
    report: reportReducer,
    plans: plansReducer,
    admin: adminReducer,
    foods: foodsReducer,
    vouchers: voucherReducer,
    voucherCriteria: voucherCriteriaReducer,
    priceCriteria: priceCriteriaReducer,
    promotionalImages:promotionalImagesReducer
  },
  devTools: true,
});
