import {createAsyncThunk} from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import graphqlClient from "../graphql";

export const getSettings =  async () => {
    let query = `
        query {
            getSettings {
                error
                msg
                data {
                    delivery_charge
                    customer_cashback_percentange
                    minimum_order_amount
                    google_map_api_key
                    rider_extra_time
                    restaurant_extra_time
                    ssl_commerez_store_id
                    ssl_commerez_store_password
                    ssl_commerez_currency
                    ssl_commerez_cus_city
                    ssl_commerez_cus_country
                    customer_vat
                    rider_cost
                    restaurant_vat
                    sms_api_url
                    sms_api_username
                    sms_api_password
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(query).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getSettings} = data
    return getSettings
}

export const updateMinimumOrderAmount = async amount => {
    let mutation = `
        mutation ($amount: Int) {
            addMinimumOrderAmount(minimum_order_amount: $amount){
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(mutation, {amount}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addMinimumOrderAmount} = data
    return addMinimumOrderAmount
}




export const updateCashbackPercentage = async amount => {
    let mutation = `
        mutation ($amount: Int) {
            addCustomerCashbackPercentange(customer_cashback_percentange: $amount){
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(mutation, {amount}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addCustomerCashbackPercentange} = data
    return addCustomerCashbackPercentange
}


export const updateRiderCost = async cost => {
    let mutation = `
        mutation($cost: Int) {
            addRiderCost(rider_cost: $cost){
                error
                msg
                data {
                    rider_cost
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(mutation, {cost}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addRiderCost} = data
    return addRiderCost
}

export const updateVat = async vat => {
    let mutation = `
        mutation ($customer_vat: Int, $restaurant_vat: Int){
            addVat(customer_vat: $customer_vat, restaurant_vat: $restaurant_vat) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(mutation, vat).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addVat} = data
    return {
        error: addVat.error,
        msg: addVat.msg,
    }
}


export const updateLateTime = async lateTime => {
    let mutation = `
        mutation($rider_time: Int, $restaurant_time: Int){
            addRiderAndRestaurantExtraTime(rider_extra_time: $rider_time, restaurant_extra_time: $restaurant_time){
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(mutation, lateTime).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addRiderAndRestaurantExtraTime} = data
    return addRiderAndRestaurantExtraTime
}

export const updateMapApiKey = async key => {
    let mutation = `
        mutation($key: String) {
            addGoogleMapApiKey(google_map_api_key: $key) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(mutation, {key}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addGoogleMapApiKey} = data
    return addGoogleMapApiKey
}

export const updateSSLInformation = async ssl => {
    let mutation = `
        mutation($ssl: SSLInput) {
            addSSLCommerezInformation(sslInput: $ssl) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(mutation, {ssl}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addSSLCommerezInformation} = data
    return addSSLCommerezInformation
}

