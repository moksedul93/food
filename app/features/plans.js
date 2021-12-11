import graphqlClient from "../graphql";
import {createAsyncThunk} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const getPlans = async () => {
    let query = `
        query{
            getAllPlans {
                msg
                error
                data {
                    _id
                    title
                    commision
                    feature
                }
            }
        }   
    `
    let client = graphqlClient()
    let {error, data} = await client.query(query).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getAllPlans} = data
    return getAllPlans
}

export const addPlan =  async plan => {
    let mutation = `
        mutation ($plan: PlanInput!) {
            addPlan(planInput: $plan) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {plan}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {addPlan} = data
    return addPlan
}

export const updatePlan = async plan => {
    let mutation = `
        mutation($plan: UpdatePlanInput!){
            updatePlan(updatePlanInput: $plan){
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {plan}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {updatePlan} = data
    return updatePlan
}