import Cookies from "js-cookie";
import graphqlClient from "../graphql";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getTransactions = async (status, page, size) => {
    let query = `
        query($status: String, $page: Int, $size: Int) {
            getAllTransactionsByAdmin( status: $status, page: $page, pagesize: $size) {
                error
                msg
                data {
                    totalDocs
                    docs {
                        _id
                        amount
                        current_balance
                        previous_balance
                        status
                        reason
                        user_or_restaurant {
                            first_name
                            last_name
                            mobile
                        }
                        createdAt
                    }
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(query, {status, page, size}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getAllTransactionsByAdmin} = data
    return getAllTransactionsByAdmin
}


export const updateTransaction = async transaction => {
    let mutation = `
        mutation ($_id: ID, $status: String, $reason: String) {
            updateTransactionByAdmin(_id: $_id, status: $status, reason: $reason) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, transaction).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {updateTransactionByAdmin} = data
    return updateTransactionByAdmin
}