import {useSelector} from "react-redux";
import Card from "../../card";
import Link from "next/link";
import React from "react";
import Media from "../../card/media";

const NewRestaurants = () => {
    let restaurants = useSelector(state => state.restaurants)
    return (
        <Card>
            <div className="card-header">
                <h4 className="d-inline">New Restaurant Request</h4>
                <div className="card-header-action">
                    <Link href="/admin/restaurants?status=pending">
                        <a className="btn btn-primary">View All</a>
                    </Link>
                </div>
            </div>
            <div className="card-body">
                <ul>
                    {restaurants.data.slice(0,5).map(restaurant => (
                        <Link href={"/admin/restaurants/view?id=" + restaurant._id} key={restaurant._id}>
                            <a className="c-pointer">
                                <Media name={restaurant.name} phone={restaurant.restaurant_or_homemade} createdAt={restaurant.createdAt}>
                                    {restaurant.status === 'pending' && (
                                        <div className="badge badge-pill badge-danger mt-3 float-right">Pending</div>
                                    )}
                                </Media>
                            </a>
                        </Link>
                    ))}
                </ul>
            </div>
        </Card>
    )
}

export default NewRestaurants