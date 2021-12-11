import Cookies from "js-cookie";
import graphqlClient from "../graphql";
import moment from "moment";

export const getRestaurantReport = async range => {
    let query = `
        query ($startDate: String, $endDate: String) {
            getReportByRestaurant(start_date: $startDate, end_date: $endDate) {
                error
                msg
                data {
                    orders {
                        _id
                        items {
                            name
                            base_price
                            quantity
                        }
                        customer {
                            first_name
                            last_name
                            mobile
                        }
                        createdAt
                        delivery_charge
                        base_price_sub_total
                        base_price_total
                    }
                    total
                }
            }
        }
    `


    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(query, range).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getReportByRestaurant} = data
    return getReportByRestaurant
}

export const getOwnerReport = async (restaurantId, range) => {
    let query = `
        query ($restaurantId: ID, $startDate: String, $endDate: String) {
            getReportByOwner(restaurant_id: $restaurantId, start_date: $startDate, end_date: $endDate) {
                error
                msg
                data {
                    orders {
                        _id
                        items {
                            name
                            base_price
                            quantity
                        }
                        customer {
                            first_name
                            last_name
                            mobile
                        }
                        restaurant {
                            name
                            plan {
                                commision
                            }
                        }
                        createdAt
                        delivery_charge
                        base_price_sub_total
                        base_price_total
                    }
                    total
                }
            }
        }
    `


    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(query, {restaurantId: restaurantId || '', startDate: range.startDate, endDate: range.endDate }).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getReportByOwner} = data
    return getReportByOwner
}

export const getAdminReport = async (ownerID, restaurantID, range) => {
    let query = `
        query ($ownerID: ID, $restaurantID: ID, $startDate: String, $endDate: String) {
            getReportByAdmin(owner_id: $ownerID, restaurant_id: $restaurantID, start_date: $startDate, end_date: $endDate) {
                error
                msg
                data {
                    orders {
                        _id
                        items {
                            name
                            base_price
                            price
                            quantity
                        }
                        customer {
                            first_name
                            last_name
                            mobile
                        }
                        restaurant {
                            name
                            plan {
                                commision
                            }
                        }
                        createdAt
                        delivery_charge
                        base_price_sub_total
                        cashback
                        customer_discount_amount
                        base_price_total
                        sub_total
                        total
                        vat
                    }
                    total
                }
            }
        }
    `


    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(query, {ownerID: ownerID || '', restaurantID: restaurantID || '', startDate: range.startDate, endDate: moment(range.endDate).endOf('day').toDate() }).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getReportByAdmin} = data
    return getReportByAdmin
}