import graphqlClient from "../graphql"
import Cookies from "js-cookie"
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getOrders = async (status, page, size) => {
    let query = `
        query($status: String, $page: Int, $size: Int) {
            getAllOrdersByAdmin(status: $status, page: $page, pagesize: $size) {
                error
                msg
                data {
                    totalDocs
                    docs {
                        _id
                        items {
                            name
                            quantity
                            price
                            base_price
                        }
                        customer {
                            mobile
                            first_name
                            last_name
                        }
                        delivery_info {
                            address {
                                address
                            }
                        }
                        restaurant {
                            discount_given_by_restaurant
                            discount_given_by_admin
                            rider_cost
                            name
                            plan {
                                commision
                            }
                            vat
                        }
                        customer_discount_amount
                        base_price_sub_total
                        base_price_total
                        delivery_charge
                        payment_type
                        sub_total
                        cashback
                        status
                        total
                        vat
                    }
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(query, {status, page, size}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getAllOrdersByAdmin} = data
    return getAllOrdersByAdmin
}


export const getRestaurantOrders = async status => {
    let query = `
        query($status: String) {
            getAllOrdersByRestaurant(status: $status) {
                error
                msg
                data {
                    _id
                    items {
                        name
                        quantity
                        base_price
                    }
                    customer {
                        mobile
                        first_name
                        last_name
                    }
                    base_price_sub_total
                    base_price_total
                    status
                    createdAt
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(query, {status}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getAllOrdersByRestaurant} = data
    return getAllOrdersByRestaurant
}


export const updateOrder = async (id, status) => {
    let mutation = `
        mutation($id: ID, $status: String) {
            updateOrderStatus(_id: $id, status: $status) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {id, status}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {updateOrderStatus} = data
    return updateOrderStatus
}




export const fetchOrder = createAsyncThunk('restaurant/order', async ({id}) => {
    let query = `
        query($id: ID) {
            getOneOrder(_id: $id) {
                error
                msg
                data {
                    _id
                    customer {
                        _id
                        first_name
                        last_name
                        mobile
                    }
                    items {
                        _id
                        name
                        quantity
                        price
                        base_price
                    }
                    total
                    status
                    base_price_total
                    base_price_sub_total
                    delivery_time
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(query, {id}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getOneOrder} = data
    return {
        error: getOneOrder.error,
        msg: getOneOrder.msg,
        data: getOneOrder.data
    }
})