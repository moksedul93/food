import OwnerLayout from "../../../components/layouts/owner-layout";
import Card from "../../../components/card";
import Table from "../../../components/table";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";
import Swal from "sweetalert2";
import {fetchOwnerRestaurants} from "../../../app/slices/restaurants";

const App = () => {
    const dispatch = useDispatch()
    const restaurants = useSelector(state => state.restaurants)
    useEffect(() => {
        dispatch(fetchOwnerRestaurants({status: ''}))
    }, [])


    const showNotes = async msg => {
        await Swal.fire(
            'Notes',
            msg,
            'warning'
        );
    }


    return (
        <OwnerLayout>
            <div className="section-header">
                <h3>All Restaurants</h3>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item">admin</div>
                    <div className="breadcrumb-item">restaurants</div>
                    <div className="breadcrumb-item">requests</div>
                </div>
            </div>

            <div className="row">
                <div className="col-12 mt-2">
                    <Card>
                        <div className="card-body">
                            <Table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Notes</th>
                                    <th>View</th>
                                </tr>
                                </thead>
                                <tbody>

                                {restaurants.data.map((restaurant, index) => (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{restaurant.name}</td>
                                        <td>{restaurant.restaurant_or_homemade}</td>
                                        <td>
                                            {restaurant.status === 'pending' && (
                                                <div
                                                    className="badge badge-pill badge-danger mt-3">Pending</div>
                                            )}
                                            {restaurant.status === 'approved' && (
                                                <div
                                                    className="badge badge-pill badge-primary mt-3">Approved</div>
                                            )}
                                            {restaurant.status === 'suspended' && (
                                                <div
                                                    className="badge badge-pill badge-secondary mt-3">Suspended</div>
                                            )}
                                            {restaurant.status === 'cancelled' && (
                                                <div
                                                    className="badge badge-pill badge-dark mt-3">Cancelled</div>
                                            )}
                                        </td>
                                        <td>
                                            {(restaurant.status === 'cancelled' || restaurant.status === 'suspended') && (
                                                <span>
                                                    {restaurant.rejection_msg.substr(0, 15)} ...
                                                    <a className="text-danger c-pointer"
                                                       onClick={() => showNotes(restaurant.rejection_msg)}> more</a>
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <Link href={"/owner/restaurant?id=" + restaurant._id}>
                                                <a className="text-primary table-action c-pointer mr-2" title="View"><i
                                                    className="fa fa-eye"/> </a>
                                            </Link>
                                            <Link href={"/owner/restaurant/categories?id=" + restaurant._id}>
                                                <a className="text-primary table-action c-pointer" title="Categories"><i
                                                    className="fa fa-shopping-cart"/> </a>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div>

        </OwnerLayout>
    )
}

export default App


