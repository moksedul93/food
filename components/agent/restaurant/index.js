import {useQuery} from "urql";
import Link from "next/link";

const Restaurants = props => {
    let query = `
        query($area: AreaInput!){
            getAllRestaurantsByAgent(areaInput: $area) {
                error
                msg
                data {
                    _id
                    name
                    restaurant_or_homemade
                    status
                    rejection_msg
                    owner {
                        _id
                    }
                }
            }
        }
    `


    const [res, reExecuteQuery] = useQuery({query, variables: {
            area: props.area
        }});

    const refresh = () => {
        reExecuteQuery({ requestPolicy: 'network-only' });
    };



    if (res.fetching) return (
        <div className="wrapper urql-loading">
            <i className="fas fa-spinner fa-spin text-primary" style={{fontSize: 70}}></i>
            <p className="text-primary" style={{margin:10}}>Loading...</p>
        </div>
    );
    if (res.error) return (
        <div className="wrapper urql-loading">
            <i className="fas fa-exclamation-triangle text-danger" style={{fontSize: 70}}></i>
            <p className="text-danger" style={{margin:10}}>Error in Loading Data</p>
        </div>
    );


    return (
        <>
            {res.data.getAllRestaurantsByAgent.data.map((restaurant, index) => (
                <tr>
                    <td>{index + 1}</td>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.restaurant_or_homemade}</td>
                    <td>
                        {restaurant.status == 'pending' && (
                            <div className="badge badge-pill badge-danger mt-3">Pending</div>
                        )}
                        {restaurant.status == 'approved' && (
                            <div className="badge badge-pill badge-primary mt-3">Approved</div>
                        )}
                        {restaurant.status == 'suspended' && (
                            <div className="badge badge-pill badge-secondary mt-3">Suspended</div>
                        )}
                        {restaurant.status == 'cancelled' && (
                            <div className="badge badge-pill badge-dark mt-3">Cancelled</div>
                        )}
                    </td>
                </tr>
            ))}
        </>
    )
}

export default Restaurants
