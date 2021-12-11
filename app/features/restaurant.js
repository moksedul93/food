import graphqlClient from "../graphql";
import Cookies from "js-cookie";
import {UrqlClient} from "../../components/urql/urql-provider";

export const addRestaurant = async restaurant => {
    let mutation = `
        mutation ($restaurant: RestaurantInput!) {
            addRestaurant(restaurantInput: $restaurant) {
                msg
                error
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    console.log("feature data",restaurant)
    let {error, data} = await client.mutation(mutation, {restaurant}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addRestaurant} = data
    return addRestaurant
}

export const getRestaurant = async id => {
    let query = `
        query($id: ID!) {
            getOneRestaurant(_id: $id) {
                error
                msg
                data {
                    _id
                    user
                    name
                    restaurant_or_homemade
                    discount_given_by_restaurant
                    discount_given_by_admin
                    rejection_msg
                    tags
                    description
                    plan {
                        _id
                        title
                    }
                    food_categories{
                        _id
                        name
                        foods {
                            _id
                        }
                    }
                    address {
                        address
                        location{
                            lat
                            lng
                        }
                    }
                    owner {
                        _id
                    }
                    price_type
                    cover_img
                    thumb_img
                    status
                    vat
                    rider_cost
                    opening_hour
                    closing_hour
                    open_days{
                        sat
                        sun
                        mon
                        tue
                        wed
                        thu
                        fri
                    }
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
    const {getOneRestaurant} = data
    return getOneRestaurant
}

export const updateRestaurant = async restaurant => {
    let mutation = `
        mutation($restaurant: RestaurantInput!) {
            updateRestaurant(restaurantInput: $restaurant) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    console.log("feature-",restaurant)
    let {error, data} = await client.mutation(mutation, {restaurant}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {updateRestaurant} = data
    return updateRestaurant
}


export const restaurantLogin = async restaurant => {
    let query = `
        query($user: String!, $password: String!){
            restaurantLogin(user: $user, password: $password) {
                error,
                msg,
                token
            }
        }
    `
    let client = graphqlClient()
    let {error, data} = await client.query(query, restaurant).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {restaurantLogin} = data
    if(!restaurantLogin.error) {
        Cookies.set('fja_token', restaurantLogin.token)
    }
    return restaurantLogin
}


export const verifyRestaurant = async () => {
    let query = `
        query($token: String!) {
            verifyRestaurantToken(token: $token) {
                error
                msg
                data {
                    user
                    name
                    restaurant_or_homemade
                    description                    
                    foods_count
                    price_type
                    address {
                        address
                        location{
                            lat
                            lng
                        }
                    }
                    active
                    balance
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient()
    let {error, data} = await client.query(query, {token}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {verifyRestaurantToken} = data
    return verifyRestaurantToken
}

export const updateRestaurantStatus = async status => {
    let query = `
        mutation($status : Boolean!){
            updateRestaurantActivityBySelf(status: $status) {
                error
                msg
            }
        }
    `
    let client = graphqlClient(Cookies.get('fja_token'));
    let {error, data} = await client.mutation(query, {status}).toPromise();
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {updateRestaurantActivityBySelf} = data
    return updateRestaurantActivityBySelf
}


export const updateRestaurantByAdmin = async restaurant => {
    let mutation = `
        mutation($restaurant: RestaurantInput!) {
            updateRestaurantStatus(restaurantInput: $restaurant) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {restaurant}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {updateRestaurantStatus} = data
    return updateRestaurantStatus
}


export const getRestaurantDashboardData = async () => {
    let query = `
        query {
            getDashboardPageDataByRestaurant {
                error
                msg
                data {
                    restaurantOrderStatistics {
                        _id
                        count
                    }
                    restaurantTodayOrderStatistics {
                        _id
                        count
                    }
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
    const {getDashboardPageDataByRestaurant} = data
    return getDashboardPageDataByRestaurant
}