import graphqlClient from "../graphql";
import {createAsyncThunk} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const getCategories = async (page, size) => {
    const query = `
        query ($page: Int, $size: Int) {
            getAllCategories (page: $page, pagesize: $size) {
                error
                msg
                data {
                    totalDocs
                    docs {
                        _id
                        image_url
                        name
                    }
                }
            }   
        } 
    `
    let client = graphqlClient()
    let {error, data} = await client.query(query, {page, size}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getAllCategories} = data
    return getAllCategories
}

export const addCategory = async category => {
    let mutation = `
        mutation ($name: String, $image_url: String) {
            addCategory(name: $name, image_url: $image_url) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, category).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addCategory} = data
    return addCategory
}

export const updateCategory = async category => {
    let mutation = `
        mutation ($_id: ID, $name: String, $image_url: String) {
            updateCategory(_id: $_id name: $name, image_url: $image_url) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, category).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {updateCategory} = data
    return updateCategory
}


export const addRestaurantFoodCategory = async (restaurant, id, name) => {
    let mutation = `
        mutation ($restaurant: ID, $id: ID, $name: String) {
            addFoodCategory(restaurant_id: $restaurant, category_id: $id, name: $name) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {restaurant, id, name}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addFoodCategory} = data
    return addFoodCategory
}


export const deleteRestaurantFoodCategory = async (restaurant, id) => {
    let mutation = `
        mutation ($restaurant: ID, $id: ID) {
            removeFoodCategory(restaurant_id: $restaurant, category_id: $id) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {restaurant, id}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {removeFoodCategory} = data
    return removeFoodCategory
}

