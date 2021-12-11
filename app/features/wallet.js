import Cookies from "js-cookie";
import graphqlClient from "../graphql";

export const getWallet = async () => {
    const query = `
        query {
            getWalletPageDataByOwner {
                error
                msg
                data {
                    balance
                    restaurant_balace
                    transactions {
                        _id
                        amount
                        debit_or_credit
                        current_balance
                        previous_balance
                        user_or_restaurant {
                            name
                        }
                        createdAt
                        status
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
    const {getWalletPageDataByOwner} = data
    return getWalletPageDataByOwner
}



export const withdrawBalance = async amount => {
    let mutation = `
        mutation($amount: Float) {
            withdrawOwnerBalance(amount: $amount) {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {amount}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {withdrawOwnerBalance} = data
    return withdrawOwnerBalance
}



export const transferBalance = async form => {
    let mutation = `
        mutation($res_id: ID!, $amount: Float!) {
            transferBalanceFromRestaurant(restaurant_id: $res_id amount: $amount){
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation, {res_id: form.restaurant_id, amount:parseFloat(form.transfer) }).toPromise()

    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {transferBalanceFromRestaurant} = data
    return transferBalanceFromRestaurant
}


export const transferAllBalance = async () => {
    let mutation = `
        mutation {
            transferBalanceFromAllRestaurant {
                error
                msg
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    let {error, data} = await client.mutation(mutation).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {transferBalanceFromAllRestaurant} = data
    return transferBalanceFromAllRestaurant
}
