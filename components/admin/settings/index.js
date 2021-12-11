import {UrqlClient} from "../../urql/urql-provider";
import Cookies from "js-cookie";

export const getSettings = async () => {
    let query = `
        query {
            getSettings {
                error
                msg
                data {
                    delivery_charge
                }
            }
        }
    `
    let client = UrqlClient()
    let result = await client.query(query).toPromise()
    if(result.error || result.data.getSettings.error ) {
        return {

        }
    }
    return result.data.getSettings.data
}

export const updateDeliveryCharge = async amount => {
    let mutation = `
        mutation($amount: Int) {
            addDeliveryCharge(amount: $amount) {
                error
                msg
            }
        }
    `
    let client = UrqlClient(Cookies.get('fja_token'));
    let result = await client.query(mutation, {amount}).toPromise();
    if(result.error) {
        return  {
            error: true,
            msg: 'Request failed'
        }
    }
    return {
        error: result.data.addDeliveryCharge.error,
        msg: result.data.addDeliveryCharge.msg
    }
}