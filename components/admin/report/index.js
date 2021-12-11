import {UrqlClient} from "../../urql/urql-provider";
import Cookies from "js-cookie";

export const orderReport = async (restaurant, start_date, end_date) => {
    let query = `
        query($restaurant: ID, $start_date: String, $end_date: String) {
            getReportByAdmin(restaurant_id: $restaurant, start_date: $start_date, end_date: $end_date) {
                error
                msg
                data {
                    restaurant {
                        _id
                        name
                        address {
                            address
                        }
                        owner {
                            first_name
                            last_name
                        }
                    }
                    orders {
                        _id
                        items {
                            name
                            price
                            quantity
                        }
                        customer {
                            first_name
                            last_name
                            mobile
                        }
                        createdAt
                        delivery_charge
                        sub_total
                        total
                    }
                    total
                }
            }
        }
    `
    let client = UrqlClient(Cookies.get('fja_token'));
    let response = await client.query(query , {restaurant, start_date, end_date}).toPromise();
    if(response.error || response.data.getReportByAdmin.error) {
        return false
    }
    return response.data.getReportByAdmin.data

}