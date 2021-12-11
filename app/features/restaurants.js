import Cookies from "js-cookie";
import graphqlClient from "../graphql";

export const getRestaurants = async (name,status, page=1, size=10) => {
    let query = `
        query($id: ID!,$name:String $status: String!, $page: Int, $size: Int) {
            getAllRestaurantsByAdmin(owner_id: $id,name:$name status: $status, page: $page, pagesize: $size) {
                error
                msg
                data {
                    totalDocs
                    docs {
                        _id
                        name
                        restaurant_or_homemade
                        status
                        rejection_msg
                        owner {
                            _id
                        }
                        createdAt
                    }
                }
            }
        }
    `
    let token = Cookies.get('fja_token')
    let client = graphqlClient(token)
    console.log("features-status-",status,"name--",name)
    let {error, data} = await client.query(query, {id: '',name:name||'', status: status || '', page, size}).toPromise()
    if (error) {
        return {error: true, msg: 'Network Failed'}
    }
    const {getAllRestaurantsByAdmin} = data
    return getAllRestaurantsByAdmin
}

export const getOwnerRestaurants = async status => {
    let query = `
        query($status: String!){
            getAllRestaurantsByOwner(status:$status) {
                error
                msg
                data {
                    _id
                    name
                    restaurant_or_homemade
                    status
                    rejection_msg
                    balance
                    owner {
                        _id
                    }
                    food_categories {
                        _id
                        name
                        foods {
                            _id
                        }
                    }
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
    const {getAllRestaurantsByOwner} = data
    return getAllRestaurantsByOwner
}