import Cookies from "js-cookie";
import graphqlClient from "../graphql";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {UrqlClient} from "../../components/urql/urql-provider";

export const addFood = async food => {
    let mutation = `
        mutation($food: FoodInput!) {
            addFood(foodInput: $food){
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {food}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addFood} = data
    return addFood
}

export const getFoods = async () => {
    let query = `
        query {
            getAllFoods{
                error
                msg
                data {
                    _id
                    name
                    food_categories{
                        _id
                        name
                        foods{
                            _id
                            name
                            price
                        }   
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
    const {getAllFoods} = data
    return getAllFoods
}


export const getRestaurantFoods = async () => {
    let query = `
        query {
            getAllFoodsByRestaurant{
                error
                msg
                data {
                    _id
                    name
                    food_categories{
                        _id
                        name
                        foods{
                            _id
                            name
                            price
                            active
                        }   
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
    const {getAllFoodsByRestaurant} = data
    return getAllFoodsByRestaurant
}

export const getFood = async foodParams => {
    let query = `
        query($foodParams: FoodParams!) {
            getOneFood(foodParams: $foodParams){
                error
                msg
                data {
                    _id
                    name
                    price
                    commission
                    description
                    dish_img
                    price_and_size  {
                        size
                        price
                    }
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.query(query, {foodParams}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getOneFood} = data
    return getOneFood
}

export const updateFood =  async food => {
    let mutation = `
        mutation($food: FoodInput!) {
            updateFood(foodInput: $food){
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {food}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {updateFood} = data
    return updateFood
}

export const deleteFood = async (id, category_id, restaurant_id) => {
    let mutation = `
        mutation($foodParams: FoodParams!) {
            deleteFood(foodParams: $foodParams){
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, { foodParams: {
            _id: id,
            restaurant_id: restaurant_id,
            food_categories_id: category_id
        }}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {deleteFood} = data
    return deleteFood
}

export const updateFoodStatus = async (c_id, food_id, status) => {
    let query = `
        mutation($c_id: ID!, $food_id: ID!, $status : Boolean!){
            updateFoodStatus(cat_id: $c_id, food_id: $food_id, status: $status) {
                error
                msg
            }
        }
    `
    let client = graphqlClient(Cookies.get('fja_token'));
    let {error, data} = await client.mutation(query, {c_id, food_id, status}).toPromise();
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {updateFoodStatus} = data
    return updateFoodStatus
}